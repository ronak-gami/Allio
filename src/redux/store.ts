import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore, PersistConfig} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/AuthSlice';
import languageReducer from './slices/languageSlice';
import themeReducer from './slices/ThemeSlice';
import biometricReducer from './slices/BiometricSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  language: languageReducer,
  theme: themeReducer,
  biometric:biometricReducer
});

type RootReducerType = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootReducerType> = {
  key: 'Allio_root',
  storage: AsyncStorage,
  whitelist: ['auth', 'language', 'theme'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register.imageData', 'profile.imageData'],
      },
      immutableCheck: {
        ignoredPaths: ['register.imageData', 'profile.imageData'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
