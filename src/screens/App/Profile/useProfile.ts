import { fetchImages, fetchVideos } from '@redux/slices/MediaSlice';
import { RootState, AppDispatch } from '@redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '@utils/helper';

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
  const [userData, setUserData] = useState<UserData>({
    email: '',
    firstName: undefined,
    lastName: undefined,
    mobileNo: undefined,
    profileImage: undefined,
  });

  const { email: authEmail } = useSelector(
    (state: RootState) => state.auth.userData,
  );
  const { images, videos } = useSelector((state: RootState) => state.media);
  const dispatch = useDispatch<AppDispatch>();

  const email = userEmail || authEmail;

  useEffect(() => {
    const fetchUserData = async () => {
      if (email) {
        try {
          const data = await getUserData(email);
          console.log('**LOG ** Fetched User Data:', data);

          // Set userData with the fetched data
          setUserData({
            email: data.email || email,
            firstName: data.firstName,
            lastName: data.lastName,
            mobileNo: data.mobileNo,
            profileImage: data.profileImage,
          });
        } catch (error) {
          console.log('Error fetching user data:', error);
          // Set default userData with just email
          setUserData({
            email: email,
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

  return {
    states: {
      activeTab,
      setActiveTab: handleTabChange,
    },
    data: {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobileNo: userData.mobileNo,
      profileImage: userData.profileImage,
      images,
      videos,
    },
  };
};

export default useProfile;
