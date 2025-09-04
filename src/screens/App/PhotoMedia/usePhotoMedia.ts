import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { AppDispatch, RootState } from '@redux/store';
import { fetchImages, setImages } from '@redux/slices/MediaSlice';
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
  const [PhotoUri, setPhotoUri] = useState<string | undefined>();
  const [PhotoAsset, setPhotoAsset] = useState<PhotoAsset | undefined>();
  const [model, setModel] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { email } = useSelector((state: any) => state.auth.userData);
  const dispatch = useDispatch<AppDispatch>();
  const images = useSelector((state: RootState) => state?.media?.images);

  useEffect(() => {
    handlePermissions('all');
  }, []);

  useEffect(() => {
    if (email) dispatch(fetchImages(email));
    else dispatch(setImages([]));
  }, [email, dispatch]);

  const states = useMemo(
    () => ({
      PhotoUri,
      PhotoAsset,
      model,
      loading,
      modalVisible,
      selectedImage,
      images,
      refreshing,
    }),
    [
      PhotoUri,
      PhotoAsset,
      model,
      loading,
      modalVisible,
      selectedImage,
      images,
      refreshing,
    ],
  );

  const formatFileSize = useCallback((bytes?: number): string => {
    if (!bytes) return 'Unknown';
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  }, []);

  const getFormattedResolution = useCallback(
    (asset?: PhotoAsset | null): string =>
      asset?.width && asset?.height
        ? `${asset.width}×${asset.height}`
        : 'Unknown',
    [],
  );

  const getPhotoFileName = useCallback(
    (asset?: PhotoAsset | null): string => asset?.fileName || 'Image File',
    [],
  );

  const getEstimatedCompressedSize = useCallback(
    (asset?: PhotoAsset | null): string =>
      asset?.fileSize ? formatFileSize(asset.fileSize * 0.6) : 'Unknown',
    [formatFileSize],
  );

  const hasValidPhotoAsset = useCallback(() => !!PhotoAsset?.uri, [PhotoAsset]);

  const handleClear = useCallback(() => {
    setPhotoUri(undefined);
    setPhotoAsset(undefined);
  }, []);

  const handleCameraOpen = useCallback(() => {
    launchCamera(
      { mediaType: 'photo', saveToPhotos: true },
      (response: ImagePickerResponse) => {
        const asset = response.assets?.[0];
        if (!asset?.uri) return;
        setPhotoUri(asset.uri);
        setPhotoAsset({
          uri: asset.uri,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
          type: asset.type,
          width: asset.width,
          height: asset.height,
        });
      },
    );
  }, []);

  const handleSelectPhoto = useCallback(async () => {
    const permissionResult = await handlePermissions('storage');
    if (!permissionResult?.canAccessGallery) return;

    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1, includeExtra: true },
      (response: ImagePickerResponse) => {
        const asset = response.assets?.[0];
        if (!asset?.uri) return;
        setPhotoUri(asset.uri);
        setPhotoAsset({
          uri: asset.uri,
          fileName: asset.fileName,
          fileSize: asset.fileSize,
          type: asset.type,
          width: asset.width,
          height: asset.height,
        });
      },
    );
  }, []);

  const handleEdit = useCallback(async () => {
    if (!PhotoUri) return;
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
      formData.append('email', email);
      formData.append('fileType', 'image');
      formData.append('file', {
        uri: compressedUri,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      } as any);

      const response = await api.MEDIA.upload({ data: formData });
      if (response?.data?.success) {
        showSuccess(response?.data?.message || 'Upload successful!');
        dispatch(fetchImages(email));
      }
    } catch (error: any) {
      console.error(
        'Caught error:',
        error?.response?.data?.message || error?.message || 'Upload failed.',
      );
    } finally {
      setLoading(false);
      handleClear();
    }
  }, [PhotoUri, email, dispatch, handleClear]);

  const handleCompress = useCallback(() => setModel(true), []);
  const closeModel = useCallback(() => setModel(false), []);
  const isPhotoLoaded = useCallback(() => !!PhotoUri, [PhotoUri]);
  const isModalOpen = useCallback(() => !!model, [model]);

  const openModal = useCallback((uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  }, []);
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedImage(undefined);
  }, []);

  useFocusEffect(useCallback(() => handleClear(), [handleClear]));

  const handleSave = useCallback(async () => {
    if (!PhotoUri) {
      showError('No photo selected to save.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('fileType', 'image');
      formData.append('file', {
        uri: PhotoUri,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      } as any);

      console.log("the data is ")

      const response = await api.MEDIA.upload({ data: formData });
      if (response?.data?.success) {
        showSuccess(response.data?.message || 'Image saved successfully!');
        dispatch(fetchImages(email));
      } else showError('Failed to save image.');
    } catch (error: any) {
      console.error(
        'Save error:',
        error?.response?.data?.message || error?.message || 'Save failed.',
      );
      showError(
        error?.response?.data?.message || 'Something went wrong while saving.',
      );
    } finally {
      setLoading(false);
      handleClear();
    }
  }, [PhotoUri, email, dispatch, handleClear]);

  const onRefresh = useCallback(async () => {
    if (!email) return;
    setRefreshing(true);
    try {
      await dispatch(fetchImages(email));
    } catch {
      showError('Failed to refresh images.');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, email]);

  return {
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
    modalVisible,
    openModal,
    closeModal,
    states,
    onRefresh,
    handleSave,
  };
};

export default usePhotoMedia;
