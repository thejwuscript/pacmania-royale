'use client'

import { useState, useEffect, useContext } from 'react';
import ConnectedUsersList from '@/components/ConnectedUsersList';
import ChatBox from '@/components/ChatBox';
import { Message, User, Gameroom } from '@/types/common';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import { SocketContext } from '@/components/SocketProvider';
import LobbyGameroomListLayout from '@/components/LobbyGameroomListLayout';
import LobbyGameroomListItem from '@/components/LobbyGameroomListItem';

export default function Home() {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [gamerooms, setGamerooms] = useState<Gameroom[]>([]);

  useEffect(() => {
    function onConnect(user: User) {
      setChatMessages(prev => [{ content: `User ${user.name} has connected.` }, ...prev])
    }

    function onUpdateUserList(users: User[]) {
      setConnectedUsers(users)
    }

    function setCurrentUserData(data: User) {
      setCurrentUser(data)
    }

    function onChatMessage(message: string, username: string) {
      setChatMessages(prev => [{ sender: username, content: message }, ...prev])
    }

    function onUserDisconnect(user: User) {
      setChatMessages(prev => [{ content: `User ${user.name} has disconnected.` }, ...prev])
      setConnectedUsers(connectedUsers.filter(connectedUser => connectedUser.name !== user.name))
    }

    function onGameroomCreated(id: string, maxPlayerCount: number) {
      setGamerooms(gamerooms => [...gamerooms, { id, maxPlayerCount, currentPlayerCount: 0 }])
    }

    function onGameroomPlayerCount(id: string, currentPlayerCount: number) {
      setGamerooms(gamerooms => gamerooms.map(gameroom => {
        if (gameroom.id == id) {
          return {
            ...gameroom,
            currentPlayerCount
          }
        } else {
          return gameroom
        }
      }))
    }

    socket.on("connected", onConnect)
    socket.on("update user list", onUpdateUserList)
    socket.on('current user data', setCurrentUserData)
    socket.on("chat messages", onChatMessage)
    socket.on("disconnected", onUserDisconnect)
    socket.on("gameroom created", onGameroomCreated)
    socket.on("gameroom player count", onGameroomPlayerCount)

    return () => {
      socket.off("connected", onConnect)
      socket.off("update user list", onUpdateUserList)
      socket.off('current user data', setCurrentUserData)
      socket.off("chat messages", onChatMessage)
      socket.off("disconnected", onUserDisconnect)
      socket.off("gameroom created", onGameroomCreated)
      socket.off("gameroom player count", onGameroomPlayerCount)
    }
  }, [])

  useEffect(() => {
    socket.emit("join lobby")
  }, [])

  const handleCreateGameClick = async (e: React.MouseEvent) => {
    const formData = { maxPlayerCount: 2, socketId: socket.id }
    const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKETIO_URL}/gameroom`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json();
    router.push(`/gameroom/${data.id}`)
  }

  if (!currentUser) {
    return <Loader />
  }

  return (
    <div className='w-full h-screen grid grid-cols-[3fr_1fr] gap-4 grid-rows-[80px,1fr,minmax(30%,300px)] px-2 py-2'>
      <h1 className='col-span-2 row-span-1 font-retro flex justify-center items-center text-xl'>Game Lobby</h1>
      <div className='row-start-2 row-end-3 col-span-1 p-4'>
        <button onClick={handleCreateGameClick}>
          Create Game
        </button>
        <LobbyGameroomListLayout>
          {gamerooms.map(gameroom => (
            <LobbyGameroomListItem key={gameroom.id} {...gameroom} />
          ))}
        </LobbyGameroomListLayout>
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
