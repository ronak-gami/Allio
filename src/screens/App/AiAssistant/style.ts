// import { useTheme } from '@react-navigation/native';
// import { width } from '@utils/helper';
// import { StyleSheet } from 'react-native';
// import { scale } from 'react-native-size-matters';

// const useStyle = () => {
//   const { colors } = useTheme();

//   return StyleSheet.create({
//     container: {
//       flex: 1,
//       paddingHorizontal: width * 0.02,
//     },
//     chatContainer: {
//       flex: 1,
//       paddingBottom: scale(10),
//     },
// messageContainer: {
//   marginVertical: scale(5),
//   paddingHorizontal: scale(8),
// },
//     userMessageContainer: {
//       alignSelf: 'flex-end',
//       maxWidth: '85%',
//     },
//     aiMessageContainer: {
//       alignSelf: 'flex-start',
//       maxWidth: '85%',
//     },
// messageBubble: {
//   paddingVertical: scale(10),
//   paddingHorizontal: scale(12),
//   borderRadius: scale(10),
//   borderWidth: 1,
//   flexDirection: 'row',
//   alignItems: 'flex-end',
//   justifyContent: 'space-between',
// },
// userBubble: {
//   backgroundColor: colors.primary,
//   borderBottomRightRadius: scale(4),
// },
// aiBubble: {
//   borderColor: colors.text,
//   borderBottomLeftRadius: scale(4),
// },
// mainContentContainer: {
//   flex: 1,
// },
// messageText: {
//   fontSize: scale(14),
//   lineHeight: scale(22),
//   color: colors.text,
// },
// copyButton: {
//   marginLeft: scale(8),
//   padding: scale(4),
// },
// copyIcon: {
//   width: scale(16),
//   height: scale(16),
//   resizeMode: 'contain',
//   tintColor: colors.text,
//   opacity: 0.5,
// },
//     inputContainer: {
//       flexDirection: 'row',
//       alignItems: 'flex-end',
//       paddingVertical: scale(10),
//       paddingHorizontal: scale(5),
//       backgroundColor: colors.background,
//     },
//     inputField: {
//       flex: 1,
//       marginRight: scale(8),
//     },
//     sendButton: {
//       width: scale(44),
//       height: scale(44),
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: colors.primary,
//       borderRadius: scale(22),
//     },
//     disabledButton: {
//       backgroundColor: colors.primary + '60',
//     },
//     sendIcon: {
//       resizeMode: 'contain',
//       width: scale(20),
//       height: scale(20),
//       tintColor: colors.text,
//     },
//     loaderContainer: {
//       alignSelf: 'flex-start',
//       maxWidth: '85%',
//       marginVertical: scale(4),
//       paddingHorizontal: scale(8),
//     },
//     loaderBubble: {
//       paddingHorizontal: scale(16),
//       paddingVertical: scale(16),
//       borderRadius: scale(20),
//       borderBottomLeftRadius: scale(8),
//       backgroundColor: colors.background,
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'flex-start',
//     },
//     typingIndicator: {
//       fontSize: scale(14),
//       color: colors.text,
//       opacity: 0.7,
//       marginLeft: scale(8),
//     },
//     bubbleContainer: {
//       flexDirection: 'row',
//     },
//     bubble: {
//       width: scale(8),
//       height: scale(8),
//       borderRadius: scale(4),
//       backgroundColor: colors.primary,
//       marginRight: scale(4),
//     },
//     printButton: {
//       marginTop: scale(10),
//       paddingHorizontal: scale(12),
//       paddingVertical: scale(6),
//       borderRadius: scale(16),
//       borderWidth: 1,
//       borderColor: colors.primary,
//       alignSelf: 'flex-start',
//     },
//     printButtonText: {
//       fontSize: scale(12),
//       color: colors.primary,
//       fontWeight: '600',
//     },
//     emptyContainer: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       opacity: 0.6,
//     },
//     emptyText: {
//       fontSize: scale(16),
//       color: colors.text,
//       textAlign: 'center',
//     },
//   });
// };

// export default useStyle;

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
      padding: scale(12),
      borderRadius: scale(12),
      borderWidth: 1,
      justifyContent: 'space-between',
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: scale(0),
      borderTopLeftRadius: scale(0),
    },
    aiBubble: {
      borderColor: colors.text,
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
      borderRadius: scale(16),
      borderWidth: 1,
      borderColor: colors.primary,
      alignSelf: 'flex-start',
    },
    printButtonText: {
      fontSize: scale(12),
      color: colors.primary,
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
      tintColor: colors.gray,
    },
    copyText: {
      fontSize: scale(14),
      color: colors.gray,
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
