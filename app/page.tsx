'use client'

import { useState, useEffect } from 'react';
import { socket } from './socket';
import ConnectedUsersList from '@/components/ConnectedUsersList';
import ChatBox from '@/components/ChatBox';
import { User } from '@/types/common';
import Loader from '@/components/Loader';


export default function Home() {
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.connect()

    function onConnect(user: User) {
      setChatMessages(prev => [...prev, `User ${user.name} has connected.`])
    }

    function onUpdateUserList(users: User[]) {
      setConnectedUsers(users)
    }

    function setCurrentUserData(data: User) {
      setCurrentUser(data)
    }

    function onChatMessage(message: string) {
      setChatMessages(prev => [...prev, message])
    }

    function onUserDisconnect(user: User) {
      setChatMessages(prev => [...prev, `User ${user.name} has disconnected.`])
      setConnectedUsers(connectedUsers.filter(connectedUser => connectedUser.name !== user.name))
    }

    socket.on("connected", onConnect)
    socket.on("update user list", onUpdateUserList)
    socket.on('current user data', setCurrentUserData)
    socket.on("chat messages", onChatMessage)
    socket.on("disconnected", onUserDisconnect)

    return () => {
      socket.off("connected", onConnect)
      socket.off("update user list", onUpdateUserList)
      socket.off('current user data', setCurrentUserData)
      socket.off("chat messages", onChatMessage)
      socket.off("disconnected", onUserDisconnect)
      socket.disconnect()
    }
  }, [])

  if (!currentUser) {
    return <Loader />
  }

  return (
    <div>
      <h1>Game Lobby</h1>
      <ConnectedUsersList connectedUsers={connectedUsers} currentUser={currentUser} />
      <ChatBox messages={chatMessages} currentUser={currentUser} />
    </div>
  );
}
