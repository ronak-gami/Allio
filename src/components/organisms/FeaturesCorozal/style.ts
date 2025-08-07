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
