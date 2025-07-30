import { height,width } from './../../../utils/helper';
import { COLORS } from '@utils/color';
import { StyleSheet } from 'react-native';
import { scale, Scale } from 'react-native-size-matters';


const useStyle = () => {

  return StyleSheet.create({
    container: {
        position: 'absolute',
        top: scale(10),
        left: scale(15),
        marginRight:scale(5),
        width: width*0.92,
        padding: scale(10),
        paddingTop: scale(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 9999, // Ensure it's on top of other content
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
    
        elevation: 5,
      },
      messageText: {
        color: 'white',
        fontSize: scale(15),
        flexShrink: 1, 
       
      },
      closeButton: {
        padding: 5,
      },
      closeIcon: {
        width: scale(15),
        height: scale(15),
        tintColor:COLORS.white , // Make the icon white
      },
  });
};

export default useStyle;
