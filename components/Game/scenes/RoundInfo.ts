import { Scene } from "phaser";

export class RoundInfo extends Scene {
  roundCount: number;

  constructor() {
    super("RoundInfo");
    this.roundCount = 0;
  }

  init(data: { roundCount: number }) {
    this.roundCount = data.roundCount;
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.text(centerX, centerY, `Round ${this.roundCount}`);
  }
}
