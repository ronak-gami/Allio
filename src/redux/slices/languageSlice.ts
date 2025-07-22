import {createSlice} from '@reduxjs/toolkit';
import i18n from '../../assets/i18n';

interface LanguageState {
  language: string;
}

const initialState: LanguageState = {
  language: 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      i18n.changeLanguage(action.payload);
    },
  },
});

export const {setLanguage} = languageSlice.actions;
export default languageSlice.reducer;
