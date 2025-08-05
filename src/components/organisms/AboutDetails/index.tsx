import React, { useState } from 'react';
import { View } from 'react-native';
import HeroSection from '@components/molecules/HeroSection';
import CustomModal from '@components/atoms/CustomModel';
import useStyle from './style';

const VISION_TITLE = 'Vision';
const VISION_DESCRIPTION =
  'Allio is designed to be your modern digital Swiss army knife—a unified mobile platform offering push notifications, video & photo editing tools, document scanning, and seamless Firebase modules in a single intuitive app';

const GOAL_TITLE = 'Goal';
const GOAL_DESCRIPTION =
  'Allio aims to set a new standard: combining editing, scanning, cloud services, and engagement tools—with smart UI and Firebase at its backbone—without overwhelming you with multiple installs';

const AboutOrganism: React.FC = () => {
  const styles = useStyle();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');

  const handleVision = () => {
    setModalTitle(VISION_TITLE);
    setModalDescription(VISION_DESCRIPTION);
    setModalVisible(true);
    console.log('Vision button pressed'); // Debugging log
  };

  const handleGoal = () => {
    setModalTitle(GOAL_TITLE);
    setModalDescription(GOAL_DESCRIPTION);
    console.log('Goal button pressed'); // Debugging log
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalTitle('');
    setModalDescription('');
  };

  return (
    <View>
      <HeroSection
        handleVision={handleVision}
        handleGoal={handleGoal}
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

export default AboutOrganism;
