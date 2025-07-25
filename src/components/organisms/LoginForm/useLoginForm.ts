import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  signInWithEmailAndPassword,
  getAuth,
} from '@react-native-firebase/auth';
import { setStateKey } from '@redux/slices/AuthSlice';
import { checkUserExistsByEmail } from '@utils/helper';
import useValidation from '@utils/validationSchema';
import { useNavigation } from '@react-navigation/native';
import { AUTH } from '@utils/constant';
import { AuthNavigationProp } from '@types/navigations';

export const useLoginForm = () => {
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation<AuthNavigationProp>();
  const { loginValidationSchema } = useValidation();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      const exists = await checkUserExistsByEmail(values.email);
      if (!exists) {
        console.warn('User does not exist in Firestore collection!');
        return;
      }

      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password,
      );

      const user = userCredential.user;
      if (user) {
        const token = await user.getIdToken();
        dispatch(setStateKey({ key: 'token', value: token }));
      }
    } catch (error) {
      console.error('Error into handleLogin :- ', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate(AUTH.Register);
  };

  return {
    remember,
    setRemember: () => setRemember(prev => !prev),
    loading,
    handleLogin,
    initialValues,
    loginValidationSchema,
    navigateToRegister,
  };
};
