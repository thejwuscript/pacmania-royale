import { useEffect } from "react";
import * as Phaser from "phaser";

export default function Game() {
  useEffect(() => {
    // class Example extends Phaser.Scene {
    //   preload() {
    //     this.load.setBaseURL("https://labs.phaser.io");

    //     this.load.image("sky", "assets/skies/space3.png");
    //     this.load.image("logo", "assets/sprites/phaser3-logo.png");
    //     this.load.image("red", "assets/particles/red.png");
    //   }

    //   create() {
    //     this.add.image(400, 300, "sky");

    //     const particles = this.add.particles(0, 0, "red", {
    //       speed: 100,
    //       scale: { start: 1, end: 0 },
    //       blendMode: "ADD",
    //     });

    //     const logo = this.physics.add.image(400, 100, "logo");

    //     logo.setVelocity(100, 200);
    //     logo.setBounce(1, 1);
    //     logo.setCollideWorldBounds(true);

    //     particles.startFollow(logo);
    //   }
    // }

    const config = {
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

    let player;
    let cursors;

    function preload(this: Phaser.Scene) {
      this.load.atlas('pacman-atlas', '/assets/texture_atlas.png', '/assets/spriteatlas.json');
    }

    function create(this: Phaser.Scene) {
      player = this.physics.add.image(100, 450, 'pacman-atlas', 'sprite30')
      player.setCollideWorldBounds(true);

      // this.anims.create({
      //   key: "left",
      //   frames: this.anims.generateFrameNumbers("all", { start: 0, end: 3 }),
      //   frameRate: 10,
      //   repeat: -1,
      // });

      // this.anims.create({
      //   key: "turn",
      //   frames: [{ key: "all", frame: 4 }],
      //   frameRate: 20,
      // });

      // this.anims.create({
      //   key: "right",
      //   frames: this.anims.generateFrameNumbers("all", { start: 5, end: 8 }),
      //   frameRate: 10,
      //   repeat: -1,
      // });
    }

    function update(this: Phaser.Scene) {
      cursors = this.input.keyboard.createCursorKeys();

      if (cursors.left.isDown) {
        player.setVelocityX(-160);

        // player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        // player.anims.play("right", true);
      } else {
        player.setVelocityX(0);

        // player.anims.play("turn");
      }
    }

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" className="py-4"></div>;
}
