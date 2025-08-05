// import { StyleSheet } from 'react-native';
// import { scale } from 'react-native-size-matters';
// import { useTheme } from '@react-navigation/native';
// import { FONTS } from '@utils/helper';

// const useStyle = () => {
//   const { colors } = useTheme();
//   return StyleSheet.create({
//     row: { flexDirection: 'row', paddingHorizontal: SP, paddingVertical: 16 },
//   });
// };

// export default useStyle;
// style.ts
import { Dimensions, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { width } from '@utils/helper';
import { CARD_WIDTH } from '@utils/constant';
import { SPACING } from '@utils/constant';
export interface FeatureDataItem {
  image: any;
  title: string;
  description: string;
  buttonText: string;
}

// const CARD_WIDTH = width * 0.94;
// const SPACING = (width - CARD_WIDTH) / 0.6;

const styles = StyleSheet.create({
  textone: {
    padding: 10,
    fontSize: scale(28),
    fontWeight: 'bold',
  },
});

export default function useStyle() {
  return { CARD_WIDTH, SPACING, styles };
}
