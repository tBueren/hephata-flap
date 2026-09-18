import Phaser from 'phaser';
import { SPEED_PRESETS } from '../config.js';

const KEY_HINTS = ['ONE', 'TWO', 'THREE'];

export default class SpeedSelectScene extends Phaser.Scene {
  constructor() {
    super('SpeedSelectScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.image(width / 2, height / 2, 'background');

    this.add
      .text(width / 2, height * 0.15, 'Hephata Flap', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '34px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    const entries = Object.entries(SPEED_PRESETS);
    const spacing = 110;
    const startY = height / 2 - ((entries.length - 1) * spacing) / 2;

    entries.forEach(([speedKey, preset], i) => {
      this.createSpeedButton(width / 2, startY + i * spacing, preset.label, speedKey, i);
    });
  }

  createSpeedButton(x, y, label, speedKey, index) {
    const btnWidth = 260;
    const btnHeight = 90;

    const button = this.add
      .rectangle(x, y, btnWidth, btnHeight, 0x2e6e17, 0.85)
      .setStrokeStyle(3, 0xffffff)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(x, y, label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '26px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(x, y + btnHeight / 2 + 14, `press ${index + 1}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    button.on('pointerover', () => button.setFillStyle(0x3d8f1f, 0.9));
    button.on('pointerout', () => button.setFillStyle(0x2e6e17, 0.85));
    button.on('pointerdown', () => this.selectSpeed(speedKey));

    this.input.keyboard.once(`keydown-${KEY_HINTS[index]}`, () => this.selectSpeed(speedKey));
  }

  selectSpeed(speedKey) {
    this.scene.start('PlayScene', { speed: speedKey });
  }
}
