'use client';

import { createContext, ReactNode, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO_URL, {
  autoConnect: false
})

export const SocketContext = createContext(socket);


export default function SocketProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}