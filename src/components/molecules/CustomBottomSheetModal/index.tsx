// import React, { forwardRef, useCallback, useState } from 'react';
// import {
//   BottomSheetModal,
//   BottomSheetModalProvider,
//   BottomSheetView,
// } from '@gorhom/bottom-sheet';
// import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { BlurView } from '@react-native-community/blur';
// import Text from '@components/atoms/Text';
// import Button from '@components/atoms/Button';
// import { ICONS } from '@assets/index';

// import useStyle from './style';
// interface Props {
//   title: string;
//   buttonTitle: string;
//   onButtonPress: () => void;
//   onClose: () => void;
//   children?: React.ReactNode;
// }

// export const CustomBottomSheetModal = forwardRef<BottomSheetModal, Props>(
//   ({ title, buttonTitle, onButtonPress, onClose, children }, ref) => {
//     const snapPoints = ['50%'];
//     const styles = useStyle();
//   const [isVisible, setIsVisible] = useState(false);
//     const closeSheet = useCallback(() => {
//       onClose?.();
//       ref && typeof ref !== 'function' && ref.current?.dismiss();
//     }, [onClose, ref]);

//     return (

//         {isVisible && (
//           <BlurView
//             style={StyleSheet.absoluteFill}
//             blurType="light"
//             blurAmount={10}
//             reducedTransparencyFallbackColor="white"
//           />
//         )}

//       <BottomSheetModal
//         ref={ref}
//         index={0}
//         snapPoints={snapPoints}
//         onDismiss={closeSheet}>
//         <BottomSheetView style={styles.sheetContent}>
//           {/* Header with title and close icon */}
//           <View style={styles.header}>
//             <Text type="bold" style={styles.title}>
//               {title}
//             </Text>
//             <TouchableOpacity onPress={closeSheet} style={styles.closeBtn}>
//               <Image source={ICONS.Clear} style={styles.closeIcon} />
//             </TouchableOpacity>
//           </View>
//           {/* Content */}
//           <View style={styles.content}>{children}</View>
//           {/* Bottom Button */}
//           {/* i want to add logic hear if i pass title so my button visible othervise not */}
//           {title && (
//             <Button
//               title={buttonTitle}
//               onPress={onButtonPress}
//               style={styles.bottomButton}
//             />
//           )}
//         </BottomSheetView>
//       </BottomSheetModal>
//     );
//   },
// );

// export const BottomSheetWrapper: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => <BottomSheetModalProvider>{children}</BottomSheetModalProvider>;
import React, { forwardRef, useCallback, useState } from 'react';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';

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
}

export const CustomBottomSheetModal = forwardRef<BottomSheetModal, Props>(
  ({ title, buttonTitle, onButtonPress, onClose, children }, ref) => {
    const snapPoints = ['50%'];
    const styles = useStyle();

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const closeSheet = useCallback(() => {
      setIsVisible(false);
      onClose?.();
      ref && typeof ref !== 'function' && ref.current?.dismiss();
    }, [onClose, ref]);

    const handlePresent = useCallback(() => {
      setIsVisible(true);
    }, []);

    return (
      <>
        {isVisible && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
        )}

        <BottomSheetModal
          ref={ref}
          index={0}
          snapPoints={snapPoints}
          onDismiss={closeSheet}
          onChange={index => setIsVisible(index >= 0)}>
          <BottomSheetView style={styles.sheetContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text type="bold" style={styles.title}>
                {title}
              </Text>
              <TouchableOpacity onPress={closeSheet} style={styles.closeBtn}>
                <Image source={ICONS.Clear} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>{children}</View>

            {/* Bottom Button */}
            {title && (
              <Button
                title={buttonTitle}
                onPress={onButtonPress}
                style={styles.bottomButton}
              />
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  },
);

export const BottomSheetWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <BottomSheetModalProvider>{children}</BottomSheetModalProvider>;
