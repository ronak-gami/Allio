import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { getAllUsers } from '@utils/helper';

interface User {
  id: string;
  email: string;
  relationStatus: 'none' | 'accepted' | 'sent' | 'received' | 'pending';
  order?: number;
}

export const useMyFriends = () => {
  const currentUserEmail = useSelector(
    (state: RootState) => state.auth.userData.email,
  );

  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'all'>(
    'friends',
  );
  const [users, setUsers] = useState<User[]>([]);
  const [pinnedUsers, setPinnedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const states = { loading, refreshing };

  useEffect(() => {
    fetchAllUsersWithRelation();
    refreshPinned();
  }, [activeTab]);

  // ------------------- Fetch Pinned -------------------
  const refreshPinned = async () => {
    try {
      const userDocSnapshot = await firestore()
        .collection('users')
        .where('email', '==', currentUserEmail)
        .get();

      if (!userDocSnapshot.empty) {
        const data = userDocSnapshot.docs[0].data();
        setPinnedUsers(data?.pinned ?? []);
      } else {
        setPinnedUsers([]);
      }
    } catch (e) {
      console.error('Error fetching pinned users:', e);
    }
  };

  // ------------------- Fetch Users -------------------
  const fetchAllUsersWithRelation = async () => {
    try {
      setLoading(true);

      const allUsers = await getAllUsers(currentUserEmail);
      const relationSnapshot = await firestore().collection('relation').get();

      const userDocSnapshot = await firestore()
        .collection('users')
        .where('email', '==', currentUserEmail)
        .get();

      let savedOrder: Record<string, number> = {};
      let savedPinned: string[] = [];
      if (!userDocSnapshot.empty) {
        const data = userDocSnapshot.docs[0].data();
        savedOrder = data?.order ?? {};
        savedPinned = data?.pinned ?? [];
        setPinnedUsers(savedPinned);
      }

      const relationMap: Record<
        string,
        { from: string; to: string; isAccept: boolean }
      > = {};
      relationSnapshot.forEach(doc => {
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

          let relationStatus: User['relationStatus'] = 'none';
          if (!relation) relationStatus = 'none';
          else if (relation.isAccept) relationStatus = 'accepted';
          else if (relation.from === email1) relationStatus = 'sent';
          else if (relation.to === email1) relationStatus = 'received';
          else relationStatus = 'pending';

          return {
            ...user,
            relationStatus,
            order: savedPinned.includes(user.email)
              ? undefined
              : savedOrder[user.email] ?? 9999,
          };
        })
        .filter(user => {
          if (activeTab === 'all') return !savedPinned.includes(user.email);
          if (activeTab === 'friends')
            return user.relationStatus === 'accepted';
          if (activeTab === 'pending') return user.relationStatus === 'sent';
        })
        .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

      setUsers(filteredUsers);
      setLoading(false);
      setSelectedUser(false);
    } catch (err) {
      console.error('Error fetching users with relation:', err);
      setLoading(false);
    }
  };

  const saveUserOrder = async (updatedUsers: User[]) => {
    try {
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', currentUserEmail)
        .get();

      let userDocRef;
      if (!userSnapshot.empty) {
        userDocRef = userSnapshot.docs[0].ref;
      } else {
        userDocRef = firestore().collection('users').doc();
      }

      const orderData: Record<string, number> = {};
      updatedUsers.forEach((u, index) => {
        if (u.email && !pinnedUsers.includes(u.email)) {
          orderData[u.email] = index;
        }
      });

      await userDocRef.set({ order: orderData }, { merge: true });
    } catch (e) {
      console.error('Error saving order:', e);
    } finally {
      await refreshPinned();
      await fetchAllUsersWithRelation();
      setSelectedUser(false);
    }
  };

  const handleDragEnd = ({ data }: { data: User[] }) => {
    setUsers(data);
    saveUserOrder(data);
  };

  // ------------------- Pin / Unpin -------------------
  const handlePin = async (email: string) => {
    if (pinnedUsers.length >= 2) {
      alert('You can pin only 2 friends.');
      return;
    }

    try {
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', currentUserEmail)
        .get();

      let userDocRef;
      if (!userSnapshot.empty) {
        userDocRef = userSnapshot.docs[0].ref;
      } else {
        userDocRef = firestore().collection('users').doc();
      }

      const newPinned = [...pinnedUsers, email];
      await userDocRef.set({ pinned: newPinned }, { merge: true });
      refreshPinned();
    } catch (e) {
      console.error('Error pinning user:', e);
    }
  };

  const handleUnpin = async (email: string) => {
    try {
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', currentUserEmail)
        .get();

      if (!userSnapshot.empty) {
        const userDocRef = userSnapshot.docs[0].ref;
        const newPinned = pinnedUsers.filter(e => e !== email);
        await userDocRef.set({ pinned: newPinned }, { merge: true });
        refreshPinned();
      }
    } catch (e) {
      console.error('Error unpinning user:', e);
    }
  };

  // ------------------- Refresh -------------------
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAllUsersWithRelation();
      await refreshPinned();
    } finally {
      setRefreshing(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    users,
    pinnedUsers,
    states,
    onRefresh,
    handlePin,
    handleUnpin,
    handleDragEnd,
    selectedUser,
    setSelectedUser,
  };
};
