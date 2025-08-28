import React, { memo } from 'react';
import { KeyboardAvoidingView, Platform, View, ScrollView } from 'react-native';
import { Formik } from 'formik';
import Button from '@components/atoms/Button';
import useValidation from '@utils/validationSchema';
import BottomModal from '@components/atoms/BottomModal';
import Input from '@components/atoms/Input';
import useStyle from './style';
interface ContactFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (fields: {
    name: string;
    mobileNo: string;
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
  const { contetUsValidationSchema } = useValidation();

  return (
    <Formik
      initialValues={{ name: '', mobileNo: '', email: '', message: '' }}
      validationSchema={contetUsValidationSchema}
      onSubmit={(values, { resetForm }) => {
        // This will only run if validation passes
        onSubmit(values);
        resetForm();
        onClose();
      }}>
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <BottomModal visible={visible} onClose={onClose} title="Contact Us">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}>
            <Input
              label="Name"
              placeholder="e.g., pn"
              value={values.name}
              onChangeText={handleChange('name')}
              error={touched.name ? errors.name : undefined}
              touched={touched.name}
              autoCapitalize="words"
            />

            <Input
              label="Email"
              placeholder="purvin.itpath@gmail"
              value={values.email}
              onChangeText={handleChange('email')}
              error={touched.email ? errors.email : undefined}
              touched={touched.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Mobile Number"
              placeholder="4356789076"
              value={values.mobileNo}
              onChangeText={handleChange('mobileNo')}
              error={touched.mobileNo ? errors.mobileNo : undefined}
              touched={touched.mobileNo}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Input
              label="Message"
              placeholder="Hello "
              value={values.message}
              onChangeText={handleChange('message')}
              multiline
              error={touched.message ? errors.message : undefined}
              touched={touched.message}
            />
            <Button
              title="Send"
              onPress={handleSubmit as () => void}
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
