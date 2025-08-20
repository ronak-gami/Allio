import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: height * 0.02,
      paddingTop: height * 0.01,
      paddingBottom: height * 0.02,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: height * 0.025,
      paddingHorizontal: width * 0.04,
      borderBottomWidth: 1,
      borderColor: colors.gray,
      backgroundColor: colors.primary,
    },
    backIcon: {
      marginRight: width * 0.04,
      width: scale(18),
      height: scale(18),
      tintColor: colors.black,
    },
    headerImage: {
      width: width * 0.12,
      height: width * 0.12,
      borderRadius: width * 0.06,
      marginRight: width * 0.04,
    },
    headerPlaceholder: {
      width: width * 0.12,
      height: width * 0.12,
      borderRadius: 50,
      backgroundColor: colors.text,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: width * 0.04,
    },
    headerPlaceholderText: {
      fontSize: scale(18),
      color: colors.primary,
    },
    headerName: {
      fontSize: scale(16),
      fontWeight: 'bold',
    },
    headerEmail: {
      fontSize: scale(12),
      color: colors.grayText,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.06,
      borderRadius: height * 0.03,
    },
    messageBubble: {
      padding: height * 0.015,
      borderRadius: height * 0.02,
      marginVertical: height * 0.005,
      maxWidth: '80%',
    },
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: colors.primary,
    },
    theirMessage: {
      alignSelf: 'flex-start',
      backgroundColor: colors.lightBlue,
    },
    messageText: {
      color: colors.white,
      fontSize: scale(14),
    },
    messagesContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingVertical: height * 0.01,
    },
    messagesWrapper: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      minHeight: '100%',
    },
    emptyMessageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: width * 0.02,
      paddingVertical: height * 0.015,
      borderTopWidth: 1,
      borderColor: colors.gray,
      backgroundColor: colors.background,
    },
    sendIcon: {
      width: height * 0.025,
      height: height * 0.025,
      resizeMode: 'contain',
    },
    sendButton: {
      marginLeft: width * 0.02,
      backgroundColor: colors.primary,
      paddingHorizontal: width * 0.04,
      paddingVertical: width * 0.045,
      borderRadius: height * 0.015,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    textInput: {
      paddingHorizontal: width * 0.02,
      fontSize: scale(14),
      color: colors.text,
      width: '80%',
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: height * 0.02,
      alignItems: 'center',
      justifyContent: 'center',
      padding: height * 0.025,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      height: height * 0.4,
      width: width * 0.8,
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: colors.lightyellow,
    },
    cardImageCentered: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: width * 0.1,
      marginBottom: height * 0.02,
      alignSelf: 'center',
    },
    cardPlaceholderCentered: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: width * 0.1,
      backgroundColor: colors.text,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: height * 0.02,
      alignSelf: 'center',
    },
    cardPlaceholderText: {
      fontSize: scale(22),
      color: colors.background,
    },
    cardTitle: {
      fontSize: scale(26),
      marginBottom: height * 0.005,
      color: colors.text,
    },
    cardDescriptionCentered: {
      fontSize: scale(13),
      color: colors.text,
      textAlign: 'center',
      marginTop: height * 0.005,
    },
    actionRowCentered: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: height * 0.02,
      gap: width * 0.04,
      flexWrap: 'wrap',
    },
    renderFriendStatusCard: {
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    },
    chatImage: {
      width: height * 0.2,
      height: height * 0.2,
      borderRadius: 10,
    },
    modalImage: {
      width: '100%',
      height: height * 0.4,
    },
    chatVideo: {
      width: height * 0.2,
      height: height * 0.2,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    modalVideo: {
      width: '100%',
      height: height * 0.3,
      backgroundColor: colors.background,
      borderRadius: 8,
    },
    playIconOverlay: {
      position: 'absolute',
      top: '10%',
      left: '10%',
      transform: [{ translateX: -20 }, { translateY: -20 }],
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.heromain,
      width: height * 0.2,
      height: height * 0.2,
    },
    playBtn: {
      width: height * 0.025,
      height: height * 0.025,
      tintColor: colors.primary,
    },
    menuIcon: {
      width: height * 0.025,
      height: height * 0.025,
    },
    menuContainer: {
      position: 'absolute',
      top: scale(55),
      right: scale(20),
      backgroundColor: colors.text,
      borderRadius: scale(10),
    },
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: 10,
    },
    themeOption: {
      width: '48%',
      aspectRatio: 2 / 3,
      marginBottom: height * 0.02,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: colors.background,
    },
    themeImage: {
      width: '100%',
      height: '100%',
    },
    padding: {
      padding: scale(10),
    },
    flex: {
      flex: 1,
    },
    flexGrow: {
      flexGrow: 1,
    },
    menuText: {
      textAlign: 'center',
      color: colors.primary,
    },
    locationPreviewContainer: {
      width: scale(200),
      height: scale(150),
      borderRadius: scale(8),
      overflow: 'hidden',
      marginVertical: scale(4),
    },
    locationPreview: {
      width: '100%',
      height: '100%',
    },
  });
};

export default useStyle;
