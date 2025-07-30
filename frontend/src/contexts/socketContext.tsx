// import { createContext, useContext, useEffect, useCallback, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { BASE_URL_SOCKET } from '../utils/constants';
// import { Chat, Message } from 'whatsapp-web.js';

// interface SocketContextType {
//   socket: Socket | null;
//   isConnected: boolean;
//   chats:Chat[]
//   currentChat:Chat | null
//   messages:Message[]
//   getChatMessages: (chatId: string) => void;
// }

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
//   chats:[],
//   currentChat:null,
//   messages:[],
//   getChatMessages: () => {}
// });


// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [chats,setChats]  = useState<Chat[]>([])
//   const [currentChat,setCurrentChat] = useState<Chat | null>(null)
//   const [messages,setMessages] = useState<Message[]>([])
//   const getChatMessages = useCallback((chatId:string) => {
//     if (!socket) return;
//     socket.emit("getChatMessages", { chatId });
//   },[socket]);
//   const socketInstance = io(BASE_URL_SOCKET,{
//     retries: 3,
//     timeout: 10000,
//     path: '',
//     transports: ['websocket'], // Force WebSocket only
//     reconnectionAttempts: 3,
//     // withCredentials: true,
//     // forceNew: true, // Create new connection each time
//     // upgrade: false // Disable protocol upgrade
//   });
//   socketInstance.connect();

//   useEffect(() => {
//     // Connect to your server
//     socketInstance.on('connect', () => {
//       setIsConnected(true);
//       socketInstance.emit("init",{phone:"+201554071240",name:"Nabd"})
//       console.log("Connected to server");
//       socketInstance.emit("getChatMessages", { chatId: "+201554071240" });

//     });
//     socketInstance.on('connection_success', (data) => {
//       console.log("Socket connection_success:", data);
//     });
//     socketInstance.on('qr', (data) => {
//       console.log("Socket qr:", data);
//     });
//     socketInstance.on('new_message', (data) => {
//       console.log("Socket new_message:", data);
//     });
//     socketInstance.on('closed_connection', (data) => {
//       console.log("Socket closed_connection:", data);
//     });
//     socketInstance.on('disconnect', () => {
//       setIsConnected(false);
//       console.log("Disconnected from server");
//     });
//     socketInstance.on('init', ({success, chats , contacts}) => {
//       // console.log("Socket init:", success);
//       setChats(chats)
//     });
//     socketInstance.on("getChatMessages", (data) => {
//       console.log("getChatMessages", data);
//       setMessages(data.message)

//     });
//     // Cleanup on unmount
//     return () => {
//       socketInstance.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ socket, isConnected , chats , currentChat , messages , getChatMessages }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

export {}