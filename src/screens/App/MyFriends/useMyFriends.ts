import { useEffect, useState, useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { getAllUsers } from '@utils/helper';
import { showError } from '@utils/toast';

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
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const states = { loading, refreshing };

  // ------------------- Fetch Pinned -------------------
  const refreshPinned = useCallback(async () => {
    if (!currentUserEmail) return;

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
  }, [currentUserEmail]);

  // ------------------- Ensure Self Relation -------------------
  const ensureSelfRelation = useCallback(async () => {
    if (!currentUserEmail) return;
    const me = currentUserEmail.toLowerCase();
    const selfDocRef = firestore().collection('relation').doc(`${me}_${me}`);
    const selfDocSnapshot = await selfDocRef.get();

    if (!selfDocSnapshot.exists) {
      await selfDocRef.set({ from: me, to: me, isAccept: true });
      console.log('Created self-relation document');
    }
  }, [currentUserEmail]);

  // ------------------- Fetch Users with Relation -------------------
  const fetchAllUsersWithRelation = useCallback(async () => {
    if (!currentUserEmail) return;
    setLoading(true);

    try {
      const email1 = currentUserEmail.toLowerCase();

      await ensureSelfRelation();

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
        const from = (data?.from || '').toLowerCase();
        const to = (data?.to || '').toLowerCase();
        const isAccept = !!data?.isAccept;

        if (!from || !to) return;

        relationMap[`${from}_${to}`] = { from, to, isAccept };
        relationMap[`${to}_${from}`] = { from, to, isAccept };

        if (from === to && isAccept) {
          relationMap['self'] = { from, to, isAccept };
        }
      });

      const mappedUsersRaw = allUsers.map(user => {
        const originalEmail = (user.email ?? '').trim();
        const normalized = originalEmail.toLowerCase();
        const relation = normalized
          ? relationMap[`${email1}_${normalized}`]
          : undefined;
        const isSelf = normalized === email1;

        let relationStatus: User['relationStatus'] = 'none';
        if (isSelf) relationStatus = relation?.isAccept ? 'accepted' : 'none';
        else if (!relation) relationStatus = 'none';
        else if (relation.isAccept) relationStatus = 'accepted';
        else if (relation.from === email1) relationStatus = 'sent';
        else if (relation.to === email1) relationStatus = 'received';
        else relationStatus = 'pending';

        return {
          ...user,
          email: originalEmail,
          relationStatus,
          order:
            originalEmail && !savedPinned.includes(originalEmail)
              ? savedOrder[originalEmail]
              : undefined,
        };
      });

      const dedupMap = new Map<string, User>();
      mappedUsersRaw.forEach(u => {
        const key = (u.email || '').toLowerCase();
        if (!key) return;
        if (!dedupMap.has(key)) dedupMap.set(key, u);
      });

      let filteredUsers = Array.from(dedupMap.values()).filter(user => {
        if (activeTab === 'all') return true;
        if (activeTab === 'friends') return user.relationStatus === 'accepted';
        if (activeTab === 'pending')
          return ['sent', 'received', 'pending'].includes(user.relationStatus);
        return true;
      });

      const selfDoc = relationMap['self'];
      if (
        (activeTab === 'all' &&
          !filteredUsers.some(u => (u.email || '').toLowerCase() === email1)) ||
        (activeTab === 'friends' &&
          selfDoc?.isAccept &&
          !filteredUsers.some(u => (u.email || '').toLowerCase() === email1))
      ) {
        filteredUsers.push({
          id: `self-${email1}`,
          email: currentUserEmail,
          relationStatus: activeTab === 'friends' ? 'accepted' : 'none',
          order:
            !savedPinned.includes(currentUserEmail) &&
            savedOrder[currentUserEmail] !== undefined
              ? savedOrder[currentUserEmail]
              : undefined,
        });
      }

      const orderedUsers = filteredUsers
        .filter(u => u.order !== undefined)
        .sort((a, b) => a.order! - b.order!);
      const unorderedUsers = filteredUsers.filter(u => u.order === undefined);
      setUsers([...orderedUsers, ...unorderedUsers]);
      setSelectedUser(false);
    } catch (err) {
      console.error('Error fetching users with relation:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserEmail, activeTab, ensureSelfRelation]);

  // ------------------- Pin / Unpin -------------------
  const handlePin = useCallback(
    async (email: string) => {
      if (pinnedUsers.length >= 2) {
        showError('You can pin up to 2 users only.');
        return;
      }
      try {
        const userSnapshot = await firestore()
          .collection('users')
          .where('email', '==', currentUserEmail)
          .get();
        const userDocRef = !userSnapshot.empty
          ? userSnapshot.docs[0].ref
          : firestore().collection('users').doc();
        const newPinned = [...pinnedUsers, email];
        await userDocRef.set({ pinned: newPinned }, { merge: true });
        await refreshPinned();
      } catch (e) {
        console.error('Error pinning user:', e);
      }
    },
    [currentUserEmail, pinnedUsers, refreshPinned],
  );

  const handleUnpin = useCallback(
    async (email: string) => {
      try {
        const userSnapshot = await firestore()
          .collection('users')
          .where('email', '==', currentUserEmail)
          .get();
        if (!userSnapshot.empty) {
          const userDocRef = userSnapshot.docs[0].ref;
          const data = userSnapshot.docs[0].data() || {};
          const savedOrder: Record<string, number> = data?.order ?? {};
          const newPinned = pinnedUsers.filter(e => e !== email);

          const newOrder: Record<string, number> = {};
          Object.entries(savedOrder).forEach(([e, idx]) => {
            if (e === email) return;
            if (!newPinned.includes(e))
              newOrder[e] = (typeof idx === 'number' ? idx : 9999) + 1;
          });
          newOrder[email] = 0;

          await userDocRef.set(
            { pinned: newPinned, order: newOrder },
            { merge: true },
          );
          await refreshPinned();
          await fetchAllUsersWithRelation();
        }
      } catch (e) {
        console.error('Error unpinning user:', e);
      } finally {
        setSelectedUser(false);
      }
    },
    [currentUserEmail, pinnedUsers, refreshPinned, fetchAllUsersWithRelation],
  );

  // ------------------- Save Order -------------------
  const saveUserOrder = useCallback(
    async (updatedUsers: User[]) => {
      try {
        const userSnapshot = await firestore()
          .collection('users')
          .where('email', '==', currentUserEmail)
          .get();
        const userDocRef = !userSnapshot.empty
          ? userSnapshot.docs[0].ref
          : firestore().collection('users').doc();
        const orderData: Record<string, number> = {};
        updatedUsers.forEach((u, index) => {
          if (u.email && !pinnedUsers.includes(u.email))
            orderData[u.email] = index;
        });
        await userDocRef.set({ order: orderData }, { merge: true });
      } catch (e) {
        console.error('Error saving order:', e);
      } finally {
        await refreshPinned();
        await fetchAllUsersWithRelation();
        setSelectedUser(false);
      }
    },
    [currentUserEmail, pinnedUsers, refreshPinned, fetchAllUsersWithRelation],
  );

  const handleDragEnd = useCallback(
    ({ data }: { data: User[] }) => {
      setUsers(data);
      saveUserOrder(data);
      setIsDragging(false);
    },
    [saveUserOrder],
  );

  const handleDragBegin = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllUsersWithRelation();
    await refreshPinned();
    setRefreshing(false);
  }, [fetchAllUsersWithRelation, refreshPinned]);

  // ------------------- Effects -------------------
  useEffect(() => {
    fetchAllUsersWithRelation();
    refreshPinned();
  }, [activeTab, fetchAllUsersWithRelation, refreshPinned]);

  useEffect(() => {
    if (!currentUserEmail) return;
    const me = currentUserEmail.toLowerCase();
    const unsub = firestore()
      .collection('relation')
      .doc(`${me}_${me}`)
      .onSnapshot(() => {
        fetchAllUsersWithRelation();
      });
    return () => unsub();
  }, [currentUserEmail, fetchAllUsersWithRelation]);

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
    isDragging,
    handleDragBegin,
  };
};
