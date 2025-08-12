import React, { ReactElement, forwardRef, memo, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { useBottomSheetBackHandler } from './useBottomSheetBackHandler';
import { AppBottomSheetProps } from './types';
import useStyles from './styles';

const AppBottomSheet = forwardRef(
  (
    { height, children, onDismiss, ...rest }: AppBottomSheetProps,
    ref: any,
  ): ReactElement => {
    const styles = useStyles();

    const snapPoints = useMemo((): string[] | number[] => height, [height]);

    const { handleSheetPositionChange } = useBottomSheetBackHandler(ref);

    const renderBackdrop = () => {
      return (
        <TouchableOpacity
          activeOpacity={0}
          onPress={() => ref?.current?.close()}
          style={styles.renderBackdrop}
        />
      );
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onDismiss={onDismiss}
        onChange={handleSheetPositionChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.backgroundStyle}
        {...rest}>
        {children}
      </BottomSheetModal>
    );
  },
);

export default memo(AppBottomSheet);
