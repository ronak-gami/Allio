import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Auth/Splash';
import OnboardingScreen from '../screens/Auth/Onboarding';
import LoginScreen from '../screens/Auth/Login';
import RegisterScreen from '../screens/Auth/Registration';
import ForgotPassword from '../screens/Auth/ForgetPassword';
import { AUTH } from '../utils/constant';

const Stack = createNativeStackNavigator();
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Onboarding">
      <Stack.Screen name={AUTH.Splash} component={SplashScreen} />
      <Stack.Screen name={AUTH.Onboarding} component={OnboardingScreen} />
      <Stack.Screen name={AUTH.Login} component={LoginScreen} />
      <Stack.Screen name={AUTH.Register} component={RegisterScreen} />
      <Stack.Screen name={AUTH.ForgotPassword} component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
