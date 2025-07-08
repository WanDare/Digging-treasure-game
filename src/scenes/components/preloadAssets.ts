import Phaser from "phaser";

export function preloadAssets(scene: Phaser.Scene) {
  const images: [string, string][] = [
    ["Background", "assets/images/beach_theme.png"],
    ["EnergyCard", "assets/images/energy_card.png"],
    ["CrossMark", "assets/images/cross_mark.png"],
    ["LineSplit", "assets/images/line_split.png"],
    ["Digging", "assets/images/digging.png"],
    ["Profile", "assets/images/user_profile.png"],
    ["PopupWinner", "assets/images/popup_winner.png"],
    ["Start", "assets/images/start_button.png"],
    ["Exit", "assets/images/exit_button.png"],
    ["FullScreen", "assets/images/fullscreen_button.png"],
    ["SoundOff", "assets/images/soundoff_button.png"],
    ["SoundOn", "assets/images/soundon_button.png"],
    ["Refresh", "assets/images/refresh_button.png"],
    ["ShineEffect", "assets/images/shine_effect.png"],
    ["SandSplash", "assets/images/sand_splash.png"],
    ["TreasureChest", "assets/images/treasure_chest.png"],
    ["TreasureChestOpen", "assets/images/treasure_chest_open.png"],
    ["Prize1", "assets/prizes/prize4.png"],
    ["Prize2", "assets/prizes/prize6.png"],
    ["Prize3", "assets/prizes/prize7.png"],
    ["Shovel1", "assets/motions/shovel_frame1.png"],
    ["Shovel2", "assets/motions/shovel_frame2.png"],
    ["Shovel3", "assets/motions/shovel_frame3.png"],
    ["Shovel4", "assets/motions/shovel_frame4.png"],
  ];

  images.forEach(([key, path]) => {
    scene.load.image(key, path);
  });

  scene.load.spritesheet(
    "shovelSheet",
    "assets/motions/shovel_spritesheet.png",
    {
      frameWidth: 100,
      frameHeight: 100,
    }
  );
}
