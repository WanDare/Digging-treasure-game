import Phaser from "phaser";

export function handleDiggingLogic(
  scene: Phaser.Scene,
  digImg: Phaser.GameObjects.Image,
  disableOthers: () => void,
  restart: () => void
) {
  digImg.disableInteractive();
  digImg.setTexture("Digging");

  const shovel = scene.add
    .sprite(digImg.x + 30, digImg.y - 60, "Shovel1")
    .setScale(1)
    .play("shovel_dig");

  scene.time.delayedCall(800, () => {
    shovel.destroy();

    const chest = scene.add
      .image(digImg.x, digImg.y - 50, "TreasureChest")
      .setDisplaySize(134, 134)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    scene.tweens.add({ targets: chest, alpha: 1, scale: 0.8, duration: 400 });

    chest.once("pointerdown", () => {
      chest.disableInteractive();
      scene.tweens.add({
        targets: chest,
        x: 360,
        y: 640,
        scale: 1.2,
        duration: 400,
        onComplete: () => {
          chest.setTexture("TreasureChestOpen");

          const prizeOptions = [
            { name: "Sakkin Aojito 1 box", key: "Prize1" },
            { name: "Sakkin Aojito 1 box", key: "Prize2" },
            { name: "Sakkin Aojito 1 box", key: "Prize3" },
          ];
          const selectedPrize = Phaser.Math.RND.pick(prizeOptions);

          const prizeImg = scene.add
            .image(360, 620, selectedPrize.key)
            .setScale(0.07)
            .setAlpha(0);
          scene.tweens.add({ targets: prizeImg, alpha: 1, duration: 400 });

          scene.time.delayedCall(500, () => {
            // 🟦 Dim background
            scene.add.rectangle(360, 640, 720, 1280, 0x000000, 0.6).setDepth(9);

            // 🏆 Winner popup
            const popup = scene.add
              .image(360, 640, "PopupWinner")
              .setDisplaySize(720, 1280)
              .setAlpha(0)
              .setDepth(10);

            scene.tweens.add({ targets: popup, alpha: 1, duration: 300 });

            // 🎁 Prize image in popup
            const popupPrize = scene.add
              .image(360, 760, selectedPrize.key)
              .setDisplaySize(150, 150)
              .setAlpha(0)
              .setDepth(11);

            // 📝 You won + prize text
            const youWonText = scene.add
              .text(0, 0, "You won: ", {
                fontSize: "24px",
                fontFamily: "AutumnInSeptember",
                color: "#E7FDFF",
              })
              .setDepth(11);

            const prizeNameText = scene.add
              .text(0, 0, selectedPrize.name, {
                fontSize: "24px",
                fontFamily: "GROBOLD",
                color: "#FFFFFF",
                stroke: "#085874a",
                strokeThickness: 2,
                fontStyle: "bold",
              })
              .setShadow(2, 2, "rgba(28, 59, 88, 0.22)", 4, false, true)
              .setDepth(11);

            // Group texts and center
            const textGroup = scene.add
              .container(240, 600, [youWonText, prizeNameText])
              .setAlpha(0)
              .setDepth(11);

            youWonText.setX(-youWonText.width / 2);
            prizeNameText.setX(youWonText.x + youWonText.width + 4);
            youWonText.setY(-youWonText.height / 2);
            prizeNameText.setY(-prizeNameText.height / 2);

            // Fade-in both
            scene.tweens.add({
              targets: [popupPrize, textGroup],
              alpha: 1,
              duration: 400,
              delay: 300,
              ease: "Power2",
            });

            // ⏲ Restart after 5s
            scene.time.delayedCall(5000, () => restart());
          });
        },
      });
    });
  });
}
