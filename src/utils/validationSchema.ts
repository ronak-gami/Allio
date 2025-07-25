import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter valid email address')
    .required(`{t}`)
    .trim(),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter valid email')
    .required('Email is required')
    .trim(),
});

export const registrationValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Please enter valid email address')
    .required('Email is required')
    .trim(),
  mobileNo: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const projectValidationSchema = Yup.object().shape({
  projectName: Yup.string().required('Project name is required'),
  projectGroup: Yup.string().required('Project group is required'),
  estimate: Yup.object()
    .shape({
      hours: Yup.number().min(0).max(23),
      minutes: Yup.number().min(0).max(59),
    })
    .nullable(),
  deadline: Yup.date().nullable().required('Project deadline is required'),
  priority: Yup.string().required('Project priority is required'),
  assignee: Yup.string().required('Project assignee is required'),
  description: Yup.string(),
});
