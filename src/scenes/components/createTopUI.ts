import Phaser from "phaser";

export interface UIHandlers {
  refresh: () => void;
  fullscreen: () => void;
  exit: () => void;
  toggleSound: (icon: Phaser.GameObjects.Image) => void;
}

let energyTextRef: Phaser.GameObjects.Text | null = null;

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

  // 🧠 Get user info safely
  const userRaw = localStorage.getItem("user");
  let user: any = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch (err) {
    console.warn("⚠️ Failed to parse user:", err);
  }

  const fullName = user?.name || "Guest";
  const energy = user?.energy ?? 0;
  const photoUrl = user?.photo || "";

  const container = scene.add.container(500, 58);

  // 🖼️ Load user photo from URL
  if (photoUrl) {
    if (scene.textures.exists("UserPhoto")) {
      scene.textures.remove("UserPhoto");
    }
    scene.load.image("UserPhoto", photoUrl);
    scene.load.once("complete", () => {
      const profileImg = scene.add
        .image(-170, 0, "UserPhoto")
        .setDisplaySize(42, 42)
        .setOrigin(0.5)
        .setDepth(1)
        .setCrop(0, 0, 42, 42);

      container.add(profileImg);
    });
    scene.load.start();
  } else {
    container.add(scene.add.image(-170, 0, "Profile").setScale(1));
  }

  // 👤 Username with ellipsis
  const maxWidth = 130;
  let displayName = fullName;
  const nameText = scene.add
    .text(0, 0, displayName, {
      fontSize: "20px",
      fontFamily: "GROBOLD",
      color: "#fff",
      fontStyle: "bold",
    })
    .setStroke("#1A5389", 2)
    .setOrigin(0, 0.1)
    .setX(-135)
    .setY(-8);

  while (nameText.width > maxWidth && displayName.length > 0) {
    displayName = displayName.slice(0, -1);
    nameText.setText(displayName + "…");
  }

  container.add(nameText);
  container.add(scene.add.image(15, 0, "LineSplit").setScale(1));
  container.add(scene.add.image(110, 0, "EnergyCard").setScale(1));

  // ⚡ Energy Text (reference stored)
  energyTextRef = scene.add
    .text(120, 2, `${energy} Energy`, {
      fontSize: "20px",
      fontFamily: "GROBOLD",
      color: "#fff",
      fontStyle: "bold",
    })
    .setStroke("#1A5389", 2)
    .setOrigin(0.5);

  container.add(energyTextRef);
}

export function updateEnergyDisplay(newEnergy: number) {
  if (energyTextRef) {
    energyTextRef.setText(`${newEnergy} Energy`);
  }
}
