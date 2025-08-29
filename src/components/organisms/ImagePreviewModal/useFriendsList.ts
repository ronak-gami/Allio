import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { handleMediaDownload, handleMediaShare } from '@utils/helper';
import api from '@api/index';
import { showSuccess } from '@utils/toast';

export const useFriendsList = (
  myEmail?: string | null,
  imageUri: any,
  mediaType: any,
  onClose: () => void,
) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'preview' | 'friends'>('preview');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  useEffect(() => {
    if (!myEmail) return;
    setLoading(true);

    firestore()
      .collection('relation')
      .where('isAccept', '==', true)
      .onSnapshot(async snapshot => {
        const friendEmails: string[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.from === myEmail) friendEmails.push(data.to);
          if (data.to === myEmail) friendEmails.push(data.from);
        });

        if (friendEmails.length) {
          const usersSnap = await firestore()
            .collection('users')
            .where('email', 'in', friendEmails)
            .get();

          const users = usersSnap.docs.map(doc => doc.data());
          setFriends(users);
        } else {
          setFriends([]);
        }
        setLoading(false);
      });
  }, [myEmail]);

  const handleSendToFriends = async () => {
    if (!selectedFriends.length) return;

    const batch = firestore().batch();
    selectedFriends.forEach(friendEmail => {
      const docId =
        myEmail < friendEmail
          ? `${myEmail}_${friendEmail}`
          : `${friendEmail}_${myEmail}`;

      const msgRef = firestore()
        .collection('relation')
        .doc(docId)
        .collection('messages')
        .doc();

      batch.set(msgRef, {
        from: myEmail,
        to: friendEmail,
        image: imageUri,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    const email1 = myEmail.trim().toLowerCase();

    const title = 'Message Sent';
    const body = `${email1} has sent message to you.`;

    const data = {
      emails: selectedFriends,
      title: title,
      body: body,
    };

    const response = await api?.NOTIFICATION.sendNotification({ data });

    if (response?.data?.status) {
      showSuccess('Notification sent!');
      setSelectedFriends([]);
    }
    setMode('preview');
    onClose();
  };

  const handleDownload = () => {
    handleMediaDownload(imageUri, mediaType);
  };

  const handleShare = () => {
    handleMediaShare(imageUri, mediaType);
  };

  const handleSend = () => {
    setMode('friends');
  };

  const toggleSelect = (email: string) => {
    setSelectedFriends(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email],
    );
  };
  return {
    friends,
    loading,
    handleSend,
    handleShare,
    handleDownload,
    mode,
    setMode,
    selectedFriends,
    setSelectedFriends,
    handleSendToFriends,
    toggleSelect,
  };
};
