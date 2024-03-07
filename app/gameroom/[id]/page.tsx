"use client";

import { useState, useContext, useEffect } from "react";
import type { User } from "@/types/common";
import { SocketContext } from "@/components/SocketProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Player = User;

interface AppError {
  message: string;
}

export default function Gameroom({ params }: { params: { id: string } }) {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState<Player[]>([]);
  // const [hostPresent, setHostPresent] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    socket.emit("join gameroom", params.id, 2, (err: Error) => {
      setError({ message: err.message });
    });
  }, []);

  useEffect(() => {
    const onPlayersJoined = (players: Player[]) => {
      setPlayers(players);
    };

    const onHostLeft = () => {
      // setHostPresent(false);
      setError({ message: "The host has left the room." });
    };

    const onPlayerLeft = (name: string) => {
      setPlayers(players.filter((player) => player.name !== name));
    };

    socket.on("players joined", onPlayersJoined);
    socket.on("host left", onHostLeft);
    socket.on("player left", onPlayerLeft);

    return () => {
      // socket.emit("leave gameroom", params.id);
      socket.off("players joined", onPlayersJoined);
      socket.off("host left", onHostLeft);
      socket.off("player left", onPlayerLeft);
    };
  }, [players]);

  return (
    <div className="px-2">
      <h1 className="text-4xl font-bold text-gray-900 my-8">Game Room #{params.id}</h1>
      <h2 className="underline underline-offset-1 font-semibold text-gray-900 text-xl my-4">Players</h2>
      <ul className="flex flex-col gap-1">
        {players.map((player, index) => (
          <li key={index}>{player.name}</li>
        ))}
      </ul>
      {error && (
        <div className="fixed top-0 left-0 w-full h-full backdrop-filter backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-md p-5 shadow-md flex flex-col justify-center items-center text-lg">
            <p className="p-2 text-lg">{error.message}</p>
            <Link href="/">
              <Button className="text-lg">Return to Lobby</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
