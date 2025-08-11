import { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { showSuccess, showError } from '@utils/toast';
import { useUserCard } from '@components/cards/UserCard/useUserCard';
import firestore from '@react-native-firebase/firestore';
import api from '@api/index';

export const useChatDetails = (targetUser: any) => {
  const myEmail = useSelector(
    (state: RootState) => state.auth?.userData?.email,
  );
  const { relationStatus, sendRequest, acceptRequest, rejectRequest } =
    useUserCard(myEmail, targetUser?.email);

  const [imageModalVisible, setImageModalVisible] = useState<Boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [videoModalVisible, setVideoModalVisible] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<
    {
      [x: string]: any;
      text?: string;
      image?: string | null;
      fromMe: boolean;
    }[]
  >([]);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const isAutoScroll = useRef(true);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    }, 50);
  }, []);

  const handleScroll = (e: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const paddingToBottom = 20;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    isAutoScroll.current = isBottom;
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
  };

  const openVideoModal = (videoUri: string) => {
    setSelectedVideo(videoUri);
    setVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setVideoModalVisible(false);
  };

  useEffect(() => {
    if (!myEmail || !targetUser?.email) {
      return;
    }

    const sortedEmails = [myEmail, targetUser.email].sort();
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
          text: data?.text || '',
          image: data?.image || null,
          video: data?.video || null,
          fromMe: data?.from === myEmail,
        };
      });

      setChatHistory(messages);
    });

    return () => unsubscribe();
  }, [myEmail, targetUser?.email]);

  useEffect(() => {
    if (isAutoScroll.current) {
      scrollToBottom(true);
    }
  }, [chatHistory, scrollToBottom]);
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const messageToSend = message.trim(); // ✅ store before clearing
      const timestamp = firestore.FieldValue.serverTimestamp();
      const sortedEmails = [myEmail, targetUser.email].sort();
      const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`;

      const relationRef = firestore().collection('relation').doc(relationId);
      const docSnapshot = await relationRef.get();

      if (!docSnapshot.exists) {
        await relationRef.set({
          from: myEmail,
          to: targetUser?.email,
          isAccept: false,
          timestamp,
        });
      }

      await relationRef.collection('messages').add({
        text: messageToSend, // ✅ use stored value
        from: myEmail,
        to: targetUser?.email,
        timestamp,
      });
      const email1 = myEmail.trim().toLowerCase();
      const email2 = targetUser?.email.trim().toLowerCase();

      const title = 'Message Sent';
      const body = `${email1} has sent message to you.`;

      const data = {
        emails: [email2],
        title: title,
        body: body,
      };

      console.log('shyam patel', data, 'data---->>>>');
      const response = await api?.NOTIFICATION.sendNotification({ data });

      console.log(response, 'response---->>>>');

      if (response?.data?.success) {
        showSuccess(response?.data?.message || 'Notification sent!');
      }
      setMessage(''); // ✅ clear AFTER send
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
    sendMessage: handleSendMessage,
    chatHistory,

    scrollViewRef,
    handleScroll,

    imageModalVisible,
    selectedImage,
    openImageModal,
    closeImageModal,
    videoModalVisible,
    selectedVideo,
    openVideoModal,
    closeVideoModal,
  };
};
