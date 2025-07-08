export default class DiggingGameModel {
  private muted: boolean = false;

  toggleSound(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  // Future: track energy, treasure states, etc.
}
