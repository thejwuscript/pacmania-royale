import { Scene } from "phaser";
import { socket } from "@/components/SocketProvider";
import type { Player } from "@/app/gameroom/[id]/page";

export class Game extends Scene {
  roundCount: number;
  players: Player[];
  gameroomId: string;

  constructor() {
    super("Game");
    this.roundCount = 1;
    this.players = [];
    this.gameroomId = "";
  }

  init(data: any) {
    if (data) {
      this.roundCount = data.roundCount;
      this.players = data.players;
      this.gameroomId = data.gameroomId;
    }
  }

  create() {
    socket.emit("get initial positions", this.gameroomId, (players: any) => {
      this.onCurrentPlayers(players);
    });

    // socket.on("player moved", (player) => onPlayerMoved(player));

    // socket.on("player defeated", onPlayerDefeated);

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
  }

  onCurrentPlayers(players: any) {
    const sprites: any[] = [];
    Object.keys(players).forEach((id) => {
      const sprite = this.physics.add.sprite(
        players[id].position.x,
        players[id].position.y,
        "pacman-atlas",
        players[id].orientation === "right" ? "sprite30" : "sprite134"
      );
      sprite.tint = players[id].color;
      sprite.setCollideWorldBounds(true);
      sprite.body.setBounce(1);
      players[id].sprite = sprite;
      // const nameText = this.add.text(sprite.x, sprite.y + sprite.displayHeight + 10, players[id].name);
      // players[id].nameText = nameText;
      // nameText.setOrigin(0.5, 1);
      sprites.push(sprite);
    });
    this.players = players;

    const cherry = this.physics.add.sprite(100, 100, "pacman-atlas", "sprite2");

    // this.physics.add.collider(sprites[0], sprites[1], handlePlayerCollision, () => true, this);
    // this.physics.add.overlap(sprites, cherry, gainPower);
  }
}
