import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { getCurrentTimestamp } from '@utils/helper';
import { showError, showSuccess } from '@utils/toast';
import api from '@api/index';

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
) => {
  const [relationStatus, setRelationStatus] = useState<RelationStatus>('none');
  const [documentId, setDocumentId] = useState<string>('');

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

    const data = {
      emails: [email2],
      title: title,
      body: body,
    };
    const response = await api?.NOTIFICATION.sendNotification({ data });

    if (response?.data?.success) {
      showSuccess(response?.data?.message || 'Notification sent!');
    }
  };

  const acceptRequest = async () => {
    if (!documentId) return;
    await firestore().collection('relation').doc(documentId).update({
      isAccept: true,
    });
    const email1 = myEmail.trim().toLowerCase();
    const email2 = userEmail.trim().toLowerCase();

    const title = 'Friend Request Accepted';
    const body = `${email1} has Accepted your friend request.`;

    const data = {
      emails: [email2],
      title: title,
      body: body,
    };
    const response = await api?.NOTIFICATION.sendNotification({ data });
    console.log('response', response, 'response---->>>>');
    if (response?.data?.success) {
      showSuccess(response?.data?.message || 'Notification sent!');
    }
  };

  const rejectRequest = async () => {
    if (!documentId) return;
    await firestore().collection('relation').doc(documentId).delete();
    const email1 = myEmail.trim().toLowerCase();
    const email2 = userEmail.trim().toLowerCase();

    const title = 'Friend Request Rejected';
    const body = `${email1} has Rejected your friend request.`;

    const data = {
      emails: [email2],
      title: title,
      body: body,
    };
    const response = await api?.NOTIFICATION.sendNotification({ data });
    console.log('response', response, 'reject request---->>>>');

    if (response?.data?.success) {
      showSuccess(response?.data?.message || 'Notification sent!');
    }
  };
  const handleSend = async () => {
    try {
      await sendRequest();
      showSuccess('Friend request sent');
    } catch (error) {
      console.error('Send Error:', error);
      showError('Failed to send request');
    }
  };

  const handleAccept = async () => {
    try {
      await acceptRequest();
      showSuccess('Friend request accepted');
    } catch (error) {
      console.error('Accept Error:', error);
      showError('Failed to accept request');
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest();
      showSuccess('Friend request rejected');
    } catch (error) {
      console.error('Reject Error:', error);
      showError('Failed to reject request');
    }
  };

  return {
    relationStatus,
    sendRequest,
    acceptRequest,
    rejectRequest,
    handleSend,
    handleAccept,
    handleReject,
  };
};
