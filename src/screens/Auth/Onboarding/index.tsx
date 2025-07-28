import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const Onboarding: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const onboardingWatched = await AsyncStorage.getItem('onboardingWatched');
      if (onboardingWatched === 'true') {
        navigation.replace('Login');
      } else {
        setLoading(false);
      }
    };
    checkOnboardingStatus();
  }, [navigation]);

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      await AsyncStorage.setItem('onboardingWatched', 'true');
      dispatch(setStateKey({ key: 'onboardingCompleted', value: true }));
      navigation.replace('Login');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboardingWatched', 'true');
    dispatch(setStateKey({ key: 'onboardingCompleted', value: true }));
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

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
