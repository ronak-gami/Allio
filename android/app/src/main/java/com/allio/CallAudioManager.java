package com.allio;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.media.ToneGenerator;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.streamvideo.reactnative.util.RingtoneUtil;

/**
 * Manages audio routing and ringtones for incoming and outgoing calls
 */
public class CallAudioManager {
    private static final String TAG = "CallAudioManager";
    private static final int OUTGOING_TONE_DURATION = 1000; // 1 second
    private static final int OUTGOING_TONE_INTERVAL = 4000; // 4 seconds between tones (standard pattern)
    
    private final Context context;
    private final AudioManager audioManager;
    private Ringtone incomingRingtone;
    private ToneGenerator toneGenerator;
    private Handler outgoingToneHandler;
    private Runnable outgoingToneRunnable;
    private boolean isSpeakerOn = false;
    private int previousAudioMode = AudioManager.MODE_NORMAL;
    private boolean wasBluetoothScoOn = false;
    private boolean wasSpeakerphoneOn = false;

    public CallAudioManager(@NonNull Context context) {
        this.context = context.getApplicationContext();
        this.audioManager = (AudioManager) this.context.getSystemService(Context.AUDIO_SERVICE);
        this.outgoingToneHandler = new Handler(Looper.getMainLooper());
    }

    /**
     * Start playing incoming call ringtone (USER'S ACTUAL DEVICE RINGTONE)
     * Incoming calls are always on speaker
     */
    public void startIncomingRingtone(boolean isVideoCall) {
        try {
            stopAllAudio(); // Stop any existing audio

            // Get user's actual default ringtone (the one they set in phone settings)
            Uri ringtoneUri = RingtoneUtil.getActualDefaultRingtoneUri(context);
            if (ringtoneUri == null) {
                ringtoneUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
            }

            incomingRingtone = RingtoneUtil.getRingtone(context, ringtoneUri);
            
            if (incomingRingtone != null) {
                // Set audio mode for ringing
                audioManager.setMode(AudioManager.MODE_RINGTONE);
                
                // Configure audio attributes for ringtone
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    incomingRingtone.setLooping(true);
                    AudioAttributes attributes = new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build();
                    incomingRingtone.setAudioAttributes(attributes);
                } else {
                    incomingRingtone.setStreamType(AudioManager.STREAM_RING);
                }
                
                // Always enable speaker for incoming calls
                setSpeakerEnabled(true);
                
                incomingRingtone.play();
                Log.d(TAG, "Started incoming ringtone (user's device ringtone) on speaker");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error starting incoming ringtone", e);
        }
    }

    /**
     * Start playing outgoing call sound (STANDARD DIAL TONE - ring back tone)
     * This is the "trueen trueen" sound you hear when calling someone
     * Video calls: speaker ON
     * Audio calls: speaker OFF (earpiece)
     */
    public void startOutgoingRingtone(boolean isVideoCall) {
        try {
            stopAllAudio(); // Stop any existing audio

            // Set audio mode for outgoing call
            audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
            
            // Video calls on speaker, audio calls on earpiece
            setSpeakerEnabled(isVideoCall);
            
            // Use ToneGenerator for standard call waiting/ring back tone
            // STREAM_VOICE_CALL ensures it goes through earpiece or speaker based on our setting
            int streamType = AudioManager.STREAM_VOICE_CALL;
            int volume = 80; // 80% volume for more natural sound
            toneGenerator = new ToneGenerator(streamType, volume);
            
            // Create repeating ring back tone pattern (trueen trueen)
            outgoingToneRunnable = new Runnable() {
                private int beepCount = 0;
                
                @Override
                public void run() {
                    if (toneGenerator != null) {
                        // Play double beep pattern (trueen trueen)
                        if (beepCount % 2 == 0) {
                            // First beep
                            toneGenerator.startTone(ToneGenerator.TONE_SUP_RINGTONE, 400);
                            outgoingToneHandler.postDelayed(this, 600); // Wait 600ms before second beep
                        } else {
                            // Second beep
                            toneGenerator.startTone(ToneGenerator.TONE_SUP_RINGTONE, 400);
                            outgoingToneHandler.postDelayed(this, 3000); // Wait 3 seconds before repeating
                        }
                        beepCount++;
                    }
                }
            };
            
            // Start the first beep immediately
            outgoingToneHandler.post(outgoingToneRunnable);
            
            Log.d(TAG, "Started outgoing ring back tone (trueen trueen), video: " + isVideoCall + ", speaker: " + isVideoCall);
        } catch (Exception e) {
            Log.e(TAG, "Error starting outgoing ringtone", e);
        }
    }

