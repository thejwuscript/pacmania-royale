import { useEffect } from "react";
import * as Phaser from "phaser";

type GameConfig = Phaser.Types.Core.GameConfig;
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default function Game() {
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

    let player: SpriteWithDynamicBody;
    let cursors: CursorKeys;

    function preload(this: Phaser.Scene) {
      this.load.atlas("pacman-atlas", "/assets/texture_atlas.png", "/assets/spriteatlas.json");
    }

    function create(this: Phaser.Scene) {
      player = this.physics.add.sprite(100, 450, "pacman-atlas", "sprite30");
      player.setCollideWorldBounds(true);

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
        player.setVelocityY(0);
        player.setVelocityX(-160);
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityY(0);
        player.setVelocityX(160);
        player.anims.play("right", true);
      } else if (cursors.up.isDown) {
        player.setVelocityX(0);
        player.setVelocityY(-160);
        player.anims.play("up", true);
      } else if (cursors.down.isDown) {
        player.setVelocityX(0);
        player.setVelocityY(160);
        player.anims.play("down", true);
      } else {
        player.setVelocityX(0);
        player.setVelocityY(0);
      }
    }

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" className="py-4"></div>;
}
