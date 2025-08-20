// import React, { useState } from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Modal,
//   ImageBackground,
//   VirtualizedList,
// } from 'react-native';
// import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
// import { HomeStackParamList } from '@types/navigations';
// import { ICONS, IMAGES } from '@assets/index';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTheme } from '@react-navigation/native';
// import Video from 'react-native-video';
// import { Button, Container, CustomModal, Input, Text } from '@components/index';
// import useStyle from './style';
// import { useChatDetails } from './useChatDetails';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// type ChatDetailsRouteProp = RouteProp<HomeStackParamList, 'ChatDetailsScreen'>;

// const getItemCount = (data: any[]) => data.length;
// const getItem = (data: any[], index: number) => data[index];

// const ChatDetailsScreen = () => {
//   const styles = useStyle();
//   const { colors } = useTheme();
//   const navigation = useNavigation();
//   const route = useRoute<ChatDetailsRouteProp>();
//   const { user } = route.params || {};
//   const [menuVisible, setMenuVisible] = useState<boolean>(false);

//   const {
//     states,
//     relationStatus,
//     sendRequest,
//     acceptRequest,
//     rejectRequest,
//     sendMessage,
//     handleScroll,
//     openImageModal,
//     closeImageModal,
//     openVideoModal,
//     closeVideoModal,
//     blockUser,
//     clearChat,
//     unblockUser,
//     setThemeModalVisible,
//     selectTheme,
//     removeTheme,
//     navigateToProfile,
//     handleAttachLocation,
//   } = useChatDetails(user);

//   const showImage = user?.profile && user?.profile !== '';
//   const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || '?';

//   if (!user) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>User data not found.</Text>
//       </SafeAreaView>
//     );
//   }

//   const renderFriendStatusCard = () => {
//     if (relationStatus === 'accepted') {
//       return null;
//     }
//     return (
//       <View style={styles.card}>
//         {showImage ? (
//           <Image
//             source={{ uri: user?.profile }}
//             style={styles.cardImageCentered}
//           />
//         ) : (
//           <View style={styles.cardPlaceholderCentered}>
//             <Text style={styles.cardPlaceholderText}>{firstLetter}</Text>
//           </View>
//         )}
//         <Text style={styles.cardTitle}>Let’s Connect</Text>
//         <Text style={styles.cardDescriptionCentered}>
//           {relationStatus === 'none'
//             ? 'Send a friend request to start chatting.'
//             : relationStatus === 'sent'
//             ? 'Waiting for approval...'
//             : 'This user sent you a request. Accept to start chatting.'}
//         </Text>

//         <View style={styles.actionRowCentered}>
//           {relationStatus === 'notsent' && (
//             <Button
//               title="Send Friend Request"
//               onPress={sendRequest}
//               style={styles.button}
//             />
//           )}
//           {relationStatus === 'received' && (
//             <>
//               <Button title="Accept" onPress={acceptRequest} />
//               <Button
//                 title="Reject"
//                 onPress={rejectRequest}
//                 outlineColor={colors.error}
//               />
//             </>
//           )}
//         </View>
//       </View>
//     );
//   };

//   const openMenu = () => {
//     setMenuVisible(true);
//   };

//   const renderMessage = ({
//     item: chat,
//     index,
//   }: {
//     item: any;
//     index: number;
//   }) => {
//     return (
//       <View
//         key={index}
//         style={[
//           styles.messageBubble,
//           chat.fromMe ? styles.myMessage : styles.theirMessage,
//         ]}>
//         {chat?.text && <Text style={styles.messageText}>{chat.text}</Text>}
//         {chat?.image && (
//           <TouchableOpacity onPress={() => openImageModal(chat.image)}>
//             <Image
//               source={{ uri: chat.image }}
//               style={[styles.chatImage, { marginTop: chat.text ? 5 : 0 }]}
//               resizeMode="cover"
//             />
//           </TouchableOpacity>
//         )}
//         {chat?.video && (
//           <TouchableOpacity onPress={() => openVideoModal(chat.video)}>
//             <Video
//               source={{ uri: chat.video }}
//               style={styles.chatVideo}
//               resizeMode="cover"
//               paused
//               pointerEvents="none"
//             />
//             <View style={styles.playIconOverlay}>
//               <Image source={ICONS.VideoPlay} style={styles.playBtn} />
//             </View>
//           </TouchableOpacity>
//         )}
//         {chat?.location && (
//           <TouchableOpacity
//             onPress={() => states.handleLocationPress(chat.location)}
//             style={styles.locationPreviewContainer}>
//             <MapView
//               provider={PROVIDER_GOOGLE}
//               style={styles.locationPreview}
//               scrollEnabled={false}
//               zoomEnabled={false}
//               pitchEnabled={false}
//               rotateEnabled={false}
//               initialRegion={{
//                 latitude: chat.location.latitude,
//                 longitude: chat.location.longitude,
//                 latitudeDelta: 0.01,
//                 longitudeDelta: 0.01,
//               }}>
//               <Marker
//                 coordinate={{
//                   latitude: chat.location.latitude,
//                   longitude: chat.location.longitude,
//                 }}
//               />
//             </MapView>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   return (
//     <Container title="Chat Details" showHeader={false}>
//       <SafeAreaView style={styles.container}>
//         <KeyboardAvoidingView
//           style={styles.container}
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
//           <View style={styles.header}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Image source={ICONS.BackArrow} style={styles.backIcon} />
//             </TouchableOpacity>

