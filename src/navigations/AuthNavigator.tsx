import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash';
import OnboardingScreen from '../screens/onboarding';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegistrationScreen';
import ForgotPassword from '../screens/ForgetPasswordScreen';

const Stack = createNativeStackNavigator();
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Onboarding">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegisterScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
