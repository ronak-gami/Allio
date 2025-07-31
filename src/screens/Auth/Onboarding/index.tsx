import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import useStyle from './style';
import CustomOnboarding from '@components/atoms/CustomOnboarding';
import { onboardingData } from '@utils/constant';
import { setStateKey } from '@redux/slices/AuthSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types/navigations';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import analytics from '@react-native-firebase/analytics';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const Onboarding: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    // No need for analytics().logScreenView here! It's handled globally.
    crashlytics().log('OnboardingScreen mounted');
    const trace = perf().newTrace('onboarding_screen_load');
    trace.start();
    const checkOnboardingStatus = async () => {
      const onboardingWatched = await AsyncStorage.getItem('onboardingWatched');
      if (onboardingWatched === 'true') {
        navigation.replace('Login');
      }
    };
    checkOnboardingStatus();
    return () => {
      trace.stop();
    };
  }, [navigation]);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      await AsyncStorage.setItem('onboardingWatched', 'true');
      dispatch(setStateKey({ key: 'onboardingCompleted', value: true }));
      await analytics().logEvent('onboarding_get_started'); // Custom event
      navigation.replace('Login');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboardingWatched', 'true');
    dispatch(setStateKey({ key: 'onboardingCompleted', value: true }));
    await analytics().logEvent('onboarding_skipped'); // Custom event
    navigation.replace('Login');
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
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <CustomOnboarding
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

      <Pressable style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </Pressable>
    </View>
  );
};

export default Onboarding;
