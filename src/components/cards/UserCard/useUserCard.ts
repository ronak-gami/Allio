import { useEffect, useState } from 'react';
import {
  PanResponder,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { getCurrentTimestamp } from '@utils/helper';
import { showError, showSuccess } from '@utils/toast';
import api from '@api/index';
import { useNavigation } from '@react-navigation/native';
import { HOME } from '@utils/constant';

export type RelationStatus =
  | 'none'
  | 'pending'
  | 'sent'
  | 'received'
  | 'accepted'
  | 'notsent';

const THRESHOLD = 50;

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
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // 👇 new drag states
  const [dragVisible, setDragVisible] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);

  // -------------------------
  // Relation / Friend request logic
  // -------------------------
  useEffect(() => {
    if (!myEmail || !userEmail) return;
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
          if (data?.isAccept) setRelationStatus('accepted');
          else if (data?.from === email1) setRelationStatus('sent');
          else if (data?.to === email1) setRelationStatus('received');
          else setRelationStatus('notsent');
        } else setRelationStatus('none');
      });

    return () => unsubscribe();
  }, [myEmail, userEmail]);

  useEffect(() => {
    if (!myEmail || !user?.email) return;

    const fetchLastMessage = async () => {
      const email1 = myEmail.toLowerCase();
      const email2 = user.email.toLowerCase();
      const key =
        email1 < email2 ? `${email1}_${email2}` : `${email2}_${email1}`;

      try {
        const roomSnap = await firestore()
          .collection('relation')
          .doc(key)
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();

        if (!roomSnap.empty) {
          const last = roomSnap.docs[0].data();

          if (last.liveShare) {
            setLastMessage('Live Share');
          } else if (last.location) {
            setLastMessage('location');
          } else {
            setLastMessage(last.text || '');
          }

          const msgDate = last.timestamp?.toDate?.() || new Date();
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);

          if (
            msgDate.getDate() === today.getDate() &&
            msgDate.getMonth() === today.getMonth() &&
            msgDate.getFullYear() === today.getFullYear()
          ) {
            setLastMessageDate('Today');
          } else if (
            msgDate.getDate() === yesterday.getDate() &&
            msgDate.getMonth() === yesterday.getMonth() &&
            msgDate.getFullYear() === yesterday.getFullYear()
          ) {
            setLastMessageDate('Yesterday');
          } else {
            setLastMessageDate(msgDate.toLocaleDateString());
          }
        }
      } catch (err) {
        console.log('Error fetching last message:', err);
      }
    };

    // Initial fetch
    fetchLastMessage();

    // Set interval to fetch every 1 second
    const interval = setInterval(fetchLastMessage, 1000);

    return () => clearInterval(interval);
  }, [myEmail, user]);

  // -------------------------
  // Drag logic
  // -------------------------
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
    if (isPinned) onUnpin?.(user.email);
    else onPin?.(user.email);
  };

  // -------------------------
  // Send / Accept / Reject
  // -------------------------
  const sendRequest = async () => {
    if (!myEmail || !userEmail || !documentId) return;
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
    if (response?.data?.success)
      showSuccess(response?.data?.message || 'Notification sent!');
  };

  const acceptRequest = async () => {
    if (!documentId) return;
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
    if (response?.data?.success)
      showSuccess(response?.data?.message || 'Notification sent!');
  };

  const rejectRequest = async () => {
    if (!documentId) return;
    await firestore().collection('relation').doc(documentId).delete();
    const email2 = userEmail?.trim().toLowerCase();
    const data = {
      emails: [email2],
      title: 'Friend Request Rejected',
      body: `${myEmail} has rejected your friend request.`,
    };
    const response = await api?.NOTIFICATION.sendNotification({ data });
    if (response?.data?.success)
      showSuccess(response?.data?.message || 'Notification sent!');
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
      menuPosition,
      setMenuVisible,
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
