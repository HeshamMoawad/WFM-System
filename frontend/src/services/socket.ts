// src/services/socket.ts
import { io, Socket } from 'socket.io-client';
import { Message } from 'whatsapp-web.js';

export interface SocketMessage {
  event: string;
  data: any;
}

const URL = 'http://localhost:96';

export let socket: Socket | null = null;

// Parse Socket.IO binary event format (e.g., '42["event", {...}]')
const parseSocketMessage = (rawMessage: string): SocketMessage | null => {
  try {
    // Remove the prefix (e.g., '42' which is the message type for event)
    const jsonStr = rawMessage.substring(rawMessage.indexOf('['));
    const [event, data] = JSON.parse(jsonStr);
    return { event, data };
  } catch (error) {
    console.error('Error parsing socket message:', error);
    return null;
  }
};

export const initializeSocket = (): Socket => {
  if (!socket) {
    const authToken = JSON.parse(localStorage.getItem('Auth') || '{}')?.uuid;

    socket = io(URL, {
      autoConnect: false,
      transports: ['websocket'],
    });

    // Handle raw message to parse the Socket.IO format
    socket.on('message', (rawMessage: string) => {
      const parsedMessage = parseSocketMessage(rawMessage);
      if (parsedMessage) {
        // Emit the parsed event
        socket?.emit(parsedMessage.event, parsedMessage.data);
      }
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Helper function to handle new messages in the expected format
export const handleNewMessage = (data: any): Message | null => {
  try {
    if (Array.isArray(data) && data.length > 0) {
      const messageData = data[0];
      // Transform the data to match the Message interface
      return {
        ...messageData,
        _data: messageData._data || {},
        id: messageData.id || {},
        timestamp: messageData.timestamp || Date.now(),
        fromMe: messageData.fromMe || false,
        hasMedia: messageData.hasMedia || false,
        isForwarded: messageData.isForwarded || false,
        isStatus: messageData.isStatus || false,
        isStarred: messageData.isStarred || false,
        from: messageData.from || '',
        to: messageData.to || '',
        body: messageData.body || '',
        type: messageData.type || 'chat',
        vCards: messageData.vCards || [],
        mentionedIds: messageData.mentionedIds || [],
        groupMentions: messageData.groupMentions || [],
        links: messageData.links || [],
      } as unknown as Message;
    }
    return null;
  } catch (error) {
    console.error('Error processing new message:', error);
    return null;
  }
};