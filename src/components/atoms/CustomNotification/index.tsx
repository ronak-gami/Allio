import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Text, Animated, TouchableOpacity, Image } from 'react-native';

import { ICONS } from '@assets/index';
import { COLORS } from '@utils/color';

import useStyle from './style';

export interface CustomToastRef {
  show: (message: string, type?: 'success' | 'info' | 'error') => void;
  hide: () => void;
}
type NotificationType = 'success' | 'info' | 'error';

interface NotificationState {
  isVisible: boolean;
  message: string;
  type: NotificationType;
}
const CustomNotification = forwardRef<CustomToastRef, {}>(({}, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const animatedValue = useRef(new Animated.Value(-100)).current;

  const [type, setType] = useState<NotificationType>('info');
  const styles = useStyle();

  useImperativeHandle(ref, () => ({
    show: (msg, toastType = 'info') => {
      setMessage(msg);
      setType(toastType);
      setIsVisible(true);
      Animated.timing(animatedValue, {
        toValue: 0,

        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        ref.current?.hide();
      }, 5000);
    },
    hide: () => {
      Animated.timing(animatedValue, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    },
  }));

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return COLORS.primary;
      case 'error':
        return COLORS.error;
      case 'info':
      default:
        return COLORS.lightgray;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY: animatedValue }],
        },
      ]}>
      <Text style={styles.messageText}>{message}</Text>
      <TouchableOpacity
        onPress={() => ref.current?.hide()}
        style={styles.closeButton}>
        <Image source={ICONS.Clear} style={styles.closeIcon} />
      </TouchableOpacity>
    </Animated.View>
  );
});

export default CustomNotification;
