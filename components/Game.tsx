import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { Player } from "@/app/gameroom/[id]/page";
import { Socket } from "socket.io-client";

type GameConfig = Phaser.Types.Core.GameConfig;
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

interface GameProps {
  players: Player[];
  socket: Socket;
  gameroomId: string;
}

export default function Game({ players, socket, gameroomId }: GameProps) {
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

    // function onPlayerMoved(players: any) {
    //   playersRef.current = players;
    // }

    function create(this: Phaser.Scene) {
      socket.emit("get initial positions", gameroomId, (players: any) => {
        onCurrentPlayers(this, players);
      });

      // socket.on("player moved", (players) => onPlayerMoved(players));

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
    }

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
      socket.off("current players");
    };
  }, []);

  return <div id="game-container" className="py-4"></div>;
}
