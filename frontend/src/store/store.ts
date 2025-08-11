import { configureStore } from '@reduxjs/toolkit'
import socketReducer from '../features/socket/socketSlice';
import chatReducer from '../features/chats/chatSlice';
import qrReducer from '../features/qr/qrSlice';
import myChatsReducer from '../features/mychats/mychatsSlice';
import messageReducer from '../features/chats/messageSlice';

export const store = configureStore({
  reducer: {
    socket:socketReducer,
    chats:chatReducer,
    qr: qrReducer,
    myChats:myChatsReducer,
    messages:messageReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch