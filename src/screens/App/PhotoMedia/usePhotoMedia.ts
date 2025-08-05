import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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

import { handlePermissions } from '@utils/helper';
import { showError, showSuccess } from '@utils/toast';
import { LICENSE_KEY } from '@utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { fetchImages } from '@redux/slices/MediaSlice';
import api from '@api/index';

interface PhotoAsset {
  uri: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  type?: string;
  width?: number;
  height?: number;
}

const usePhotoMedia = () => {
  const [PhotoUri, setPhotoUri] = useState<string | null>(null);
  const [PhotoAsset, setPhotoAsset] = useState<PhotoAsset | null>(null);
  const [model, setModel] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.media.images);

  useEffect(() => {
    handlePermissions('all');
  }, []);

  useEffect(() => {
    if (userData?.email) {
      dispatch(fetchImages(userData?.email));
    }
  }, [userData?.email, dispatch]);

  useEffect(() => {
    if (images && Array.isArray(images)) {
      setNoData(images.length === 0);
    }
  }, [images]);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  const getFormattedResolution = (asset?: PhotoAsset | null): string => {
    if (!asset?.width || !asset?.height) return 'Unknown';
    return `${asset.width}×${asset.height}`;
  };

  const getPhotoFileName = (asset?: PhotoAsset | null): string => {
    return asset?.fileName || 'Image File';
  };

  const getEstimatedCompressedSize = (asset?: PhotoAsset | null): string => {
    return asset?.fileSize ? formatFileSize(asset.fileSize * 0.6) : 'Unknown';
  };

  const hasValidPhotoAsset = (): boolean => !!PhotoAsset?.uri;

  const handleCameraOpen = async () => {
    const cameraOptions = {
      mediaType: 'photo' as MediaType,
      saveToPhotos: true,
    };

    launchCamera(cameraOptions, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) return;

      const asset = response.assets?.[0];
      if (asset?.uri) {
        setPhotoUri(asset.uri);
        setPhotoAsset({
          uri: asset.uri,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
          type: asset.type,
          width: asset.width,
          height: asset.height,
        });
      }
    });
  };

  const handleSelectPhoto = async () => {
    const permissionResult = await handlePermissions('storage');
    if (!permissionResult.canAccessGallery) return;

    const galleryOptions = {
      mediaType: 'photo' as MediaType,
      selectionLimit: 1,
      includeExtra: true,
    };

    launchImageLibrary(galleryOptions, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) return;

      const asset = response.assets?.[0];
      if (asset?.uri) {
        setPhotoUri(asset.uri);
        setPhotoAsset({
          uri: asset.uri,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
          type: asset.type,
          width: asset.width,
          height: asset.height,
        });
      }
    });
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const settings = new EditorSettingsModel({
        license: LICENSE_KEY,
        export: {
          filename: 'edited_image',
          image: { format: 'jpeg', exportType: 'file-url', quality: 0.1 },
        },
        exportOptions: { enableDownload: true, show: true },
        enableExport: true,
      });

      const result = await IMGLYEditor.openEditor(
        settings,
        { source: PhotoUri, type: SourceType.IMAGE },
        EditorPreset.PHOTO,
      );

      if (!result?.artifact) {
        showError('Image editing was cancelled or failed.');
        return;
      }

      const compressedUri = result.artifact.startsWith('file://')
        ? result.artifact
        : `file://${result.artifact}`;

      const formData = new FormData();
      formData.append('email', userData?.email);
      formData.append('fileType', 'image');
      formData.append('file', {
        uri: compressedUri,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      });

      const response = await api.MEDIA.upload({ data: formData });

      if (response?.data?.success) {
        showSuccess(response.data.message || 'Upload successful!');
        dispatch(fetchImages(userData?.email));
      }
    } catch (error: any) {
      const apiError =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong during upload.';
      showError(apiError);
      console.log('Caught error:', error);
    } finally {
      setLoading(false);
      handleClear();
    }
  };

  const handleClear = () => {
    setPhotoUri(null);
    setPhotoAsset(null);
  };

  const handleCompress = () => setModel(true);
  const closeModel = () => setModel(false);
  const isPhotoLoaded = () => !!PhotoUri;
  const isModalOpen = () => !!model;

  const openModal = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  useFocusEffect(
    useCallback(() => {
      handleClear();
    }, []),
  );

  return {
    PhotoUri,
    PhotoAsset,
    model,
    handleCameraOpen,
    handleSelectPhoto,
    handleClear,
    handleEdit,
    handleCompress,
    closeModel,
    formatFileSize,
    getFormattedResolution,
    getPhotoFileName,
    getEstimatedCompressedSize,
    hasValidPhotoAsset,
    isPhotoLoaded,
    isModalOpen,
    photos: images,
    loading,
    noData,
    modalVisible,
    selectedImage,
    openModal,
    closeModal,
  };
};

export default usePhotoMedia;
