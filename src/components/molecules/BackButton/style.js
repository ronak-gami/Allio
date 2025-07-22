import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

export const useStyle = () => {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            top: scale(18),
            left: scale(18),
            zIndex: 999,
        },
        icon: {
            width: scale(22),
            height: scale(22),
        },
    })
}