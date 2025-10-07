import { NativeModules, Platform } from 'react-native';

const { CallAudioModule } = NativeModules;

export class CallAudioManager {
  /**
   * Start incoming call ringtone (system ringtone, always on speaker)
   */
  static async startIncomingRingtone(isVideoCall: boolean): Promise<void> {
    if (Platform.OS === 'android' && CallAudioModule) {
      try {
        await CallAudioModule.startIncomingRingtone(isVideoCall);
      } catch (error) {
        console.error('Error starting incoming ringtone:', error);
      }
    }
  }

  /**
   * Start outgoing call ringtone
   * Video calls: speaker ON
   * Audio calls: speaker OFF
   */
  static async startOutgoingRingtone(isVideoCall: boolean): Promise<void> {
    if (Platform.OS === 'android' && CallAudioModule) {
      try {
        await CallAudioModule.startOutgoingRingtone(isVideoCall);
      } catch (error) {
        console.error('Error starting outgoing ringtone:', error);
      }
    }
  }

  /**
   * Stop all ringtone audio
   */
  static async stopAllAudio(): Promise<void> {
    if (Platform.OS === 'android' && CallAudioModule) {
      try {
        await CallAudioModule.stopAllAudio();
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    }
  }

  /**
   * Configure audio for active call
   * Video calls: speaker ON
   * Audio calls: speaker OFF initially
   */
  static async startCallAudio(isVideoCall: boolean): Promise<void> {
    if (Platform.OS === 'android' && CallAudioModule) {
      try {
        await CallAudioModule.startCallAudio(isVideoCall);
      } catch (error) {
        console.error('Error starting call audio:', error);
      }
    }
  }

  /**
   * Stop call audio and restore previous state
   */
  static async stopCallAudio(): Promise<void> {
    if (Platform.OS === 'android' && CallAudioModule) {
      try {
        await CallAudioModule.stopCallAudio();
      } catch (error) {
        console.error('Error stopping call audio:', error);
      }
    }
  }

  /**
   * Toggle speaker on/off
   */
  static async toggleSpeaker(): Promise<boolean> {
    if (Platform.OS === 'android' && CallAudioModule) {
      try {
        return await CallAudioModule.toggleSpeaker();
      } catch (error) {
        console.error('Error toggling speaker:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Set speaker enabled/disabled
   */
  static async setSpeakerEnabled(enabled: boolean): Promise<void> {
    if (Platform.OS === 'android' && CallAudioModule) {
      try {
        await CallAudioModule.setSpeakerEnabled(enabled);
      } catch (error) {
        console.error('Error setting speaker:', error);
      }
    }
  }

  /**
   * Check if speaker is enabled
   */
  static async isSpeakerEnabled(): Promise<boolean> {
    if (Platform.OS === 'android' && CallAudioModule) {
      try {
        return await CallAudioModule.isSpeakerEnabled();
      } catch (error) {
        console.error('Error checking speaker:', error);
        return false;
      }
    }
    return false;
  }
}
