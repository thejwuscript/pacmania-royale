import { Scene } from "phaser";

export class RoundInfo extends Scene {
  roundCount: number;
  players: any;

  constructor() {
    super("RoundInfo");
    this.roundCount = 1;
  }

  init(data: { roundCount: number }) {
    if (data && data.roundCount) {
      this.roundCount = data.roundCount;
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
      2000,
      () => {
        this.scene.start("Game");
      },
      [],
      this
    );
  }
}
