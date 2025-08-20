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
    mobileNo: string;
    email: string;
    message: string;
  }) => {
    // Handle form submission (e.g., send to backend, show toast, etc.)
  };
  interface ContactFormFields {
    name: string;
    mobileNo: string;
    email: string;
    message: string;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text type="bold" style={styles.title} label={'ContactUsSection.title'} />

      <Button
        title={'ContactUsSection.contact_button'}
        onPress={handleOpen}
        style={styles.contactButton}
      />
      <ContactFormModal
        key={modalVisible ? 'open' : 'closed'}
        visible={modalVisible}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default memo(ContactUsSection);
