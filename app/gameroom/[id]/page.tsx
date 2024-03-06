"use client";

import { useState, useContext, useEffect } from "react";
import type { User } from "@/types/common";
import { SocketContext } from "@/components/SocketProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Player = User;

export default function Gameroom({ params }: { params: { id: string } }) {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const [hostPresent, setHostPresent] = useState(true);

  useEffect(() => {
    const onPlayersJoined = (players: Player[]) => {
      setPlayers(players);
    };

    const onHostLeft = () => {
      setHostPresent(false);
    };

    const onPlayerLeft = (name: string) => {
      setPlayers(players.filter((player) => player.name !== name));
    };

    socket.emit("join gameroom", params.id, 2, (err: Error) => {
      console.error(err.message);
    });
    socket.on("players joined", onPlayersJoined);
    socket.on("host left", onHostLeft);
    socket.on("player left", onPlayerLeft);

    return () => {
      // socket.emit("leave gameroom", params.id);
      socket.off("players joined", onPlayersJoined);
      socket.off("host left", onHostLeft);
      socket.off("player left", onPlayerLeft);
    };
  }, [players, hostPresent]);

  return (
    <div>
      <h1>Welcome to game room {params.id}</h1>
      <h2>Players in this room are:</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player.name}</li>
        ))}
      </ul>
      {!hostPresent && (
        <div className="fixed top-0 left-0 w-full h-full backdrop-filter backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-md p-5 shadow-md flex flex-col justify-center items-center text-lg">
            <p className="p-2 text-lg">The host has left the room.</p>
            <Link href="/">
              <Button className="text-lg">Return to Lobby</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
