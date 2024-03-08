import { useEffect } from "react";
import * as Phaser from "phaser";
import { Player } from "@/app/gameroom/[id]/page";
import { Socket } from "socket.io-client";

type GameConfig = Phaser.Types.Core.GameConfig;
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

interface GameProps {
  players: Player[];
  socket: Socket;
}

export default function Game({ players, socket }: GameProps) {
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

    let playerOne: SpriteWithDynamicBody;
    let playerTwo: SpriteWithDynamicBody;
    let cursors: CursorKeys;

    function preload(this: Phaser.Scene) {
      this.load.atlas("pacman-atlas", "/assets/texture_atlas.png", "/assets/spriteatlas.json");
    }

    function create(this: Phaser.Scene) {
      //add players here
      playerOne = this.physics.add.sprite(100, 450, "pacman-atlas", "sprite30");
      playerTwo = this.physics.add.sprite(700, 150, "pacman-atlas", "sprite30");
      playerOne.setCollideWorldBounds(true);
      playerTwo.setCollideWorldBounds(true);

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

      if (cursors.left.isDown) {
        playerOne.setVelocityY(0);
        playerOne.setVelocityX(-160);
        playerOne.anims.play("left", true);
      } else if (cursors.right.isDown) {
        playerOne.setVelocityY(0);
        playerOne.setVelocityX(160);
        playerOne.anims.play("right", true);
      } else if (cursors.up.isDown) {
        playerOne.setVelocityX(0);
        playerOne.setVelocityY(-160);
        playerOne.anims.play("up", true);
      } else if (cursors.down.isDown) {
        playerOne.setVelocityX(0);
        playerOne.setVelocityY(160);
        playerOne.anims.play("down", true);
      } else {
        playerOne.setVelocityX(0);
        playerOne.setVelocityY(0);
      }
    }

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" className="py-4"></div>;
}
