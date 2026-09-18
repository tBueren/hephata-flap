import Phaser from 'phaser';

// Placeholder textures are generated procedurally so the game is playable
// with zero external assets. To swap in real mascot/product art later,
// replace the generate* calls below with this.load.image(key, url) calls
// in preload(), pointing at files under public/assets/images/ — keep the
// same texture keys ('bird', 'pipe', 'background', 'ground') so PlayScene
// needs no changes.
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create() {
    this.generateBirdTexture();
    this.generatePipeTexture();
    this.generateBackgroundTexture();
    this.generateGroundTexture();

    this.scene.start('SpeedSelectScene');
  }

  generateBirdTexture() {
    const g = this.add.graphics();
    const w = 34;
    const h = 26;

    // Body (mascot blob)
    g.fillStyle(0xf6b93b, 1);
    g.fillEllipse(w / 2, h / 2, w - 4, h - 2);

    // Wing
    g.fillStyle(0xe58e26, 1);
    g.fillEllipse(w / 2 - 4, h / 2 + 2, 12, 8);

    // Beak
    g.fillStyle(0xff7f27, 1);
    g.fillTriangle(w - 6, h / 2 - 3, w - 6, h / 2 + 3, w + 4, h / 2);

    // Eye
    g.fillStyle(0xffffff, 1);
    g.fillCircle(w / 2 + 5, h / 2 - 5, 5);
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(w / 2 + 6, h / 2 - 5, 2.5);

    g.generateTexture('bird', w + 4, h + 2);
    g.destroy();
  }

  generatePipeTexture() {
    // A small tileable strip, repeated vertically via TileSprite in
    // PlayScene so a single pipe can stretch to any gap-dependent height
    // without distorting a fixed-size sprite.
    const g = this.add.graphics();
    const w = 52;
    const h = 40;

    g.fillStyle(0x4c9a2a, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(0x5fbf35, 1);
    g.fillRect(4, 0, 6, h);
    g.fillStyle(0x2e6e17, 1);
    g.fillRect(w - 10, 0, 6, h);

    g.generateTexture('pipe', w, h);
    g.destroy();
  }

  generateBackgroundTexture() {
    // Sized to the actual window at boot (the canvas fills the browser
    // window via Phaser.Scale.RESIZE), so this covers it edge-to-edge
    // with no stretching. Cloud positions are fractions of that size.
    const g = this.add.graphics();
    const w = this.scale.width;
    const h = this.scale.height;

    g.fillGradientStyle(0x4ec0ca, 0x4ec0ca, 0x8fe0e8, 0x8fe0e8, 1);
    g.fillRect(0, 0, w, h);

    // Simple clouds
    g.fillStyle(0xffffff, 0.5);
    g.fillEllipse(w * 0.2, h * 0.17, 70, 30);
    g.fillEllipse(w * 0.7, h * 0.33, 90, 34);
    g.fillEllipse(w * 0.38, h * 0.57, 60, 26);

    g.generateTexture('background', w, h);
    g.destroy();
  }

  generateGroundTexture() {
    const g = this.add.graphics();
    const w = 48;
    const h = 40;

    g.fillStyle(0xded895, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(0x4c9a2a, 1);
    g.fillRect(0, 0, w, 8);
    g.fillStyle(0xc9c07a, 1);
    g.fillRect(0, 20, w, 4);
    g.fillRect(24, 8, 4, 12);

    g.generateTexture('ground', w, h);
    g.destroy();
  }
}
