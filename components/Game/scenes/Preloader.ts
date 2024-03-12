import { Scene } from "phaser";
import type { Player } from "@/app/gameroom/[id]/page";

export class Preloader extends Scene {
  players: Player[];

  constructor() {
    super("Preloader");
    this.players = [];
  }

  init(data: { players: Player[] }) {
    if (!data) return;

    if (data.players) {
      this.players = data.players;
    }
  }

  preload() {}

  create() {
    this.scene.start("RoundInfo", { roundCount: 1, players: this.players });
  }
}
