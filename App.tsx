import React, { useEffect, useRef } from 'react';

import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import perf from '@react-native-firebase/perf';
import CustomNotification, {
  CustomToastRef,
} from '@components/atoms/CustomNotification';
import { useNotification } from '@hooks/index';
import { store, persistor } from './src/redux/store';
import StackNavigator from './src/navigations';
import { WEB_CLIENT_ID } from '@utils/constant';
import { StyleSheet } from 'react-native';

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);
  const customToastRef = useRef<CustomToastRef>(null);
  useNotification(customToastRef);
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <PaperProvider>
          <PersistGate loading={null} persistor={persistor}>
            <CustomNotification ref={customToastRef} />
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
            <Toast />
          </PersistGate>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
