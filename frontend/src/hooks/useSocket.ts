import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chat, Contact, Message } from "whatsapp-web.js";
import { AppMessage } from "../types/whatsapp";
import { AppChat, setChats } from '../features/chats/chatSlice';
import { addMessage, setChatsAndContacts, updateChat, updateContact, setMessagesForChat } from '../features/chats/chatSlice';
import { setQrCode } from '../features/qr/qrSlice';
import { initializeSocket, socket, handleNewMessage } from '../services/socket';
import { setSocketConnected, setSocketDisconnected, setSocketError, setLoginSuccess } from '../features/socket/socketSlice';

const useSocket = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const s = initializeSocket();

        const onConnect = () => {
            console.log('socket connected');
            if (s.id) {
                dispatch(setSocketConnected(s.id));
            }
        };

        const onDisconnect = () => {
            console.log('socket disconnected');
            dispatch(setSocketDisconnected());
        };

    const onInit = (data: {success: boolean, chats: Chat[], contacts: Contact[] }) => {
      if (data.success) {
        dispatch(setChatsAndContacts(data));
      } else {
        dispatch(setSocketError({ message: 'Failed to initialize socket', code: 'INIT_FAILED' }));
      }
    };

    const onQr = (qr: string) => {
      dispatch(setQrCode(qr));
    };

    const onNewMessage = (data: any) => {
      console.log('new message received', data);
      const message = handleNewMessage(data);
      if (message) {
        dispatch(addMessage(message as AppMessage));
      } else {
        console.warn('Received invalid message format:', data);
      }
    };

    const handleChatUpdate = (response: { success: boolean, chatId: string, data: any }) => {
      if (response.success) {
        dispatch(updateChat({ chatId: response.chatId, updatedProps: response.data }));
      }
    };

    const handleContactUpdate = (response: { success: boolean, contactId: string, data: any }) => {
      if (response.success) {
        dispatch(updateContact({ contactId: response.contactId, updatedProps: response.data }));
      }
    };

    const onChats = (data: { chats: Chat[], contacts: Contact[] }) => {
      console.log('chats received');
      dispatch(setChatsAndContacts(data));
    };
    const onSyncChats = (data: { chats: Chat[]}) => {
      console.log('sync chats received');
      dispatch(setChats(data.chats));
    };

    const onLoginSuccess = (userId: string) => {
      console.log('login success', userId);
      dispatch(setLoginSuccess(userId));
    };

    const onException = (error: { message: string; code?: string }) => {
      console.error('socket exception', error);
      dispatch(setSocketError({ message: error.message, code: error.code }));
    };

    const onError = (error: any) => {
      console.error('socket error', error);
      dispatch(setSocketError({ message: error.message, code: error.code }));
    };

    const onGetChatMessages = (data: { success: boolean; messages: Message[] }) => {
      if (data.success && data.messages.length > 0) {
        const chatId = data.messages[0].id.remote;
        dispatch(setMessagesForChat({ chatId, messages: data.messages as AppMessage[] }));
      }
    };

    const handleGroupCreate = (response: { success: boolean, group: Chat }) => {
      if (response.success) {
        // Assuming a new chat object is received, we can add it to the list.
        // You might need a specific 'addChat' reducer if the structure is different.
        dispatch(setChatsAndContacts({ chats: [response.group], contacts: [] }));
      }
    };

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('init', onInit);
    s.on('qr', onQr);
    s.on('new_message', onNewMessage);
    s.on('connect_error', onError);
    s.on('connect_timeout', onError);
    s.on('error', onError);
    s.on('exception', onException);
    s.on('success_login', onLoginSuccess);
    s.on('chats', onChats);
    s.on('getChatMessages', onGetChatMessages);
    s.on('sync_chats', onSyncChats);

    // New Listeners
    s.on('muteChat', handleChatUpdate);
    s.on('unmuteChat', handleChatUpdate);
    s.on('markChatAsRead', handleChatUpdate);
    s.on('markChatAsUnread', handleChatUpdate);
    s.on('blockContact', handleContactUpdate);
    s.on('unblockContact', handleContactUpdate);
    s.on('getContactById', handleContactUpdate);
    s.on('createGroup', handleGroupCreate);
    const interval = setInterval(() => {
      s.emit('syncChats');
    }, 15000);
    if (!s.connected) {
      s.connect();
    }

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('init', onInit);
      s.off('qr', onQr);
      s.off('new_message', onNewMessage);
      s.off('connect_error', onError);
      s.off('connect_timeout', onError);
      s.off('error', onError);
      s.off('exception', onException);
      s.off('success_login', onLoginSuccess);
      s.off('chats', onChats);
      s.off('getChatMessages', onGetChatMessages);
      s.off('sync_chats', onSyncChats);

      // Cleanup new listeners
      s.off('muteChat', handleChatUpdate);
      s.off('unmuteChat', handleChatUpdate);
      s.off('markChatAsRead', handleChatUpdate);
      s.off('markChatAsUnread', handleChatUpdate);
      s.off('blockContact', handleContactUpdate);
      s.off('unblockContact', handleContactUpdate);
      s.off('getContactById', handleContactUpdate);
      s.off('createGroup', handleGroupCreate);
      clearInterval(interval);
    };
  }, [dispatch]);

  return socket;
};

export default useSocket;
