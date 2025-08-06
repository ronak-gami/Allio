import React, { useRef } from 'react';
import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import FeatureCard from '@components/molecules/FeatureCard';
import type { FeatureDataItem } from './style';
import useStyle from './style';
import Text from '@components/atoms/Text';

const windowWidth = Dimensions.get('window').width;

interface FeaturesCarouselProps {
  data: FeatureDataItem[];
  onPress: (label: string) => void;
}

export const FeaturesCarousel: React.FC<FeaturesCarouselProps> = ({
  data,
  onPress,
}) => {
  const { CARD_WIDTH, styles } = useStyle();
  const carouselRef = useRef<ICarouselInstance>(null);

  return (
    <>
      <Text style={styles.textone}>Features of ALLIO</Text>

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
    </>
  );
};
