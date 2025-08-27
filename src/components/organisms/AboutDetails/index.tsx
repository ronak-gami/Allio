import React, { memo, useState } from 'react';
import { View } from 'react-native';
import HeroSection from '@components/molecules/HeroSection';
import CustomModal from '@components/atoms/CustomModel';

const AboutOrganism: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalDescription, setModalDescription] = useState<string>('');

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
      />
    </View>
  );
};

export default memo(AboutOrganism);
