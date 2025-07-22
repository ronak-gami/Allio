import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../../utils/color';

export const useStyle = () =>
  StyleSheet.create({
    label: {
      fontSize: scale(14),
      marginBottom: scale(6),
      color: COLORS.darkGray,
    },
    dropdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.gray,
      borderRadius: scale(6),
      paddingVertical: scale(10),
      paddingHorizontal: scale(12),
      backgroundColor: COLORS.white,
    },
    dropdownText: {
      fontSize: scale(14),
      color: COLORS.black,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: COLORS.modelbg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: COLORS.white,
      borderRadius: scale(8),
      width: '80%',
      maxHeight: '50%',
      padding: scale(10),
    },
    item: {
      paddingVertical: scale(12),
    },
    itemText: {
      fontSize: scale(14),
      color: COLORS.darkGray,
    },
    errorText: {
      color: COLORS.error,
      fontSize: 12,
      marginTop: scale(4),
    },
    icon: {
      width: scale(13),
      height: scale(13),
      marginLeft: 10,
    },
  });
