import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';
import { ICONS } from '@assets/index';
import useStyle from './style';

const CameraScreen = () => {
  const styles = useStyle();
  const [flash, setFlash] = useState<'on' | 'off'>('off');

  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
    })();
  }, []);

  const takePhoto = async () => {
    try {
      const photo = await cameraRef.current?.takePhoto({
        flash,
      });
      if (photo?.path) {
        navigation.navigate('EditPhoto', {
          imageUri: 'file://' + photo.path,
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ICONS.cancel} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
      </View>
    </View>
  );
};

export default CameraScreen;
