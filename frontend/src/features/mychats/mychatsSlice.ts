// src/store/socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyChat {
    account:string,
    user:string,
    phone:string,
}

export interface ChatState {
    myChats:MyChat[]
}

const initialState: ChatState = {
    myChats:[]
};

export const myChatsSlice = createSlice({
  name: 'myChats',
  initialState,
  reducers: {
    setMyChats: (state, action: PayloadAction<MyChat[]>) => {
      state.myChats = action.payload;
    },
  },
});

export const { setMyChats } = myChatsSlice.actions;
export default myChatsSlice.reducer;