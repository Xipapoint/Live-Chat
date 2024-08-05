import { createSlice, PayloadAction} from '@reduxjs/toolkit';


export interface AuthState {
  isAuthenticated: boolean;
  userId: string
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: ''
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.userId = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userId = '';
    },
  },
});
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
