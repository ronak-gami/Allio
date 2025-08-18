import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import useStyle from './style';
import { useTheme } from '@react-navigation/native';

import { Button, Container, Text } from '@components/index';
import useMyQR from './useMyQR';

const MyQR: React.FC = () => {
  const styles = useStyle();
  const { colors } = useTheme();

  const { qrImageUri, handleDownload, handleShare, states } = useMyQR();

  return (
    <Container title="My QR" showBackArrow>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollcontainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.cameraContainer}>
            <View style={styles.camera}>
              {states?.loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : qrImageUri ? (
                <Image
                  source={{ uri: qrImageUri }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              ) : (
                <Text type="medium" style={{ color: colors.text }}>
                  QR Code not available.
                </Text>
              )}
            </View>
          </View>

          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText} type="extrabold">
              OR
            </Text>
            <View style={styles.line} />
          </View>

          <View style={styles.buttonGroup}>
            <Button
              title="Download QR"
              onPress={handleDownload}
              bgColor={colors.primary}
            />
            <Button
              title="Share QR"
              onPress={handleShare}
              bgColor={colors.primary}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default MyQR;
