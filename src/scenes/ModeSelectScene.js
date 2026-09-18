import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GAME_MODES } from '../config.js';

export default class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super('ModeSelectScene');
  }

  create() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background');

    this.add
      .text(GAME_WIDTH / 2, 90, 'Hephata Flap', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '34px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.createModeButton(
      GAME_HEIGHT / 2 - 60,
      'Classic',
      'Constant speed & gap',
      GAME_MODES.CLASSIC,
      '1'
    );

    this.createModeButton(
      GAME_HEIGHT / 2 + 60,
      'Advanced',
      'Speeds up as you score',
      GAME_MODES.ADVANCED,
      '2'
    );
  }

  createModeButton(y, label, subtitle, mode, keyHint) {
    const width = 260;
    const height = 90;

    const button = this.add
      .rectangle(GAME_WIDTH / 2, y, width, height, 0x2e6e17, 0.85)
      .setStrokeStyle(3, 0xffffff)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(GAME_WIDTH / 2, y - 14, label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '26px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, y + 18, subtitle, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: '#e0f2e9',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, y + height / 2 + 14, `press ${keyHint}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setAlpha(0.7);

    button.on('pointerover', () => button.setFillStyle(0x3d8f1f, 0.9));
    button.on('pointerout', () => button.setFillStyle(0x2e6e17, 0.85));
    button.on('pointerdown', () => this.selectMode(mode));

    this.input.keyboard.once(`keydown-${keyHint === '1' ? 'ONE' : 'TWO'}`, () =>
      this.selectMode(mode)
    );
  }

  selectMode(mode) {
    this.scene.start('PlayScene', { mode });
  }
}
