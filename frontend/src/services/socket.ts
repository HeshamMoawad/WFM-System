// src/services/socket.ts
import { io, Socket } from 'socket.io-client';
import { Message } from 'whatsapp-web.js';
import { BASE_URL_SOCKET } from '../utils/constants'
import { toast } from 'sonner';

export interface SocketMessage {
  event: string;
  data: any;
}

const URL = BASE_URL_SOCKET;

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

    // Listen for new message events and show notification
    socket.on('newMessage', (data: any) => {
      // Handle the new message notification
      handleNewMessageNotification(data);
    });

    // Listen for chat archive/unarchive events
    socket.on('chatArchived', (data: any) => {
      console.log('Chat archived:', data);
      // Optionally show a notification when a chat is archived
      if (data.chatId) {
        toast.info('Chat archived', {
          description: 'A chat has been moved to archived chats',
          duration: 3000,
          position: 'top-right',

        });
      }
    });

    socket.on('chatUnarchived', (data: any) => {
      console.log('Chat unarchived:', data);
      // Optionally show a notification when a chat is unarchived
      if (data.chatId) {
        toast.success('Chat unarchived', {
          description: 'A chat has been moved from archived to active chats',
          duration: 3000,
          position: 'top-right',
        });
      }
    });

    // Listen for other notification events if needed
    socket.on('notification', (data: any) => {
      handleSocketNotification(data);
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

// Function to play notification sound
const playNotificationSound = () => {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 800; // 800Hz frequency
    gainNode.gain.value = 0.3; // 30% volume

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 200); // 200ms beep duration
  } catch (error) {
    console.warn('Could not play notification sound:', error);
    // Fallback: try to play an audio file if Web Audio is not supported
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(err => console.warn('Audio play failed:', err));
    } catch (fallbackError) {
      console.warn('Audio fallback also failed:', fallbackError);
    }
  }
};

// Function to handle new message notifications
export const handleNewMessageNotification = (data: any) => {
  try {
    const message = handleNewMessage(data);
    console.log('New message received', message);
    if (message) {
      // Play notification sound
      playNotificationSound();

      // Show toast notification
      toast.info(`New message from ${message.from.replace('@c.us', '')}`, {
        description: message.body.length > 100 ? `${message.body.substring(0, 100)}...` : message.body,
        duration: 5000,
        position: 'top-right',
      });

      // Also show browser notification if permission is granted
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('New Message', {
            body: `From: ${message.from.replace('@c.us', '')}\n${message.body.length > 50 ? message.body.substring(0, 50) + '...' : message.body}`,
            icon: '/logo192.png', // Use your app logo
            tag: 'new-message'
          });
        } else if (Notification.permission === 'default') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('New Message', {
                body: `From: ${message.from.replace('@c.us', '')}\n${message.body.length > 50 ? message.body.substring(0, 50) + '...' : message.body}`,
                icon: '/logo192.png',
                tag: 'new-message'
              });
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error handling new message notification:', error);
  }
};

// Function to handle general socket notifications
export const handleSocketNotification = (data: any) => {
  try {
    const { title, message, type = 'info', duration = 5000 } = data;
    playNotificationSound(); // Play sound for all notifications

    switch (type) {
      case 'success':
        toast.success(title || 'Success', {
          description: message,
          duration,
          position: 'top-right',
        });
        break;
      case 'error':
        toast.error(title || 'Error', {
          description: message,
          duration,
          position: 'top-right',
        });
        break;
      case 'warning':
        toast.warning(title || 'Warning', {
          description: message,
          duration,
          position: 'top-right',
        });
        break;
      default:
        toast.info(title || 'Notification', {
          description: message,
          duration,
          position: 'top-right',
        });
    }

    // Show browser notification as well
    if ('Notification' in window && message) {
      if (Notification.permission === 'granted') {
        new Notification(title || 'Notification', {
          body: message,
          icon: '/logo192.png',
          tag: 'socket-notification'
        });
      }
    }
  } catch (error) {
    console.error('Error handling socket notification:', error);
  }
};

// Helper function to handle new messages in the expected format
export const handleNewMessage = (data: any): Message | null => {
  try {
    if (data) {
      // const messageData = data[0];
      // // Transform the data to match the Message interface
      // return {
      //   ...messageData,
      //   _data: messageData._data || {},
      //   id: messageData.id || {},
      //   timestamp: messageData.timestamp || Date.now(),
      //   fromMe: messageData.fromMe || false,
      //   hasMedia: messageData.hasMedia || false,
      //   isForwarded: messageData.isForwarded || false,
      //   isStatus: messageData.isStatus || false,
      //   isStarred: messageData.isStarred || false,
      //   from: messageData.from || '',
      //   to: messageData.to || '',
      //   body: messageData.body || '',
      //   type: messageData.type || 'chat',
      //   vCards: messageData.vCards || [],
      //   mentionedIds: messageData.mentionedIds || [],
      //   groupMentions: messageData.groupMentions || [],
      //   links: messageData.links || [],
      // } as unknown as Message;
    }
    return data?.message;
  } catch (error) {
    console.error('Error processing new message:', error);
    return null;
  }
};