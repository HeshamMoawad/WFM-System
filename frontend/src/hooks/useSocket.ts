import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Chat, Contact, Message } from 'whatsapp-web.js';
import { addMessage, setChatsAndContacts, updateChat, updateContact } from '../features/chats/chatSlice';
import { setQrCode } from '../features/qr/qrSlice';
import { initializeSocket, socket } from '../services/socket';
import { setSocketConnected, setSocketDisconnected } from '../features/socket/socketSlice';

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

    const onInit = (data: { chats: Chat[], contacts: Contact[] }) => {
      dispatch(setChatsAndContacts(data));
    };

    const onQr = (qr: string) => {
      dispatch(setQrCode(qr));
    };

    const onNewMessage = (message: Message) => {
      dispatch(addMessage(message));
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

    // New Listeners
    s.on('muteChat', handleChatUpdate);
    s.on('unmuteChat', handleChatUpdate);
    s.on('markChatAsRead', handleChatUpdate);
    s.on('markChatAsUnread', handleChatUpdate);
    s.on('blockContact', handleContactUpdate);
    s.on('unblockContact', handleContactUpdate);
    s.on('getContactById', handleContactUpdate);
    s.on('createGroup', handleGroupCreate);

    if (!s.connected) {
      s.connect();
    }

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('init', onInit);
      s.off('qr', onQr);
      s.off('new_message', onNewMessage);

      // Cleanup new listeners
      s.off('muteChat', handleChatUpdate);
      s.off('unmuteChat', handleChatUpdate);
      s.off('markChatAsRead', handleChatUpdate);
      s.off('markChatAsUnread', handleChatUpdate);
      s.off('blockContact', handleContactUpdate);
      s.off('unblockContact', handleContactUpdate);
      s.off('getContactById', handleContactUpdate);
      s.off('createGroup', handleGroupCreate);
    };
  }, [dispatch]);

  return socket;
};

export default useSocket;
