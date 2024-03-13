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
  }

  create() {
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

    if (socket.id === this.hostId) {
      socket.emit("update round count", this.gameroomId);
    }
  }
}
