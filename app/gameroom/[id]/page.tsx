'use client';

import { useState, useContext } from 'react';
import type { User } from '@/types/common';
import { SocketContext } from '@/components/SocketProvider';

type Player = User;

export default function Gameroom({ params }: { params: { id: string } }) {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <div>
      Welcome to game room {params.id}
      <h2>Players in this room are:</h2>
      <ul>
        {players.map(player => (
          <li>
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  )
}