import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { getAllUsers } from '@utils/helper';

export const useMyFriends = () => {
  const currentUserEmail = useSelector(
    (state: RootState) => state.auth.userData.email,
  );

  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'all'>(
    'friends',
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchAllUsersWithRelation();
  }, [activeTab]);

  const states = {
    loading,
    refreshing,
  };

  const fetchAllUsersWithRelation = async () => {
    try {
      setLoading(true);
      const allUsers = await getAllUsers(currentUserEmail);
      const snapshot = await firestore().collection('relation').get();

      const relationMap: Record<
        string,
        { from: string; to: string; isAccept: boolean }
      > = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        const from = data?.from?.toLowerCase();
        const to = data?.to?.toLowerCase();
        const isAccept = data?.isAccept;

        const key = from < to ? `${from}_${to}` : `${to}_${from}`;
        relationMap[key] = { from, to, isAccept };
      });

      const email1 = currentUserEmail.toLowerCase();

      const filteredUsers = allUsers
        .map(user => {
          const email2 = user.email?.toLowerCase();
          const key =
            email1 < email2 ? `${email1}_${email2}` : `${email2}_${email1}`;
          const relation = relationMap[key];

          if (!relation) {
            return { ...user, relationStatus: 'none' };
          }
          if (relation.isAccept) {
            return { ...user, relationStatus: 'accepted' };
          }
          if (relation.from === email1) {
            return { ...user, relationStatus: 'sent' };
          }
          if (relation.to === email1) {
            return { ...user, relationStatus: 'received' };
          }
          return { ...user, relationStatus: 'pending' };
        })
        .filter(user => {
          if (activeTab === 'all') return true;
          if (activeTab === 'friends')
            return user.relationStatus === 'accepted';
          if (activeTab === 'pending') return user.relationStatus === 'sent';
        });

      setUsers(filteredUsers);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users with relation:', err);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAllUsersWithRelation();
    } finally {
      setRefreshing(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    users,
    states,
    onRefresh,
  };
};
