import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetHandle,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import { View, TouchableOpacity, Image } from 'react-native';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import { ICONS } from '@assets/index';
import useStyle from './style';

interface Props {
  title: string;
  buttonTitle: string;
  onButtonPress: () => void;
  onClose: () => void;
  children?: React.ReactNode;
  enableBackdrop?: boolean;
  enableHandle?: boolean;
  backdropOpacity?: number;
  onTabBarVisibilityChange?: (visible: boolean) => void;
}

export const CustomBottomSheetModal = forwardRef<BottomSheetModal, Props>(
  (
    {
      title,
      buttonTitle,
      onButtonPress,
      onClose,
      children,
      enableBackdrop = true,
      enableHandle = true,
      backdropOpacity = 0.7,
      onTabBarVisibilityChange,
    },
    ref,
  ) => {
    const snapPoints = useMemo(() => ['40%'], []);
    const styles = useStyle();

    const closeSheet = useCallback(() => {
      onClose?.();
      onTabBarVisibilityChange?.(true);
      ref && typeof ref !== 'function' && ref.current?.close();
    }, [onClose, ref, onTabBarVisibilityChange]);

    const handleSheetChanges = useCallback(
      (index: number) => {
        // Hide tab bar when sheet is open (index >= 0), show when closed (index === -1)
        onTabBarVisibilityChange?.(index === -1);
      },
      [onTabBarVisibilityChange],
    );

    // Custom backdrop component with blur effect
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => {
        if (!enableBackdrop) return null;

        return (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            enableTouchThrough={false}
            opacity={0.6}
            pressBehavior="close"
          />
        );
      },
      [enableBackdrop, backdropOpacity, closeSheet],
    );

    // Custom handle component
    const renderHandle = useCallback(
      (props: BottomSheetHandleProps) => {
        if (!enableHandle) return null;

        return (
          <BottomSheetHandle
            {...props}
            style={styles.handle}
            indicatorStyle={styles.handleIndicator}
          />
        );
      },
      [enableHandle, styles.handle, styles.handleIndicator],
    );

    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        // onDismiss={closeSheet}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleComponent={renderHandle}
        enablePanDownToClose={true}>
        <BottomSheetView style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text type="BOLD" style={styles.title} label={title} />

            <TouchableOpacity onPress={closeSheet} style={styles.closeBtn}>
              <Image source={ICONS.Clear} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>{children}</View>

          {/* Bottom Button */}
          {buttonTitle && (
            <Button
              title={buttonTitle}
              onPress={onButtonPress}
              style={styles.bottomButton}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

export const BottomSheetWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <BottomSheetModalProvider>{children}</BottomSheetModalProvider>;
