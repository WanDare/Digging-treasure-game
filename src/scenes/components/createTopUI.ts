import Phaser from "phaser";

export interface UIHandlers {
  refresh: () => void;
  fullscreen: () => void;
  exit: () => void;
  toggleSound: (icon: Phaser.GameObjects.Image) => void;
}

export function createTopUI(scene: Phaser.Scene, handlers: UIHandlers) {
  scene.add.image(0, 0, "Background").setOrigin(0).setDisplaySize(720, 1280);

  const buttonPositions: { key: string; y: number }[] = [
    { key: "Refresh", y: 58 },
    { key: "SoundOn", y: 128 },
    { key: "FullScreen", y: 198 },
    { key: "Exit", y: 268 },
  ];

  buttonPositions.forEach(({ key, y }) => {
    const btn = scene.add
      .image(110, y, key)
      .setInteractive({ useHandCursor: true });

    if (key === "SoundOn") {
      btn.on("pointerdown", () => handlers.toggleSound(btn));
    } else {
      const lowerKey = key.toLowerCase() as keyof UIHandlers;
      const handler = handlers[lowerKey];
      if (handler) btn.on("pointerdown", handler);
    }
  });

  scene.add.container(500, 58, [
    scene.add.image(-170, 0, "Profile").setScale(1),

    (() => {
      const maxWidth = 130;
      const fullName = "Lee Siveheng";
      let displayName = fullName;

      const tempText = scene.add.text(0, 0, displayName, {
        fontSize: "20px",
        fontFamily: "GROBOLD",
      });

      while (tempText.width > maxWidth && displayName.length > 0) {
        displayName = displayName.slice(0, -1);
        tempText.setText(displayName + "…");
      }

      tempText
        .setText(displayName + (displayName !== fullName ? "…" : ""))
        .setStyle({
          color: "#fff",
          fontStyle: "bold",
        })
        .setStroke("#1A5389", 2)
        .setOrigin(0, 0.1)
        .setX(-135)
        .setY(-8);

      return tempText;
    })(),

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
