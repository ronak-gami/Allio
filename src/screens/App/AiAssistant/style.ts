import { useTheme } from '@react-navigation/native';
import { width, height } from '@utils/helper';
import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
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
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      borderRadius: scale(20),
      marginBottom: scale(2),
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: scale(8),
    },
    aiBubble: {
      backgroundColor: colors.background, // Changed to background for contrast
      borderBottomLeftRadius: scale(8),
    },
    messageText: {
      fontSize: scale(14),
      lineHeight: scale(20),
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
      paddingVertical: scale(10),
      paddingHorizontal: scale(5),
      backgroundColor: colors.background,
    },
    inputField: {
      flex: 1,
      marginRight: scale(8),
    },
    sendButton: {
      width: scale(44),
      height: scale(44),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: scale(22),
    },
    disabledButton: {
      backgroundColor: colors.primary + '60',
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
      borderRadius: scale(20),
      borderBottomLeftRadius: scale(8),
      backgroundColor: colors.background, // Changed to background for consistency
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    typingIndicator: {
      fontSize: scale(14),
      color: colors.text,
      opacity: 0.7,
      marginLeft: scale(8),
    },
    bubbleContainer: {
      flexDirection: 'row',
    },
    bubble: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
      backgroundColor: colors.primary,
      marginRight: scale(4),
    },
    printButton: {
      marginTop: scale(10),
      paddingHorizontal: scale(12),
      paddingVertical: scale(6),
      backgroundColor: 'transparent',
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: colors.primary,
      alignSelf: 'flex-start',
    },
    printButtonText: {
      fontSize: scale(12),
      color: colors.primary,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.6,
    },
    emptyText: {
      fontSize: scale(16),
      color: colors.text,
      textAlign: 'center',
    },
  });
};

export default useStyle;
