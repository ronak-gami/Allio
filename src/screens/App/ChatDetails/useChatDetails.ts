// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '@redux/store';
// import { showSuccess, showError } from '@utils/toast';
// import { useUserCard } from '@components/cards/UserCard/useUserCard';
// import firestore from '@react-native-firebase/firestore';

// export const useChatDetails = (targetEmail: string) => {
//   const myEmail = useSelector(
//     (state: RootState) => state.auth?.userData?.email,
//   );
//   const { relationStatus, sendRequest, acceptRequest, rejectRequest } =
//     useUserCard(myEmail, targetEmail);

//   const [message, setMessage] = useState('');
//   const [chatHistory, setChatHistory] = useState<
//     { text: string; fromMe: boolean }[]
//   >([]);

//   console.log('the targetEmail', targetEmail);

//   const sendMessage = async email2 => {
//     if (!message.trim()) {
//       showError('Message cannot be empty');
//       return;
//     }

//     try {
//       const timestamp = firestore.FieldValue.serverTimestamp();
//       const sortedEmails = [myEmail, targetEmail].sort(); // ensures consistent order
//       const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`; // unique ID

//       const relationRef = firestore().collection('relation').doc(relationId);
//       const docSnapshot = await relationRef.get();

//       if (!docSnapshot.exists) {
//         await relationRef.set({
//           from: myEmail,
//           to: targetEmail,
//           isAccept: false,
//           timestamp,
//         });
//       }

//       await relationRef.collection('messages').add({
//         text: message.trim(),
//         from: myEmail,
//         to: targetEmail,
//         timestamp: timestamp,
//       });

//       setChatHistory(prev => [...prev, { text: message.trim(), fromMe: true }]);
//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       showError('Failed to send message');
//     }
//   };

//   return {
//     relationStatus,
//     sendRequest: async () => {
//       try {
//         await sendRequest();
//         showSuccess('Friend request sent');
//       } catch {
//         showError('Send request failed');
//       }
//     },
//     acceptRequest: async () => {
//       try {
//         await acceptRequest();
//         showSuccess('Request accepted');
//       } catch {
//         showError('Accept failed');
//       }
//     },
//     rejectRequest: async () => {
//       try {
//         await rejectRequest();
//         showSuccess('Request rejected');
//       } catch {
//         showError('Reject failed');
//       }
//     },
//     message,
//     setMessage,
//     sendMessage,
//     chatHistory,
//   };
// };

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { showSuccess, showError } from '@utils/toast';
import { useUserCard } from '@components/cards/UserCard/useUserCard';
import firestore from '@react-native-firebase/firestore';
import api from '@api/index';

export const useChatDetails = (targetEmail: string) => {
  const myEmail = useSelector(
    (state: RootState) => state.auth?.userData?.email,
  );
  const { relationStatus, sendRequest, acceptRequest, rejectRequest } =
    useUserCard(myEmail, targetEmail);

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { text: string; fromMe: boolean }[]
  >([]);

  useEffect(() => {
    if (!myEmail || !targetEmail) return;

    const sortedEmails = [myEmail, targetEmail].sort();
    const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`;
    const messagesRef = firestore()
      .collection('relation')
      .doc(relationId)
      .collection('messages')
      .orderBy('timestamp', 'asc');

    const unsubscribe = messagesRef.onSnapshot(snapshot => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          text: data.text,
          fromMe: data.from === myEmail,
        };
      });

      setChatHistory(messages);
    });

    return () => unsubscribe();
  }, [myEmail, targetEmail]);

  // const sendMessage = async () => {
  //   if (!message.trim()) {
  //     showError('Message cannot be empty');
  //     return;
  //   }

  //   try {
  //     const timestamp = firestore.FieldValue.serverTimestamp();
  //     const sortedEmails = [myEmail, targetEmail].sort();
  //     const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`;

  //     const relationRef = firestore().collection('relation').doc(relationId);
  //     const docSnapshot = await relationRef.get();

  //     if (!docSnapshot.exists) {
  //       await relationRef.set({
  //         from: myEmail,
  //         to: targetEmail,
  //         isAccept: false,
  //         timestamp,
  //       });
  //     }

  //     await relationRef.collection('messages').add({
  //       text: message.trim(),
  //       from: myEmail,
  //       to: targetEmail,
  //       timestamp: timestamp,
  //     });

  //     setMessage('');
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //     showError('Failed to send message');
  //   }
  // };

  const sendMessage = async () => {
    if (!message.trim()) {
      showError('Message cannot be empty');
      return;
    }

    try {
      const timestamp = firestore.FieldValue.serverTimestamp();
      const sortedEmails = [myEmail, targetEmail].sort();
      const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`;

      const relationRef = firestore().collection('relation').doc(relationId);
      const docSnapshot = await relationRef.get();

      if (!docSnapshot.exists) {
        await relationRef.set({
          from: myEmail,
          to: targetEmail,
          isAccept: false,
          timestamp,
        });
      }

      // 🔹 Add message to Firestore
      await relationRef.collection('messages').add({
        text: message.trim(),
        from: myEmail,
        to: targetEmail,
        timestamp: timestamp,
      });

      // 🔹 Clear message input
      setMessage('');

      // 🔹 Send notification using API

      const title = `${myEmail} has sent you a Message .`;

      const data = {
        email: targetEmail,
        title: title,
        body: message.trim(),
        // body: 'hi',
      };

      const response = await api?.NOTIFICATION.sendNotification({ data });
      console.log('the repon', response);

      if (response?.data?.success) {
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message');
    }
  };

  return {
    relationStatus,
    sendRequest: async () => {
      try {
        await sendRequest();
        showSuccess('Friend request sent');
      } catch {
        showError('Send request failed');
      }
    },
    acceptRequest: async () => {
      try {
        await acceptRequest();
        showSuccess('Request accepted');
      } catch {
        showError('Accept failed');
      }
    },
    rejectRequest: async () => {
      try {
        await rejectRequest();
        showSuccess('Request rejected');
      } catch {
        showError('Reject failed');
      }
    },
    message,
    setMessage,
    sendMessage,
    chatHistory,
    
  };
};
