import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userData: Object;
  token: string | null;
  onboardingCompleted: boolean;
}

interface SetStateKeyPayload {
  key: keyof AuthState;
  value: any;
}

const initialState: AuthState = {
  userData: {},
  token: null,
  onboardingCompleted: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStateKey: (state, action: PayloadAction<SetStateKeyPayload>) => {
      const { key, value } = action.payload;
      if (key in state) {
        state[key] = value;
      }
    },
    logout: state => {
      state.userData = {};
      state.token = null;
    },
  },
});

export const { setStateKey, logout } = authSlice.actions;
export default authSlice.reducer;
