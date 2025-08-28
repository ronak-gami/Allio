import { useState, useEffect, useRef, useCallback } from 'react';
import { Image, ScrollView, Platform, AppState } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { showSuccess, showError } from '@utils/toast';
import { useUserCard } from '@components/cards/UserCard/useUserCard';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import api from '@api/index';
import { formatLastSeen, getAllUsers } from '@utils/helper';
import { HOME } from '@utils/constant';
import { HomeNavigationProp } from '@types/navigations';

import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import { Linking } from 'react-native';

type ChatMsg = {
  id: string;
  text?: string;
  image?: string | null;
  video?: string | null;
  fromMe: boolean;
  timestamp?: any;
  location?: { latitude: number; longitude: number } | null;
  liveShare?: { id: string; active: boolean } | null;
  deletedFor?: { [email: string]: boolean };
  edited?: boolean;
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

  const [isBlockedByMe, setIsBlockedByMe] = useState<boolean>(false);
  const [isBlockedByThem, setIsBlockedByThem] = useState<boolean>(false);
  const [clearTime, setClearTime] = useState<any>(null);

  const [themeModalVisible, setThemeModalVisible] = useState<boolean>(false);
  const [loding, setloding] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selecturl, setselecturl] = useState<string | null>(null);
  const [selectedThemeKey, setSelectedThemeKey] = useState<string | null>(null); // fileKey

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
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true);

  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [actionModalVisible, setActionModalVisible] = useState<boolean>(false);

  const [replyToMsg, setReplyToMsg] = useState<ChatMsg | null>(null);

  const [pinnedMsg, setPinnedMsg] = useState<string | null>(null);

  const [actionMsgId, setActionMsgId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>('');

  const [editMsgId, setEditMsgId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);

  const [lastSeen, setLastSeen] = useState<string>('');

  const [isOnline, setIsOnline] = useState<string>('');

  const [allThemes, setAllThemes] = useState<
    { fileKey: string; url: string }[]
  >([]);

  const setReplyMessage = (msg: ChatMsg) => setReplyToMsg(msg);
  const clearReplyMessage = () => setReplyToMsg(null);

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
    selectedThemeKey,

    menuVisible,
    selectedMessages,

    locationFullVisible,
    locationPromptVisible,
    currentCoords,
    isLiveSharingMine,
    setLocationPromptVisible,

    editModalVisible,
    editText,
    actionMsgId,
    pinnedMsg,
    isEditing,

    highlightedMsgId,
    setHighlightedMsgId,

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
    if (!myEmail || !targetUser?.email) {
      return null;
    }
    const sorted = [myEmail, targetUser.email].sort();
    return `${sorted[0]}_${sorted[1]}`;
  })();

  useEffect(() => {
    if (!myEmail || !targetUser?.email || !relationId) {
      return;
    }

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

    const unsubMessages = relationRef
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const msgs: ChatMsg[] = snapshot.docs
          .map(doc => {
            const d = doc.data() || {};
            return {
              id: doc.id,
              text: d.text || '',
              image: d.image || null,
              video: d.video || null,
              location: d.location || null,
              liveShare: d.liveShare || null,
              fromMe: d.from === myEmail,
              timestamp: d.timestamp,
              deletedFor: d.deletedFor || {},
              edited: d.edited || false,
            } as ChatMsg;
          })
          .filter(msg => {
            // Exclude messages deleted for me
            if (msg.deletedFor && msg.deletedFor[myEmail]) {
              return false;
            }
            if (!clearTime) {
              return true;
            }
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
    const unsub = firestore()
      .collection('themeImages')
      .onSnapshot(snapshot => {
        const themes = snapshot.docs.map(doc => doc.data()) as {
          fileKey: string;
          url: string;
        }[];
        setAllThemes(themes);
      });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!targetUser?.email) {
      return;
    }

    const fetchTargetUser = async () => {
      const allUsers = await getAllUsers(myEmail);
      const target = allUsers.find(u => u.email === targetUser.email);

      if (target) {
        if (target.lastSeen) {
          const lastSeenDate = target.lastSeen.toDate
            ? target.lastSeen.toDate()
            : new Date(target.lastSeen);

          setLastSeen(formatLastSeen(lastSeenDate)); // 👈 format using helper
        }

        if (typeof target.online === 'boolean') {
          setIsOnline(target.online);
        }
      }
    };

    fetchTargetUser();

    const intervalId = setInterval(fetchTargetUser, 30000);
    return () => clearInterval(intervalId);
  }, [myEmail, targetUser.email]);

  useEffect(() => {
    if (states?.chatHistory?.length > 0) {
      scrollToBottom(false);
    }
  }, [states?.chatHistory?.length, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!message.trim() || !relationId) {
      return;
    }

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

      // Correct notification data structure for your API
      const data = {
        emails: [email2],
        title: 'New Message',
        body: `${email1}: ${message.trim()}`,
      };

      const response = await api?.NOTIFICATION.sendNotification({ data });
      if (response?.data?.status) {
        showSuccess(response?.data?.message || 'Message sent!');
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  /** Block / Unblock / Clear */
  const blockUser = async () => {
    if (!relationId) {
      return;
    }
    await firestore()
      .collection('relation')
      .doc(relationId)
      .set({ [`block_${myEmail}`]: true }, { merge: true });
    setIsBlockedByMe(true);
    showSuccess('User blocked');
  };

  const unblockUser = async () => {
    if (!relationId) {
      return;
    }
    await firestore()
      .collection('relation')
      .doc(relationId)
      .set({ [`block_${myEmail}`]: false }, { merge: true });
    setIsBlockedByMe(false);
    showSuccess('User unblocked');
  };

  useEffect(() => {
    if (!relationId) {
      return;
    }

    const unsub = firestore()
      .collection('relation')
      .doc(relationId)
      .onSnapshot(doc => {
        const data = doc.data();
        if (data?.themeUrl) {
          setSelectedTheme(data.themeUrl);
          setSelectedThemeKey(data.themeKey || null);
        } else {
          setSelectedTheme(null);
          setSelectedThemeKey(null);
        }
      });

    return () => unsub();
  }, [relationId]);

  const clearChat = async () => {
    try {
      if (!relationId) {
        return;
      }
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
    if (!myEmail || !targetUser?.email || !relationId) {
      return;
    }
    const unsub = firestore()
      .collection('themes')
      .doc(relationId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setSelectedTheme(doc.data()?.themeUrl || null);
        }
      });
    return () => unsub();
  }, [myEmail, targetUser?.email, relationId]);

  const selectTheme = async (fileKey: string | null) => {
    if (!relationId || !fileKey) {
      return;
    }
    setloding(true);

    try {
      // 1. Get theme from "themeImages"
      const themeSnap = await firestore()
        .collection('themeImages')
        .where('fileKey', '==', fileKey)
        .limit(1)
        .get();

      if (themeSnap.empty) {
        showError('Theme not found');
        setloding(false);
        return;
      }

      const themeData = themeSnap.docs[0].data();
      const themeUrl = themeData.url;

      // 2. Save theme in relation doc
      await firestore().collection('relation').doc(relationId).set(
        {
          themeUrl,
          themeKey: fileKey,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      // 3. Update local state
      setSelectedTheme(themeUrl);
      setSelectedThemeKey(fileKey);
      setThemeModalVisible(false);
      showSuccess('Theme applied successfully!');
    } catch (err) {
      console.error(err);
      showError('Failed to apply theme');
    } finally {
      setloding(false);
    }
  };

  const removeTheme = async () => {
    try {
      if (!relationId) {
        return;
      }
      await firestore().collection('relation').doc(relationId).set(
        {
          themeUrl: firestore.FieldValue.delete(),
          themeKey: firestore.FieldValue.delete(),
        },
        { merge: true },
      );

      setSelectedTheme(null);
      setSelectedThemeKey(null);
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
      if (result === RESULTS.GRANTED) {
        return true;
      }

      result = await request(perm);
      if (result === RESULTS.GRANTED) {
        return true;
      }

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
      if (!silent) {
        setLocationPromptVisible(true);
      } else {
        setLocationPromptVisible(false);
      }
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
      if (!relationId) {
        return;
      }
      let latlng = currentCoords;
      if (!latlng) {
        const ok = await ensureLocationReady(true);
        if (!ok) {
          return;
        }
        latlng = currentCoords;
      }
      if (!latlng) {
        return;
      }

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
      if (!relationId) {
        return;
      }
      const ok = await ensureLocationReady(true);
      if (!ok) {
        return;
      }

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

      if (liveEndTimer.current) {
        clearTimeout(liveEndTimer.current);
      }
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

  const toggleSelectMessage = (msgId: string) => {
    setSelectedMessages(prev =>
      prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId],
    );
  };

  const clearSelectedMessages = () => setSelectedMessages([]);

  const openActionModal = () => setActionModalVisible(true);
  const closeActionModal = () => setActionModalVisible(false);

  // Delete selected messages for me
  const deleteMessagesForMe = async () => {
    if (!relationId || selectedMessages.length === 0) {
      return;
    }

    // Mark messages as deleted for me (e.g. add a field in Firestore)
    const relationRef = firestore().collection('relation').doc(relationId);

    for (const msgId of selectedMessages) {
      await relationRef
        .collection('messages')
        .doc(msgId)
        .set({ deletedFor: { [myEmail]: true } }, { merge: true });
    }
    clearSelectedMessages();
    closeActionModal();
    showSuccess('Deleted for you');
  };

  // Delete selected messages for everyone
  const deleteMessagesForEveryone = async () => {
    if (!relationId || selectedMessages.length === 0) {
      return;
    }
    const relationRef = firestore().collection('relation').doc(relationId);
    for (const msgId of selectedMessages) {
      await relationRef.collection('messages').doc(msgId).delete();
    }
    clearSelectedMessages();
    closeActionModal();
    showSuccess('Deleted for everyone');
  };

  // Pin selected message (only first selected)
  const pinMessage = async (msgId: string) => {
    if (!relationId || !msgId) {
      return;
    }
    const relationRef = firestore().collection('relation').doc(relationId);
    await relationRef.set({ pinnedMsg: msgId }, { merge: true });
    showSuccess('Message pinned');
  };

  useEffect(() => {
    if (!relationId) {
      return;
    }
    const relationRef = firestore().collection('relation').doc(relationId);
    const unsub = relationRef.onSnapshot(doc => {
      const data = doc.data();
      setPinnedMsg(data?.pinnedMsg || null);
    });
    return () => unsub();
  }, [relationId]);

  useEffect(() => {
    if (!relationId) {
      return;
    }

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

  const handleEditMessage = async () => {
    if (!editMsgId || !editText.trim()) {
      return;
    }
    const relationRef = firestore().collection('relation').doc(relationId);
    await relationRef
      .collection('messages')
      .doc(editMsgId)
      .set({ text: editText.trim(), edited: true }, { merge: true });
    setEditText('');
    setEditMsgId(null);
    setIsEditing(false);
  };

  useEffect(() => {
    return () => {
      if (liveWatchId.current != null) {
        Geolocation.clearWatch(liveWatchId.current);
      }
      if (liveEndTimer.current) {
        clearTimeout(liveEndTimer.current);
      }
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

    selectedMessages,
    toggleSelectMessage,
    clearSelectedMessages,
    actionModalVisible,
    openActionModal,
    closeActionModal,
    deleteMessagesForMe,
    deleteMessagesForEveryone,
    pinMessage,

    replyToMsg,
    setReplyMessage,
    clearReplyMessage,

    handleEditMessage,
    setEditText,
    setEditModalVisible,
    setActionMsgId,

    setIsEditing,
    setEditMsgId,

    lastSeen,
    isOnline,

    allThemes,
  };
};
