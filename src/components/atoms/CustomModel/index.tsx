import React, { memo } from 'react';
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
import { ICONS } from '@assets/index';
import CustomLoader from '../CustomLoader';

interface CustomModalProps {
  visible: boolean | any;
  title: string;
  description?: string;
  onClose?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
  loading?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  description,
  onClose,
  children,
  loading,
}) => {
  const { colors } = useTheme();
  const styles = useStyle();

  return (
    <>
      <Modal
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        visible={visible}
        onRequestClose={onClose}>
        <View style={[styles.overlay, { backgroundColor: colors.modelbg }]}>
          <View style={[styles.card, { backgroundColor: colors.text }]}>
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

            <Text type="BOLD" style={styles.title}> 
            {title}
            </Text>

            {description && (
              <Text style={styles.description}>{description}</Text>
            )}

            <View style={styles.children}>{children}</View>
          </View>
        </View>
      </Modal>
      {loading && <CustomLoader visible={loading} />}
    </>
  );
};

export default memo(CustomModal);
