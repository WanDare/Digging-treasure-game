import DiggingGameModel from "../model/digging_game_model";
import DiggingGameView from "../view/digging_game_view";

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
    this.view.createLayout({
      refresh: () => this.onRefresh(),
      soundoff: () => this.onToggleSound(),
      fullscreen: () => this.onToggleFullScreen(),
      exit: () => this.onExit(),
    });
  }

  private onRefresh(): void {
    console.log("[Controller] Refreshing game...");
    this.scene.scene.restart();
  }

  private onToggleSound(): void {
    // Toggle sound state in model
    const muted = this.model.toggleSound();
    console.log(`[Controller] Sound is now ${muted ? "muted" : "unmuted"}`);

    // TODO: integrate actual sound manager logic
    // this.scene.sound.mute = muted;
  }

  private onToggleFullScreen(): void {
    if (!this.scene.scale.isFullscreen) {
      console.log("[Controller] Entering fullscreen");
      this.scene.scale.startFullscreen();
    } else {
      console.log("[Controller] Exiting fullscreen");
      this.scene.scale.stopFullscreen();
    }
  }

  private onExit(): void {
    console.log("[Controller] Exiting game");
    // Optionally display confirmation dialog
    this.scene.scene.stop();
  }
}
