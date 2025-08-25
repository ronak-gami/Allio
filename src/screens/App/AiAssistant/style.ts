import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    gradientContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: width * 0.02,
    },
    chatContainer: {
      flex: 1,
      paddingBottom: scale(10),
    },
    messageContainer: {
      marginVertical: scale(4),
      paddingHorizontal: scale(8),
    },
    userMessageContainer: {
      alignSelf: 'flex-end',
      maxWidth: '85%',
    },
    aiMessageContainer: {
      alignSelf: 'flex-start',
      maxWidth: '85%',
    },
    messageBubble: {
      padding: scale(12),
      borderRadius: scale(12),
      borderWidth: 1,
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
    },
    userBubble: {
      backgroundColor: 'rgba(251, 192, 45, 0.8)',
      borderColor: 'rgba(251, 192, 45, 0.3)',
      borderBottomRightRadius: scale(0),
      borderTopLeftRadius: scale(0),
    },
    aiBubble: {
      backgroundColor: 'rgba(75, 85, 99, 0.4)',
      borderColor: 'rgba(156, 163, 175, 0.3)',
      borderBottomLeftRadius: scale(0),
      borderTopRightRadius: scale(0),
    },
    mainContentContainer: {
      // flex: 1,
    },
    messageText: {
      fontSize: scale(14),
      lineHeight: scale(22),
      color: colors.text,
    },
    userText: {
      color: colors.text,
    },
    aiText: {
      color: colors.text,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: scale(12),
    },
    inputField: {
      flex: 1,
      marginRight: scale(5),
      backgroundColor: 'transparent',
    },
    sendButton: {
      width: scale(44),
      height: scale(44),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(251, 192, 45, 0.9)',
      borderRadius: scale(22),
    },
    disabledButton: {
      backgroundColor: 'rgba(251, 192, 45, 0.3)',
    },
    sendIcon: {
      resizeMode: 'contain',
      width: scale(20),
      height: scale(20),
      tintColor: colors.text,
    },
    loaderContainer: {
      alignSelf: 'flex-start',
      maxWidth: '85%',
      marginVertical: scale(4),
      paddingHorizontal: scale(8),
    },
    loaderBubble: {
      paddingHorizontal: scale(16),
      paddingVertical: scale(16),
      borderBottomLeftRadius: scale(0),
      borderTopRightRadius: scale(0),
      backgroundColor: 'rgba(75, 85, 99, 0.4)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderWidth: 1,
      borderColor: 'rgba(156, 163, 175, 0.3)',
    },
    typingIndicator: {
      fontSize: scale(14),
      color: colors.text,
      opacity: 0.8,
      marginLeft: scale(8),
    },
    bubbleContainer: {
      flexDirection: 'row',
    },
    bubble: {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
      backgroundColor: 'rgba(251, 192, 45, 0.8)',
      marginRight: scale(6),
    },
    printButton: {
      marginTop: scale(10),
      paddingHorizontal: scale(12),
      paddingVertical: scale(6),
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: 'rgba(251, 192, 45, 0.6)',
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(251, 192, 45, 0.1)',
    },
    printButtonText: {
      fontSize: scale(12),
      color: 'rgba(251, 192, 45, 0.9)',
    },
    copyButton: {
      paddingVertical: scale(5),
      flexDirection: 'row',
      alignItems: 'center',
      gap: scale(5),
    },
    copyIcon: {
      width: scale(16),
      height: scale(16),
      resizeMode: 'contain',
      tintColor: 'rgba(156, 163, 175, 0.8)',
    },
    copyText: {
      fontSize: scale(12),
      color: 'rgba(156, 163, 175, 0.8)',
    },
    // Enhanced Empty State Styles
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: scale(20),
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scale(30),
      position: 'relative',
    },
    logoGlow: {
      position: 'absolute',
      width: scale(120),
      height: scale(120),
      borderRadius: scale(60),
      backgroundColor: 'rgba(251, 192, 45, 0.45)',
      shadowColor: '#FBC02D',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      elevation: 8,
    },
    logoIcon: {
      width: scale(80),
      height: scale(80),
      resizeMode: 'contain',
      tintColor: colors.skyBlue,
    },
    emptyTitle: {
      fontSize: scale(28),
      color: colors.text,
      textAlign: 'center',
      marginBottom: scale(8),
      letterSpacing: 0.5,
    },
    emptySubtitle: {
      fontSize: scale(16),
      color: colors.text,
      textAlign: 'center',
      lineHeight: scale(24),
      letterSpacing: 0.2,
    },
  });
};

export default useStyle;
