import Phaser from "phaser";

export function createDiggingSpots(
  scene: Phaser.Scene,
  positions: [number, number][]
): Phaser.GameObjects.Image[] {
  return positions.map(([x, y]) =>
    scene.add.image(x, y + 300, "Digging").setScale(0.9)
  );
}
