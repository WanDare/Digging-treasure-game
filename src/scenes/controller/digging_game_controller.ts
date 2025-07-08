import DiggingGameModel from "../model/digging_game_model";
import DiggingGameView from "../view/digging_game_view";
import type { UIHandlers } from "../components/createTopUI";
import { loadLoginScreen } from "../login-screen/login";

export default class DiggingGameController {
  private model: DiggingGameModel;
  private view: DiggingGameView;

  constructor(private scene: Phaser.Scene) {
    this.model = new DiggingGameModel();
    this.view = new DiggingGameView(scene);
  }

  preload(): void {
    this.view.preload();
  }

  create(): void {
    // 🧼 Stop any lingering BGM from last session
    const oldBgm = (this.scene as any).bgm as Phaser.Sound.BaseSound;
    if (oldBgm) {
      oldBgm.stop();
      oldBgm.destroy();
      this.scene.sound.remove(oldBgm);
      delete (this.scene as any).bgm;
    }

    // 🔊 Create fresh background music
    const bgm = this.scene.sound.add("BeachTheme", { loop: true, volume: 0.5 });
    if (!this.model.soundMuted) {
      bgm.play();
    }
    (this.scene as any).bgm = bgm;

    const handlers: UIHandlers = {
      refresh: () => this.onRefresh(),
      toggleSound: (btn) => this.onToggleSound(btn),
      fullscreen: () => this.onToggleFullScreen(),
      exit: () => this.onExit(),
    };

    this.view.createLayout(handlers);
  }

  private onRefresh(): void {
    console.log("[Controller] Refreshing game...");

    // 🟦 Add fade-out transition
    const fade = this.scene.add
      .rectangle(0, 0, 720, 1280, 0x000000)
      .setOrigin(0)
      .setAlpha(0)
      .setDepth(1000);

    this.scene.tweens.add({
      targets: fade,
      alpha: 1,
      duration: 600,
      ease: "Power2",
      onComplete: () => {
        const bgm = (this.scene as any).bgm as Phaser.Sound.BaseSound;
        if (bgm) {
          bgm.stop();
          bgm.destroy();
          this.scene.sound.remove(bgm);
          delete (this.scene as any).bgm;
        }

        this.scene.sound.stopAll();
        this.scene.sound.removeAll();

        this.scene.scene.restart();
      },
    });
  }

  private onToggleSound(btn?: Phaser.GameObjects.Image): void {
    const muted = this.model.toggleSound();
    this.scene.sound.mute = muted;

    const bgm = (this.scene as any).bgm as Phaser.Sound.BaseSound;
    if (bgm) {
      if (muted) bgm.pause();
      else bgm.resume();
    }

    if (btn) {
      btn.setTexture(muted ? "SoundOff" : "SoundOn");
    }
  }

  private onToggleFullScreen(): void {
    if (!this.scene.scale.isFullscreen) {
      this.scene.scale.startFullscreen();
    } else {
      this.scene.scale.stopFullscreen();
    }
  }

  private onExit(): void {
    const bgm = (this.scene as any).bgm;
    if (bgm) {
      bgm.stop();
      bgm.destroy();
      this.scene.sound.remove(bgm);
      delete (this.scene as any).bgm;
    }

    this.scene.sound.stopAll();
    this.scene.sound.removeAll();
    this.scene.scene.stop();

    loadLoginScreen(() => {
      window.location.reload();
    });
  }
}
