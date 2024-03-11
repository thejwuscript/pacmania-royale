"use client";

import { useState, useContext, useEffect } from "react";
import type { User } from "@/types/common";
import { SocketContext } from "@/components/SocketProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Game from "@/components/Game";

export type Player = User & {
  color: string;
};

interface AppError {
  message: string;
}

export default function Gameroom({ params }: { params: { id: string } }) {
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState<Player[]>([]);
  const [hostId, setHostId] = useState("");
  const [error, setError] = useState<AppError | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    socket.emit("join gameroom", params.id, (err: Error) => {
      setError({ message: err.message });
    });
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      socket.emit("leave gameroom", params.id);
    });
  }, [hostId]);

  useEffect(() => {
    function onStartGame() {
      setGameStarted(true);
    }
    socket.on("start game", onStartGame);

    return () => {
      socket.off("start game", onStartGame);
    };
  }, []);

  useEffect(() => {
    const onPlayersJoined = (players: Player[], hostId: string) => {
      setPlayers(players);
      setHostId(hostId);
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
      socket.off("players joined", onPlayersJoined);
      socket.off("host left", onHostLeft);
      socket.off("player left", onPlayerLeft);
    };
  }, [players]);

  const handleStartGameClick = () => {
    socket.emit("game start", params.id);
  };

  return (
    <div className="px-2">
      <h1 className="text-4xl font-bold text-gray-900 my-8">Game Room #{params.id}</h1>
      <h2 className="underline underline-offset-1 font-semibold text-gray-900 text-xl my-4">Players</h2>
      <ul className="flex flex-col gap-1">
        {players.map((player, index) => (
          <li key={index}>
            {player.name}{" "}
            <span className="inline-block w-3 h-3" style={{ backgroundColor: player.color.replace("0x", "#") }}></span>{" "}
            {player.id === hostId && <span>Host</span>}
          </li>
        ))}
      </ul>
      {players.length >= 2 && (
        <Button className="text-lg" onClick={handleStartGameClick}>
          Start Game
        </Button>
      )}
      {gameStarted && <Game players={players} gameroomId={params.id} />}
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
