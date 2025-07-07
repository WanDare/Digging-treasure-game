import Phaser from "phaser";
import LoadingScene from "./scenes/LoadingScene";
import DiggingGameScene from "./scenes/view/DiggingGameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 720,
  height: 1280,
  backgroundColor: "#263238",
  scene: [LoadingScene, DiggingGameScene],
  parent: "game",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
};

new Phaser.Game(config);
