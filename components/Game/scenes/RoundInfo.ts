import { Scene } from "phaser";
import type { Player } from "@/app/gameroom/[id]/page";

type TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

export class RoundInfo extends Scene {
  roundCount: number;
  players: Player[];
  gameroomId: string;

  constructor() {
    super("RoundInfo");
    this.roundCount = 1;
    this.players = [];
    this.gameroomId = "";
  }

  init(data: { roundCount: number; players: Player[]; gameroomId: string }) {
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

    const roundText = this.add.text(centerX, centerY - 100, `Round ${this.roundCount}`, {
      fontFamily: "Times New Roman",
      fontSize: "32px",
      color: "#fff",
      fontStyle: "normal",
      strokeThickness: 1,
    });
    roundText.setOrigin(0.5);

    const scoreTextStyle: TextStyle = {
      fontFamily: "Times New Roman",
      fontSize: "30px",
      strokeThickness: 2,
    };
    const p1Sprite = this.add.sprite(200, 200, "pacman-atlas", "sprite30").setOrigin(0.5);
    p1Sprite.setTint(parseInt(this.players[0].color, 16));
    const p1Score = this.add
      .text(p1Sprite.x, p1Sprite.y + 60, this.players[0].score.toString(), scoreTextStyle)
      .setOrigin(0.5);

    const p2Sprite = this.add.sprite(400, 200, "pacman-atlas", "sprite134").setOrigin(0.5);
    p2Sprite.setTint(parseInt(this.players[1].color, 16));
    const p2Score = this.add
      .text(p2Sprite.x, p2Sprite.y + 60, this.players[1].score.toString(), scoreTextStyle)
      .setOrigin(0.5);

    // this.time.delayedCall(
    //   2500,
    //   () => {
    //     this.scene.start("Game");
    //   },
    //   [],
    //   this
    // );
  }
}
