
// import * as Yup from 'yup';
// import i18n from '../assets/i18n';
// //i want to create hook for this functions so i want to use for language translation i can use as t and in translation i use this directly for different language error message 
// const useValidation = () => {
//     const t = i18n.t.bind(i18n);

//     // const loginValidationSchema = Yup.object().shape({
//     //     email: Yup.string()
//     //         .email(t('Please enter valid email address'))
//     //         .required(t('Email is required'))
//     //         .trim(),
//     //     password: Yup.string()
//     //         .min(6, t('Password must be at least 6 characters'))
//     //         .required(t('Password is required'))
//     //         .matches(
//     //             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//     //             t('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
//     //         ),
//     // });

//     const loginValidationSchema = Yup.object().shape({
//         email: Yup.string()
//             .email(t('validation.email_valid'))
//             .required(t('validation.email_required'))
//             .trim(),
//         password: Yup.string()
//             .min(6, t('validation.password_min'))
//             .required(t('validation.password_required'))
//             .matches(
//                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//                 t('validation.password_pattern'),
//             ),
//     });
//     const forgotPasswordSchema = Yup.object().shape({
//         email: Yup.string()
//             .email(t('Please enter valid email'))
//             .required(t('Email is required'))
//             .trim(),
//     });
//     const registrationValidationSchema = Yup.object().shape({
//         firstName: Yup.string()
//             .required(t('First name is required'))
//             .min(2, t('First name must be at least 2 characters')),
//         lastName: Yup.string()
//             .required(t('Last name is required'))
//             .min(2, t('Last name must be at least 2 characters')),
//         email: Yup.string()
//             .email(t('Please enter valid email address'))
//             .required(t('Email is required'))
//             .trim(),
//         mobileNo: Yup.string()
//             .required(t('Mobile number is required'))
//             .matches(/^[0-9]{10}$/, t('Mobile number must be 10 digits')),
//         password: Yup.string()
//             .min(6, t('Password must be at least 6 characters'))
//             .required(t('Password is required'))
//             .matches(
//                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//                 t('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
//             ),
//         confirmPassword: Yup.string()
//             .oneOf([Yup.ref('password'), null], t('Passwords must match'))
//             .required(t('Confirm password is required')),
//     });

//     return {
//         loginValidationSchema,
//         forgotPasswordSchema,
//         registrationValidationSchema,
//     };
// };

// export default useValidation;

// // // export const forgotPasswordSchema = Yup.object().shape({
// // //     email: Yup.string()
// // //         .email('Please enter valid email')
// // //         .required('Email is required')
// // //         .trim(),
// // // });

// // // export const registrationValidationSchema = Yup.object().shape({
// // //     firstName: Yup.string()
// // //         .required('First name is required')
// // //         .min(2, 'First name must be at least 2 characters'),
// // //     lastName: Yup.string()
// // //         .required('Last name is required')
// // //         .min(2, 'Last name must be at least 2 characters'),
// // //     email: Yup.string()
// // //         .email('Please enter valid email address')
// // //         .required('Email is required')
// // //         .trim(),
// // //     mobileNo: Yup.string()
// // //         .required('Mobile number is required')
// // //         .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
// // //     password: Yup.string()
// // //         .min(6, 'Password must be at least 6 characters')
// // //         .required('Password is required')
// // //         .matches(
// // //             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
// // //             'Password must contain at least one uppercase letter, one lowercase letter, and one number',
// // //         ),
// // //     confirmPassword: Yup.string()
// // //         .oneOf([Yup.ref('password'), null], 'Passwords must match')
// // //         .required('Confirm password is required'),
// // // });export const loginValidationSchema = Yup.object().shape({
import * as Yup from 'yup';
import i18n from '../assets/i18n';
import { useTranslation } from 'react-i18next';
const t = i18n.t.bind(i18n);
// const { t } = useTranslation();


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
            .matches(/^[0-9]{10}$/, t('validation.mobile_pattern', { field: t('mobile') })),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation.confirm_password_match'))
            .required(t('validation.field_required', { field: t('confirm_password') })),
    });

    return {
        loginValidationSchema,
        forgotPasswordSchema,
        registrationValidationSchema,
    };
};

export default useValidation;