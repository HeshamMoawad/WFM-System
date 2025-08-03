// src/store/socketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, Contact, Message } from 'whatsapp-web.js';

// Define a custom chat type that includes messages
export interface AppChat extends Chat {
  messages: Message[];
}

export interface ChatState {
  chats: AppChat[];
  contacts: Contact[];
}

const initialState: ChatState = {
  chats: [],
  contacts: [],
};

export const chatSlice = createSlice({
  name: 'waChats',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload.map((chat) => ({
        ...chat,
        messages: [], // Initialize with an empty messages array
      }));
    },
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },
    setChatsAndContacts: (state, action: PayloadAction<{ chats: Chat[]; contacts: Contact[] }>) => {
      state.chats = action.payload.chats.map((chat) => ({
        ...chat,
        messages: [], // Initialize with an empty messages array
      }));
      state.contacts = action.payload.contacts;
    },
    resetChatsAndContacts: (state) => {
      state.chats = [];
      state.contacts = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const chat = state.chats.find((c) => c.id._serialized === message.id.remote);
      if (chat) {
        chat.messages.push(message);
        chat.lastMessage = message;
      }
    },
    updateMessageAck: (state, action: PayloadAction<{ messageId: string; ack: number }>) => {
      const { messageId, ack } = action.payload;
      for (const chat of state.chats) {
        const message = chat.messages.find((m) => m.id.id === messageId);
        if (message) {
          message.ack = ack;
          break;
        }
      }
    },
    updateChat: (state, action: PayloadAction<{ chatId: string; updatedProps: Partial<AppChat> }>) => {
      const { chatId, updatedProps } = action.payload;
      const chatIndex = state.chats.findIndex((c) => c.id._serialized === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex] = { ...state.chats[chatIndex], ...updatedProps };
      }
    },
    updateContact: (state, action: PayloadAction<{ contactId: string; updatedProps: Partial<Contact> }>) => {
      const { contactId, updatedProps } = action.payload;
      const contactIndex = state.contacts.findIndex((c) => c.id._serialized === contactId);
      if (contactIndex !== -1) {
        state.contacts[contactIndex] = { ...state.contacts[contactIndex], ...updatedProps };
      }
    },
    setMessagesForChat: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      const { chatId, messages } = action.payload;
      const chat = state.chats.find((c) => c.id._serialized === chatId);
      if (chat) {
        chat.messages = messages;
      }
    },
    updateMessageMedia: (state, action: PayloadAction<{ messageId: string; mediaUrl: string }>) => {
      const { messageId, mediaUrl } = action.payload;
      for (const chat of state.chats) {
        const message = chat.messages.find((m) => m.id.id === messageId);
        if (message) {
          // You might need to extend the Message type as well if mediaUrl is not a standard property
          (message as any).mediaUrl = mediaUrl;
          break;
        }
      }
    },
  },
});

export const { setChats, setContacts, setChatsAndContacts, resetChatsAndContacts, addMessage, updateMessageAck, updateMessageMedia, setMessagesForChat, updateChat, updateContact } = chatSlice.actions;
export default chatSlice.reducer;