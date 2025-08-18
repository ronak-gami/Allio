// import React, { memo } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { ICONS } from '@assets/index';
import useStyle from './style';
import { useImageSlider } from './useImageSlide';
import { CustomFlatList } from '@components/index';
import { memo } from 'react';

interface ImageSliderProps {
  images: any[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const styles = useStyle();
  const {
    flatListRef,
    current,
    onMomentumScrollEnd,
    IMAGE_WIDTH,
    IMAGE_MARGIN,
  } = useImageSlider(images);

  return (
    <View style={styles.container}>
      <CustomFlatList
        ref={flatListRef as React.RefObject<any>}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={IMAGE_WIDTH + IMAGE_MARGIN * 2}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.contentContainer}
        keyExtractor={(_, idx: number) => idx.toString()}
        renderItem={({ item }: { item: any }) => (
          <Image source={item} style={styles.image} resizeMode="cover" />
        )}
        onMomentumScrollEnd={onMomentumScrollEnd as (event: any) => void}
        getItemLayout={(_: any, index: number) => ({
          length: IMAGE_WIDTH + IMAGE_MARGIN * 2,
          offset: (IMAGE_WIDTH + IMAGE_MARGIN * 2) * index,
          index,
        })}
        initialScrollIndex={current}
        extraData={current}
        ListEmptyComponent={null as React.ReactElement | null}
      />
    </View>
  );
};

export default memo(ImageSlider);
