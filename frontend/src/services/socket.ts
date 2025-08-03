// src/services/socket.ts
import { io, Socket } from 'socket.io-client';
const URL = 'http://localhost:96';
// import { BASE_URL_SOCKET } from '../utils/constants';

export let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    const authToken = 'your-auth-token'; // Replace with the actual token

    socket = io(URL, {
      autoConnect: false,
      auth: {
        token: authToken,
      },
      transports: ['websocket'],
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