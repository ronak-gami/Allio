import { fetchImages, fetchVideos } from '@redux/slices/MediaSlice';
import { RootState, AppDispatch } from '@redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface UseProfileProps {
  userEmail?: string;
}

const useProfile = ({ userEmail }: UseProfileProps = {}) => {
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
  };
};

export default useProfile;
