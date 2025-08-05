import React, { useRef, useState, useEffect } from 'react';
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import { ICONS } from '@assets/index';
import useStyle from './style';
import { height, width } from '@utils/helper';
import { scale } from 'react-native-size-matters';

interface ImageSliderProps {
  images: any[];
}

const IMAGE_WIDTH = width * 0.7;
const IMAGE_MARGIN = scale(10);

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const styles = useStyle();
  const flatListRef = useRef<FlatList<any>>(null);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const scrollTo = (index: number, animated = true) => {
    flatListRef.current?.scrollToIndex({ index, animated });
    setCurrent(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      let next = current;
      if (direction === 'forward') {
        if (current >= images.length - 1) {
          setDirection('backward');
          next = current - 1;
        } else {
          next = current + 1;
        }
      } else {
        // backward
        if (current <= 0) {
          setDirection('forward');
          next = current + 1;
        } else {
          next = current - 1;
        }
      }
      scrollTo(next);
    }, 3000);

    return () => clearInterval(timer);
  }, [current, direction, images.length]);

  const onMomentumScrollEnd = (e: any) => {
    const idx = Math.round(
      e.nativeEvent.contentOffset.x / (IMAGE_WIDTH + IMAGE_MARGIN * 2),
    );
    setCurrent(idx);
  };

  const goPrev = () => {
    const prev = current === 0 ? images.length - 1 : current - 1;
    setDirection('backward');
    scrollTo(prev);
  };

  const goNext = () => {
    const next = current === images.length - 1 ? 0 : current + 1;
    setDirection('forward');
    scrollTo(next);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrowLeft} onPress={goPrev}>
        <Image source={ICONS.Left} style={styles.arrowIcon} />
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={IMAGE_WIDTH + IMAGE_MARGIN * 2}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} resizeMode="cover" />
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: IMAGE_WIDTH + IMAGE_MARGIN * 2,
          offset: (IMAGE_WIDTH + IMAGE_MARGIN * 2) * index,
          index,
        })}
        initialScrollIndex={current}
        extraData={current}
      />
      <TouchableOpacity style={styles.arrowRight} onPress={goNext}>
        <Image source={ICONS.ArrowRight} style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageSlider;
