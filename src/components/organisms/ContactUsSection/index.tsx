import React, { memo, useState } from 'react';
import { View } from 'react-native';
import Button from '@components/atoms/Button';
import ContactFormModal from '@components/molecules/ContactForm';
import useStyle from './style';
import Text from '@components/atoms/Text';
// Assuming this is the correct import path for the validation schema

const ContactUsSection: React.FC = () => {
  const styles = useStyle();
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpen = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);

  const handleSubmit = (fields: {
    name: string;
    mobile: string;
    email: string;
    message: string;
  }) => {
    console.log('hello');
    // Handle form submission (e.g., send to backend, show toast, etc.)
  };

  return (
    <View style={styles.sectionContainer}>
      <Text type="bold" style={styles.title} label={'ContactUsSection.title'} />

      <Button
        title="Contact Us"
        onPress={handleOpen}
        style={styles.contactButton}
      />
      <ContactFormModal
        visible={modalVisible}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default memo(ContactUsSection);
