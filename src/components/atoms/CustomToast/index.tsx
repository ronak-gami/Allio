// src/components/CustomToast.tsx
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
import useStyle from './style'; // Assuming this provides StyleSheet.create or similar
import { ICONS } from '@assets/index'; // Assuming ICONS.Clear is your cross icon
import { COLORS } from '@utils/color'; // Assuming COLORS provides your color constants

// Define the shape of the props for the toast
interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error'; // You can expand these types
}

// Define the shape of the ref handle methods that will be exposed
export interface CustomToastRef {
  show: (message: string, type?: 'success' | 'info' | 'error') => void;
  hide: () => void;
}

const { width } = Dimensions.get('window');

const CustomToast = forwardRef<CustomToastRef, {}>(({}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'info' | 'error'>('info'); // Default type
  const animatedValue = useRef(new Animated.Value(-100)).current; // Start off-screen above

  // Get styles from the hook
  const styles = useStyle(); // Call the hook inside the component

  // Expose show and hide methods via useImperativeHandle
  useImperativeHandle(ref, () => ({
    show: (msg, toastType = 'info') => {
      setMessage(msg);
      setType(toastType);
      setIsVisible(true);
      Animated.timing(animatedValue, {
        toValue: 0, // Slide down to top of screen
     
        useNativeDriver: true,
      }).start();

      
      // setTimeout(() => {
      //   // Ensure ref.current exists before calling hide
      //   ref.current?.hide();
      // }, 10000);
    },
    hide: () => {
      Animated.timing(animatedValue, {
        toValue: -100, // Slide back up off-screen
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    },
  }));

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return COLORS.primary; // Green
      case 'error':
        return COLORS.error; // Red
      case 'info':
      default:
        return COLORS.lightgray; // Blue
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
