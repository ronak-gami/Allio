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
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import { handleVideoPermissions } from '@utils/helper';
import { showSuccess } from '@utils/toast';
import { LICENSE_KEY } from '@utils/constant';

interface VideoAsset {
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
  const [PhotoAsset, setPhotoAsset] = useState<VideoAsset | null>(null);
  const [model, setModel] = useState<Boolean>(false);

  useEffect(() => {
    handleVideoPermissions('all');
  }, []);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) {
      return 'Unknown';
    }
    const mb = bytes / 1024 / 1024;
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  const getFormattedResolution = (asset?: VideoAsset | null): string => {
    if (!asset || !asset.width || !asset.height) {
      return 'Unknown';
    }
    return `${asset.width}×${asset.height}`;
  };

  const getPhotoFileName = (asset?: VideoAsset | null): string => {
    return asset?.fileName || 'Video File';
  };

  const getEstimatedCompressedSize = (asset?: VideoAsset | null): string => {
    if (!asset?.fileSize) {
      return 'Unknown';
    }
    return formatFileSize(asset.fileSize * 0.6);
  };

  const hasValidPhotoAsset = (): boolean => {
    return PhotoAsset !== null && PhotoAsset !== undefined && !!PhotoAsset.uri;
  };

  const handleCameraOpen = async () => {
    const cameraOptions = {
      mediaType: 'photo' as MediaType,
      saveToPhotos: true,
    };

    launchCamera(cameraOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
      } else if (response.errorMessage) {
        console.error('Camera error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];

        setPhotoUri(asset.uri);

        setPhotoAsset?.({
          uri: asset.uri ?? '',
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
    try {
      const permissionResult = await handleVideoPermissions('storage');

      if (!permissionResult.canAccessGallery) {
        console.error(
          'Permission Error: Storage permission is required to access the gallery.',
        );
        return;
      }

      const galleryOptions = {
        mediaType: 'photo' as MediaType,
        selectionLimit: 1,
        includeExtra: true,
        includeBase64: false,
      };

      launchImageLibrary(galleryOptions, (response: ImagePickerResponse) => {
        if (response.didCancel) {
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
          setPhotoUri(asset.uri);
          setPhotoAsset?.({
            uri: asset.uri,
            fileName: asset.fileName,
            fileSize: asset.fileSize,
            type: asset.type,
            width: asset.width,
            height: asset.height,
          });
        } else {
          console.error('No photo was selected.');
        }
      });
    } catch (error) {
      console.error(
        'An unexpected error occurred while selecting a photo:',
        error,
      );
    }
  };

  const handleEdit = async () => {
    try {
      const settings = new EditorSettingsModel({
        license: LICENSE_KEY,
        export: {
          filename: 'edited_image',
          image: {
            format: 'jpeg',
            exportType: 'file-url',
          },
        },
        exportOptions: {
          enableDownload: true,
          show: true,
        },
        enableExport: true,
      });

      const result = await IMGLYEditor.openEditor(
        settings,
        {
          source: PhotoUri,
          type: SourceType.IMAGE,
        },
        EditorPreset.PHOTO,
      );

      if (result?.artifact) {
        const fileName = `edited_${Date.now()}.jpg`;
        const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
        const sourcePath = result.artifact.replace('file://', '');

        await RNFS.copyFile(sourcePath, destPath);

        await CameraRoll.saveAsset(destPath, { type: 'photo' });

        showSuccess('Image saved to gallery!');
      }
    } catch (error) {
      console.error('IMGLY Editor error:', error);
    } finally {
      handleClear();
    }
  };

  const handleClear = () => {
    setPhotoUri(null);
    setPhotoAsset(null);
  };

  const handleCompress = () => {
    console.log('Compressing video...');
    setModel(true);
  };

  const closeModel = () => {
    setModel(false);
  };

  const isPhotoLoaded = (): boolean => {
    return !!PhotoUri;
  };

  const isModalOpen = (): boolean => {
    return !!model;
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
  };
};

export default usePhotoMedia;
