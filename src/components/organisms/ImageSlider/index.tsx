import React from 'react';
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import { ICONS } from '@assets/index';
import useStyle from './style';
import { useImageSlider } from './useImageSlide';

interface ImageSliderProps {
  images: any[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const styles = useStyle();
  const {
    flatListRef,
    current,
    goNext,
    goPrev,
    onMomentumScrollEnd,
    IMAGE_WIDTH,
    IMAGE_MARGIN,
  } = useImageSlider(images);

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
