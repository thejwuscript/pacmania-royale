'use client';

import { useState, useContext, useEffect } from 'react';
import type { User } from '@/types/common';
import { SocketContext } from '@/components/SocketProvider';

type Player = User;

export default function Gameroom({ params }: { params: { id: string } }) {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    function onPlayersJoined(players: Player[]) {
      setPlayers(players)
    }

    socket.emit("join gameroom", params.id)
    socket.on("players joined", onPlayersJoined)

    return () => {
      socket.off("players joined", onPlayersJoined)
    }
  }, [])

  return (
    <div>
      Welcome to game room {params.id}
      <h2>Players in this room are:</h2>
      <ul>
        {players.map(player => (
          <li key={params.id}>
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  )
}