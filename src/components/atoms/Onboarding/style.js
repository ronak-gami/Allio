import { StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/color';
import { width, height } from '../../../utils/helper';

export const useStyle = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.lightBlue,
            justifyContent: 'center',
            paddingHorizontal: 38,
        },
        image: {
            width: width * 0.8,
            height: height * 0.5,
            resizeMode: 'contain',
            alignItems: 'center',
            borderRadius: 90
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'start',
            marginTop: 10,
            color: COLORS.navyBlue,
        },
        description: {
            fontSize: 16,
            textAlign: 'start',
            width: '50%',
            marginTop: 10,
            color: COLORS.navyBlue,
        },
    });
};
