import Phaser from "phaser";
import { preloadAssets } from "./components";

export default class LoadingScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;

  private loadComplete = false;
  private minTimePassed = false;

  constructor() {
    super({ key: "LoadingScene" });
  }

  preload() {
    const { width, height } = this.cameras.main;

    this.preloadFonts();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(width / 2 - 170, height / 2 - 30, 340, 60);

    this.progressBar = this.add.graphics();

    this.loadingText = this.make
      .text({
        x: width / 2,
        y: height / 2 - 50,
        text: "Loading...",
        style: {
          font: "bold 28px Arial", 
          color: "#ffffff",
        },
      })
      .setOrigin(0.5);

    this.percentText = this.make
      .text({
        x: width / 2,
        y: height / 2,
        text: "0%",
        style: {
          font: "24px Arial",
          color: "#ffffff",
        },
      })
      .setOrigin(0.5);

    preloadAssets(this);

    this.load.on("progress", (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x85c1e9, 1);
      this.progressBar.fillRect(
        width / 2 - 160,
        height / 2 - 15,
        320 * value,
        30
      );
      this.percentText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on("complete", () => {
      this.loadComplete = true;
      this.checkReady();
    });

    this.time.delayedCall(1500, () => {
      this.minTimePassed = true;
      this.checkReady();
    });
  }

  private preloadFonts() {
    const font1 = new FontFace(
      "AutumnInSeptember",
      "url(/assets/fonts/AutumnInSeptember.ttf)"
    );
    const font2 = new FontFace("GROBOLD", "url(/assets/fonts/GROBOLD.ttf)");

    font1
      .load()
      .then((loaded) => {
        (document as any).fonts.add(loaded);
        console.log("✅ AutumnInSeptember font loaded.");
      })
      .catch((err) => {
        console.warn("❌ AutumnInSeptember font failed:", err);
      });

    font2
      .load()
      .then((loaded) => {
        (document as any).fonts.add(loaded);
        console.log("✅ GROBOLD font loaded.");
      })
      .catch((err) => {
        console.warn("❌ GROBOLD font failed:", err);
      });
  }

  private checkReady() {
    if (this.loadComplete && this.minTimePassed) {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();

      this.scene.start("DiggingGameScene");
    }
  }
}
