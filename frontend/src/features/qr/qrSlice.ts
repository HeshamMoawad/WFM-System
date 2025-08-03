// src/features/qr/qrSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QrState {
  qrCode: string | null;
}

const initialState: QrState = {
  qrCode: null,
};

export const qrSlice = createSlice({
  name: 'qr',
  initialState,
  reducers: {
    setQrCode: (state, action: PayloadAction<string | null>) => {
      state.qrCode = action.payload;
    },
    clearQrCode: (state) => {
      state.qrCode = null;
    },
  },
});

export const { setQrCode, clearQrCode } = qrSlice.actions;
export default qrSlice.reducer;
