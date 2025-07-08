import Phaser from "phaser";
import DiggingGameScene from "./scenes/DiggingGameScene";
import { loadLoginScreen } from "./scenes/login-screen/login";
import LoadingScene from "./scenes/LoadingScene";

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

// new Phaser.Game(config);

loadLoginScreen(() => {
  new Phaser.Game(config);
});
