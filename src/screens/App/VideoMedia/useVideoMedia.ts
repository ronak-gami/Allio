import {
  launchImageLibrary,
  launchCamera,
  MediaType,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useEffect, useState } from 'react';
import { handleVideoPermissions } from '@utils/helper';

interface VideoAsset {
  uri: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  type?: string;
  width?: number;
  height?: number;
}

const useVideoMedia = () => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [editable, setEditable] = useState<Boolean>(false);
  const [model, setModel] = useState<Boolean>(false);

  useEffect(() => {
    handleVideoPermissions('all');
  }, []);

  const handleRecordVideo = async () => {
    try {
      console.log('Checking permissions and launching camera...');
      const permissionResult = await handleVideoPermissions('all');

      if (!permissionResult.canRecordVideo) {
        console.error(
          'Permission Error: Camera and microphone permissions are required.',
        );
        return;
      }

      const cameraOptions = {
        mediaType: 'video' as MediaType,
        videoQuality: 'high' as const,
        durationLimit: 120,
        saveToPhotos: true,
      };

      launchCamera(cameraOptions, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled the camera.');
          return;
        }
        if (response.errorMessage) {
          console.error('Camera Error:', response.errorMessage);
          return;
        }
        if (
          response.assets &&
          response.assets.length > 0 &&
          response.assets[0].uri
        ) {
          const uri = response.assets[0].uri;
          console.log('Video captured successfully. URI:', uri);
          setVideoUri(uri);
        } else {
          console.error('No video was recorded.');
        }
      });
    } catch (error) {
      console.error(
        'An unexpected error occurred while trying to record a video:',
        error,
      );
    }
  };

  const handleSelectVideo = async () => {
    try {
      console.log('Checking permissions and launching gallery...');
      const permissionResult = await handleVideoPermissions('storage');

      if (!permissionResult.canAccessGallery) {
        console.error(
          'Permission Error: Storage permission is required to access the gallery.',
        );
        return;
      }

      const galleryOptions = {
        mediaType: 'video' as MediaType,
        selectionLimit: 1,
      };

      launchImageLibrary(galleryOptions, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled gallery selection.');
          return;
        }
        if (response.errorMessage) {
          console.error('Gallery Error:', response.errorMessage);
          return;
        }
        if (
          response.assets &&
          response.assets.length > 0 &&
          response.assets[0].uri
        ) {
          const uri = response.assets[0].uri;
          console.log('Video selected successfully. URI:', uri);
          setVideoUri(uri);
        } else {
          console.error('No video was selected.');
        }
      });
    } catch (error) {
      console.error(
        'An unexpected error occurred while selecting a video:',
        error,
      );
    }
  };

  const saveVideoToGallery = async (uri: string): Promise<void> => {
    try {
      console.log('Attempting to save video to gallery...');
      const permissionResult = await handleVideoPermissions('storage');
      if (!permissionResult.canSaveVideos) {
        console.error(
          'Permission Error: Storage permission is required to save videos.',
        );
        return;
      }
      await CameraRoll.save(uri, { type: 'video' });
      console.log('Video saved to gallery successfully.');
    } catch (error) {
      console.error('Failed to save video to gallery:', error);
    }
  };

  const getVideoInfo = (video: VideoAsset): string => {
    const size = video.fileSize
      ? `${(video.fileSize / 1024 / 1024).toFixed(2)} MB`
      : 'Unknown size';
    const duration = video.duration
      ? `${Math.round(video.duration)}s`
      : 'Unknown duration';
    const dimensions =
      video.width && video.height
        ? `${video.width}x${video.height}`
        : 'Unknown dimensions';
    return `📁 ${
      video.fileName || 'video.mp4'
    }\n📏 ${size}\n⏱️ ${duration}\n📐 ${dimensions}`;
  };

  const handleClear = () => {
    setVideoUri(null);
    setEditable(false);
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const openModel = () => {
    setModel(true);
  };
  const closeModel = () => {
    setModel(false);
  };

  return {
    videoUri,
    handleRecordVideo,
    handleSelectVideo,
    saveVideoToGallery,
    getVideoInfo,
    handleClear,
    handleEdit,
    editable,
    openModel,
    closeModel,
    model,
  };
};

export default useVideoMedia;
