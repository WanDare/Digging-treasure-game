// DiggingGameView.ts
import Phaser from "phaser";
import {
  preloadAssets,
  createTopUI,
  createDiggingSpots,
  createStartButton,
  handleDiggingLogic,
  updateEnergyDisplay,
} from "../components";
import { API_BASE_URL } from "../utils/constants";

export type UIHandlers = {
  refresh: () => void;
  exit: () => void;
  fullscreen: () => void;
  toggleSound: (icon: Phaser.GameObjects.Image) => void;
};

export default class DiggingGameView {
  [x: string]: any;
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

  createLayout(handlers: UIHandlers) {
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
      async () => {
        try {
          const userRaw = localStorage.getItem("user");
          if (!userRaw) return;

          const user = JSON.parse(userRaw);

          // ⚡️ Immediate UI feedback
          this.startButton?.destroy();

          // Optional: Add a loading spinner or animation here

          const res = await fetch(`${API_BASE_URL}/reward/game-play`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: user.phone,
              deviceName: navigator.userAgent,
              gameName: "Digging Treasure",
              energy: 2,
            }),
          });

          if (res.ok) {
            const result = await res.json();
            const reward = result.data;

            user.energy = Math.max((user.energy ?? 0) - 2, 0);
            localStorage.setItem("user", JSON.stringify(user));
            updateEnergyDisplay(user.energy);

            this.transitionToCrossMarks(reward);
          } else {
            console.warn("❌ Failed to deduct energy:", await res.text());

            // Optional: re-show the start button if failed
            this.startButton = createStartButton(
              this.scene,
              centerX,
              height - 80,
              this.handleStartButtonClick.bind(this)
            );
          }
        } catch (err) {
          console.error("Error sending energy request:", err);
        }
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

  private transitionToCrossMarks(reward: {
    rewardName: string;
    photo: string;
  }) {
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
                reward,
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
