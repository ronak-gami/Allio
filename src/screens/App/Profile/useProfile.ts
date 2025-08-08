import { fetchImages, fetchVideos } from '@redux/slices/MediaSlice';
import { RootState, AppDispatch } from '@redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@types/navigations';

interface UseProfileProps {
  userEmail?: string;
}

const useProfile = ({ userEmail }: UseProfileProps = {}) => {
  const navigation = useNavigation<HomeNavigationProp>();
  const [activeTab, setActiveTab] = useState<string>('images');
  const { email: authEmail } = useSelector(
    (state: RootState) => state.auth.userData,
  );
  const { images, videos } = useSelector((state: RootState) => state.media);
  const dispatch = useDispatch<AppDispatch>();

  const email = userEmail || authEmail;

  useEffect(() => {
    if (email) {
      dispatch(fetchImages(email));
      dispatch(fetchVideos(email));
    }
  }, [dispatch, email]);

  const handleTabChange = (tab: string) => setActiveTab(tab);

  const Goback = () => {
    navigation.goBack();
  };

  return {
    states: {
      activeTab,
      setActiveTab: handleTabChange,
    },
    data: {
      email,
      images,
      videos,
    },
    Goback,
  };
};

export default useProfile;
