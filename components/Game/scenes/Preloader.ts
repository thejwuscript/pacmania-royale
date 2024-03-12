import { Scene } from "phaser";
import type { Player } from "@/app/gameroom/[id]/page";
import { socket } from "@/components/SocketProvider";

export class Preloader extends Scene {
  players: Player[];
  gameroomId: string;

  constructor() {
    super("Preloader");
    this.players = [];
    this.gameroomId = "";
  }

  init(data: { players: Player[]; gameroomId: string }) {
    if (!data) return;

    if (data.players) {
      this.players = data.players;
    }

    if (data.gameroomId) {
      this.gameroomId = data.gameroomId;
    }
  }

  preload() {
    this.load.atlas("pacman-atlas", "/assets/texture_atlas.png", "/assets/spriteatlas.json");
  }

  create() {
    socket.emit("get initial positions", this.gameroomId, (players: any) => {
      this.onCurrentPlayers(players);
    });
    this.scene.start("RoundInfo", { roundCount: 1, players: this.players });
  }

  onCurrentPlayers(players: any) {
    console.log(players);
  }
}