//             {showImage ? (
//               <Image
//                 source={{ uri: user?.profile }}
//                 style={styles.headerImage}
//               />
//             ) : (
//               <View style={styles.headerPlaceholder}>
//                 <Text style={styles.headerPlaceholderText}>{firstLetter}</Text>
//               </View>
//             )}

//             <TouchableOpacity
//               style={styles.flex}
//               activeOpacity={0.7}
//               onPress={() => {
//                 if (!states?.isBlockedByThem) {
//                   navigateToProfile();
//                 }
//               }}>
//               <Text style={styles.headerName}>{user?.firstName}</Text>
//               <Text style={styles.headerEmail}>{user?.email}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={openMenu}>
//               <Image source={ICONS.menu} style={styles.menuIcon} />
//             </TouchableOpacity>
//           </View>

//           <ImageBackground
//             source={
//               states?.selectedTheme ? { uri: states?.selectedTheme } : null
//             }
//             style={styles.flex}
//             resizeMode="cover">
//             {/* Chat Content */}
//             <ScrollView
//               ref={states?.scrollViewRef}
//               contentContainerStyle={[
//                 styles.scrollContainer,
//                 states?.selectedTheme ? { backgroundColor: 'transparent' } : {},
//               ]}
//               style={{
//                 flex: 1,
//                 backgroundColor: states?.selectedTheme
//                   ? undefined
//                   : colors.background,
//               }}
//               keyboardShouldPersistTaps="handled"
//               showsVerticalScrollIndicator={false}
//               onScroll={handleScroll}
//               scrollEventThrottle={16}>
//               {relationStatus && (
//                 <View style={styles.renderFriendStatusCard}>
//                   {renderFriendStatusCard()}
//                 </View>
//               )}

//               {relationStatus === 'accepted' && (
//                 <>
//                   {states?.isBlockedByMe ? (
//                     <View style={styles.flexGrow}>
//                       <View style={styles.card}>
//                         {showImage ? (
//                           <Image
//                             source={{ uri: user?.profile }}
//                             style={styles.cardImageCentered}
//                           />
//                         ) : (
//                           <View style={styles.cardPlaceholderCentered}>
//                             <Text style={styles.cardPlaceholderText}>
//                               {firstLetter}
//                             </Text>
//                           </View>
//                         )}
//                         <Text style={styles.cardTitle}>Block</Text>
//                         <Text style={styles.cardDescriptionCentered}>
//                           You blocked this user.
//                         </Text>
//                         <Button
//                           style={styles.padding}
//                           title="Unblock User"
//                           onPress={unblockUser}
//                         />
//                       </View>
//                     </View>
//                   ) : states?.chatHistory?.length === 0 ? (
//                     <View style={styles.flexGrow}>
//                       <View style={styles.card}>
//                         {showImage ? (
//                           <Image
//                             source={{ uri: user?.profile }}
//                             style={styles.cardImageCentered}
//                           />
//                         ) : (
//                           <View style={styles.cardPlaceholderCentered}>
//                             <Text style={styles.cardPlaceholderText}>
//                               {firstLetter}
//                             </Text>
//                           </View>
//                         )}
//                         <Text style={styles.cardTitle}>Let's Message</Text>
//                         <Text style={styles.cardDescriptionCentered}>
//                           No messages yet.
//                         </Text>
//                       </View>
//                     </View>
//                   ) : (
//                     <VirtualizedList
//                       ref={states?.scrollViewRef}
//                       data={states?.chatHistory}
//                       initialNumToRender={15}
//                       renderItem={renderMessage}
//                       keyExtractor={(_, index) => index.toString()}
//                       getItemCount={getItemCount}
//                       getItem={getItem}
//                       maxToRenderPerBatch={10}
//                       windowSize={10}
//                       onScroll={handleScroll}
//                       scrollEventThrottle={16}
//                       contentContainerStyle={[
//                         styles.scrollContainer,
//                         states?.selectedTheme
//                           ? { backgroundColor: 'transparent' }
//                           : {},
//                       ]}
//                       style={{
//                         flex: 1,
//                         backgroundColor: states?.selectedTheme
//                           ? undefined
//                           : colors.background,
//                       }}
//                       inverted
//                       maintainVisibleContentPosition={{
//                         minIndexForVisible: 0,
//                         autoscrollToTopThreshold: 10,
//                       }}
//                     />
//                   )}
//                 </>
//               )}
//             </ScrollView>
//           </ImageBackground>

