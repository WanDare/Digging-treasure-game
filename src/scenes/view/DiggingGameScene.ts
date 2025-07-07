import Phaser from "phaser";

export default class DiggingGameScene extends Phaser.Scene {
  private map: number[][] = [];
  private tileSize: number = 64;
  private rows: number = 5;
  private cols: number = 8;
  private tiles: Phaser.GameObjects.Rectangle[][] = [];

  constructor() {
    super("DiggingGameScene");
  }

  preload() {
    // You can preload assets here if needed
  }

  create() {
    this.map = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(0)
    );

    for (let row = 0; row < this.rows; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const tile = this.add
          .rectangle(
            col * this.tileSize + this.tileSize / 2,
            row * this.tileSize + this.tileSize / 2,
            this.tileSize - 4,
            this.tileSize - 4,
            0x8d6e63
          )
          .setInteractive();

        tile.on("pointerdown", () => this.digTile(row, col));

        this.tiles[row][col] = tile;
      }
    }

    this.add.text(10, this.rows * this.tileSize + 10, "Click to dig!", {
      font: "18px Arial",
      color: "#ffffff",
    });
  }

  private digTile(row: number, col: number) {
    if (this.map[row][col] === 0) {
      this.map[row][col] = 1;
      this.tiles[row][col].setFillStyle(0x4e342e);
    }
  }
}
