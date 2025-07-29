import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isBiometricAuthenticated: false,
};

const biometricSlice = createSlice({
  name: 'biometric',
  initialState,
  reducers: {
    biometricStateChange: (state, action) => {
      state.isBiometricAuthenticated = action.payload;
    },
  },
});

export const { biometricStateChange } = biometricSlice.actions;
export default biometricSlice.reducer;
