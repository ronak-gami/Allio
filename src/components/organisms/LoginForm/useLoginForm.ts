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
import { showError, showSuccess } from '@utils/toast';
import { Toast } from 'toastify-react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
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
      console.log('Checking user exists for', values.email);
if (!exists) {
  console.log('User does not exist for', values.email);
  showError('User does not exist!');
  return;
}
      const auth = getAuth();





      console.log('Signing in user', values.email);
const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
console.log('Sign in result', userCredential);
  
  
      const user = userCredential.user;
      if (user) {
        const token = await user.getIdToken();
        dispatch(setStateKey({ key: 'token', value: token }));
        console.log('Logging analytics');
        // Log Analytics
        await analytics().logEvent('login', {
          method: 'email',
          email: values.email,
        });
        crashlytics().log('Forcing test crash');
        crashlytics().crash();
        crashlytics().log('User login successful');
  
        crashlytics().setAttribute('email', values.email);
  
        showSuccess('Login Successful!');

      }
    } catch (error) {
      console.error('Error into handleLogin :- ', error);
      crashlytics().recordError(error);
      
      crashlytics().log('Error during login');
      // crashlytics().recordError(error);
      showError(
        error?.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
      trace.stop();  
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
