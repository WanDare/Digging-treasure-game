import Phaser from "phaser";
import {
  preloadAssets,
  createTopUI,
  createDiggingSpots,
  createStartButton,
  handleDiggingLogic,
} from "../components";

export default class DiggingGameView {
  private scene: Phaser.Scene;
  private diggingSpots: Phaser.GameObjects.Image[] = [];
  private digUsed = false;
  private startButton?: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preload() {
    preloadAssets(this.scene);
  }

  createLayout(handlers: Record<string, () => void>) {
    const width = 720;
    const height = 1280;
    const centerX = width / 2;

    createTopUI(this.scene, handlers);

    const positions: [number, number][] = [
      [230, 450],
      [505, 550],
      [230, 650],
      [530, 755],
    ];

    this.diggingSpots = createDiggingSpots(this.scene, positions);

    this.startButton = createStartButton(
      this.scene,
      centerX,
      height - 80,
      () => {
        this.startButton?.destroy();
        this.transitionToCrossMarks();
      }
    );

    if (!this.scene.anims.exists("shovel_dig")) {
      this.scene.anims.create({
        key: "shovel_dig",
        frames: [
          { key: "Shovel1" },
          { key: "Shovel2" },
          { key: "Shovel3" },
          { key: "Shovel4" },
        ],
        frameRate: 8,
        repeat: 0,
      });
    }
  }

  private transitionToCrossMarks() {
    this.diggingSpots.forEach((spot) => {
      this.scene.tweens.add({
        targets: spot,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          spot.setTexture("CrossMark").setInteractive();
          this.scene.tweens.add({ targets: spot, alpha: 1, duration: 300 });

          spot.once("pointerdown", () => {
            if (!this.digUsed) {
              this.digUsed = true;
              this.disableOtherCrossMarks(spot);

              handleDiggingLogic(
                this.scene,
                spot,
                () => this.disableOtherCrossMarks(spot),
                () => this.scene.scene.restart()
              );
            }
          });
        },
      });
    });
  }

  private disableOtherCrossMarks(selected: Phaser.GameObjects.Image) {
    this.diggingSpots.forEach((spot) => {
      if (spot !== selected) spot.disableInteractive();
    });
  }
}
