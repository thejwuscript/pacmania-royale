import { Scene } from "phaser";

type TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

export class GameOver extends Scene {
  name: string;

  constructor() {
    super("GameOver");
    this.name = "";
  }

  init(data: { name: string }) {
    this.name = data.name;
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const textStyle: TextStyle = {
      fontFamily: "Times New Roman",
      fontSize: "28px",
    };

    this.add.text(centerX, centerY - 50, "Game Over", textStyle).setOrigin(0.5);

    const message = `${this.name} wins the game!`;
    this.add.text(centerX, centerY + 50, message, textStyle).setOrigin(0.5);
  }
}
