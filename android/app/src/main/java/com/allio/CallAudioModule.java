package com.allio;
import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

/**
 * React Native module for managing call audio
 */
@ReactModule(name = CallAudioModule.NAME)
public class CallAudioModule extends ReactContextBaseJavaModule {
    public static final String NAME = "CallAudioModule";
    private static final String TAG = "CallAudioModule";
    
    private CallAudioManager audioManager;

    public CallAudioModule(ReactApplicationContext reactContext) {
        super(reactContext);
        audioManager = new CallAudioManager(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void startIncomingRingtone(boolean isVideoCall, Promise promise) {
        try {
            audioManager.startIncomingRingtone(isVideoCall);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Error starting incoming ringtone", e);
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void startOutgoingRingtone(boolean isVideoCall, Promise promise) {
        try {
            audioManager.startOutgoingRingtone(isVideoCall);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Error starting outgoing ringtone", e);
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void stopAllAudio(Promise promise) {
        try {
            audioManager.stopAllAudio();
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Error stopping audio", e);
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void startCallAudio(boolean isVideoCall, Promise promise) {
        try {
            audioManager.startCallAudio(isVideoCall);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Error starting call audio", e);
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void stopCallAudio(Promise promise) {
        try {
            audioManager.stopCallAudio();
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Error stopping call audio", e);
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void toggleSpeaker(Promise promise) {
        try {
            audioManager.toggleSpeaker();
            promise.resolve(audioManager.isSpeakerEnabled());
        } catch (Exception e) {
            Log.e(TAG, "Error toggling speaker", e);
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void setSpeakerEnabled(boolean enabled, Promise promise) {
        try {
            audioManager.setSpeakerEnabled(enabled);
            promise.resolve(enabled);
        } catch (Exception e) {
            Log.e(TAG, "Error setting speaker", e);
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void isSpeakerEnabled(Promise promise) {
        try {
            promise.resolve(audioManager.isSpeakerEnabled());
        } catch (Exception e) {
            Log.e(TAG, "Error checking speaker", e);
            promise.reject("ERROR", e.getMessage());
        }
    }

    @Override
    public void invalidate() {
        super.invalidate();
        if (audioManager != null) {
            audioManager.release();
        }
    }
}