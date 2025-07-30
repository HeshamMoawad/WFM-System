import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_URL_SOCKET } from '../utils/constants';
import { Chat } from 'whatsapp-web.js';



type SocketEventHandlers = {
  [event: string]: (data: any) => void;
};
type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
    chats: Chat[];
    on: (event: string, handler: (data: any) => void) => void;
    off: (event: string) => void;
    emit: (event: string, data?: any) => void;
    // currentChat: Chat | null;
    // setCurrentChat: (chat: Chat | null) => void;
};
let socket: Socket | null = null;

export const useSocket = (): SocketContextType => {
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [eventHandlers, setEventHandlers] = useState<SocketEventHandlers>({});
  // const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  // Initialize socket connection
  useEffect(() => {
    socket = io(BASE_URL_SOCKET, {
      retries: 3,
      timeout: 10000,
      transports: ['websocket'],
      reconnectionAttempts: 3,
    });


    // socket = socketInstance;

    // Basic connection events
    socket?.on('connect', () => {
      setIsConnected(true);
      socket?.emit("init", { phone: "+201554071240", name: "Nabd" });
    });

    socket?.on('disconnect', () => {
      setIsConnected(false);
    });

    // Default event handlers
    socket?.on('connection_success', (data) => {
      console.log("Socket connection_success:", data);
    });

    socket?.on('init', ({ success, chats }) => {
      setChats(chats);
    });

    // Cleanup on unmount
    return () => {
      socket?.disconnect();
    };
  }, []);

  // Register event handlers dynamically
  useEffect(() => {
    if (!socket) return;

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket?.on(event, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket?.off(event, handler);
      });
    };
  }, [socket, eventHandlers]);

  // Method to register new event handlers
  const on = useCallback((event: string, handler: (data: any) => void) => {
    setEventHandlers(prev => ({ ...prev, [event]: handler }));
  }, []);

  // Method to unregister event handlers
  const off = useCallback((event: string) => {
    setEventHandlers(prev => {
      const newHandlers = { ...prev };
      delete newHandlers[event];
      return newHandlers;
    });
  }, []);

  // Method to emit events
  const emit = useCallback((event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected - cannot emit event');
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    chats,
    on,
    off,
    emit,
    // currentChat,
    // setCurrentChat ,
  };
};