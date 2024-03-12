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
    this.scene.start("RoundInfo", { roundCount: 1, players: this.players, gameroomId: this.gameroomId });
  }
}
