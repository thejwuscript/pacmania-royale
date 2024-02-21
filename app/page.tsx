'use client'

import { useState, useEffect } from 'react';
import { socket } from './socket';
import ConnectedUsersList from '@/components/ConnectedUsersList';
import ChatBox from '@/components/ChatBox';
import { Message, User } from '@/types/common';
import Loader from '@/components/Loader';


export default function Home() {
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.connect()

    function onConnect(user: User) {
      setChatMessages(prev => [...prev, { content: `User ${user.name} has connected.` }])
    }

    function onUpdateUserList(users: User[]) {
      setConnectedUsers(users)
    }

    function setCurrentUserData(data: User) {
      setCurrentUser(data)
    }

    function onChatMessage(message: string, username: string) {
      setChatMessages(prev => [...prev, { sender: username, content: message }])
    }

    function onUserDisconnect(user: User) {
      setChatMessages(prev => [...prev, { content: `User ${user.name} has disconnected.` }])
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
    <div className='w-full h-screen grid grid-cols-[3fr_1fr] gap-4 grid-rows-[80px,1fr,minmax(30%,300px)] px-2 py-2'>
      <h1 className='col-span-2 row-span-1 font-retro flex justify-center items-center text-xl'>Game Lobby</h1>
      <div className='row-start-2 row-end-3 col-span-1 p-4'>
        <div>Game Room 1</div>
        <div>Game Room 2</div>
        <div>Game Room 3</div>
      </div>
      <div className="col-span-1 row-start-3 row-end-4">
        <ChatBox messages={chatMessages} currentUser={currentUser} />
      </div>
      <div className="col-start-2 col-span-1 row-span-2 border-2 border-black p-2">
        <ConnectedUsersList connectedUsers={connectedUsers} currentUser={currentUser} />
      </div>
    </div>
  );
}
