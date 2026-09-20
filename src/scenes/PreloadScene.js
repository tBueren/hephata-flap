import Phaser from 'phaser';

// The bird uses real art from public/assets/images/; the other textures are
// generated procedurally as placeholders. To swap those for real art, replace
// the generate* calls below with this.load.image(key, url) calls in
// preload() — keep the same texture keys ('bird', 'pipe', 'background',
// 'ground') so PlayScene needs no changes.
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('birdLogo', `${import.meta.env.BASE_URL}assets/images/bird.png`);
  }

  create() {
    this.generateBirdTexture();
    this.generatePipeTexture();
    this.generateBackgroundTexture();
    this.generateGroundTexture();

    this.scene.start('SpeedSelectScene');
  }

  // The bird is the Hephata logo (public/assets/images/bird.png) on a small
  // white orb, baked into one 'bird' texture so PlayScene can treat it as a
  // single sprite.
  generateBirdTexture() {
    const size = 48;
    const logoHeight = 30;

    const orb = this.add.graphics();
    orb.fillStyle(0xffffff, 1);
    orb.fillCircle(size / 2, size / 2, size / 2);
    orb.lineStyle(2, 0xd9d9d9, 1);
    orb.strokeCircle(size / 2, size / 2, size / 2 - 1);

    const logo = this.add.image(0, 0, 'birdLogo');
    logo.setScale(logoHeight / logo.height);

    const rt = this.add.renderTexture(0, 0, size, size);
    rt.draw(orb, 0, 0);
    rt.draw(logo, size / 2, size / 2);
    rt.saveTexture('bird');

    orb.destroy();
    logo.destroy();
    rt.destroy();
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
