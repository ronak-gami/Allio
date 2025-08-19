import React, { useMemo, useCallback, ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useBottomSheet } from '../../../context/BottomSheetContext';
import { ICONS } from '@assets/index';
import Button from '@components/atoms/Button';

import useStyle from './style';
import Text from '../Text';
interface GlobalBottomSheetProps {
  children: ReactNode;
}

const GlobalBottomSheet: React.FC<GlobalBottomSheetProps> = ({ children }) => {
  const {
    bottomSheetRef,
    snapPoints,
    content,
    title,
    showCloseButton,
    buttons,
    closeBottomSheet,
  } = useBottomSheet();
  const styles = useStyle();

  const memoizedSnapPoints = useMemo(() => {
    return snapPoints;
  }, [snapPoints]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
        onPress={() => {
          closeBottomSheet();
        }}
      />
    ),
    [closeBottomSheet],
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        closeBottomSheet();
      }
    },
    [closeBottomSheet],
  );

  return (
    <>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Start closed
        snapPoints={memoizedSnapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.background}
        style={styles.bottomSheet}>
        <BottomSheetView style={styles.contentContainer}>
          {/* Header with title and close button */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                {title && (
                  <Text
                    type="semibold"
                    style={styles.headerTitle}
                    label={title}
                  />
                )}
              </View>
              {showCloseButton && (
                <TouchableOpacity onPress={closeBottomSheet}>
                  <Image source={ICONS.cancel} style={styles.closeButton} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content Area */}
          <View style={styles.contentArea}>
            {content ? (
              <>{content}</>
            ) : (
              <>
                <Text style={styles.defaultTitle}>Bottom Sheet Content</Text>
                <Text style={styles.defaultSubtitle}>
                  This is the default content. Pass custom content through the
                  context.
                </Text>
              </>
            )}
          </View>

          {/* Buttons at the bottom */}
          {buttons.length > 0 && (
            <View style={styles.buttonContainer}>
              {buttons.map((button, index) => {
                return (
                  <Button
                    key={index}
                    title={button.title}
                    onPress={button.onPress}
                    disabled={button.disabled}
                  />
                );
              })}
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({});

export default GlobalBottomSheet;
