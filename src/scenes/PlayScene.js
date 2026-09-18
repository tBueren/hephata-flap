import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GAME_SETTINGS, DIFFICULTY_RAMP, GAME_MODES } from '../config.js';

const {
  gravity,
  flapVelocity,
  maxFallSpeed,
  pipeSpeed,
  pipeGap,
  pipeSpawnInterval,
  pipeHorizontalMargin,
  groundHeight,
} = GAME_SETTINGS;

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  init(data) {
    this.mode = data.mode || GAME_MODES.CLASSIC;
  }

  create() {
    this.score = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.pipePairs = [];
    this.currentPipeSpeed = pipeSpeed;
    this.currentPipeGap = pipeGap;

    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT - groundHeight);

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'background');

    this.ground = this.add.tileSprite(
      GAME_WIDTH / 2,
      GAME_HEIGHT - groundHeight / 2,
      GAME_WIDTH,
      groundHeight,
      'ground'
    );

    this.pipesGroup = this.physics.add.group();

    this.bird = this.physics.add.sprite(GAME_WIDTH * 0.28, GAME_HEIGHT / 2, 'bird');
    this.bird.body.setAllowGravity(false);
    this.bird.body.setMaxVelocity(400, maxFallSpeed);
    this.bird.body.setCollideWorldBounds(true);
    this.bird.body.onWorldBounds = true;

    this.idleTween = this.tweens.add({
      targets: this.bird,
      y: this.bird.y - 10,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const UI_DEPTH = 10;

    this.scoreText = this.add
      .text(GAME_WIDTH / 2, 40, '0', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(UI_DEPTH);

    this.add
      .text(GAME_WIDTH / 2, 76, this.mode === GAME_MODES.ADVANCED ? 'Advanced' : 'Classic', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setAlpha(0.8)
      .setDepth(UI_DEPTH);

    this.instructionText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, 'Tap / Click / Space\nto flap', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(UI_DEPTH);

    this.physics.add.overlap(this.bird, this.pipesGroup, () => this.handleGameOver(), null, this);
    this.physics.world.on('worldbounds', (body) => {
      if (body.gameObject === this.bird) {
        this.handleGameOver();
      }
    });

    this.input.on('pointerdown', () => this.handleInput());
    this.input.keyboard.on('keydown-SPACE', () => this.handleInput());
  }

  handleInput() {
    if (this.gameOver) return;
    if (!this.gameStarted) this.startGame();
    this.flap();
  }

  startGame() {
    this.gameStarted = true;
    this.idleTween.stop();
    this.instructionText.destroy();

    this.bird.body.setAllowGravity(true);
    this.physics.world.gravity.y = gravity;

    this.pipeTimer = this.time.addEvent({
      delay: pipeSpawnInterval,
      callback: () => this.spawnPipePair(),
      loop: true,
    });

    this.spawnPipePair();
  }

  flap() {
    this.bird.setVelocityY(flapVelocity);
  }

  spawnPipePair() {
    const gap = this.currentPipeGap;
    const minGapY = pipeHorizontalMargin + gap / 2;
    const maxGapY = GAME_HEIGHT - groundHeight - pipeHorizontalMargin - gap / 2;
    const gapY = Phaser.Math.Between(minGapY, maxGapY);
    const x = GAME_WIDTH + 40;
    const pipeWidth = 52;

    const topHeight = gapY - gap / 2;
    const topPipe = this.makePipeSegment(x, topHeight / 2, pipeWidth, topHeight);

    const bottomTop = gapY + gap / 2;
    const bottomHeight = GAME_HEIGHT - groundHeight - bottomTop;
    const bottomPipe = this.makePipeSegment(x, bottomTop + bottomHeight / 2, pipeWidth, bottomHeight);

    this.pipePairs.push({ top: topPipe, bottom: bottomPipe, scored: false });
  }

  makePipeSegment(x, y, width, height) {
    const segment = this.add.tileSprite(x, y, width, height, 'pipe');
    this.physics.add.existing(segment);
    this.pipesGroup.add(segment);
    segment.body.setAllowGravity(false);
    segment.body.immovable = true;
    segment.body.setVelocity(this.currentPipeSpeed, 0);
    return segment;
  }

  applyDifficultyRamp() {
    if (this.mode !== GAME_MODES.ADVANCED) return;

    const { scoreStep, speedIncrement, gapDecrement, maxPipeSpeed, minPipeGap } = DIFFICULTY_RAMP;
    const tier = Math.floor(this.score / scoreStep);

    this.currentPipeSpeed = Math.max(pipeSpeed - tier * speedIncrement, maxPipeSpeed);
    this.currentPipeGap = Math.max(pipeGap - tier * gapDecrement, minPipeGap);
  }

  handleGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;

    this.physics.pause();
    if (this.pipeTimer) this.pipeTimer.remove();
    this.bird.setTint(0xff4444);

    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', { score: this.score, mode: this.mode });
    });
  }

  update() {
    if (!this.gameStarted || this.gameOver) return;

    const tilt = Phaser.Math.Clamp(this.bird.body.velocity.y * 0.08, -20, 90);
    this.bird.angle = tilt;

    this.ground.tilePositionX += 2;

    for (const pair of this.pipePairs) {
      if (!pair.scored && pair.top.x + pair.top.width / 2 < this.bird.x) {
        pair.scored = true;
        this.score += 1;
        this.scoreText.setText(String(this.score));
        this.applyDifficultyRamp();
      }
    }

    this.pipePairs = this.pipePairs.filter((pair) => {
      if (pair.top.x < -60) {
        pair.top.destroy();
        pair.bottom.destroy();
        return false;
      }
      return true;
    });
  }
}
