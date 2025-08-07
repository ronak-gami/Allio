import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { scale } from 'react-native-size-matters';
import { width } from '@utils/helper';

export const IMAGE_WIDTH = width * 0.7;
export const IMAGE_MARGIN = scale(10);

export const useImageSlider = (images: any[]) => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [current, setCurrent] = useState<number>(0);
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

  return {
    flatListRef,
    current,
    goNext,
    goPrev,
    onMomentumScrollEnd,
    IMAGE_WIDTH,
    IMAGE_MARGIN,
  };
};
