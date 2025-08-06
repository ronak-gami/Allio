import React, { memo, useState } from 'react';
import { View } from 'react-native';
import HeroSection from '@components/molecules/HeroSection';
import CustomModal from '@components/atoms/CustomModel';
import useStyle from './style';

const AboutOrganism: React.FC = () => {
  const styles = useStyle();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalTitle('');
    setModalDescription('');
  };

  return (
    <View>
      <HeroSection
        description={
          'Allio is your all-in-one productivity app. Edit videos and photos, scan documents, and manage files with ease. Powered by Firebase for secure and reliable features. Our goal: bring every essential tool into one seamless app experience.'
        }
      />
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        description={modalDescription}
        onClose={handleCloseModal}
        // Example: light yellow
      />
    </View>
  );
};

export default memo(AboutOrganism);
