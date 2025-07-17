import DiggingGameModel from "../model/digging_game_model";
import DiggingGameView from "../view/digging_game_view";
import type { UIHandlers } from "../components/createTopUI";

export default class DiggingGameController {
  private model: DiggingGameModel;
  private view: DiggingGameView;
  private energyRefunded = false;

  constructor(private scene: Phaser.Scene) {
    this.model = new DiggingGameModel();
    this.view = new DiggingGameView(scene);
  }

  preload(): void {
    this.view.preload();
  }

  create(): void {
    let bgm = (this.scene as any).bgm as Phaser.Sound.BaseSound;

    if (!bgm) {
      bgm = this.scene.sound.add("BeachTheme", { loop: true, volume: 0.5 });
      if (!this.model.soundMuted) {
        bgm.play();
      }
      (this.scene as any).bgm = bgm;
    }

    const handlers: UIHandlers = {
      refresh: () => this.onRefresh(),
      toggleSound: (btn) => this.onToggleSound(btn),
      fullscreen: () => this.onToggleFullScreen(),
      exit: () => this.onExit(),
    };

    this.view.createLayout(handlers);
  }

  private onRefresh(): void {
    if (
      this.view.hasUsedEnergy() &&
      !this.view.hasTappedDiggingSpot() &&
      !this.energyRefunded
    ) {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        user.energy = (user.energy ?? 0) + 1;
        localStorage.setItem("user", JSON.stringify(user));
        this.energyRefunded = true;
        console.log("Energy refunded locally");
      }
    }

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
        this.scene.scene.restart();
      },
    });
  }

  private onToggleSound(btn?: Phaser.GameObjects.Image): void {
    const muted = this.model.toggleSound();
    this.scene.sound.mute = muted;

    const bgm = (this.scene as any).bgm as Phaser.Sound.BaseSound;
    if (bgm) {
      muted ? bgm.pause() : bgm.resume();
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

    window.location.reload();
  }
}
