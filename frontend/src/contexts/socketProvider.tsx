import { createContext, useContext } from 'react';
import { useSocket as useSocketHook } from '../hooks/useSocket';

const SocketContext = createContext<ReturnType<typeof useSocketHook> | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocketHook();

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};