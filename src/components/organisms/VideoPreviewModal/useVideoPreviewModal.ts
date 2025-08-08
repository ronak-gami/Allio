import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { handleMediaDownload, handleMediaShare } from '@utils/helper';

export const useVideoPreviewModal = (
  myEmail?: string | null,
  mediaUri?: string,
  mediaType?: 'photo' | 'video',
  onClose?: () => void,
) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'preview' | 'friends'>('preview');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  useEffect(() => {
    if (!myEmail) return;
    setLoading(true);

    const unsubscribe = firestore()
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

    return () => unsubscribe();
  }, [myEmail]);

  const handleSendToFriends = async () => {
    if (!selectedFriends.length) return;

    const batch = firestore().batch();
    selectedFriends.forEach(friendEmail => {
      const docId =
        myEmail! < friendEmail
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
        [mediaType === 'video' ? 'video' : 'image']: mediaUri,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    setSelectedFriends([]);
    setMode('preview');
    onClose?.();
  };

  const handleDownload = () => {
    handleMediaDownload(mediaUri, mediaType);
  };

  const handleShare = () => {
    handleMediaShare(mediaUri, mediaType);
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
