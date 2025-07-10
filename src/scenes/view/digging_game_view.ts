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
      this.handleStartButtonClick.bind(this)
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

  private async handleStartButtonClick() {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return;

    const user = JSON.parse(userRaw);
    const centerX = 720 / 2;
    const height = 1280;

    if ((user.energy ?? 0) < 2) {
      this.showToast("⚡ Not enough energy to start");
      return;
    }

    this.startButton?.destroy();

    const reward = await this.deductEnergy(user);

    if (reward) {
      user.energy = Math.max((user.energy ?? 0) - 2, 0);
      localStorage.setItem("user", JSON.stringify(user));
      updateEnergyDisplay(user.energy);

      this.transitionToCrossMarks(reward);
    } else {
      this.showToast("❌ Failed to start. Please try again.");
      this.startButton = createStartButton(
        this.scene,
        centerX,
        height - 80,
        this.handleStartButtonClick.bind(this)
      );
    }
  }

  private async deductEnergy(user: any): Promise<any | null> {
    try {
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
        const json = await res.json();
        return json.data;
      } else {
        console.warn("❌ Backend error:", await res.text());
        return null;
      }
    } catch (error) {
      console.error("❌ Network or parsing error:", error);
      return null;
    }
  }

  private showToast(message: string) {
    const toast = this.scene.add
      .text(360, 640, message, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#fff",
        backgroundColor: "#000000aa",
        padding: { left: 16, right: 16, top: 8, bottom: 8 },
      })
      .setOrigin(0.5)
      .setDepth(100)
      .setAlpha(0);

    this.scene.tweens.add({
      targets: toast,
      alpha: 1,
      duration: 300,
      yoyo: true,
      hold: 1500,
      onComplete: () => toast.destroy(),
    });
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
