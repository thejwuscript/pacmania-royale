import { Scene } from "phaser";
import type { Player } from "@/app/gameroom/[id]/page";

type TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

export class RoundInfo extends Scene {
  roundCount: number;
  players: { [key: string]: Player };
  gameroomId: string;

  constructor() {
    super("RoundInfo");
    this.roundCount = 1;
    this.players = {};
    this.gameroomId = "";
  }

  init(data: { roundCount: number; players: { [key: string]: Player }; gameroomId: string }) {
    if (!data) return;

    if (data.roundCount) {
      this.roundCount = data.roundCount;
    }

    if (data.players) {
      this.players = data.players;
    }

    if (data.gameroomId) {
      this.gameroomId = data.gameroomId;
    }
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const roundTextStyle = {
      fontFamily: '"Press Start 2P"',
      fontSize: "22px",
      color: "#fff",
      fontStyle: "normal",
    };

    const roundText = this.add.text(centerX, centerY - 100, `Round ${this.roundCount}`, roundTextStyle);
    roundText.setOrigin(0.5);

    const bestOfTest = this.add
      .text(centerX, roundText.y + 35, "(Best of 3)", { ...roundTextStyle, fontSize: "14px" })
      .setOrigin(0.5);

    const scoreTextStyle: TextStyle = {
      fontFamily: '"Press Start 2P"',
      fontSize: "20px",
    };

    const playersAry = Object.values(this.players);
    const p1Sprite = this.add.sprite(200, 260, "pacman-atlas", "sprite30").setOrigin(0.5);
    p1Sprite.setTint(parseInt(playersAry[0].color, 16));
    const p1Score = this.add
      .text(p1Sprite.x, p1Sprite.y - 60, playersAry[0].score.toString(), scoreTextStyle)
      .setOrigin(0.5);

    const p2Sprite = this.add.sprite(400, 260, "pacman-atlas", "sprite134").setOrigin(0.5);
    p2Sprite.setTint(parseInt(playersAry[1].color, 16));
    const p2Score = this.add
      .text(p2Sprite.x, p2Sprite.y - 60, playersAry[1].score.toString(), scoreTextStyle)
      .setOrigin(0.5);

    const dash = this.add.text((p1Score.x + p2Score.x) / 2, p1Score.y, "-", scoreTextStyle).setOrigin(0.5);

    this.time.delayedCall(
      2500,
      () => {
        this.scene.start("Game", { roundCount: this.roundCount, players: this.players, gameroomId: this.gameroomId });
      },
      [],
      this.scene
    );
  }
}