//           {relationStatus === 'accepted' && (
//             <View style={styles.inputContainer}>
//               <Input
//                 placeholder="Type your message..."
//                 value={states?.message}
//                 onChangeText={states?.setMessage}
//                 style={styles.textInput}
//               />
//               <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
//                 <Image source={ICONS.Send} style={styles.sendIcon} />
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Image Modal */}
//           <CustomModal
//             visible={states?.imageModalVisible}
//             title="Image"
//             onClose={closeImageModal}>
//             {states?.selectedImage && (
//               <Image
//                 source={{ uri: states?.selectedImage }}
//                 style={styles.modalImage}
//                 resizeMode="contain"
//               />
//             )}
//           </CustomModal>

//           {/* Video Modal */}
//           <CustomModal
//             visible={states?.videoModalVisible}
//             title="Video"
//             onClose={closeVideoModal}>
//             {states?.selectedVideo && (
//               <Video
//                 source={{ uri: states?.selectedVideo }}
//                 style={styles.modalVideo}
//                 controls
//                 resizeMode="contain"
//                 paused={false}
//               />
//             )}
//           </CustomModal>

//           <Modal
//             visible={menuVisible}
//             transparent
//             animationType="fade"
//             onRequestClose={() => setMenuVisible(false)}>
//             <TouchableOpacity
//               style={styles.flex}
//               activeOpacity={1}
//               onPress={() => setMenuVisible(false)}>
//               <View style={styles.menuContainer}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setMenuVisible(false);
//                     states?.isBlockedByMe ? unblockUser() : blockUser();
//                   }}
//                   style={styles.padding}>
//                   <Text type="semibold" style={styles.menuText}>
//                     {states?.isBlockedByMe ? 'Unblock User' : 'Block User'}
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setMenuVisible(false);
//                     clearChat();
//                   }}
//                   style={styles.padding}>
//                   <Text type="semibold" style={styles.menuText}>
//                     Clear Chat
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setMenuVisible(false);
//                     setThemeModalVisible(true);
//                   }}
//                   style={styles.padding}>
//                   <Text type="semibold" style={styles.menuText}>
//                     Theme
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={handleAttachLocation}
//                   style={styles.padding}>
//                   <Text type="semibold" style={styles.menuText}>
//                     Share Location
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableOpacity>
//           </Modal>

//           <CustomModal
//             visible={states?.themeModalVisible}
//             title="Select Chat Theme"
//             onClose={() => setThemeModalVisible(false)}>
//             <View style={styles.themeGrid}>
//               {['Chattheme1', 'Chattheme2', 'Chattheme3', 'Chattheme4'].map(
//                 key => {
//                   const themeUri = IMAGES[key];
//                   const isSelected =
//                     states?.selectedTheme === themeUri ||
//                     states?.selecturl === themeUri;

//                   return (
//                     <TouchableOpacity
//                       key={key}
//                       onPress={() => states?.setselecturl(themeUri)}
//                       style={[
//                         styles.themeOption,
//                         isSelected && {
//                           borderWidth: 5,
//                           borderColor: colors.primary,
//                         },
//                       ]}>
//                       <Image
//                         source={themeUri}
//                         style={styles.themeImage}
//                         resizeMode="cover"
//                       />
//                     </TouchableOpacity>
//                   );
//                 },
//               )}
//             </View>

//             <Button
//               title="Apply"
//               loading={states?.loding}
//               onPress={() => {
//                 selectTheme(states?.selecturl);
//               }}
//             />

//             {/* Remove Theme Button */}
//             {states?.selectedTheme && (
//               <Button
//                 title="Remove Theme"
//                 outlineColor={colors.primary}
//                 onPress={() => {
//                   removeTheme();
//                 }}
//               />
//             )}
//           </CustomModal>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </Container>
//   );
// };

// export default ChatDetailsScreen;

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
