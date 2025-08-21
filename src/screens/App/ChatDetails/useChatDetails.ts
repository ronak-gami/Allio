import { useState, useEffect, useRef, useCallback } from 'react';
import { Image, ScrollView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { showSuccess, showError } from '@utils/toast';
import { useUserCard } from '@components/cards/UserCard/useUserCard';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import api from '@api/index';
import { uploadToCloudinary } from '@utils/helper';
import { HOME } from '@utils/constant';
import { HomeNavigationProp } from '@types/navigations';

import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import { Linking } from 'react-native';

type ChatMsg = {
  text?: string;
  image?: string | null;
  video?: string | null;
  fromMe: boolean;
  timestamp?: any;
  location?: { latitude: number; longitude: number } | null;
  liveShare?: { id: string; active: boolean } | null;
};

type LatLng = { latitude: number; longitude: number };

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

  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  // ===== Location UI & state
  const [locationFullVisible, setLocationFullVisible] =
    useState<boolean>(false);
  const [locationPromptVisible, setLocationPromptVisible] =
    useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<LatLng | null>(null);
  const [liveDurationMin, setLiveDurationMin] = useState<number>(15);

  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);

  const [liveShareIdMine, setLiveShareIdMine] = useState<string | null>(null);
  const [isLiveSharingMine, setIsLiveSharingMine] = useState<boolean>(false);
  const liveWatchId = useRef<number | null>(null);
  const liveEndTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(true);

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
    loadingMessages,

    menuVisible,

    locationFullVisible,
    locationPromptVisible,
    currentCoords,
    isLiveSharingMine,
    setLocationPromptVisible,
    unblockUserInline: () => unblockUser(),
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

  /** Firestore paths */
  const relationId = (() => {
    if (!myEmail || !targetUser?.email) return null;
    const sorted = [myEmail, targetUser.email].sort();
    return `${sorted[0]}_${sorted[1]}`;
  })();

  useEffect(() => {
    if (!myEmail || !targetUser?.email || !relationId) return;

    const relationRef = firestore().collection('relation').doc(relationId);
    // 🔹 Relation listener
    const unsubRelation = relationRef.onSnapshot(doc => {
      const data = doc.data();
      if (data) {
        setIsBlockedByMe(data[`block_${myEmail}`] || false);
        setIsBlockedByThem(data[`block_${targetUser.email}`] || false);
        setClearTime(data[`clearTime_${myEmail}`] || null);
      }
    });

    // 🔹 Messages listener
    const unsubMessages = relationRef
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const msgs: ChatMsg[] = snapshot.docs
          .map(doc => {
            const d = doc.data() || {};
            return {
              text: d.text || '',
              image: d.image || null,
              video: d.video || null,
              location: d.location || null,
              liveShare: d.liveShare || null,
              fromMe: d.from === myEmail,
              timestamp: d.timestamp,
            } as ChatMsg;
          })
          .filter(msg => {
            if (!clearTime) return true;
            return msg.timestamp?.toDate?.() > clearTime.toDate?.();
          });

        setChatHistory(msgs);
        setLoadingMessages(false);
      });

    return () => {
      unsubRelation();
      unsubMessages();
    };
  }, [myEmail, targetUser?.email, relationId, clearTime]);

  useEffect(() => {
    if (states?.chatHistory?.length > 0) {
      scrollToBottom(false);
    }
  }, [states?.chatHistory?.length, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!message.trim() || !relationId) return;
    try {
      const timestamp = firestore.FieldValue.serverTimestamp();
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
        text: message.trim(),
        from: myEmail,
        to: targetUser?.email,
        timestamp,
      });

      const email1 = (myEmail || '').trim().toLowerCase();
      const email2 = (targetUser?.email || '').trim().toLowerCase();
      const data = {
        emails: [email2],
        title: 'Message Sent',
        body: `${email1} has sent a message to you.`,
      };
      const response = await api?.NOTIFICATION.sendNotification({ data });
      if (response?.data?.success)
        showSuccess(response?.data?.message || 'Notification sent!');

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  /** Block / Unblock / Clear */
  const blockUser = async () => {
    if (!relationId) return;
    await firestore()
      .collection('relation')
      .doc(relationId)
      .set({ [`block_${myEmail}`]: true }, { merge: true });
    setIsBlockedByMe(true);
    showSuccess('User blocked');
  };

  const unblockUser = async () => {
    if (!relationId) return;
    await firestore()
      .collection('relation')
      .doc(relationId)
      .set({ [`block_${myEmail}`]: false }, { merge: true });
    setIsBlockedByMe(false);
    showSuccess('User unblocked');
  };

  const clearChat = async () => {
    try {
      if (!relationId) return;
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

  /** Theme */
  useEffect(() => {
    if (!myEmail || !targetUser?.email || !relationId) return;
    const unsub = firestore()
      .collection('themes')
      .doc(relationId)
      .onSnapshot(doc => {
        if (doc.exists) setSelectedTheme(doc.data()?.themeUrl || null);
      });
    return () => unsub();
  }, [myEmail, targetUser?.email, relationId]);

  const selectTheme = async (localImage: any) => {
    if (!relationId || !localImage) return;
    setloding(true);
    try {
      const themesRef = firestore().collection('themes').doc(relationId);
      const existingDoc = await themesRef.get();
      if (existingDoc.exists && existingDoc.data()?.themeUrl) {
        if (existingDoc.data().localKey === localImage) {
          setSelectedTheme(existingDoc.data().themeUrl);
          setThemeModalVisible(false);
          return;
        }
      }
      const fileUri = Image.resolveAssetSource(localImage).uri;
      const uploadedUrl = await uploadToCloudinary({
        uri: fileUri,
        type: 'image/png',
        fileName: `${relationId}_${Date.now()}.png`,
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

  const removeTheme = async () => {
    try {
      if (!relationId) return;
      const themesRef = firestore().collection('themes').doc(relationId);
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

  const navigateToProfile = () =>
    navigation.navigate(HOME.Profile, { email: targetUser?.email });

  const askLocationPermission = async (): Promise<boolean> => {
    try {
      const perm =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      let result = await check(perm);
      if (result === RESULTS.GRANTED) return true;

      result = await request(perm);
      if (result === RESULTS.GRANTED) return true;

      return false;
    } catch (e) {
      console.warn('Permission error', e);
      return false;
    }
  };
  const openMenu = () => setMenuVisible(true);

  const getCurrentPosition = (): Promise<GeolocationResponse> =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {},
      );
    });

  const warmUpCurrentLocation = async (): Promise<boolean> => {
    try {
      const pos = await getCurrentPosition();

      setCurrentCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      return true;
    } catch (err: any) {
      return false;
    }
  };

  const openSystemLocationSettings = () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS').catch(
        err => console.warn('Failed to open location settings:', err),
      );
    } else {
      Linking.openURL('app-settings:');
    }
  };
  const ensureLocationReady = async (silent = false): Promise<boolean> => {
    const granted = await askLocationPermission();

    if (!granted) {
      if (!silent) setLocationPromptVisible(true);
      else setLocationPromptVisible(true);
      return false;
    }
    const ok = await warmUpCurrentLocation();
    if (!ok) {
      setLocationPromptVisible(true);
      return false;
    }
    return true;
  };

  const retryLocationPreparation = async () => {
    setLocationPromptVisible(false);
    await ensureLocationReady(true);
  };

  const dismissLocationPrompt = () => setLocationPromptVisible(false);

  const openInGoogleMaps = (latitude: number, longitude: number) => {
    const url =
      Platform.select({
        ios: `http://maps.apple.com/?ll=${latitude},${longitude}`,
        android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
      }) || `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const openLocationFullModal = () => setLocationFullVisible(true);
  const closeLocationFullModal = () => setLocationFullVisible(false);

  const shareCurrentLocation = async () => {
    try {
      if (!relationId) return;
      let latlng = currentCoords;
      if (!latlng) {
        const ok = await ensureLocationReady(true);
        if (!ok) return;
        latlng = currentCoords;
      }
      if (!latlng) return;

      const timestamp = firestore.FieldValue.serverTimestamp();
      const relationRef = firestore().collection('relation').doc(relationId);
      await relationRef.collection('messages').add({
        from: myEmail,
        to: targetUser?.email,
        timestamp,
        location: { latitude: latlng.latitude, longitude: latlng.longitude },
      });

      showSuccess('Location shared');
    } catch (err) {
      console.error('shareCurrentLocation error', err);
      showError('Failed to share location');
    }
  };

  const startLiveLocationShare = async (minutes = 15) => {
    try {
      if (!relationId) return;
      const ok = await ensureLocationReady(true);
      if (!ok) return;

      const liveRef = firestore().collection('live_shares').doc();
      const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

      await liveRef.set({
        id: liveRef.id,
        relationId,
        owner: myEmail,
        to: targetUser?.email,
        active: true,
        expiresAt,
        last: null,
        updatedAt: new Date(),
      });

      // Send a chat message with liveShare reference
      const relationRef = firestore().collection('relation').doc(relationId);
      await relationRef.collection('messages').add({
        from: myEmail,
        to: targetUser?.email,
        timestamp: firestore.FieldValue.serverTimestamp(),
        liveShare: { id: liveRef.id, active: true },
      });

      setLiveShareIdMine(liveRef.id);
      setIsLiveSharingMine(true);

      // Start watching location

      liveWatchId.current = Geolocation.watchPosition(
        async pos => {
          try {
            const latitude = pos.coords.latitude;
            const longitude = pos.coords.longitude;
            await liveRef.set(
              {
                last: { latitude, longitude },
                updatedAt: new Date(),
              },
              { merge: true },
            );
          } catch (e) {
            console.warn('live update error', e);
          }
        },
        (error: GeoError) => console.warn('watchPosition error', error),
        // { enableHighAccuracy: true, distanceFilter: 10 },
      );

      if (liveEndTimer.current) clearTimeout(liveEndTimer.current);
      liveEndTimer.current = setTimeout(() => {
        stopLiveLocationShare();
      }, minutes * 60 * 1000);

      showSuccess(`Live location sharing for ${minutes} min`);
    } catch (err) {
      console.error('startLiveLocationShare error', err);
      showError('Failed to start live location');
    }
  };

  const stopLiveLocationShare = async () => {
    try {
      if (liveWatchId.current != null) {
        Geolocation.clearWatch(liveWatchId.current);
        liveWatchId.current = null;
      }
      if (liveEndTimer.current) {
        clearTimeout(liveEndTimer.current);
        liveEndTimer.current = null;
      }

      if (liveShareIdMine) {
        const liveRef = firestore()
          .collection('live_shares')
          .doc(liveShareIdMine);
        await liveRef.set(
          { active: false, updatedAt: new Date() },
          { merge: true },
        );

        if (relationId) {
          await firestore()
            .collection('relation')
            .doc(relationId)
            .collection('messages')
            .add({
              from: myEmail,
              to: targetUser?.email,
              timestamp: firestore.FieldValue.serverTimestamp(),
              text: 'Live location ended.',
            });
        }
      }
      setIsLiveSharingMine(false);
      setLiveShareIdMine(null);
      showSuccess('Live location stopped');
    } catch (err) {
      console.error('stopLiveLocationShare error', err);
    }
  };

  useEffect(() => {
    if (!relationId) return;

    const syncLiveLocations = async () => {
      const snap = await firestore()
        .collection('live_shares')
        .where('relationId', '==', relationId)
        .where('active', '==', true)
        .get();

      const activeShares = new Map<
        string,
        { latitude: number; longitude: number }
      >();

      snap.forEach(doc => {
        const d = doc.data() as any;
        // FIX: use longitude, not lng
        if (d?.last?.latitude && d?.last?.longitude) {
          activeShares.set(doc.id, {
            latitude: d.last.latitude,
            longitude: d.last.longitude,
          });
        }

        if (d?.owner === myEmail && d?.active) {
          setLiveShareIdMine(doc.id);
          setIsLiveSharingMine(true);
        }
      });

      setChatHistory(prev =>
        prev.map(m =>
          m.liveShare?.id && activeShares.has(m.liveShare.id)
            ? {
                ...m,
                location: activeShares.get(m.liveShare.id) || m.location,
                liveShare: { id: m.liveShare.id, active: true },
              }
            : m,
        ),
      );
    };

    syncLiveLocations();
  }, [relationId, myEmail]);

  useEffect(() => {
    return () => {
      if (liveWatchId.current != null)
        Geolocation.clearWatch(liveWatchId.current);
      if (liveEndTimer.current) clearTimeout(liveEndTimer.current);
    };
  }, []);

  return {
    states,
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

    setMenuVisible,

    openLocationFullModal,
    closeLocationFullModal,
    ensureLocationReady,
    shareCurrentLocation,
    startLiveLocationShare,
    stopLiveLocationShare,
    isLiveSharingMine,
    openInGoogleMaps,
    liveDurationMin,
    setLiveDurationMin,

    openMenu,

    openSystemLocationSettings,
    retryLocationPreparation,
    dismissLocationPrompt,
  };
};
