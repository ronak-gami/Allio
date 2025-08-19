import { useState, useEffect, useRef, useCallback } from 'react';
import { Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { showSuccess, showError } from '@utils/toast';
import { useUserCard } from '@components/cards/UserCard/useUserCard';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import api from '@api/index';
import { checkLocationPermission, uploadToCloudinary } from '@utils/helper';
import { HOME } from '@utils/constant';
import { HomeNavigationProp } from '@types/navigations';
import { registerLocationCallback } from '@utils/LocationCallbackManager';

export const useChatDetails = (targetUser: any) => {
  const myEmail = useSelector(
    (state: RootState) => state.auth?.userData?.email,
  );
  const { relationStatus, sendRequest, acceptRequest, rejectRequest } =
    useUserCard(myEmail, targetUser?.email);

  const navigation = useNavigation<HomeNavigationProp>();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isBlockedByMe, setIsBlockedByMe] = useState(false);
  const [isBlockedByThem, setIsBlockedByThem] = useState(false);
  const [clearTime, setClearTime] = useState<any>(null);
  const [themeModalVisible, setThemeModalVisible] = useState<boolean>(false);
  const [loding, setloding] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selecturl, setselecturl] = useState<string | null>(null);

  const [chatHistory, setChatHistory] = useState<
    {
      text?: string;
      image?: string | null;
      video?: string | null;
      location?: {
        latitude: number;
        longitude: number;
      } | null;
      fromMe: boolean;
      timestamp?: any;
    }[]
  >([]);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const isAutoScroll = useRef(true);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated });
    }, 50);
  }, []);

  const states = {
    message,
    setMessage,
    chatHistory,
    scrollViewRef,
    imageModalVisible,
    selectedImage,
    videoModalVisible,
    selectedVideo,
    isBlockedByMe,
    isBlockedByThem,
    themeModalVisible,
    selectedTheme,
    setselecturl,
    selecturl,
    loding,
  };

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
    if (!myEmail || !targetUser?.email) return;

    const sortedEmails = [myEmail, targetUser.email].sort();
    const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`;
    const relationRef = firestore().collection('relation').doc(relationId);

    const unsubRelation = relationRef.onSnapshot(doc => {
      const data = doc.data();
      if (data) {
        setIsBlockedByMe(data[`block_${myEmail}`] || false);
        setIsBlockedByThem(data[`block_${targetUser.email}`] || false);
        setClearTime(data[`clearTime_${myEmail}`] || null);
      }
    });

    const unsubMessages = relationRef
      .collection('messages')
      .orderBy('timestamp', 'desc') // Changed to desc for inverted list
      .onSnapshot(snapshot => {
        const messages = snapshot.docs
          .map(doc => ({
            text: doc.data()?.text || '',
            image: doc.data()?.image || null,
            video: doc.data()?.video || null,
            location: doc.data()?.location || null,
            fromMe: doc.data()?.from === myEmail,
            timestamp: doc.data()?.timestamp,
          }))
          .filter(msg => {
            if (!clearTime) return true;
            return msg.timestamp?.toDate?.() > clearTime.toDate?.();
          });

        setChatHistory(messages);
      });

    return () => {
      unsubRelation();
      unsubMessages();
    };
  }, [myEmail, targetUser?.email, clearTime]);

  useEffect(() => {
    if (isAutoScroll.current) {
      scrollToBottom(true);
    }
  }, [chatHistory, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const messageToSend = message.trim();
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
        text: messageToSend,
        from: myEmail,
        to: targetUser?.email,
        timestamp,
      });

      const email1 = myEmail.trim().toLowerCase();
      const email2 = targetUser?.email.trim().toLowerCase();
      const data = {
        emails: [email2],
        title: 'Message Sent',
        body: `${email1} has sent message to you.`,
      };

      const response = await api?.NOTIFICATION.sendNotification({ data });

      if (response?.data?.success) {
        showSuccess(response?.data?.message || 'Notification sent!');
      }
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  /** Block user */
  const blockUser = async () => {
    const sortedEmails = [myEmail, targetUser.email].sort();
    const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`;
    await firestore()
      .collection('relation')
      .doc(relationId)
      .set({ [`block_${myEmail}`]: true }, { merge: true });
    setIsBlockedByMe(true);
    showSuccess('User blocked');
  };

  /** Unblock user */
  const unblockUser = async () => {
    const sortedEmails = [myEmail, targetUser.email].sort();
    const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`;
    await firestore()
      .collection('relation')
      .doc(relationId)
      .set({ [`block_${myEmail}`]: false }, { merge: true });
    setIsBlockedByMe(false);
    showSuccess('User unblocked');
  };

  /** Clear chat */
  const clearChat = async () => {
    try {
      const sortedEmails = [myEmail, targetUser.email].sort();
      const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`;
      const now = new Date();

      await firestore()
        .collection('relation')
        .doc(relationId)
        .set(
          { [`clearTime_${myEmail}`]: firestore.FieldValue.serverTimestamp() },
          { merge: true },
        );

      setClearTime({ toDate: () => now });

      showSuccess('Chat cleared from your side');
    } catch (error) {
      console.error('Clear chat failed:', error);
      showError('Failed to clear chat');
    }
  };

  useEffect(() => {
    if (!myEmail || !targetUser?.email) return;

    const sortedEmails = [myEmail, targetUser.email].sort();
    const chatId = `${sortedEmails[0]}_${sortedEmails[1]}`;

    const unsub = firestore()
      .collection('themes')
      .doc(chatId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setSelectedTheme(doc.data()?.themeUrl || null);
        }
      });

    return () => unsub();
  }, [myEmail, targetUser?.email]);

  const selectTheme = async localImage => {
    setloding(true);
    try {
      const sortedEmails = [myEmail, targetUser.email].sort();
      const chatId = `${sortedEmails[0]}_${sortedEmails[1]}`;
      const themesRef = firestore().collection('themes').doc(chatId);

      const existingDoc = await themesRef.get();
      if (existingDoc.exists && existingDoc.data()?.themeUrl) {
        if (existingDoc.data().localKey === localImage) {
          // Already same theme
          setSelectedTheme(existingDoc.data().themeUrl);
          setThemeModalVisible(false);
          return;
        }
      }

      // Convert local require to URI
      const fileUri = Image.resolveAssetSource(localImage).uri;

      const uploadedUrl = await uploadToCloudinary({
        uri: fileUri,
        type: 'image/png',
        fileName: `${chatId}_${Date.now()}.png`,
      });

      await themesRef.set({
        themeUrl: uploadedUrl,
        localKey: localImage,
        updatedAt: new Date(),
      });

      setSelectedTheme(uploadedUrl);
      showSuccess('Theme applied successfully!');
    } catch (err) {
      console.error(err);
      showError('Failed to apply theme');
    } finally {
      setloding(false);
      setThemeModalVisible(false);
    }
  };

  /** Remove Theme */
  const removeTheme = async () => {
    try {
      const sortedEmails = [myEmail, targetUser.email].sort();
      const chatId = `${sortedEmails[0]}_${sortedEmails[1]}`;
      const themesRef = firestore().collection('themes').doc(chatId);

      await themesRef.delete();

      setSelectedTheme(null);
      setselecturl(null);
      showSuccess('Theme removed, default background applied');
    } catch (err) {
      console.error(err);
      showError('Failed to remove theme');
    } finally {
      setThemeModalVisible(false);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate(HOME.Profile, { email: targetUser?.email });
  };

  const sendLocationToFirestore = async (location: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      const sortedEmails = [myEmail, targetUser.email].sort();
      const relationId = `${sortedEmails[0]}_${sortedEmails[1]}`;
      const relationRef = firestore().collection('relation').doc(relationId);

      await relationRef.collection('messages').add({
        from: myEmail,
        to: targetUser?.email,
        fromMe: true,
        timestamp: firestore.FieldValue.serverTimestamp(),
        text: '',
        image: null,
        video: null,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
    } catch (error) {
      console.error('Error sending location:', error);
      showError('Failed to share location');
    }
  };

  const handleAttachLocation = async () => {
    console.log('🚀 Starting handleAttachLocation');
    try {
      // Validate user data
      if (!myEmail || !targetUser?.email) {
        console.error('❌ Missing email data:', {
          myEmail,
          targetUserEmail: targetUser?.email,
        });
        showError('Missing required data');
        return;
      }

      // Check location permission
      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        console.error('❌ Location permission denied');
        showError('Location permission is required');
        return;
      }

      const callbackId = registerLocationCallback(sendLocationToFirestore);
      console.log('📝 Generated callbackId:', callbackId);

      // Navigate immediately after registering callback
      navigation.navigate(HOME.LocationPicker, { callbackId });
      console.log('✅ Navigation successful');
    } catch (error) {
      console.error('❌ Error in handleAttachLocation:', error);
      showError('Failed to open location picker');
    }
  };

  const handleLocationPress = (location: {
    latitude: number;
    longitude: number;
  }) => {
    // Here you can decide what to do when user taps the location:
    // Options:
    // 1. Open in Maps app
    // 2. Show full screen map preview
    // 3. Show location details
    // 4. Navigate to custom location view

    console.log('Location pressed:', location);
    // We can implement the desired action once you decide
  };

  return {
    states: {
      ...states,
      handleLocationPress,
    },
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
    sendMessage: handleSendMessage,
    chatHistory,
    handleScroll,
    selectedImage,
    openImageModal,
    closeImageModal,
    selectedVideo,
    openVideoModal,
    closeVideoModal,
    blockUser,
    unblockUser,
    clearChat,
    setThemeModalVisible,
    selectedTheme,
    selectTheme,
    setselecturl,
    navigateToProfile,
    removeTheme,
    handleAttachLocation,
  };
};