    /**
     * Stop all audio playback
     */
    public void stopAllAudio() {
        try {
            // Stop incoming ringtone
            if (incomingRingtone != null && incomingRingtone.isPlaying()) {
                incomingRingtone.stop();
                incomingRingtone = null;
                Log.d(TAG, "Stopped incoming ringtone");
            }

            // Stop outgoing tone
            if (outgoingToneHandler != null && outgoingToneRunnable != null) {
                outgoingToneHandler.removeCallbacks(outgoingToneRunnable);
                outgoingToneRunnable = null;
            }
            
            if (toneGenerator != null) {
                toneGenerator.stopTone();
                toneGenerator.release();
                toneGenerator = null;
                Log.d(TAG, "Stopped outgoing dial tone");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error stopping audio", e);
        }
    }

    /**
     * Configure audio for active call
     * @param isVideoCall true for video call, false for audio call
     */
    public void startCallAudio(boolean isVideoCall) {
        try {
            stopAllAudio();
            
            // Save previous audio state
            previousAudioMode = audioManager.getMode();
            wasSpeakerphoneOn = audioManager.isSpeakerphoneOn();
            wasBluetoothScoOn = audioManager.isBluetoothScoOn();

            // Set audio mode for call
            audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
            
            // Video calls on speaker, audio calls on earpiece initially
            setSpeakerEnabled(isVideoCall);
            
            Log.d(TAG, "Started call audio, video: " + isVideoCall + ", speaker: " + isSpeakerOn);
        } catch (Exception e) {
            Log.e(TAG, "Error starting call audio", e);
        }
    }

    /**
     * Stop call audio and restore previous audio state
     */
    public void stopCallAudio() {
        try {
            stopAllAudio();
            
            // Restore previous audio state
            audioManager.setMode(previousAudioMode);
            audioManager.setSpeakerphoneOn(wasSpeakerphoneOn);
            
            if (wasBluetoothScoOn) {
                audioManager.setBluetoothScoOn(true);
            }
            
            isSpeakerOn = false;
            Log.d(TAG, "Stopped call audio and restored previous state");
        } catch (Exception e) {
            Log.e(TAG, "Error stopping call audio", e);
        }
    }

    /**
     * Toggle speaker on/off during call
     */
    public void toggleSpeaker() {
        setSpeakerEnabled(!isSpeakerOn);
    }

    /**
     * Enable or disable speaker
     */
    public void setSpeakerEnabled(boolean enabled) {
        try {
            isSpeakerOn = enabled;
            audioManager.setSpeakerphoneOn(enabled);
            Log.d(TAG, "Speaker " + (enabled ? "enabled" : "disabled"));
        } catch (Exception e) {
            Log.e(TAG, "Error setting speaker", e);
        }
    }

    /**
     * Check if speaker is enabled
     */
    public boolean isSpeakerEnabled() {
        return isSpeakerOn;
    }

    /**
     * Clean up resources
     */
    public void release() {
        stopAllAudio();
        stopCallAudio();
        if (outgoingToneHandler != null) {
            outgoingToneHandler.removeCallbacksAndMessages(null);
        }
    }
}