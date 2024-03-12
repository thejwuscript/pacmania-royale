import { Scene } from "phaser";
import { socket } from "@/components/SocketProvider";
import type { Player } from "@/app/gameroom/[id]/page";

export class Game extends Scene {
  roundCount: number;
  players: { [key: string]: Player };
  gameroomId: string;
  cherry?: Phaser.Physics.Arcade.Sprite;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

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
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.enabled = true;
    // this.cherry = this.physics.add.sprite(100, 100, "pacman-atlas", "sprite2");

    socket.emit("get initial positions", this.gameroomId, (players: any) => {
      this.onCurrentPlayers(players);
    });

    socket.on("player moved", (player) => this.onPlayerMoved(player));

    socket.on("player defeated", (winnerSocketId, defeatedSocketId) => {
      this.onPlayerDefeated(winnerSocketId, defeatedSocketId);
    });

    socket.emit("fruit timer", 2000, this.gameroomId);

    socket.on("fruit location", (x: number, y: number) => {
      this.cherry = this.physics.add.sprite(x, y, "pacman-atlas", "sprite2");
      this.physics.add.overlap(this.getPlayerSprites(), this.cherry, this.gainPower);
    });
  }

  update() {
    const playerMeSprite = this.players[socket.id!]?.sprite as any;
    // const nameText = this.players[socket.id!].nameText as any;
    if (!playerMeSprite || !playerMeSprite.active) return;
    if (playerMeSprite.anims.isPaused) {
      return;
    }

    if (this.cursors?.left.isDown) {
      playerMeSprite.setVelocityY(0);
      playerMeSprite.setVelocityX(-160);
      playerMeSprite.anims.play("left", true);
    } else if (this.cursors?.right.isDown) {
      playerMeSprite.setVelocityY(0);
      playerMeSprite.setVelocityX(160);
      playerMeSprite.anims.play("right", true);
    } else if (this.cursors?.up.isDown) {
      playerMeSprite.setVelocityX(0);
      playerMeSprite.setVelocityY(-160);
      playerMeSprite.anims.play("up", true);
    } else if (this.cursors?.down.isDown) {
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

  cleanup() {
    socket.off("player moved");
    socket.off("player defeated");
    socket.off("fruit location");
    socket.emit("reset fruit", this.gameroomId);
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
      for (const id in players) {
        this.players[id] = { ...this.players[id], ...players[id] };
      }
      sprites.push(sprite);
    });

    this.physics.add.collider(sprites[0], sprites[1], this.handlePlayerCollision, () => true, this);
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

  onPlayerDefeated(winnerSocketId: string, defeatedSocketId: string) {
    const sprite = this.players[defeatedSocketId]?.sprite as any;
    // const nameText = this.players[socketId]!.nameText as any;
    sprite.on("animationcomplete", (animation: any) => {
      if (animation.key === "defeat") {
        sprite.destroy();
        // nameText.destroy();
        this.players[winnerSocketId].score += 1;
        this.cleanup();
        this.time.delayedCall(
          500,
          () => {
            this.scene.start("RoundInfo", {
              roundCount: this.roundCount + 1,
              players: this.players,
              gameroomId: this.gameroomId,
            });
          },
          [],
          this
        );
      }
    });
    if (sprite) {
      sprite.anims.play("defeat");
    }
  }

  handlePlayerCollision(player1: any, player2: any) {
    // check if one is bigger than the other
    let winnerSocketId: string = "";
    let defeatedSocketId: string = "";

    if (player1.scaleX > player2.scaleX) {
      this.input.keyboard!.enabled = false;
      player1.body.enable = false;
      player2.body.enable = false;
      player1.anims.pause();
      // player2.on("animationcomplete", (animation: any) => {
      //   if (animation.key === "defeat") {
      //     player2.destroy();
      //   }
      // });
      // player2.anims.play("defeat");
      // emit then broadcast
      // const socketId = Object.values(this.players).find((player) => player.sprite === player2)!.id;

      for (const socketId in this.players) {
        if (this.players[socketId].sprite === player1) {
          winnerSocketId = socketId;
        } else if (this.players[socketId].sprite === player2) {
          defeatedSocketId = socketId;
        }
      }

      socket.emit("player defeat", this.gameroomId, winnerSocketId, defeatedSocketId);
    } else if (player2.scaleX > player1.scaleX) {
      this.input.keyboard!.enabled = false;
      player1.body.enable = false;
      player2.body.enable = false;
      player2.anims.pause();
      // player1.on("animationcomplete", (animation: any) => {
      //   if (animation.key === "defeat") {
      //     player1.destroy();
      //   }
      // });
      // player1.anims.play("defeat");
      // emit then broadcast
      // const defeatedSocketId = Object.values(this.players).find((player) => player.sprite === player1)!.id;
      // const winnerSocketId = Object.values(this.players).find(player => )

      for (const socketId in this.players) {
        if (this.players[socketId].sprite === player2) {
          winnerSocketId = socketId;
        } else if (this.players[socketId].sprite === player1) {
          defeatedSocketId = socketId;
        }
      }

      socket.emit("player defeat", this.gameroomId, winnerSocketId, defeatedSocketId);
    }
  }

  gainPower(player: any, fruit: any) {
    fruit.destroy();
    player.setScale(2);
  }

  getPlayerSprites() {
    let sprites = [];
    for (const id in this.players) {
      sprites.push(this.players[id].sprite);
    }
    return sprites;
  }
}
