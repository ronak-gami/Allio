import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import useStyle from './style';
import { ICONS } from '@assets/index';
import { COLORS } from '@utils/color';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error'; // You can expand these types
}

export interface CustomToastRef {
  show: (message: string, type?: 'success' | 'info' | 'error') => void;
  hide: () => void;
}

const { width } = Dimensions.get('window');

const CustomToast = forwardRef<CustomToastRef, {}>(({}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'info' | 'error'>('info');
  const animatedValue = useRef(new Animated.Value(-100)).current;

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

      // setTimeout(() => {
      //   // Ensure ref.current exists before calling hide
      //   ref.current?.hide();
      // }, 10000);
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
        {/* Make sure ICONS.Clear is a valid image source */}
        <Image source={ICONS.Clear} style={styles.closeIcon} />
      </TouchableOpacity>
    </Animated.View>
  );
});

export default CustomToast;
