import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { showSuccess } from '@utils/toast';
import { useState } from 'react';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const useVideoPreviewModal = () => {
  const [loading, setLoadingState] = useState<boolean>(false);

  const handleMediaSaveToGallery = async (uri: string) => {
    setLoadingState(true);
    try {
      let localUri = uri;

      // Check if URI is a remote URL (starts with http/https)
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        // Create a local file path
        const fileName = `video_${Date.now()}.mp4`;
        const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        // Download the video
        const downloadResult = await RNFS.downloadFile({
          fromUrl: uri,
          toFile: localPath,
        }).promise;

        if (downloadResult.statusCode === 200) {
          localUri = `file://${localPath}`;
        } else {
          throw new Error('Failed to download video');
        }
      }

      // Ensure local URI has file:// prefix
      if (!localUri.startsWith('file://')) {
        localUri = `file://${localUri}`;
      }

      // Save to gallery
      await CameraRoll.save(localUri, { type: 'video' });
      showSuccess('Video saved to gallery successfully!');

      // Clean up downloaded file if it was a remote URL
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        try {
          await RNFS.unlink(localUri.replace('file://', ''));
        } catch (cleanupError) {
          console.error('Could not clean up temporary file:', cleanupError);
        }
      }
    } catch (error) {
      console.error('Error saving video to gallery:', error);
    } finally {
      setLoadingState(false);
    }
  };

  const handleVideoShare = async (message?: string, url?: string) => {
    try {
      const shareOptions = {
        title: 'Share via',
        message: message || 'Check out this video!',
        url,
        failOnCancel: false,
      };

      const result = await Share.open(shareOptions);
      console.log('Share result:', result);
    } catch (error) {
      if (error && (error as any).message !== 'User did not share') {
        console.error('Share error:', error);
      }
    }
  };
  return { handleMediaSaveToGallery, loading, handleVideoShare };
};

export default useVideoPreviewModal;
