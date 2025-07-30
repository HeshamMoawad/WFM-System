// import { io, Socket } from 'socket.io-client';
// import { BASE_URL_SOCKET } from '../utils/constants';

// let socket: Socket | null = null;

// export const getSocket = (): Socket => {
//   if (!socket) {
//     socket = io(BASE_URL_SOCKET, {
//       retries: 3,
//       timeout: 10000,
//       transports: ['websocket'],
//       reconnectionAttempts: 3,
//     });
//   }

//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };
export {};