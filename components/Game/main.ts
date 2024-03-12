import * as Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";
import { RoundInfo } from "./scenes/RoundInfo";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";

type GameConfig = Phaser.Types.Core.GameConfig;

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
  scene: [Preloader, RoundInfo, Game, GameOver]
};

function StartGame()  {
  return new Phaser.Game(config);
}

export default StartGame;