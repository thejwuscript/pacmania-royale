import { createContext, ReactNode } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO_URL, {
  autoConnect: false
})

const SocketContext = createContext(socket);

export default function SocketProvider({ children }: { children: ReactNode }) {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}