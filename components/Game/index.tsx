import { useEffect, useRef, useContext } from "react";
import * as Phaser from "phaser";
import { Player } from "@/app/gameroom/[id]/page";
import { SocketContext } from "../SocketProvider";
import StartGame from "./main";

type GameConfig = Phaser.Types.Core.GameConfig;
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
type Tile = Phaser.Tilemaps.Tile;

interface GameProps {
  players: Player[];
  gameroomId: string;
  hostId: string;
}

export default function Game({ players, gameroomId, hostId }: GameProps) {
  const socket = useContext(SocketContext);
  const [playerOne, playerTwo] = players;
  const playersRef = useRef({
    [playerOne.id]: {
      id: playerOne.id,
      name: playerOne.name,
      position: null,
      orientation: null,
      sprite: null,
      nameText: null,
    },
    [playerTwo.id]: {
      id: playerTwo.id,
      name: playerTwo.name,
      position: null,
      orientation: null,
      sprite: null,
      nameText: null,
    },
  });

  useEffect(() => {
    const game = StartGame();
    game.scene.start("Preloader", { players, gameroomId, hostId });

    return () => {
      game.destroy(true, false);
    };
  }, []);

  return <div id="game-container" className="py-4"></div>;
}
