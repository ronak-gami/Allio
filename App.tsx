import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, RootState } from './src/redux/store';
import i18n from './src/assets/i18n';
import StackNavigator from './src/navigations/StackNavigation';

const OnBeforeLift = () => {
  const language = useSelector((state: RootState) => {
    console.log('-------------state-------------', state);
    return state.language.language;
  });

  React.useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language]);
  return null;
};

const App = () => {
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
