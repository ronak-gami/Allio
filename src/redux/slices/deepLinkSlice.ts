import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PendingDeepLink = {
  routeName: string;
  params?: Record<string, any>;
} | null;

interface DeepLinkState {
  pending: PendingDeepLink;
  resolved: boolean;
}

const initialState: DeepLinkState = {
  pending: null,
  resolved: false,
};

const deepLinkSlice = createSlice({
  name: 'deepLink',
  initialState,
  reducers: {
    setPendingDeepLink(state, action: PayloadAction<PendingDeepLink>) {
      state.pending = action.payload;
    },
    clearPendingDeepLink(state) {
      state.pending = null;
    },
    markDeepLinkResolved(state) {
      state.resolved = true;
    },
  },
});

export const {
  setPendingDeepLink,
  clearPendingDeepLink,
  markDeepLinkResolved,
} = deepLinkSlice.actions;

export default deepLinkSlice.reducer;
