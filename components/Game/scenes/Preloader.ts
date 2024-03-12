import { Scene } from "phaser";
import type { Player } from "@/app/gameroom/[id]/page";

export class Preloader extends Scene {
  players: { [key: string]: Player };
  gameroomId: string;

  constructor() {
    super("Preloader");
    this.players = {};
    this.gameroomId = "";
  }

  init(data: { players: Player[]; gameroomId: string }) {
    if (!data) return;

    if (data.players) {
      const obj: { [key: string]: Player } = {};
      data.players.forEach((player) => {
        player.score = 0;
        obj[player.id] = player;
      });
      this.players = obj;
    }

    if (data.gameroomId) {
      this.gameroomId = data.gameroomId;
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
      frameRate: 5,
    });
    this.scene.start("RoundInfo", { roundCount: 1, players: this.players, gameroomId: this.gameroomId });
  }
}
