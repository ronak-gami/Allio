import { useCallback, useRef } from 'react';
import { BackHandler } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const useBottomSheetBackHandler = bottomSheetRef => {
  const backHandlerSubscriptionRef = useRef<BottomSheetModal>(null);
  const handleSheetPositionChange = useCallback(
    index => {
      const isBottomSheetVisible = index >= 0;
      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        backHandlerSubscriptionRef.current = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            bottomSheetRef?.current?.dismiss();
            return true;
          },
        );
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef],
  );
  return { handleSheetPositionChange };
};

export { useBottomSheetBackHandler };
