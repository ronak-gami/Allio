import {
  launchImageLibrary,
  launchCamera,
  MediaType,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useEffect, useState } from 'react';
import { handleVideoPermissions } from '@utils/helper';
import IMGLYEditor, {
  EditorPreset,
  EditorSettingsModel,
  SourceType,
} from '@imgly/editor-react-native';

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
  const [editable, setEditable] = useState<Boolean>(false);
  const [model, setModel] = useState<Boolean>(false);

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

  // Open Creative Video Editor
  const openVideoEditor = async (
    licenseKey: string = 'z_9lMDUqcUwlNkjjU52ZLFQbwBvxJ60uSd_ouvwBDRCKtmK5fbZAtHFd3889zr9v',
  ) => {
    try {
      if (!videoUri) {
        console.error(
          'No video selected. Please select or record a video first.',
        );
        return;
      }

      console.log('Opening Creative Video Editor...');

      // Initialize editor settings
      const settings = new EditorSettingsModel({
        license: licenseKey,
      });

      // Configure video source
      const source = {
        source: videoUri,
        type: SourceType.VIDEO,
      };

      // Open the video editor
      const result = await IMGLYEditor?.openEditor(
        settings,
        source,
        EditorPreset.VIDEO,
      );

      console.log('Video editor result:', result);

      // Update the video asset with edited result if available
      if (result && result.uri) {
        setVideoUri(result.uri);
        // Update video asset with new properties if available in result
        setVideoAsset(prevAsset => ({
          ...prevAsset,
          uri: result.uri,
          fileName: result.fileName || prevAsset?.fileName,
          fileSize: result.fileSize || prevAsset?.fileSize,
          duration: result.duration || prevAsset?.duration,
          type: result.type || prevAsset?.type,
          width: result.width || prevAsset?.width,
          height: result.height || prevAsset?.height,
        }));
      }

      return result;
    } catch (error) {
      console.error('Error opening Creative Video Editor:', error);
      throw error;
    }
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

  // Save video to gallery
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

  // Get video info (legacy function for backward compatibility)
  const getVideoInfo = (video: VideoAsset | null): string => {
    if (!video || !video.uri) {
      return 'No video information available';
    }

    const size = formatFileSize(video.fileSize);
    const duration = formatDuration(video.duration);
    const dimensions = getFormattedResolution(video);

    return `📁 ${getVideoFileName(
      video,
    )}\n📏 ${size}\n⏱️ ${duration}\n📐 ${dimensions}`;
  };

  // Handle clear video
  const handleClear = () => {
    setVideoUri(null);
    setVideoAsset(null);
    setEditable(false);
  };

  // Handle edit toggle - Updated to use Creative Editor
  const handleEdit = async (licenseKey?: string) => {
    try {
      setEditable(true);
      await openVideoEditor(licenseKey);
    } catch (error) {
      console.error('Failed to open video editor:', error);
      setEditable(false);
    }
  };

  // Handle compression action
  const handleCompress = () => {
    // Add compression logic here
    console.log('Compressing video...');
    openModel();
  };

  // Handle trim action
  const handleTrim = () => {
    // Add trim logic here
    console.log('Trimming video...');
    openModel();
  };

  // Handle filter action
  const handleFilter = () => {
    // Add filter logic here
    console.log('Applying filter to video...');
    openModel();
  };

  // Open modal
  const openModel = () => {
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

  // Check if in edit mode
  const isInEditMode = (): boolean => {
    return !!editable;
  };

  // Check if modal is open
  const isModalOpen = (): boolean => {
    return !!model;
  };

  return {
    // States
    videoUri,
    videoAsset,
    editable,
    model,

    // Video actions
    handleRecordVideo,
    handleSelectVideo,
    handleClear,
    handleEdit,
    saveVideoToGallery,

    // Creative Editor
    openVideoEditor,

    // Edit actions
    handleCompress,
    handleTrim,
    handleFilter,

    // Modal actions
    openModel,
    closeModel,

    // Utility functions
    getVideoInfo,
    formatFileSize,
    formatDuration,
    getFormattedResolution,
    getVideoFileName,
    getEstimatedCompressedSize,

    // Status checkers
    hasValidVideoAsset,
    isVideoLoaded,
    isInEditMode,
    isModalOpen,
  };
};

export default useVideoMedia;
