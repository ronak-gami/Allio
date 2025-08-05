import React, { memo } from 'react';
import {
  Modal,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';

import { ICONS } from '@assets/index';
import Text from '@components/atoms/Text';

import useStyle from './style';

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const BottomModal: React.FC<BottomModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const styles = useStyle();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}>
          {!!title && (
            <Text type="bold" style={styles.title}>
              {title}
            </Text>
          )}
          {children}
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeIconContainer}>
              <Image
                source={ICONS.cancel}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default memo(BottomModal);
