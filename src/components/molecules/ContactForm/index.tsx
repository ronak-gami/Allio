import React, { memo } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';

import Input from '@components/atoms/Input';
import Button from '@components/atoms/Button';
import useValidation from '@utils/validationSchema';

import useStyle from './style';
import BottomModal from '@components/atoms/BottomModal';

interface ContactFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (fields: {
    name: string;
    mobile: string;
    email: string;
    message: string;
  }) => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const styles = useStyle();
  const { contactUsValidationSchema } = useValidation();

  return (
    <Formik
      initialValues={{ name: '', mobile: '', email: '', message: '' }}
      validationSchema={contactUsValidationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
        onClose();
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <BottomModal visible={visible} onClose={onClose} title="Contact Us">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}>
            <Input
              placeholder="name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name ? errors.name : ''}
              style={styles.input}
            />
            <Input
              placeholder="mobile"
              value={values.mobile}
              onChangeText={handleChange('mobile')}
              onBlur={handleBlur('mobile')}
              keyboardType="phone-pad"
              error={touched.mobile ? errors.mobile : ''}
              style={styles.input}
            />
            <Input
              placeholder="email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              error={touched.email ? errors.email : ''}
              style={styles.input}
            />
            <Input
              placeholder="message"
              value={values.message}
              onChangeText={handleChange('message')}
              onBlur={handleBlur('message')}
              multiline
              error={touched.message ? errors.message : ''}
              style={[styles.input, styles.messageInput]}
            />
            <Button
              title="Send"
              onPress={handleSubmit as any}
              disabled={isSubmitting}
              style={styles.button}
            />
          </KeyboardAvoidingView>
        </BottomModal>
      )}
    </Formik>
  );
};

export default memo(ContactFormModal);
