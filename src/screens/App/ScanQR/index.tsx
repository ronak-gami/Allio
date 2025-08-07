import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import useStyle from './style';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';

import { TabParamList } from '@types/navigations';
import Input from '@components/atoms/Input';
import { ICONS } from '@assets/index';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import useScanQR from './useScanQR';
import CustomLoader from '@components/atoms/CustomLoader';

type Props = BottomTabScreenProps<TabParamList, 'ScanQR'>;

const ScanQR: React.FC<Props> = () => {
  const styles = useStyle();
  const { colors } = useTheme();
  const device = useCameraDevice('back');

  const {
    emailError,
    toggleTorch,
    handleOpenMyQR,
    externalSubmitHandler,
    onQRCodeScanned,
    states,
  } = useScanQR();

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        const scannedCode = codes[0].value;
        if (scannedCode) {
          onQRCodeScanned(scannedCode);
        }
      }
    },
  });

  return (
    <>
      <CustomLoader visible={states?.loading} />
      {!states.loading && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollcontainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.titleRow}>
              <Text style={styles.title} type="BOLD">
                scanQr.title
              </Text>
            </View>

            <View style={styles.cameraContainer}>
              <View style={styles.camera}>
                {device && (
                  <Camera
                    style={styles.camera}
                    device={device}
                    isActive={true}
                    torch={states?.torchOn ? 'on' : 'off'}
                    codeScanner={codeScanner}
                  />
                )}
              </View>
              <View style={styles.overlay}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>

            <TouchableOpacity
              style={styles.flashIconContainer}
              onPress={toggleTorch}
              activeOpacity={0.7}>
              <Image
                source={ICONS.light}
                style={[
                  styles.flashIcon,
                  {
                    tintColor: states?.torchOn ? colors.primary : colors.black,
                  },
                ]}
              />
            </TouchableOpacity>

            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText} type="extrabold">
                OR
              </Text>
              <View style={styles.line} />
            </View>

            <View style={styles.inputContainer}>
              <Input
                placeholder="scanQr.enter_email"
                value={states?.email}
                onChangeText={states?.setEmail}
                keyboardType="email-address"
                error={emailError}
                style={styles.input}
              />

              <Button
                title="scanQr.submit"
                onPress={externalSubmitHandler}
                bgColor={colors.primary}
                textColor={colors.text}
              />

              <Button
                title="scanQr.view_my_qr"
                onPress={handleOpenMyQR}
                bgColor={colors.primary}
                textColor={colors.text}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default ScanQR;
