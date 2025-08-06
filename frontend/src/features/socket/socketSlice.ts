// src/store/socketSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SocketError {
  message: string;
  code?: string;
}

export interface SocketState {
  socketId: string | null;
  connected: boolean;
  error: SocketError | null;
  loggedInUser: string | null;
}

const initialState: SocketState = {
  socketId: null,
  connected: false,
  error: null,
  loggedInUser: null,
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketConnected: (state, action: PayloadAction<string>) => {
      state.socketId = action.payload;
      state.connected = true;
    },
    setSocketDisconnected: (state) => {
      state.socketId = null;
      state.connected = false;
    },
    setSocketError: (state, action: PayloadAction<SocketError>) => {
      state.error = action.payload;
    },
    clearSocketError: (state) => {
      state.error = null;
    },
    setLoginSuccess: (state, action: PayloadAction<string>) => {
      state.loggedInUser = action.payload;
    },
    clearLoginSuccess: (state) => {
      state.loggedInUser = null;
    },
  },
});

export const { 
  setSocketConnected, 
  setSocketDisconnected, 
  setSocketError, 
  clearSocketError,
  setLoginSuccess,
  clearLoginSuccess
} = socketSlice.actions;
export default socketSlice.reducer;