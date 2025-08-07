import React, { useEffect } from 'react';

import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ToastManager from 'toastify-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store, persistor } from './src/redux/store';
import StackNavigator from './src/navigations';
import { WEB_CLIENT_ID } from '@utils/constant';

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <PersistGate loading={null} persistor={persistor}>
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
    </GestureHandlerRootView>
  );
};

export default App;
