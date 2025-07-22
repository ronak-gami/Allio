

import React from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {PaperProvider} from 'react-native-paper';
import StackNavigator from './src/navigations/StackNavigation';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, RootState, store} from './src/redux/store';
import i18n from './src/assets/i18n';
import {setLanguage} from './src/redux/slices/languageSlice';
import {getThemeColors} from './src/utils/themes';

const OnBeforeLift = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: any) => state.language.language);

  React.useEffect(() => {
    if (language) {
      i18n.changeLanguage(language); // ✅ Restore language into i18n
    }
  }, [language]);

  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const themeColors = getThemeColors(isDarkMode);
  console.log(isDarkMode);

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
