import { useEffect, useMemo, useState } from 'react';
import { PanResponder } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

import { getCurrentTimestamp } from '@utils/helper';
import { showError, showSuccess } from '@utils/toast';
import api from '@api/index';
import { useNavigation } from '@react-navigation/native';
import { HOME, THRESHOLD } from '@utils/constant';

export type RelationStatus =
  | 'none'
  | 'pending'
  | 'sent'
  | 'received'
  | 'accepted'
  | 'notsent';

export const useUserCard = (
  myEmail: string | null | undefined,
  userEmail: string | null | undefined,
  user: any,
  isPinned?: boolean,
  selectedUser?: any,
  onDragThreshold?: (user: any) => void,
  onPin?: (email: string) => void,
  onUnpin?: (email: string) => void,
) => {
  const navigation = useNavigation();
  const [relationStatus, setRelationStatus] = useState<RelationStatus>('none');
  const [documentId, setDocumentId] = useState<string>('');
  const [lastMessage, setLastMessage] = useState<string>('');
  const [lastMessageDate, setLastMessageDate] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  // 👇 new drag states
  const [dragVisible, setDragVisible] = useState<boolean>(false);
  const [dragDistance, setDragDistance] = useState<number>(0);

  useEffect(() => {
    if (!myEmail || !userEmail) {
      return;
    }
    const email1 = myEmail.trim().toLowerCase();
    const email2 = userEmail.trim().toLowerCase();
    const docId =
      email1 < email2 ? `${email1}_${email2}` : `${email2}_${email1}`;
    setDocumentId(docId);

    const unsubscribe = firestore()
      .collection('relation')
      .doc(docId)
      .onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          if (data?.isAccept) {
            setRelationStatus('accepted');
          } else if (data?.from === email1) {
            setRelationStatus('sent');
          } else if (data?.to === email1) {
            setRelationStatus('received');
          } else {
            setRelationStatus('notsent');
          }
        } else {
          setRelationStatus('none');
        }
      });

    return () => unsubscribe();
  }, [myEmail, userEmail]);

  useEffect(() => {
    if (!myEmail || !user?.email) {
      return;
    }

    const email1 = myEmail.toLowerCase();
    const email2 = user.email.toLowerCase();
    const key = email1 < email2 ? `${email1}_${email2}` : `${email2}_${email1}`;

    const fetchLastMessage = async () => {
      try {
        const roomSnap = await firestore()
          .collection('relation')
          .doc(key)
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();

        if (roomSnap.empty) {
          return;
        }

        const last = roomSnap.docs[0].data();

        // Set last message text
        if (last.liveShare) {
          setLastMessage('Live Share');
        } else if (last.location) {
          setLastMessage('Location');
        } else {
          setLastMessage(last.text || '');
        }

        // Set last message date/time using moment
        const msgDate = last.timestamp?.toDate?.() || new Date();
        const msgMoment = moment(msgDate);
        const now = moment();

        if (msgMoment.isSame(now, 'day')) {
          // Today → show time
          setLastMessageDate(msgMoment.format('h:mm A')); // e.g., 3:45 PM
        } else if (msgMoment.isSame(moment().subtract(1, 'day'), 'day')) {
          setLastMessageDate('Yesterday');
        } else {
          setLastMessageDate(msgMoment.format('L')); // Localized date
        }
      } catch (err) {
        console.error('Error fetching last message:', err);
      }
    };

    fetchLastMessage(); // Initial fetch
    const interval = setInterval(fetchLastMessage, 1000); // Poll every second

    return () => clearInterval(interval);
  }, [myEmail, user]);

  useEffect(() => {
    setDragVisible(selectedUser?.email === user?.email && !isPinned);
  }, [selectedUser, user?.email, isPinned]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => dragVisible,
    onPanResponderMove: (_, gestureState) => {
      setDragDistance(gestureState.dy);
      if (Math.abs(gestureState.dy) > THRESHOLD) {
        onDragThreshold?.(user);
      }
    },
    onPanResponderRelease: () => setDragDistance(10),
  });

  const handlePress = () => {
    navigation.navigate(HOME.ChatDetailsScreen, { user });
  };

  const handlePressPin = () => {
    if (isPinned) {
      onUnpin?.(user.email);
    } else {
      onPin?.(user.email);
    }
  };

  // -------------------------
  // Send / Accept / Reject
  // -------------------------
  const sendRequest = async () => {
    if (!myEmail || !userEmail || !documentId) {
      return;
    }
    const email1 = myEmail.trim().toLowerCase();
    const email2 = userEmail.trim().toLowerCase();
    const timestamp = getCurrentTimestamp
      ? getCurrentTimestamp()
      : firestore.FieldValue.serverTimestamp();

    await firestore().collection('relation').doc(documentId).set({
      from: email1,
      to: email2,
      isAccept: false,
      timestamp,
    });

    const title = 'Connection Request';
    const body = `${email1} has sent you a connection request.`;

    const data = { emails: [email2], title, body };
    const response = await api?.NOTIFICATION.sendNotification({ data });
    if (response?.data?.success) {
      showSuccess(response?.data?.message || 'Notification sent!');
    }
  };

  const acceptRequest = async () => {
    if (!documentId) {
      return;
    }
    await firestore()
      .collection('relation')
      .doc(documentId)
      .update({ isAccept: true });
    const email2 = userEmail?.trim().toLowerCase();
    const data = {
      emails: [email2],
      title: 'Friend Request Accepted',
      body: `${myEmail} has accepted your friend request.`,
    };
    const response = await api?.NOTIFICATION.sendNotification({ data });
    if (response?.data?.success) {
      showSuccess(response?.data?.message || 'Notification sent!');
    }
  };

  const rejectRequest = async () => {
    if (!documentId) {
      return;
    }
    await firestore().collection('relation').doc(documentId).delete();
    const email2 = userEmail?.trim().toLowerCase();
    const data = {
      emails: [email2],
      title: 'Friend Request Rejected',
      body: `${myEmail} has rejected your friend request.`,
    };
    const response = await api?.NOTIFICATION.sendNotification({ data });
    if (response?.data?.success) {
      showSuccess(response?.data?.message || 'Notification sent!');
    }
  };

  const handleSend = async () => {
    try {
      await sendRequest();
      showSuccess('Friend request sent');
    } catch (error) {
      console.error(error);
      showError('Failed to send request');
    }
  };
  const handleAccept = async () => {
    try {
      await acceptRequest();
      showSuccess('Friend request accepted');
    } catch (error) {
      console.error(error);
      showError('Failed to accept request');
    }
  };
  const handleReject = async () => {
    try {
      await rejectRequest();
      showSuccess('Friend request rejected');
    } catch (error) {
      console.error(error);
      showError('Failed to reject request');
    }
  };

  return {
    states: {
      lastMessage,
      lastMessageDate,
      menuVisible,
      setMenuVisible,
      dragDistance,
    },
    relationStatus,
    dragVisible,
    panResponder,
    handlePress,
    handlePressPin,
    handleSend,
    handleAccept,
    handleReject,
  };
};
