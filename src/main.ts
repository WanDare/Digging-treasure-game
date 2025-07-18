import Phaser from "phaser";
import { config } from "./game/phaserConfig";
import { loadLoginScreen } from "./scenes/login-screen/login";

// Launch login screen, then game
loadLoginScreen(() => {
  new Phaser.Game(config);
});
