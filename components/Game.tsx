import { useEffect, useRef, useContext } from "react";
import * as Phaser from "phaser";
import { Player } from "@/app/gameroom/[id]/page";
import { SocketContext } from "./SocketProvider";

type GameConfig = Phaser.Types.Core.GameConfig;
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

interface GameProps {
  players: Player[];
  gameroomId: string;
}

export default function Game({ players, gameroomId }: GameProps) {
  const socket = useContext(SocketContext);
  const [playerOne, playerTwo] = players;
  const playersRef = useRef({
    [playerOne.id]: {
      id: playerOne.id,
      name: playerOne.name,
      position: null,
      orientation: null,
      sprite: null,
    },
    [playerTwo.id]: {
      id: playerTwo.id,
      name: playerTwo.name,
      position: null,
      orientation: null,
      sprite: null,
    },
  });

  useEffect(() => {
    const config: GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    let cursors: CursorKeys;

    function preload(this: Phaser.Scene) {
      this.load.atlas("pacman-atlas", "/assets/texture_atlas.png", "/assets/spriteatlas.json");
    }

    function onCurrentPlayers(scene: Phaser.Scene, players: any) {
      Object.keys(players).forEach((id) => {
        const sprite = scene.physics.add.sprite(
          players[id].position.x,
          players[id].position.y,
          "pacman-atlas",
          players[id].orientation === "right" ? "sprite30" : "sprite134"
        );
        sprite.setCollideWorldBounds(true);
        players[id].sprite = sprite;
      });
      playersRef.current = players;
    }

    function onPlayerMoved(player: any) {
      playersRef.current[player.id].sprite!.x = player.position.x;
      playersRef.current[player.id].sprite!.y = player.position.y;
    }

    function create(this: Phaser.Scene) {
      socket.emit("get initial positions", gameroomId, (players: any) => {
        onCurrentPlayers(this, players);
      });

      socket.on("player moved", (player) => onPlayerMoved(player));

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNames("pacman-atlas", {
          prefix: "sprite",
          frames: [117, 134, 144],
        }),
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNames("pacman-atlas", {
          prefix: "sprite",
          frames: [14, 30, 45],
        }),
      });

      this.anims.create({
        key: "up",
        frames: this.anims.generateFrameNames("pacman-atlas", {
          prefix: "sprite",
          frames: [154, 161, 178],
        }),
      });

      this.anims.create({
        key: "down",
        frames: this.anims.generateFrameNames("pacman-atlas", {
          prefix: "sprite",
          frames: [60, 76, 98],
        }),
      });
    }

    function update(this: Phaser.Scene) {
      cursors = this.input.keyboard!.createCursorKeys();
      const playerMeSprite = playersRef.current[socket.id!].sprite as any;
      if (!playerMeSprite) return;

      if (cursors.left.isDown) {
        playerMeSprite.setVelocityY(0);
        playerMeSprite.setVelocityX(-160);
        playerMeSprite.anims.play("left", true);
      } else if (cursors.right.isDown) {
        playerMeSprite.setVelocityY(0);
        playerMeSprite.setVelocityX(160);
        playerMeSprite.anims.play("right", true);
      } else if (cursors.up.isDown) {
        playerMeSprite.setVelocityX(0);
        playerMeSprite.setVelocityY(-160);
        playerMeSprite.anims.play("up", true);
      } else if (cursors.down.isDown) {
        playerMeSprite.setVelocityX(0);
        playerMeSprite.setVelocityY(160);
        playerMeSprite.anims.play("down", true);
      } else {
        playerMeSprite.setVelocityX(0);
        playerMeSprite.setVelocityY(0);
      }

      const prevPosition = playersRef.current[socket.id!].position as any;
      if (prevPosition && (prevPosition.x !== playerMeSprite.x || prevPosition.y !== playerMeSprite.y)) {
        socket.emit("player movement", gameroomId, socket.id, { x: playerMeSprite.x, y: playerMeSprite.y });
        prevPosition.x = playerMeSprite.x;
        prevPosition.y = playerMeSprite.y;
      }
    }

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
      socket.off("current players");
    };
  }, []);

  return <div id="game-container" className="py-4"></div>;
}
