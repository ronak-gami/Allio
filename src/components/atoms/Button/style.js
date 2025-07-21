import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
export const useStyle = () => {
    return StyleSheet.create({
        button: {
            borderRadius: scale(12),
            paddingVertical: scale(9),
            paddingHorizontal: scale(24),
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        text: {
            fontSize: scale(14),
            fontWeight: '600',
        },
        icon: {
            marginHorizontal: scale(8),
        },
    });
};
