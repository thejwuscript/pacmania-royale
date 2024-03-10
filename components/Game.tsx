import { useEffect, useRef, useContext } from "react";
import * as Phaser from "phaser";
import { Player } from "@/app/gameroom/[id]/page";
import { SocketContext } from "./SocketProvider";

type GameConfig = Phaser.Types.Core.GameConfig;
type SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
type Tile = Phaser.Tilemaps.Tile;

interface GameProps {
  players: Player[];
  gameroomId: string;
}

export default function Game({ players, gameroomId }: GameProps) {
  const socket = useContext(SocketContext);
  const [playerOne, playerTwo] = players;
  const playersRef = useRef({
    [playerOne.id]: {
      id: playerOne.id,
      name: playerOne.name,
      position: null,
      orientation: null,
      sprite: null,
      nameText: null,
    },
    [playerTwo.id]: {
      id: playerTwo.id,
      name: playerTwo.name,
      position: null,
      orientation: null,
      sprite: null,
      nameText: null,
    },
  });
  const totalTimeElapsedRef = useRef(0.0);
  const fruitAppearedRef = useRef(false);

  useEffect(() => {
    const config: GameConfig = {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    let cursors: CursorKeys;

    function preload(this: Phaser.Scene) {
      this.load.atlas("pacman-atlas", "/assets/texture_atlas.png", "/assets/spriteatlas.json");
    }

    function onCurrentPlayers(scene: Phaser.Scene, players: any) {
      const sprites: any[] = [];
      Object.keys(players).forEach((id) => {
        const sprite = scene.physics.add.sprite(
          players[id].position.x,
          players[id].position.y,
          "pacman-atlas",
          players[id].orientation === "right" ? "sprite30" : "sprite134"
        );
        sprite.setCollideWorldBounds(true);
        sprite.body.setBounce(1);
        players[id].sprite = sprite;
        const nameText = scene.add.text(sprite.x, sprite.y + sprite.displayHeight + 10, players[id].name);
        players[id].nameText = nameText;
        nameText.setOrigin(0.5, 1);
        sprites.push(sprite);
      });
      playersRef.current = players;

      const cherry = scene.physics.add.sprite(100, 100, "pacman-atlas", "sprite2");

      scene.physics.add.collider(sprites[0], sprites[1], handlePlayerCollision, () => true, scene);
      scene.physics.add.overlap(sprites, cherry, gainPower);
    }

    function gainPower(player: any, fruit: any) {
      // hide fruit
      // enlarge player sprite
      fruit.destroy();
      player.setScale(2);
    }

    function handlePlayerCollision(this: Phaser.Scene, player1: any, player2: any) {
      // check if one is bigger than the other

      if (player1.scaleX > player2.scaleX) {
        this.input.keyboard!.enabled = false;
        player1.body.enable = false;
        player2.body.enable = false;
        player1.anims.pause();
        player2.on("animationcomplete", (animation: any) => {
          if (animation.key === "defeat") {
            player2.destroy();
          }
        });
        player2.anims.play("defeat");
      } else if (player2.scaleX > player1.scaleX) {
        this.input.keyboard!.enabled = false;
        player1.body.enable = false;
        player2.body.enable = false;
        player2.anims.pause();
        player1.on("animationcomplete", (animation: any) => {
          if (animation.key === "defeat") {
            player1.destroy();
          }
        });
        player1.anims.play("defeat");
      }
    }

    function onPlayerMoved(player: any) {
      const sprite = playersRef.current[player.id].sprite as any;
      const nameText = playersRef.current[player.id].nameText as any;
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
      nameText.x = player.position.x;
      nameText.y = player.position.y + sprite.displayHeight + 10;
      sprite.x = player.position.x;
      sprite.y = player.position.y;
    }

    function create(this: Phaser.Scene) {
      socket.emit("get initial positions", gameroomId, (players: any) => {
        onCurrentPlayers(this, players);
      });

      socket.on("player moved", (player) => onPlayerMoved(player));

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

    function update(this: Phaser.Scene) {
      cursors = this.input.keyboard!.createCursorKeys();
      const playerMeSprite = playersRef.current[socket.id!].sprite as any;
      const nameText = playersRef.current[socket.id!].nameText as any;
      if (!playerMeSprite || !nameText) return;
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

      nameText.x = playerMeSprite.x;
      nameText.y = playerMeSprite.y + playerMeSprite.displayHeight + 10;

      const prevPosition = playersRef.current[socket.id!].position as any;
      if (prevPosition && (prevPosition.x !== playerMeSprite.x || prevPosition.y !== playerMeSprite.y)) {
        socket.emit("player movement", gameroomId, socket.id, { x: playerMeSprite.x, y: playerMeSprite.y });
        prevPosition.x = playerMeSprite.x;
        prevPosition.y = playerMeSprite.y;
      }
    }

    var game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
      socket.off("current players");
    };
  }, []);

  return <div id="game-container" className="py-4"></div>;
}
