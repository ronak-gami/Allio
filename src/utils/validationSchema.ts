import * as Yup from 'yup';
import i18n from '../assets/i18n';
const t = i18n.t.bind(i18n);

const useValidation = () => {
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('validation.email_valid', { field: t('email') }))
      .required(t('validation.field_required', { field: t('email') }))
      .trim(),
    password: Yup.string()
      .min(6, t('validation.field_min', { field: t('password'), min: 6 }))
      .required(t('validation.field_required', { field: t('password') }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t('validation.password_pattern', { field: t('password') }),
      ),
  });

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('validation.email_valid', { field: t('email') }))
      .required(t('validation.field_required', { field: t('email') }))
      .trim(),
  });

  const registrationValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('validation.email_valid', { field: t('email') }))
      .required(t('validation.field_required', { field: t('email') }))
      .trim(),
    password: Yup.string()
      .min(6, t('validation.field_min', { field: t('password'), min: 6 }))
      .required(t('validation.field_required', { field: t('password') }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t('validation.password_pattern', { field: t('password') }),
      ),
    firstName: Yup.string()
      .required(t('validation.field_required', { field: t('first_name') }))
      .min(2, t('validation.field_min', { field: t('first_name'), min: 2 })),
    lastName: Yup.string()
      .required(t('validation.field_required', { field: t('last_name') }))
      .min(2, t('validation.field_min', { field: t('last_name'), min: 2 })),

    mobileNo: Yup.string()
      .required(t('validation.field_required', { field: t('mobile') }))
      .matches(
        /^[0-9]{10}$/,
        t('validation.mobile_pattern', { field: t('mobile') }),
      ),

    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('password'), null],
        t('validation.confirm_password_match'),
      )
      .required(
        t('validation.field_required', { field: t('confirm_password') }),
      ),
  });

  return {
    loginValidationSchema,
    forgotPasswordSchema,
    registrationValidationSchema,
  };
};

export default useValidation;
