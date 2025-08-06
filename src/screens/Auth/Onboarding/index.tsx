import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import analytics from '@react-native-firebase/analytics';

import { AuthStackParamList } from '@types/navigations';
import { CustomFlatList, CustomOnboarding } from '@components/index';
import { onboardingData } from '@utils/constant';
import { width } from '@utils/helper';

import { setStateKey } from '@redux/slices/AuthSlice';

import useStyle from './style';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const Onboarding: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<any>(undefined);

  useEffect(() => {
    crashlytics().log('OnboardingScreen mounted');
    const trace = perf().newTrace('onboarding_screen_load');
    trace.start();
    return () => {
      trace.stop();
    };
  }, []);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      dispatch(setStateKey({ key: 'onboardingCompleted', value: false }));
      await analytics().logEvent('onboarding_get_started');
      navigation.replace('Login');
    }
  };

  const handleSkip = async () => {
    dispatch(setStateKey({ key: 'onboardingCompleted', value: false }));
    await analytics().logEvent('onboarding_skipped');
    navigation.replace('Login');
  };

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <CustomFlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <CustomOnboarding
            image={item?.image}
            title={item?.title}
            description={item?.description}
            width={width}
          />
        )}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
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

export default Onboarding;
