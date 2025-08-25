import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { width } from '@utils/helper';

const useStyle = ({ iconSize = scale(20), disabled = false } = {}) => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.background,
    },
    tab: {
      paddingVertical: scale(12),
      paddingHorizontal: scale(16),
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: width * 0.2,
      opacity: disabled ? 0.5 : 1,
    },
    activeTab: {
      borderBottomWidth: scale(1),
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: scale(14),
      color: colors.text,
      textAlign: 'center',
    },
    activeTabText: {
      color: colors.primary,
    },
    tabIcon: {
      width: iconSize,
      height: iconSize,
      tintColor: colors.text,
      marginBottom: scale(4),
    },
    activeTabIcon: {
      tintColor: colors.primary,
    },
    activeIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: scale(2),
      backgroundColor: colors.primary,
    },
  });
};

export default useStyle;
