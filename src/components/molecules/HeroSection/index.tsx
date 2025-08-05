// import React from 'react';
// import { View, Image, StyleSheet, Pressable } from 'react-native';
// import Button from '@components/atoms/Button';
// import Text from '@components/atoms/Text';
// import { IMAGES } from '@assets/index';
// import useStyle from './style';

// interface HeroSectionProps {
//   onVisionPress: () => void;
//   onGoalPress: () => void;
//   description: string;
// }

// const HeroSection: React.FC<HeroSectionProps> = ({
//   onVisionPress,
//   onGoalPress,
//   description,
// }) => {
//   const styles = useStyle();

//   return (
//     <View style={styles.container}>
//       <View style={styles.imageWrapper}>
//         <Image source={IMAGES.Mobile} style={styles.image} />
//       </View>
//       <View style={styles.contentWrapper}>
//         <View style={styles.textWrapper}>
//           <Text type="bold" style={styles.title}>
//             About Allio
//           </Text>
//           <Text style={styles.description}>{description}</Text>
//         </View>
//         <View style={styles.buttonRow}>
//           <Pressable>
//             <Button
//               title="Vision"
//               onPress={onVisionPress}
//               style={styles.button}
//             />
//           </Pressable>
//           <Pressable>
//             <Button title="Goal" onPress={onGoalPress} style={styles.button} />
//           </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default HeroSection;
import React, { useEffect } from 'react';
import { View, ImageBackground, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import { IMAGES } from '@assets/index';
import useStyle from './style';
// import LottieView from 'lottie-react-native';

const { width: W, height: H } = Dimensions.get('window');

interface Props {
  description: string;
  handleVision: () => void;
  handleGoal: () => void;
}

export default function HeroSection({
  description,
  handleVision,
  handleGoal,
}: Props) {
  const styles = useStyle();

  const titleY = useSharedValue(50);
  const descY = useSharedValue(60);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    titleY.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    descY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    btnOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: titleY.value === 0 ? 1 : 0,
  }));
  const descStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: descY.value }],
    opacity: descY.value === 0 ? 1 : 0,
  }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
  }));

  return (
    <ImageBackground
      source={IMAGES.Mobile}
      resizeMode="cover"
      style={styles.bg}>
      <View style={styles.overlay} />
      <Animated.View style={[styles.textBlock, titleStyle]}>
        <Text type="bold" style={styles.title}>
          Welcome to ALLIO
        </Text>
      </Animated.View>
      <Animated.View style={[styles.descBlock, descStyle]}>
        <Text style={styles.description}>{description}</Text>
      </Animated.View>
      <Animated.View style={[styles.buttonRow, btnStyle]}>
        {/* <Button
          title="Vision"
          onPress={() => {
            console.log('Vision pressed from HeroSection');
            handleVision();
          }}
        /> */}
        {/* <Button
          title="Goal"
          onPress={() => {
            console.log('Goal pressed from HeroSection');
            handleGoal();
          }}
        /> */}
      </Animated.View>

      {/* Decorative floating shape using Lottie or static */}
    </ImageBackground>
  );
}
