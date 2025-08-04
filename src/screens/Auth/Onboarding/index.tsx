import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import analytics from '@react-native-firebase/analytics';

import StatusBar from '@components/atoms/StatusBar';
import CustomOnboarding from '@components/atoms/CustomOnboarding';
import { onboardingData } from '@utils/constant';
import { setStateKey } from '@redux/slices/AuthSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@types/navigations';
import { width } from '@utils/helper';

import useStyle from './style';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const Onboarding: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    crashlytics().log('OnboardingScreen mounted');
    const trace = perf().newTrace('onboarding_screen_load');
    trace.start();
    return () => {
      trace.stop();
    };
  }, [navigation]);

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

  const getItemLayout = (data: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.statusBar.backgroundColor}
      />

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
        getItemLayout={getItemLayout}
        snapToInterval={width}
        snapToAlignment="start"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <CustomOnboarding
            image={item.image}
            title={item.title}
            description={item.description}
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
