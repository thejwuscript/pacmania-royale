import { Scene } from "phaser";
import { socket } from "@/components/SocketProvider";
import type { Player } from "@/app/gameroom/[id]/page";

export class Game extends Scene {
  roundCount: number;
  players: { [key: string]: Player };
  gameroomId: string;

  constructor() {
    super("Game");
    this.roundCount = 1;
    this.players = {};
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
    const cherry = this.physics.add.sprite(100, 100, "pacman-atlas", "sprite2");

    socket.emit("get initial positions", this.gameroomId, (players: any) => {
      this.onCurrentPlayers(players);
    });

    socket.on("player moved", (player) => this.onPlayerMoved(player));

    socket.on("player defeated", this.onPlayerDefeated);

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

  update() {
    const cursors = this.input.keyboard!.createCursorKeys();
    const playerMeSprite = this.players[socket.id!]?.sprite as any;
    // const nameText = this.players[socket.id!].nameText as any;
    if (!playerMeSprite || !playerMeSprite.active) return;
    if (playerMeSprite.anims.isPaused) {
      return;
    }

    if (cursors.left.isDown) {
      playerMeSprite.setVelocityY(0);
      playerMeSprite.setVelocityX(-160);
      playerMeSprite.anims.play("left", true);
    } else if (cursors.right.isDown) {
      playerMeSprite.setVelocityY(0);
      playerMeSprite.setVelocityX(160);
      playerMeSprite.anims.play("right", true);
    } else if (cursors.up.isDown) {
      playerMeSprite.setVelocityX(0);
      playerMeSprite.setVelocityY(-160);
      playerMeSprite.anims.play("up", true);
    } else if (cursors.down.isDown) {
      playerMeSprite.setVelocityX(0);
      playerMeSprite.setVelocityY(160);
      playerMeSprite.anims.play("down", true);
    } else {
      playerMeSprite.setVelocityX(0);
      playerMeSprite.setVelocityY(0);
    }

    // nameText.x = playerMeSprite.x;
    // nameText.y = playerMeSprite.y + playerMeSprite.displayHeight + 10;

    const prevPosition = this.players[socket.id!].position as any;
    if (prevPosition && (prevPosition.x !== playerMeSprite.x || prevPosition.y !== playerMeSprite.y)) {
      socket.emit("player movement", this.gameroomId, socket.id, { x: playerMeSprite.x, y: playerMeSprite.y });
      prevPosition.x = playerMeSprite.x;
      prevPosition.y = playerMeSprite.y;
    }
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

    // this.physics.add.collider(sprites[0], sprites[1], handlePlayerCollision, () => true, this);
    // this.physics.add.overlap(sprites, cherry, gainPower);
  }

  onPlayerMoved(player: any) {
    const sprite = this.players[player.id].sprite as any;
    // const nameText = this.players[player.id].nameText as any;
    const prevX = sprite.x;
    const prevY = sprite.y;
    if (Math.round(player.position.x - prevX) > 0) {
      // look right
      sprite.anims.play("right", true);
    } else if (Math.round(player.position.x - prevX) < 0) {
      // look left
      sprite.anims.play("left", true);
    } else if (Math.round(player.position.y - prevY) > 0) {
      // look down
      sprite.anims.play("down", true);
    } else if (Math.round(player.position.y - prevY) < 0) {
      // look up
      sprite.anims.play("up", true);
    }
    // nameText.x = player.position.x;
    // nameText.y = player.position.y + sprite.displayHeight + 10;
    sprite.x = player.position.x;
    sprite.y = player.position.y;
  }

  onPlayerDefeated(socketId: string) {
    const sprite = this.players[socketId]!.sprite as any;
    // const nameText = this.players[socketId]!.nameText as any;
    sprite.on("animationcomplete", (animation: any) => {
      if (animation.key === "defeat") {
        sprite.destroy();
        // nameText.destroy();
      }
    });
    if (sprite) {
      sprite.anims.play("defeat");
    }
  }
}
