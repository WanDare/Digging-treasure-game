import Phaser from "phaser";
import DiggingGameController from "./controller/digging_game_controller";

export default class DiggingGameScene extends Phaser.Scene {
  private controller!: DiggingGameController;

  constructor() {
    super("DiggingGameScene");
  }

  preload() {
    this.controller = new DiggingGameController(this);
    this.controller.preload();
  }

  create() {
    this.controller.create();
  }
}
