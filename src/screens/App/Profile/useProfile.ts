import { RootState } from '@redux/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const useProfile = () => {
  const [activeTab, setActiveTab] = useState<string>('images');
  const { email } = useSelector((state: RootState) => state.auth.userData);
  const { images, videos } = useSelector((state: RootState) => state.media);

  const states = {
    activeTab,
    setActiveTab,
  };
  return { states, email, images, videos };
};
export default useProfile;
