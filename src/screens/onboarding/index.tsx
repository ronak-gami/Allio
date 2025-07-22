import React, {useRef, useState} from 'react';
import {View, FlatList, TouchableOpacity, Text} from 'react-native';
import Onboarding from '../../components/atoms/CustomOnboarding';
import {onboardingData} from '../../utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './style';

const OnboardingScreen = ({navigation}: any) => {
  const checkOnboardingStatus = async () => {
    const onboardingWatched = await AsyncStorage.getItem('onboardingWatched');
    if (onboardingWatched) {
      // navigation.replace('splashScreen');
    }
  };
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef<FlatList<any>>(null);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({index: currentIndex + 1});
      }
      setCurrentIndex(currentIndex + 1);
    } else {
      await AsyncStorage.setItem('onboardingWatched', 'true');
      checkOnboardingStatus();
      navigation.navigate('LoginScreen');
    }
  };
  const handleSkip = () => {
    navigation.navigate('LoginScreen'); // Assuming you want to navigate to Login on skip
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Onboarding
            image={item.image}
            title={item.title}
            description={item.description}
          />
        )}
        onMomentumScrollEnd={event => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x /
              event.nativeEvent.layoutMeasurement.width,
          );
          setCurrentIndex(index);
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingScreen;
// import React, {useRef, useState} from 'react';
// import {View, FlatList, TouchableOpacity, Text} from 'react-native';
// import OnboardingScreen from '../../components/atoms/Onboarding';
// import {useStyle} from './style';
// import {onboardingData} from '../../utils/constant';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// // Import navigation types
// import type {NativeStackScreenProps} from '@react-navigation/native-stack';

// // Define your stack param list
// type RootStackParamList = {
//   splashScreen: undefined;
//   Auth: undefined;
//   // Add other screens if needed
// };

// // Use the correct type for props
// type OnboardingProps = NativeStackScreenProps<
//   RootStackParamList,
//   'splashScreen'
// >;

// const styles = useStyle();
// const Onboarding = ({navigation}: OnboardingProps) => {
//   const chackOnboardingStatus = async () => {
//     const onboardingWatched = await AsyncStorage.getItem('onboardingWatched');
//     if (onboardingWatched) {
//       navigation.replace('splashScreen');
//     }
//   };
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const flatListRef = useRef<FlatList<any>>(null);

//   const handleNext = async () => {
//     if (currentIndex < onboardingData.length - 1) {
//       if (flatListRef.current) {
//         flatListRef.current.scrollToIndex({index: currentIndex + 1});
//       }
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       await AsyncStorage.setItem('onboardingWatched', 'true');
//       chackOnboardingStatus();
//     }
//   };
//   const handleSkip = () => {
//     navigation.replace('Auth');
//   };
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
//         <Text style={styles.skipText}>Skip</Text>
//       </TouchableOpacity>
//       <FlatList
//         ref={flatListRef}
//         data={onboardingData}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={item => item.id}
//         renderItem={({item}) => (
//           <OnboardingScreen
//             image={item.image}
//             title={item.title}
//             description={item.description}
//           />
//         )}
//         onMomentumScrollEnd={event => {
//           const index = Math.round(
//             event.nativeEvent.contentOffset.x /
//               event.nativeEvent.layoutMeasurement.width,
//           );
//           setCurrentIndex(index);
//         }}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleNext}>
//         <Text style={styles.buttonText}>
//           {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Onboarding;
