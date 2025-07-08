import Phaser from "phaser";

export function createStartButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  onStart: () => void
): Phaser.GameObjects.Image {
  return scene.add
    .image(x, y, "Start")
    .setScale(0.9)
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", onStart);
}
