import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {COLORS} from '../../../utils/color';

export default StyleSheet.create({
    button: {
        marginHorizontal: scale(8),
        borderRadius: scale(20),
        padding: scale(6),
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      pressed: {
        backgroundColor: COLORS.hoverColor,
        opacity: 0.8,
      },
      icon: {
        width: scale(32),
        height: scale(32),
        resizeMode: 'contain',
      },
});