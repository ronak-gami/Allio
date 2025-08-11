// components/GlobalBottomSheet.tsx
import React, { forwardRef, useCallback, useMemo } from 'react';
//i want to use
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetHandle,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';

import { View, Text, TouchableOpacity, Image } from 'react-native';
import { BottomSheetConfig } from 'src/context/BottomSheetContext';
import useStyle from './style';
import { COLORS } from '@utils/color';
import { ICONS } from '@assets/index';

interface GlobalBottomSheetProps {
  config: BottomSheetConfig | null;
  onSheetChange: (index: number) => void;
}

export const GlobalBottomSheet = forwardRef<
  BottomSheet,
  GlobalBottomSheetProps
>(({ config, onSheetChange }, ref) => {
  const styles = useStyle();
  const snapPoints = useMemo(() => {
    if (!config) return ['25%'];
    return config.snapPoints || ['25%', '50%'];
  }, [config?.snapPoints]);

  interface RenderBackdropProps extends BottomSheetBackdropProps {}

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => {
      if (!config?.enableBackdrop) return null;

      return (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={config.backdropOpacity || 0.5}
          enableTouchThrough={false}
        />
      );
    },
    [config?.enableBackdrop, config?.backdropOpacity],
  );

  const renderHandle = useCallback(
    (props: BottomSheetHandleProps) => {
      if (config?.enableHandle === false) return null;

      return (
        <BottomSheetHandle
          {...props}
          style={[styles.handle]}
          indicatorStyle={[styles.handleIndicator]}
        />
      );
    },
    [config?.enableHandle],
  );

  const renderButton = (
    button: NonNullable<BottomSheetConfig['buttons']>[0],
    index: number,
  ) => {
    const getButtonStyle = () => {
      switch (button.variant) {
        case 'danger':
          return [styles.button, styles.dangerButton];
        case 'secondary':
          return [styles.button, styles.secondaryButton];
        default:
          return [styles.button, styles.primaryButton];
      }
    };

    const getTextStyle = () => {
      switch (button.variant) {
        case 'danger':
          return [styles.buttonText, styles.dangerButtonText];
        case 'secondary':
          return [styles.buttonText];
        default:
          return [styles.buttonText, styles.primaryButtonText];
      }
    };

    return (
      <TouchableOpacity
        key={index}
        style={getButtonStyle()}
        onPress={button.onPress}
        activeOpacity={0.7}>
        <Text style={getTextStyle()}>{button.title}</Text>
      </TouchableOpacity>
    );
  };

  // Don't render if no config
  if (!config) {
    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={['1%']}
        onChange={onSheetChange}
        enablePanDownToClose={false}
        style={{ display: 'none' }}>
        {/* Empty children to satisfy required prop */}
        <></>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      ref={ref}
      index={-1} // Start closed
      snapPoints={snapPoints}
      onChange={onSheetChange}
      backdropComponent={renderBackdrop}
      handleComponent={renderHandle}
      enablePanDownToClose={true}
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={[styles.background]}>
      <BottomSheetView style={styles.container}>
        {/* Header */}
        {(config.title || config.showCloseButton) && (
          <View style={[styles.header, { borderBottomColor: COLORS.gray }]}>
            {config.title && <Text style={[styles.title]}>{config.title}</Text>}
            {config.showCloseButton && (
              <TouchableOpacity
                style={[styles.closeButton]}
                onPress={() => onSheetChange(-1)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Image
                  source={ICONS.Clear}
                  style={styles.closeButtonText}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>{config.content}</View>

        {/* Buttons */}
        {config.buttons && config.buttons.length > 0 && (
          <View style={styles.buttonsContainer}>
            {config.buttons.map(renderButton)}
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});
