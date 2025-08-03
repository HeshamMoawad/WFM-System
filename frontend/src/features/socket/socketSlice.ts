// src/store/socketSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'



export interface SocketState {
  socketId: string | null;
  connected: boolean;
}

const initialState: SocketState = {
  socketId: null,
  connected: false,
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
  },
});

export const { setSocketConnected, setSocketDisconnected } = socketSlice.actions;
export default socketSlice.reducer;