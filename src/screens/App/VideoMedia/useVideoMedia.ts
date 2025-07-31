import {
  launchImageLibrary,
  launchCamera,
  MediaType,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { useEffect, useState } from 'react';
import { handleVideoPermissions } from '@utils/helper';
import IMGLYEditor, {
  EditorPreset,
  EditorSettingsModel,
  SourceType,
} from '@imgly/editor-react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

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
  const [videoAsset, setVideoAsset] = useState<VideoAsset | null>(null);
  const [model, setModel] = useState<Boolean>(false);
  const [saveVisible, setSaveVisible] = useState<Boolean>(false);

  useEffect(() => {
    handleVideoPermissions('all');
  }, []);

  // Format file size helper function
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) {
      return 'Unknown';
    }
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  // Format duration helper function
  const formatDuration = (seconds?: number): string => {
    if (!seconds) {
      return 'Unknown';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, '0')}`
      : `${secs}s`;
  };

  // Get formatted resolution
  const getFormattedResolution = (asset?: VideoAsset | null): string => {
    if (!asset || !asset.width || !asset.height) {
      return 'Unknown';
    }
    return `${asset.width}×${asset.height}`;
  };

  // Get video file name
  const getVideoFileName = (asset?: VideoAsset | null): string => {
    return asset?.fileName || 'Video File';
  };

  // Calculate estimated compressed size
  const getEstimatedCompressedSize = (asset?: VideoAsset | null): string => {
    if (!asset?.fileSize) {
      return 'Unknown';
    }
    return formatFileSize(asset.fileSize * 0.6);
  };

  // Check if video asset exists and has valid data
  const hasValidVideoAsset = (): boolean => {
    return videoAsset !== null && videoAsset !== undefined && !!videoAsset.uri;
  };

  const saveStateData = (uri: string) => {
    setSaveVisible(true);
    setVideoUri(uri);
    setVideoAsset(prevAsset => (prevAsset ? { ...prevAsset, uri } : { uri }));
  };

  // Single Edit function that opens Creative Video Editor
  const handleEdit = async () => {
    try {
      if (!videoUri) {
        console.error(
          'No video selected. Please select or record a video first.',
        );
        return;
      }
      const settings = new EditorSettingsModel({
        license:
          'z_9lMDUqcUwlNkjjU52ZLFQbwBvxJ60uSd_ouvwBDRCKtmK5fbZAtHFd3889zr9v',
      });
      const source = {
        source: videoUri,
        type: SourceType.VIDEO,
      };
      const result = await IMGLYEditor?.openEditor(
        settings,
        source,
        EditorPreset.VIDEO,
      );
      if (result && result?.artifact) {
        saveStateData(result?.artifact);
      }
      console.log('Data update & result got');
      console.log('result: ', result?.artifact);
      return result?.artifact;
    } catch (error) {
      console.error('Error opening Creative Video Editor:', error);
      throw error;
    }
  };

  const handleVideoSaveToGallery = async (uri: any) => {
    console.log('video will be save to gallery');
    await CameraRoll.save(uri, { type: 'video' });
    console.log('Save successfully');
    setSaveVisible(false);
  };

  // Handle record video
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
          const asset = response.assets[0];
          console.log('Video captured successfully. URI:', asset.uri);
          setVideoUri(asset.uri);
          setVideoAsset({
            uri: asset.uri,
            fileName: asset.fileName,
            fileSize: asset.fileSize,
            duration: asset.duration,
            type: asset.type,
            width: asset.width,
            height: asset.height,
          });
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

  // Handle select video from gallery
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
          const asset = response.assets[0];
          console.log('Video selected successfully. URI:', asset.uri);
          setVideoUri(asset.uri);
          setVideoAsset({
            uri: asset.uri,
            fileName: asset.fileName,
            fileSize: asset.fileSize,
            duration: asset.duration,
            type: asset.type,
            width: asset.width,
            height: asset.height,
          });
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

  // Handle clear video
  const handleClear = () => {
    setVideoUri(null);
    setVideoAsset(null);
  };

  // Handle compression action
  const handleCompress = () => {
    console.log('Compressing video...');
    setModel(true);
  };

  // Close modal
  const closeModel = () => {
    setModel(false);
  };

  // Check if video is loaded
  const isVideoLoaded = (): boolean => {
    return !!videoUri;
  };

  // Check if modal is open
  const isModalOpen = (): boolean => {
    return !!model;
  };

  return {
    // States
    videoUri,
    videoAsset,
    model,

    // Video actions
    handleRecordVideo,
    handleSelectVideo,
    handleClear,
    handleEdit,
    saveVisible,
    handleVideoSaveToGallery,

    // Modal actions
    handleCompress,
    closeModel,

    // Utility functions
    formatFileSize,
    formatDuration,
    getFormattedResolution,
    getVideoFileName,
    getEstimatedCompressedSize,

    // Status checkers
    hasValidVideoAsset,
    isVideoLoaded,
    isModalOpen,
  };
};

export default useVideoMedia;
