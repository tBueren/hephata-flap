import Phaser from 'phaser';
import { STORAGE_KEY, SPEED_PRESETS, DEFAULT_SPEED } from '../config.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.score = data.score ?? 0;
    this.speedKey = data.speed && SPEED_PRESETS[data.speed] ? data.speed : DEFAULT_SPEED;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    const best = this.updateBestScore(this.score);

    this.add.image(width / 2, height / 2, 'background');

    this.add
      .text(width / 2, height / 2 - 120, 'Game Over', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '40px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 40, `Score: ${this.score}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, `Best: ${best}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        color: '#ffd54f',
        stroke: '#000000',
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 40, SPEED_PRESETS[this.speedKey].label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setAlpha(0.8);

    this.add
      .text(width / 2, height / 2 + 100, 'Tap / Click / Space\nto choose speed', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5);

    this.input.once('pointerdown', () => this.restart());
    this.input.keyboard.once('keydown-SPACE', () => this.restart());
  }

  updateBestScore(score) {
    const key = `${STORAGE_KEY}_${this.speedKey}`;
    const stored = Number(localStorage.getItem(key) ?? 0);
    const best = Math.max(stored, score);
    localStorage.setItem(key, String(best));
    return best;
  }

  restart() {
    this.scene.start('SpeedSelectScene');
  }
}
