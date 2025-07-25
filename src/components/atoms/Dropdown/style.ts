import { useTheme } from '@react-navigation/native';
import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    label: {
      fontSize: scale(14),
      marginBottom: scale(6),
      color: colors.darkGray,
    },
    dropdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.gray,
      borderRadius: scale(6),
      paddingVertical: scale(10),
      paddingHorizontal: scale(12),
      backgroundColor: colors.white,
    },
    dropdownText: {
      fontSize: scale(14),
      color: colors.black,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.modelbg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: colors.white,
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
      color: colors.darkGray,
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      marginTop: scale(4),
    },
    icon: {
      width: scale(13),
      height: scale(13),
      marginLeft: 10,
    },
  });
};

export default useStyle;
