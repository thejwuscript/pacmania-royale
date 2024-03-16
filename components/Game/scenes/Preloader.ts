import { Scene } from "phaser";
import type { Player } from "@/app/gameroom/[id]/page";
import { socket } from "@/components/SocketProvider";

export class Preloader extends Scene {
  gameroomId: string;
  hostId: string;

  constructor() {
    super("Preloader");
    this.gameroomId = "";
    this.hostId = "";
  }

  init(data: { players: Player[]; gameroomId: string; hostId: string }) {
    if (!data) return;

    if (data.gameroomId) {
      this.gameroomId = data.gameroomId;
    }

    if (data.hostId) {
      this.hostId = data.hostId;
    }
  }

  preload() {
    this.load.atlas("pacman-atlas", "/assets/texture_atlas.png", "/assets/spriteatlas.json");
    this.load.script("webfont", "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
  }

  create() {
    this.dots = [];

    WebFont.load({
      google: {
        families: ["Press Start 2P"],
      },
      active: () => {
        const loadingText = this.add
          .text(this.cameras.main.centerX, this.cameras.main.centerY, "Loading", {
            fontSize: "24px",
            fontFamily: '"Press Start 2P"',
            color: "#ffffff",
          })
          .setOrigin(0.5);

        for (let i = 0; i < 3; i++) {
          const dot = this.add
            .text(loadingText.x + loadingText.displayWidth / 2 + 10 + i * 20, this.cameras.main.centerY, ".", {
              fontSize: "24px",
              fontFamily: '"Press Start 2P"',
              color: "#ffffff",
            })
            .setOrigin(0.5);
          this.dots.push(dot);
        }
      },
    });

    this.time.addEvent({
      delay: 300,
      callback: this.animateDots,
      callbackScope: this,
      loop: true,
    });

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

    this.anims.create({
      key: "defeat",
      frames: this.anims.generateFrameNames("pacman-atlas", {
        prefix: "sprite",
        frames: [16, 32, 47, 63, 80, 104, 122, 140, 149, 157],
      }),
      frameRate: 7,
    });

    socket.on("go to next round", (roundCount, players, gameroomId) => {
      this.scene.start("RoundInfo", { roundCount, players, gameroomId });
    });

    this.events.on("destroy", () => {
      socket.off("go to next round");
    });

    if (socket.id === this.hostId) {
      // delay firing to give other clients time to hook their listeners
      setTimeout(() => socket.emit("update round count", this.gameroomId), 2000);
    }
  }

  animateDots() {
    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];
      dot.alpha = dot.alpha === 1 ? 0 : 1; // Toggle dot's visibility
    }
  }
}
