import Phaser from "phaser";

export async function handleDiggingLogic(
  scene: Phaser.Scene,
  digImg: Phaser.GameObjects.Image,
  reward: { rewardName: string; photo: string },
  _disableOthers: () => void,
  restart: () => void
) {
  digImg.disableInteractive();
  digImg.setTexture("Digging");

  const shovel = scene.add
    .sprite(digImg.x + 30, digImg.y - 60, "Shovel1")
    .setScale(1)
    .play("shovel_dig");

  scene.time.delayedCall(800, async () => {
    shovel.destroy();

    const chest = scene.add
      .image(digImg.x, digImg.y - 50, "TreasureChest")
      .setDisplaySize(134, 134)
      .setAlpha(0);

    scene.tweens.add({
      targets: chest,
      alpha: 1,
      scale: 0.8,
      duration: 400,
      onComplete: async () => {
        const rewardName = reward?.rewardName || "Mystery Prize";
        const rewardPhotoUrl = reward?.photo;

        const textureKey = "RewardImage";
        if (scene.textures.exists(textureKey)) {
          scene.textures.remove(textureKey);
        }

        scene.load.image(textureKey, rewardPhotoUrl + `?v=${Date.now()}`);
        scene.load.once("loaderror", (file: Phaser.Loader.File) => {
          console.error("❌ Failed to load reward image:", file.src);
        });
        await new Promise<void>((resolve) => {
          scene.load.once("complete", resolve);
          scene.load.start();
        });

        scene.tweens.add({
          targets: chest,
          x: 360,
          y: 640,
          scale: 1.2,
          duration: 400,
          onComplete: () => {
            const shine = scene.add
              .image(360, 640, "ShineEffect")
              .setDisplaySize(567, 567)
              .setAlpha(0.8)
              .setDepth(8);

            scene.tweens.add({
              targets: shine,
              angle: 360,
              duration: 4000,
              repeat: -1,
              ease: "Linear",
            });

            chest.setTexture("TreasureChestOpen").setDepth(9);

            const prizeImg = scene.add
              .image(360, 620, textureKey)
              .setDisplaySize(64, 64)
              .setAlpha(0)
              .setDepth(9);

            scene.tweens.add({ targets: prizeImg, alpha: 1, duration: 400 });

            scene.time.delayedCall(500, () => {
              scene.add
                .rectangle(360, 640, 720, 1280, 0x000000, 0.6)
                .setDepth(9);

              const popup = scene.add
                .image(360, 640, "PopupWinner")
                .setDisplaySize(720, 1280)
                .setAlpha(0)
                .setDepth(10);
              scene.tweens.add({ targets: popup, alpha: 1, duration: 300 });

              const popupPrize = scene.add
                .image(355, 760, textureKey)
                .setDisplaySize(150, 150)
                .setAlpha(0)
                .setDepth(11);

              const youWonText = scene.add
                .text(0, 0, "You won: ", {
                  fontSize: "24px",
                  fontFamily: "AutumnInSeptember",
                  color: "#E7FDFF",
                })
                .setDepth(11);

              const prizeNameText = scene.add
                .text(0, 0, rewardName, {
                  fontSize: "24px",
                  fontFamily: "GROBOLD",
                  color: "#FFFFFF",
                  stroke: "#085874a",
                  strokeThickness: 2,
                  fontStyle: "bold",
                })
                .setShadow(2, 2, "rgba(28, 59, 88, 0.22)", 4, false, true)
                .setDepth(11);

              const textGroup = scene.add
                .container(240, 600, [youWonText, prizeNameText])
                .setAlpha(0)
                .setDepth(11);

              youWonText.setX(-youWonText.width / 2);
              prizeNameText.setX(youWonText.x + youWonText.width + 4);
              youWonText.setY(-youWonText.height / 2);
              prizeNameText.setY(-prizeNameText.height / 2);

              scene.tweens.add({
                targets: [popupPrize, textGroup],
                alpha: 1,
                duration: 400,
                delay: 300,
                ease: "Power2",
              });

              scene.time.delayedCall(5000, () => {
                shine.destroy();
                restart();
              });
            });
          },
        });
      },
    });
  });
}
