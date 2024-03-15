"use client";

import { useState, useContext, useEffect } from "react";
import type { User } from "@/types/common";
import { SocketContext } from "@/components/SocketProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Game from "@/components/Game/index";

export type Player = User & {
  color: string;
  score: number;
  sprite: Phaser.Physics.Arcade.Sprite;
  position: { x: number; y: number };
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

  const host = socket.id === hostId;
  const roomFull = players.length === 2;

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
    const onPlayerLeft = (name: string) => {
      if (gameStarted) {
        setError({ message: "Your opponent has left the game." });
      } else {
        setPlayers(players.filter((player) => player.name !== name));
      }
    };
    socket.on("player left", onPlayerLeft);

    return () => {
      socket.off("player left", onPlayerLeft);
    };
  }, [players, gameStarted]);

  useEffect(() => {
    const onPlayersJoined = (players: Player[], hostId: string) => {
      setPlayers(players);
      setHostId(hostId);
    };

    const onHostLeft = () => {
      setError({ message: "The host has left the room." });
      socket.emit("leave gameroom", params.id);
    };

    socket.on("players joined", onPlayersJoined);
    socket.on("host left", onHostLeft);

    return () => {
      socket.off("players joined", onPlayersJoined);
      socket.off("host left", onHostLeft);
    };
  }, []);

  const handleStartGameClick = () => {
    socket.emit("game start", params.id);
  };

  return (
    <div className="px-2 pt-4">
      <Link href="/" className="flex items-center gap-1 p-2">
        <span className="text-2xl">&#129044;</span>
        <span className="hover:underline underline-offset-2">Back</span>
      </Link>
      <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-8">Game Room #{params.id}</h1>
      <h2 className="underline underline-offset-1 font-semibold text-gray-900 text-xl my-4">Players</h2>
      <ul className="flex flex-col gap-1 mb-5">
        {players.map((player, index) => (
          <li key={index} className="flex items-center gap-2">
            {player.id === socket.id ? <b>{player.name}</b> : player.name} {player.id === hostId && <span>(Host)</span>}{" "}
            <span
              className="inline-block w-4 h-4 border border-black"
              style={{ backgroundColor: player.color.replace("0x", "#") }}
            ></span>
          </li>
        ))}
      </ul>
      {roomFull && host && !gameStarted && (
        <Button className="text-lg" onClick={handleStartGameClick}>
          Start Game
        </Button>
      )}
      {roomFull && !host && !gameStarted && <span>Waiting for the host to start the game...</span>}
      {gameStarted && !error && <Game players={players} gameroomId={params.id} hostId={hostId} />}
      {error && (
        <div className="fixed top-0 left-0 w-full h-full backdrop-filter backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-md p-5 shadow-md flex flex-col justify-center items-center text-lg">
            <p className="p-2 text-lg">{error.message}</p>
            <Link className="text-lg" href="/">
              <Button className="text-lg">Return to Lobby</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
