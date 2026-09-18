import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import ModeSelectScene from './scenes/ModeSelectScene.js';
import PlayScene from './scenes/PlayScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#4ec0ca',
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, PreloadScene, ModeSelectScene, PlayScene, GameOverScene],
};

new Phaser.Game(config);
