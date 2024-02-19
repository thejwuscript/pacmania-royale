'use client'

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ConnectedUsersList from '@/components/ConnectedUsersList';
import ChatBox from '@/components/ChatBox';
import { ConnectedUser } from '@/types/common';


export default function Home() {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [myUser, setMyUser] = useState<ConnectedUser | null>(null);
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKETIO_URL);

    // socket.on('connect', () => {
    //   const socketId = socket.id;
    //   console.log("Socket ID:", socketId);
    // });

    socket.on("user connected", user => {
      setChatMessages(prev => [...prev, `User ${user.name} has connected.`])
    })

    socket.on("connected users", users => {
      setConnectedUsers(users)
    })

    socket.on('my user data', myUserData => {
      setMyUser(myUserData);
    })

    socket.on("chat messages", message => {
      setChatMessages(prev => [...prev, message])
    })

    socket.on("user disconnected", user => {
      setChatMessages(prev => [...prev, `User ${user.name} has disconnected.`])
      setConnectedUsers(connectedUsers.filter(connectedUser => connectedUser.name !== user.name))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>
      <h1>Game Lobby</h1>
      {myUser && <ConnectedUsersList connectedUsers={connectedUsers} myUser={myUser} />}
      <ChatBox messages={chatMessages} />
    </div>
  );
}
