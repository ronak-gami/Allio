import React, { useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import FeatureCard from '@components/molecules/FeatureCard';
import type { FeatureDataItem } from './style';
import useStyle from './style';
import Text from '@components/atoms/Text';

const windowWidth = Dimensions.get('window').width;

export function FeaturesCarousel({
  data,
  onPress,
}: {
  data: FeatureDataItem[];
  onPress: (label: string) => void;
}) {
  const { CARD_WIDTH, styles } = useStyle();
  const carouselRef = useRef<ICarouselInstance>(null);

  const panGesture = Gesture.Pan().onEnd(event => {
    // Only navigate carousel on significant horizontal swipe
    if (
      Math.abs(event.translationX) > Math.abs(event.translationY) &&
      Math.abs(event.translationX) > 20
    ) {
      const direction = event.translationX < 0 ? 'next' : 'prev';
      carouselRef.current?.[direction]({ animated: true });
    }
  });

  return (
    <>
      <Text style={styles.textone}>Features of ALLIO</Text>

      <GestureDetector gesture={panGesture}>
        <Carousel
          ref={carouselRef}
          data={data}
          width={windowWidth}
          height={CARD_WIDTH * 0.9}
          loop
          mode="horizontal-stack"
          modeConfig={{
            stackInterval: 20,
            scaleInterval: 0.1,
            moveSize: CARD_WIDTH,
            snapDirection: 'left',
          }}
          onConfigurePanGesture={gesture => {
            gesture.enabled(false);
          }}
          renderItem={({ item }) => (
            <View style={{ width: CARD_WIDTH }}>
              <FeatureCard
                image={item.image}
                title={item.title}
                description={item.description}
                buttonText={item.buttonText}
                onPress={() => onPress(item.title)}
              />
            </View>
          )}
          customConfig={() => ({ viewCount: 3, type: 'positive' })}
        />
      </GestureDetector>
    </>
  );
}
