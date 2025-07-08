export default class DiggingGameModel {
  public soundMuted: boolean = false;

  toggleSound(): boolean {
    this.soundMuted = !this.soundMuted;
    return this.soundMuted;
  }

  isMuted(): boolean {
    return this.soundMuted;
  }

  // Future: track energy, treasure states, etc.
}
