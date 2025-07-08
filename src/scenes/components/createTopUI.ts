import Phaser from "phaser";

export function createTopUI(
  scene: Phaser.Scene,
  handlers: Record<string, () => void>
) {
  scene.add.image(0, 0, "Background").setOrigin(0).setDisplaySize(720, 1280);

  const buttons = ["Refresh", "SoundOff", "FullScreen", "Exit"];
  buttons.forEach((key, i) => {
    scene.add
      .image(110, 58 + i * 70, key)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => handlers[key.toLowerCase()]?.());
  });

  scene.add.container(500, 58, [
    scene.add.image(-170, 0, "Profile").setScale(1),
    scene.add
      .text(-135, -8, "Lee Siveheng", {
        fontSize: "20px",
        fontFamily: "GROBOLD",
        color: "#fff",
        fontStyle: "bold",
      })
      .setStroke("#1A5389", 2)
      .setOrigin(0, 0.1),
    scene.add.image(15, 0, "LineSplit").setScale(1),
    scene.add.image(110, 0, "EnergyCard").setScale(1),
    scene.add
      .text(120, 2, "50 Energy", {
        fontSize: "20px",
        fontFamily: "GROBOLD",
        color: "#fff",
        fontStyle: "bold",
      })
      .setStroke("#1A5389", 2)
      .setOrigin(0.5),
  ]);
}
