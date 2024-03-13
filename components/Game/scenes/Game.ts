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

    socket.emit("reset fruit", this.gameroomId);
    socket.emit("get initial positions", this.gameroomId, (players: any) => {
      this.onCurrentPlayers(players);
    });

    socket.on("player moved", (player) => this.onPlayerMoved(player));

    socket.on("player defeated", (winnerSocketId, defeatedSocketId) => {
      this.onPlayerDefeated(winnerSocketId, defeatedSocketId);
    });

    socket.emit("fruit timer", 2000, this.gameroomId);

    socket.on("fruit location", (x: number, y: number) => {
      this.cherry?.destroy();
      this.cherry = this.physics.add.sprite(x, y, "pacman-atlas", "sprite2");
      this.physics.add.overlap(this.getPlayerSprites(), this.cherry, this.handleCherryCollision, () => true, this);
    });

    socket.on("go to next round", (roundCount, players, gameroomId) => {
      this.scene.start("RoundInfo", {
        roundCount,
        players,
        gameroomId,
      });
    });

    socket.on("player power up", (id: string) => {
      socket.emit("reset fruit", this.gameroomId);
      this.players[id].sprite.setScale(2);
    });

    socket.on("player return to normal", (id: string) => {
      this.players[id].sprite.setScale(1);
      socket.emit("fruit timer", 2000, this.gameroomId);
    });
  }

  update() {
    const mySprite = this.players[socket.id!]?.sprite as any;
    // const nameText = this.players[socket.id!].nameText as any;
    if (!mySprite || !mySprite.active) return;
    if (mySprite.anims.isPaused) {
      return;
    }

    if (this.cursors?.left.isDown) {
      mySprite.setVelocityY(0);
      const Vx = mySprite.scaleX > 1 ? -210 : -160;
      mySprite.setVelocityX(Vx);
      mySprite.anims.play("left", true);
    } else if (this.cursors?.right.isDown) {
      mySprite.setVelocityY(0);
      const Vx = mySprite.scaleX > 1 ? 210 : 160;
      mySprite.setVelocityX(Vx);
      mySprite.anims.play("right", true);
    } else if (this.cursors?.up.isDown) {
      mySprite.setVelocityX(0);
      const Vy = mySprite.scaleX > 1 ? -210 : -160;
      mySprite.setVelocityY(Vy);
      mySprite.anims.play("up", true);
    } else if (this.cursors?.down.isDown) {
      mySprite.setVelocityX(0);
      const Vy = mySprite.scaleX > 1 ? 210 : 160;
      mySprite.setVelocityY(Vy);
      mySprite.anims.play("down", true);
    } else {
      mySprite.setVelocityX(0);
      mySprite.setVelocityY(0);
    }

    const prevPosition = this.players[socket.id!].position as any;
    if (prevPosition && (prevPosition.x !== mySprite.x || prevPosition.y !== mySprite.y)) {
      socket.emit("player movement", this.gameroomId, socket.id, { x: mySprite.x, y: mySprite.y });
      prevPosition.x = mySprite.x;
      prevPosition.y = mySprite.y;
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

    socket.emit("win round", winnerSocketId, this.gameroomId);

    sprite.on("animationcomplete", (animation: any) => {
      if (animation.key === "defeat") {
        sprite.destroy();
        this.cleanup();
        this.time.delayedCall(
          500,
          () => {
            socket.emit("update round count", this.gameroomId);
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

  handleCherryCollision(sprite: any, cherry: any) {
    cherry.destroy();
    for (const _ in this.players) {
      // prevent other clients from firing the same event
      if (this.players[socket.id!].sprite === sprite) {
        socket.emit("got cherry", socket.id, this.gameroomId);
      }
    }
  }

  getPlayerSprites() {
    let sprites = [];
    for (const id in this.players) {
      sprites.push(this.players[id].sprite);
    }
    return sprites;
  }
}
