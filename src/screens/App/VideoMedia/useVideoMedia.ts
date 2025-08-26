import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@api/index';
import {
  launchImageLibrary,
  launchCamera,
  MediaType,
  ImagePickerResponse,
} from 'react-native-image-picker';
import IMGLYEditor, {
  EditorPreset,
  EditorSettingsModel,
  SourceType,
} from '@imgly/editor-react-native';
import { fetchVideos, setVideos } from '@redux/slices/MediaSlice';
import { handlePermissions } from '@utils/helper';
import { LICENSE_KEY } from '@utils/constant';
import { AppDispatch } from '@redux/store';

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
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [videoUri, setVideoUri] = useState<string | undefined>(undefined);
  const [videoAsset, setVideoAsset] = useState<VideoAsset | undefined>(
    undefined,
  );
  const [saveVisible, setSaveVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewModal, setPreviewModal] = useState<boolean>(false);
  const [previewVideoUri, setPreviewVideoUri] = useState<string | undefined>(
    undefined,
  );
  const [previewVideoTitle, setPreviewVideoTitle] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { email } = useSelector((state: any) => state.auth.userData);
  const Videos_data = useSelector((state: any) => state.media.videos);

  useEffect(() => {
    handlePermissions('all');
    if (email) {
      dispatch(fetchVideos(email));
    } else {
      dispatch(setVideos([]));
    }
  }, [dispatch, email]);

  const states = {
    videoUri,
    setVideoUri,
    videoAsset,
    setVideoAsset,
    loading,
    setLoading,
    previewVideoUri,
    setPreviewVideoTitle,
    saveVisible,
    setSaveVisible,
    previewVideoTitle,
    refreshing,
    activeTab,
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) {
      return 'Unknown';
    }
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

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

  const getFormattedResolution = (asset?: VideoAsset | null): string => {
    if (!asset || !asset.width || !asset.height) {
      return 'Unknown';
    }
    return `${asset.width}×${asset.height}`;
  };

  const getVideoFileName = (asset?: VideoAsset | null): string => {
    return asset?.fileName || 'Video File';
  };

  const hasValidVideoAsset = (): boolean => {
    return videoAsset !== null && !!videoAsset.uri;
  };

  const saveStateData = (uri: string) => {
    setSaveVisible(true);
    setVideoUri(uri);
    setVideoAsset(prevAsset => (prevAsset ? { ...prevAsset, uri } : { uri }));
  };

  const handleSaveMedia = async () => {
    if (!videoAsset || !videoUri) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('email', email);
      formData.append('fileType', 'video');
      formData.append('file', {
        uri: videoUri.startsWith('file://') ? videoUri : `file://${videoUri}`,
        type: videoAsset.type || 'video/mp4',
        name: videoAsset.fileName || `video_${Date.now()}.mp4`,
      });

      const response = await api.MEDIA.upload({
        data: formData,
      });

      if (response.data) {
        dispatch(fetchVideos(email));
        handleClear();
      }
    } catch (error) {
      console.error('Upload Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      if (!videoUri) {
        console.error('No video selected.');
        return;
      }
      const settings = new EditorSettingsModel({ license: LICENSE_KEY });
      const source = { source: videoUri, type: SourceType.VIDEO };
      const result = await IMGLYEditor?.openEditor(
        settings,
        source,
        EditorPreset.VIDEO,
      );
      if (result && result.artifact) {
        saveStateData(result.artifact);
      }
      return result?.artifact;
    } catch (error) {
      console.error('Error opening editor:', error);
      throw error;
    }
  };

  const handleRecordVideo = async () => {
    try {
      const permissionResult = await handlePermissions('all');

      if (!permissionResult.canRecordVideo) {
        console.error('Permission denied.');
        return;
      }

      const cameraOptions = {
        mediaType: 'video' as MediaType,
        videoQuality: 'high',
        durationLimit: 120,
        saveToPhotos: true,
      };

      launchCamera(cameraOptions, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          return;
        }
        if (response.assets?.[0]?.uri) {
          const asset = response.assets[0];
          setVideoUri(asset.uri);
          setVideoAsset(asset as VideoAsset);
          setSaveVisible(false);
        }
      });
    } catch (error) {
      console.error('Error recording video:', error);
    }
  };

  const handleSelectVideo = async () => {
    try {
      const permissionResult = await handlePermissions('storage');

      if (!permissionResult.canAccessGallery) {
        console.error('Permission denied.');
        return;
      }

      launchImageLibrary(
        { mediaType: 'video', selectionLimit: 1 },
        (response: ImagePickerResponse) => {
          if (response.didCancel || response.errorMessage) {
            return;
          }
          if (response.assets?.[0]?.uri) {
            const asset = response.assets[0];
            setVideoUri(asset.uri);
            setVideoAsset(asset as VideoAsset);
            setSaveVisible(false);
          }
        },
      );
    } catch (error) {
      console.error('Error selecting video:', error);
    }
  };

  const handleSelectStoredVideo = (video: any) => {
    setPreviewVideoUri(video.videoURL);
    setPreviewVideoTitle('Video Preview');
    setPreviewModal(true);
  };

  const handleClear = () => {
    setVideoUri(undefined);
    setVideoAsset(undefined);
    setSaveVisible(false);
  };

  const closePreviewModal = () => {
    setPreviewModal(false);
    setPreviewVideoUri(undefined);
    setPreviewVideoTitle('');
  };

  const isVideoLoaded = (): boolean => !!videoUri;
  const isPreviewModalOpen = (): boolean => !!previewModal;

  const onRefresh = async () => {
    if (!email) return;
    try {
      setRefreshing(true);
      await dispatch(fetchVideos(email));
    } catch (error) {
      console.error('Error refreshing videos:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onTabChange = (index: number) => {
    setActiveTab(index);
  };

  return {
    Videos_data,
    states,
    handleRecordVideo,
    handleSelectVideo,
    handleClear,
    handleEdit,
    closePreviewModal,
    isVideoLoaded,
    formatFileSize,
    formatDuration,
    getFormattedResolution,
    getVideoFileName,
    hasValidVideoAsset,
    handleSaveMedia,
    handleSelectStoredVideo,
    isPreviewModalOpen,
    onRefresh,
    onTabChange,
  };
};

export default useVideoMedia;
