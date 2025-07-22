import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  userData: Object;
  token: string | null;
  onboardingCompleted: Boolean;
}

const initialState: AuthState = {
  userData: {},
  token: null,
  onboardingCompleted: true,
};

interface SetStateKeyPayload {
  key: keyof AuthState;
  value: any;
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStateKey: (state, action: PayloadAction<SetStateKeyPayload>) => {
      const {key, value} = action.payload;
      if (key in state) {
        state[key] = value;
      }
    },
    logout: () => initialState,
  },
});

export const {setStateKey, logout} = authSlice.actions;
export default authSlice.reducer;
