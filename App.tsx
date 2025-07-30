import React, { useEffect,useRef } from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import StackNavigator from './src/navigations';
import ToastManager from 'toastify-react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import perf from '@react-native-firebase/perf';
import { useNotification } from './src/hook/useNotification';
import CustomToast, { CustomToastRef } from '@components/atoms/CustomToast';

const App = () => {
  const customToastRef = useRef<CustomToastRef>(null);
  useNotification(customToastRef)
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '299086233123-40u7rfe1tdb4q5m7341rtdqo5qabf7eu.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);
  useEffect(() => {
    crashlytics().log('App mounted');
    analytics().logAppOpen();
    // Optionally start a performance trace
    const trace = perf().newTrace('app_start');
    trace.start();
    return () => {
      trace.stop();
    };
  }, []);


 
  return (
    <Provider store={store}>
      <PaperProvider>
        <PersistGate loading={null} persistor={persistor}>
        <CustomToast ref={customToastRef} />
          <ToastManager
            position="bottom"
            theme="light"
            icons={{
              success: 'check-circle',
              error: 'error',
              info: 'info',
              warn: 'warning',
              default: 'notifications',
            }}
            iconFamily="MaterialIcons"
            iconSize={24}
          />
          <StackNavigator />
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
};

export default App;
