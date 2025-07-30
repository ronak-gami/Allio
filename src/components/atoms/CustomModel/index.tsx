import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import useStyle from './style';
import Text from '../Text';
import { ICONS } from '@assets/index'; // Replace with your close icon asset path

interface CustomModalProps {
  visible: boolean | any;
  title: string;
  description?: string;
  onClose?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  description,
  onClose,
  children,
}) => {
  const { colors } = useTheme();
  const styles = useStyle();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.modalbg }]}>
        <View style={[styles.card, { backgroundColor: colors.text }]}>
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeIconContainer}>
              <Image
                source={ICONS.cancel}
                style={[styles.closeIcon, { tintColor: colors.background }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

          <Text
            type="BOLD"
            style={[styles.title, { color: colors.background }]}>
            {title}
          </Text>

          {description && (
            <Text style={[styles.description, { color: colors.background }]}>
              {description}
            </Text>
          )}

          <View>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
