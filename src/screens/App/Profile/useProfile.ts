import { fetchImages, fetchVideos } from '@redux/slices/MediaSlice';
import { RootState, AppDispatch } from '@redux/store';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '@utils/helper';
import { HOME } from '@utils/constant';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@types/navigations';
import firestore from '@react-native-firebase/firestore';

interface UseProfileProps {
  userEmail?: string;
}

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  mobileNo?: string;
  profileImage?: string;
}

const useProfile = ({ userEmail }: UseProfileProps = {}) => {
  const [activeTab, setActiveTab] = useState<string>('images');
  const [isFriend, setIsFriend] = useState<boolean>(false);
  console.log('isFriend: ', isFriend);
  const [userData, setUserData] = useState<UserData>({
    email: '',
    firstName: undefined,
    lastName: undefined,
    mobileNo: undefined,
    profileImage: undefined,
  });
  const navigation = useNavigation<HomeStackParamList>();
  const { email: authEmail } = useSelector(
    (state: RootState) => state.auth.userData,
  );
  const { images, videos } = useSelector((state: RootState) => state.media);
  const dispatch = useDispatch<AppDispatch>();

  const email = userEmail || authEmail;
  const isExternalProfile = !!userEmail && userEmail !== authEmail;

  const checkIfFriend = useCallback(
    async (friendEmail: string): Promise<boolean> => {
      console.log('Hellow');
      const email1 = authEmail.trim().toLowerCase();
      console.log('userData?.email: ', userData?.email);
      const email2 = friendEmail?.trim().toLowerCase();

      if (!email1 || !email2) return false;

      const docId1 = `${email1}_${email2}`;
      console.log('docId1: ', docId1);
      const docId2 = `${email2}_${email1}`;
      console.log('docId2: ', docId2);

      try {
        const docSnap1 = await firestore()
          .collection('relation')
          .doc(docId1)
          .get();
        console.log('docSnap1: ', docSnap1);
        if (docSnap1.exists && docSnap1.data()?.isAccept === true) {
          return true;
        }

        const docSnap2 = await firestore()
          .collection('relation')
          .doc(docId2)
          .get();
        if (docSnap2.exists && docSnap2.data()?.isAccept === true) {
          return true;
        }

        return false;
      } catch (error) {
        console.error('[Firestore] Error checking friendship:', error);
        return false;
      }
    },
    [userData?.email],
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (email) {
        try {
          const data = await getUserData(email);
          if (data) {
            setUserData({
              email: data.email || email,
              firstName: data.firstName,
              lastName: data.lastName,
              mobileNo: data.mobileNo,
              profileImage: data.profileImage,
            });
          } else {
            setUserData({
              email,
              firstName: undefined,
              lastName: undefined,
              mobileNo: undefined,
              profileImage: undefined,
            });
          }
        } catch (error) {
          console.error('[useProfile] Failed to load user data:', error);
          setUserData({
            email,
            firstName: undefined,
            lastName: undefined,
            mobileNo: undefined,
            profileImage: undefined,
          });
        }
      }
    };

    fetchUserData();
  }, [email]);

  useEffect(() => {
    if (email) {
      dispatch(fetchImages(email));
      dispatch(fetchVideos(email));
    }
  }, [dispatch, email]);

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const navigateToMyFriends = () => {
    navigation.navigate(HOME.ChatDetailsScreen, { user: userData });
  };

  useEffect(() => {
    const checkFriendStatus = async () => {
      if (userEmail && userData.email) {
        const result = await checkIfFriend(userEmail);
        setIsFriend(result);
      }
    };
    checkFriendStatus();
  }, [userEmail, userData.email, checkIfFriend]);

  return {
    states: {
      isFriend,
      activeTab,
      setActiveTab: handleTabChange,
    },
    data: {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobileNo: userData.mobileNo,
      profileImage: userData.profileImage,
      images: isFriend ? images : images.slice(0, 4),
      videos: isFriend ? videos : videos.slice(0, 4),
      allImages: images,
      allVideos: videos,
    },
    isExternalProfile,
    navigateToMyFriends,
  };
};

export default useProfile;
