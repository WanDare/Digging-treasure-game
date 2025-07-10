import Phaser from "phaser";

export function createStartButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  onStart: () => void | Promise<void>
): Phaser.GameObjects.Image {
  const button = scene.add
    .image(x, y, "Start")
    .setScale(0.9)
    .setInteractive({ useHandCursor: true });

  button.on("pointerdown", () => {
    // Disable temporarily to prevent spam
    button.disableInteractive();

    Promise.resolve(onStart()).finally(() => {
      button.setInteractive();
    });
  });

  return button;
}
