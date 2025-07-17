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

  // Ensure energy starts at 0 if undefined
  const userRaw = localStorage.getItem("user");
  let user: any = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : {};
  } catch (err) {
    console.warn("⚠️ Failed to parse user:", err);
    user = {};
  }

  const fullName = user?.name || "Guest";
  if (typeof user.energy !== "number") {
    user.energy = 0;
    localStorage.setItem("user", JSON.stringify(user));
  }

  let currentEnergy = user.energy;

  const container = scene.add.container(500, 58);

  const profile = scene.add
    .image(-170, 0, "Profile")
    .setDisplaySize(42, 42)
    .setOrigin(0.5);
  container.add(profile);

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

  // ⚡ Energy Text
  energyTextRef = scene.add
    .text(120, 2, `${currentEnergy}`, {
      fontSize: "20px",
      fontFamily: "GROBOLD",
      color: "#fff",
      fontStyle: "bold",
    })
    .setStroke("#1A5389", 2)
    .setOrigin(0.5);
  container.add(energyTextRef);

  // ➕ Increase Button
  const increaseBtn = scene.add
    .image(160, 0, "increase")
    .setInteractive({ useHandCursor: true })
    .setDisplaySize(24, 24)
    .on("pointerdown", () => {
      currentEnergy++;
      updateEnergyDisplay(currentEnergy);
      saveEnergyToStorage(currentEnergy);
    });
  container.add(increaseBtn);

  // ➖ Decrease Button
  const decreaseBtn = scene.add
    .image(80, 0, "decrease")
    .setInteractive({ useHandCursor: true })
    .setDisplaySize(24, 24)
    .on("pointerdown", () => {
      if (currentEnergy > 0) {
        currentEnergy--;
        updateEnergyDisplay(currentEnergy);
        saveEnergyToStorage(currentEnergy);
      }
    });
  container.add(decreaseBtn);
}

export function updateEnergyDisplay(newEnergy: number) {
  if (energyTextRef) {
    energyTextRef.setText(`${newEnergy}`);
  }
}

function saveEnergyToStorage(energy: number) {
  const userRaw = localStorage.getItem("user");
  let user: any = {};

  try {
    user = userRaw ? JSON.parse(userRaw) : {};
    user.energy = energy;
    localStorage.setItem("user", JSON.stringify(user));
  } catch (err) {
    console.warn("⚠️ Failed to save energy to user data:", err);
  }
}
