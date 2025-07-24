import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import i18n from './src/assets/i18n';
import StackNavigator from './src/navigations/StackNavigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { persistor, RootState, store } from '@redux/store';

const OnBeforeLift = () => {
  const language = useSelector((state: RootState) => {
    return state.language.language;
  });

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);
  return null;
};

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '299086233123-40u7rfe1tdb4q5m7341rtdqo5qabf7eu.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);
  return (
    <Provider store={store}>
      <PaperProvider>
        <PersistGate
          loading={null}
          persistor={persistor}
          onBeforeLift={() => {
            const state = store.getState();
            const lang = state.language?.language || 'en';
            i18n.changeLanguage(lang);
          }}>
          <OnBeforeLift />
          <StackNavigator />
        </PersistGate>
      </PaperProvider>
    </Provider>
  );
};

export default App;
