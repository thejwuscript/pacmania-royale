import { Scene } from "phaser";
import type { Player } from "@/app/gameroom/[id]/page";

export class RoundInfo extends Scene {
  roundCount: number;
  players: Player[];

  constructor() {
    super("RoundInfo");
    this.roundCount = 1;
    this.players = [];
  }

  init(data: { roundCount: number; players: Player[] }) {
    if (!data) return;

    if (data.roundCount) {
      this.roundCount = data.roundCount;
    }

    if (data.players) {
      console.log(data.players);
    }
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const roundText = this.add.text(centerX, centerY, `Round ${this.roundCount}`, {
      fontFamily: "Times New Roman",
      fontSize: "32px",
      color: "#fff",
      fontStyle: "normal",
    });
    roundText.setOrigin(0.5);

    this.time.delayedCall(
      2500,
      () => {
        this.scene.start("Game");
      },
      [],
      this
    );
  }
}
