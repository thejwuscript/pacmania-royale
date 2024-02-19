import { createContext, PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: PropsWithChildren) {
  const socket = io();

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
