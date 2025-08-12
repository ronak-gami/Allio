import React, { useEffect } from 'react';

import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store, persistor } from './src/redux/store';
import StackNavigator from './src/navigations';
import { WEB_CLIENT_ID } from '@utils/constant';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <StackNavigator />
            </BottomSheetModalProvider>
            <Toast />
          </GestureHandlerRootView>
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
};

export default App;
