

import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import useStyle from './style';

import IMGLYEditor, {
  EditorPreset,
  EditorSettingsModel,
  SourceType,
} from '@imgly/editor-react-native';

const EditPhotoScreen = () => {
  const route = useRoute();
  const styles = useStyle();
  const navigation = useNavigation();
  const { imageUri } = route.params;
  const [editedImage, setEditedImage] = useState(null);

  useEffect(() => {
    const copyToLocalFile = async () => {
      try {
        const newPath = `${RNFS.TemporaryDirectoryPath}img_${Date.now()}.jpg`;
        await RNFS.copyFile(imageUri, newPath);
        setEditedImage('file://' + newPath);
      } catch (error) {
        Alert.alert('Error', 'Failed to copy image to local storage');
        console.error('Copy error:', error);
      }
    };
    copyToLocalFile();
  }, [imageUri]);

  const requestAndroidPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  const handleSave = async () => {
    try {
      const granted = await requestAndroidPermission();
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Cannot save image without permission.',
        );
        return;
      }

      const fileName = `cropped_${Date.now()}.jpg`;
      const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
      const sourcePath = editedImage.replace('file://', '');

      await RNFS.copyFile(sourcePath, destPath);
      Alert.alert('Saved', 'Image saved to gallery!');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Save Error', 'Failed to save image');
    }
  };

  const handleCrop = async () => {
    try {
      const cropped = await ImagePicker.openCropper({
        path: editedImage,
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: true,
      });

      setEditedImage(cropped.path);
      Alert.alert('Success', 'Image cropped manually!');
    } catch (error) {
      console.error('Crop error:', error);
      Alert.alert('Error', 'Cropping failed');
    }
  };

  const handleRotateWithCropper = async () => {
    try {
      const result = await ImagePicker.openCropper({
        path: editedImage,
        width: 300,
        height: 300,
        cropping: true,
        freeStyleCropEnabled: true,
        enableRotationGesture: true,
        cropperToolbarTitle: 'Edit Photo',
        cropperCircleOverlay: false,
      });

      setEditedImage(result.path);
    } catch (error) {
      console.log('Cropper closed or failed:', error);
    }
  };

  // const handleOther = async () => {
  //   try {
  //     const settings = new EditorSettingsModel({
  //       license:
  //         'z_9lMDUqcUwlNkjjU52ZLFQbwBvxJ60uSd_ouvwBDRCKtmK5fbZAtHFd3889zr9v',
  //     });

  //     const result = await IMGLYEditor.openEditor(
  //       settings,
  //       {
  //         source: editedImage,
  //         type: SourceType.IMAGE,
  //       },
  //       EditorPreset.PHOTO,
  //     );
  //     console.log(result);

  //     if (result?.uri) {
  //       setEditedImage(result.uri);

  //       const hasPermission = await requestAndroidPermission();
  //       if (true) {
  //         await CameraRoll.save(result.uri, { type: 'photo' });
  //         Alert.alert('Success', 'Image saved to gallery!');
  //       } else {
  //         Alert.alert(
  //           'Permission Denied',
  //           'Cannot save image without permission',
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.error('IMGLY Editor error:', error);
  //     Alert.alert('Error', 'Editor cancelled or failed');
  //   }
  // };

  // const handleOther = async () => {
  //   try {
  //     const settings = new EditorSettingsModel({
  //       license:
  //         'z_9lMDUqcUwlNkjjU52ZLFQbwBvxJ60uSd_ouvwBDRCKtmK5fbZAtHFd3889zr9v',
  //       export: {
  //         filename: 'edited_image',
  //         image: {
  //           format: 'jpeg',
  //           exportType: 'data-url',
  //         },
  //       },
  //       exportOptions: {
  //         enableDownload: true,
  //         show: true,
  //       },
  //       enableExport: true,
  //     });

  //     const result = await IMGLYEditor.openEditor(
  //       settings,
  //       {
  //         source: editedImage,
  //         type: SourceType.IMAGE,
  //       },
  //       EditorPreset.PHOTO,
  //     );

  //     console.log(result);

  //     if (result?.artifact) {
  //       setEditedImage(result?.artifact);

  //       const hasPermission = await requestAndroidPermission();
  //       if (true) {
  //         await CameraRoll.save(result.artifact, { type: 'photo' });
  //         Alert.alert('Success', 'Image saved to gallery!');
  //       } else {
  //         Alert.alert(
  //           'Permission Denied',
  //           'Cannot save image without permission',
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.error('IMGLY Editor error:', error);
  //     Alert.alert('Error', 'Editor cancelled or failed');
  //   }
  // };

  
  const handleOther = async () => {
    try {
      const settings = new EditorSettingsModel({
        license:
          'z_9lMDUqcUwlNkjjU52ZLFQbwBvxJ60uSd_ouvwBDRCKtmK5fbZAtHFd3889zr9v',
        export: {
          filename: 'edited_image',
          image: {
            format: 'jpeg',
            exportType: 'file-url', // important for RNFS
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
          source: editedImage,
          type: SourceType.IMAGE,
        },
        EditorPreset.PHOTO,
      );

      console.log('Edited image result:', result);

      if (result?.artifact) {
        const hasPermission = await requestAndroidPermission();
        if (!hasPermission) {
          Alert.alert(
            'Permission Denied',
            'Cannot save image without permission',
          );
          // return;
        }

        const fileName = `edited_${Date.now()}.jpg`;
        const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;
        const sourcePath = result.artifact.replace('file://', '');

        await RNFS.copyFile(sourcePath, destPath);
        console.log('Saved to:', destPath);

      
        Alert.alert('Success', 'Image saved to gallery!');
      }
    } catch (error) {
      console.error('IMGLY Editor error:', error);
      Alert.alert('Error', 'Editor cancelled or failed');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.headerText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {editedImage && (
          <Image
            source={{ uri: editedImage }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={handleCrop}>
          <Text style={styles.bottomText}>Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handleRotateWithCropper}>
          <Text style={styles.bottomText}>Rotate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButton} onPress={handleOther}>
          <Text style={styles.bottomText}>Other</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditPhotoScreen;
