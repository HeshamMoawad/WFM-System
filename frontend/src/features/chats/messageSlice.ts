// src/store/socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Contact } from 'whatsapp-web.js';
import { AppMessage } from '../../types/whatsapp';

// Define a custom chat type that includes messages
export interface MessageState {
  messages: AppMessage[];
}

const initialState: MessageState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: 'waMessages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<AppMessage>) => {
      state.messages.push(action.payload);
    },
    updateMessageAck: (state, action: PayloadAction<{ messageId: string; ack: number }>) => {
      const { messageId, ack } = action.payload;
      for (const message of state.messages) {
        if (message.id.id === messageId) {
          message.ack = ack;
          break;
        }
      }
    },
    updateMessageMedia: (state, action: PayloadAction<{ messageId: string; mediaUrl: string }>) => {
      const { messageId, mediaUrl } = action.payload;
      for (const message of state.messages) {
        if (message.id.id === messageId) {
          (message as any).mediaUrl = mediaUrl;
          break;
        }
      }
    },
    setMessagesForChat: (state, action: PayloadAction<{ chatId: string; messages: AppMessage[] }>) => {
      const { chatId, messages } = action.payload;
      const chatIndex = state.messages.findIndex((c) => c.id.remote === chatId);
      if (chatIndex !== -1) {
        state.messages[chatIndex] = messages;
      }
    },
    resetMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;