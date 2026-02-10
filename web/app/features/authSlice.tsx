import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: { id: string; email: string; role?: 'ADMIN' | 'PARTICIPANT' } | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: any; token: string }>) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    initAuth(
      state,
      action: PayloadAction<{ user: any; token: string } | null>
    ) {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
      }
      state.initialized = true;
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.initialized = true;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, initAuth, logout } = authSlice.actions;

export default authSlice.reducer;
