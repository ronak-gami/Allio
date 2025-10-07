import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import { ICONS } from '@assets/index';
import { useCall } from '../../../context/CallContext';
import { height, width } from '@utils/helper';

const AudioCallHeader: React.FC = () => {
  const { colors } = useTheme();
  const {
    isAudioCallActive,
    audioCallData,
    showAudioCallHeader,
    navigateToAudioCall,
    endAudioCall,
  } = useCall();

  const [slideAnim] = useState(new Animated.Value(-100));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Format time display (mm:ss or hh:mm:ss)
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Animate header in/out
  useEffect(() => {
    if (showAudioCallHeader && isAudioCallActive) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showAudioCallHeader, isAudioCallActive, slideAnim]);

  // Pulse animation for call indicator
  useEffect(() => {
    if (showAudioCallHeader && isAudioCallActive) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [showAudioCallHeader, isAudioCallActive, pulseAnim]);

  // Show header if audio call is active AND (we should show header OR we have call data)
  if (!isAudioCallActive || (!showAudioCallHeader && !audioCallData)) {
    return null;
  }

  // Provide fallback data if audioCallData is null but we should show header
  const displayData = audioCallData || {
    callerName: 'Audio Call',
    callDuration: 0,
    callId: '',
  };

  const styles = createStyles(colors);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      <TouchableOpacity
        style={styles.callInfo}
        onPress={navigateToAudioCall}
        activeOpacity={0.8}>
        {/* Call status indicator */}
        <View style={styles.callIndicator}>
          <Animated.View
            style={[
              styles.pulseIndicator,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <Image source={ICONS.voiceCall} style={styles.callIcon} />
        </View>

        {/* Call details */}
        <View style={styles.callDetails}>
          <Text style={styles.callerName} numberOfLines={1}>
            {displayData.callerName}
          </Text>
          <Text style={styles.callDuration}>
            {formatTime(displayData.callDuration)}
          </Text>
        </View>

        {/* Tap to return text */}
        <Text style={styles.tapToReturn}>Tap to return</Text>
      </TouchableOpacity>

      {/* End call button */}
      <TouchableOpacity
        style={styles.endCallButton}
        onPress={endAudioCall}
        activeOpacity={0.8}>
        <Image source={ICONS.cancel} style={styles.endCallIcon} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: height * 0.08,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(16),
      zIndex: 1000,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    callInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    callIndicator: {
      position: 'relative',
      marginRight: scale(12),
    },
    pulseIndicator: {
      position: 'absolute',
      width: scale(32),
      height: scale(32),
      borderRadius: scale(16),
      backgroundColor: colors.background,
      opacity: 0.3,
      top: -scale(4),
      left: -scale(4),
    },
    callIcon: {
      width: scale(24),
      height: scale(24),
      tintColor: colors.background,
    },
    callDetails: {
      flex: 1,
      marginRight: scale(12),
    },
    callerName: {
      fontSize: scale(14),
      fontWeight: '600',
      color: colors.background,
      marginBottom: scale(2),
      maxWidth: width * 0.4, // Ensure it doesn't take too much space
    },
    callDuration: {
      fontSize: scale(12),
      color: colors.background,
      opacity: 0.9,
    },
    tapToReturn: {
      fontSize: scale(12),
      color: colors.background,
      opacity: 0.8,
      fontWeight: '500',
    },
    endCallButton: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      //   backgroundColor: '#FF3B30',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: scale(12),
    },
    endCallIcon: {
      width: scale(20),
      height: scale(20),
      tintColor: '#FFFFFF',
    },
  });

export default AudioCallHeader;
