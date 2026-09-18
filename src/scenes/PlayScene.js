import Phaser from 'phaser';
import { GAME_SETTINGS, SPEED_PRESETS, DEFAULT_SPEED } from '../config.js';

const {
  gravity,
  flapVelocity,
  maxFallSpeed,
  pipeGap,
  pipeHorizontalGapFactor,
  minPipeHorizontalGap,
  pipeHorizontalMargin,
  groundHeight,
} = GAME_SETTINGS;

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  init(data) {
    this.speedKey = data.speed && SPEED_PRESETS[data.speed] ? data.speed : DEFAULT_SPEED;
    this.pipeSpeed = SPEED_PRESETS[this.speedKey].pipeSpeed;
  }

  create() {
    this.width = this.scale.width;
    this.height = this.scale.height;
    this.score = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.pipePairs = [];

    this.physics.world.setBounds(0, 0, this.width, this.height - groundHeight);

    this.add.image(this.width / 2, this.height / 2, 'background');

    this.ground = this.add.tileSprite(
      this.width / 2,
      this.height - groundHeight / 2,
      this.width,
      groundHeight,
      'ground'
    );

    this.pipesGroup = this.physics.add.group();

    this.bird = this.physics.add.sprite(this.width * 0.28, this.height / 2, 'bird');
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
      .text(this.width / 2, 40, '0', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setDepth(UI_DEPTH);

    this.add
      .text(this.width / 2, 76, SPEED_PRESETS[this.speedKey].label, {
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
      .text(this.width / 2, this.height / 2 + 80, 'Tippen / Klicken / Leertaste\nzum Flattern', {
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

    this.spawnInitialPipes();
  }

  getPipeIntervalMs() {
    const targetGap = Math.max(minPipeHorizontalGap, this.width * pipeHorizontalGapFactor);
    return (targetGap / Math.abs(this.pipeSpeed)) * 1000;
  }

  // Pretends the pipe timer already started `headStart` ms in the past,
  // spawning (at their current mid-flight positions) whichever pipes
  // would already exist by now, then hands off to the normal timer for
  // the rest. This halves the wait before the first pipe arrives while
  // keeping every pipe-to-pipe gap — including the one leading into the
  // first scheduled pipe — at the normal spacing.
  spawnInitialPipes() {
    const interval = this.getPipeIntervalMs();
    const speedMag = Math.abs(this.pipeSpeed);
    const edgeX = this.width + 40;
    const fullTravelMs = ((edgeX - this.bird.x) / speedMag) * 1000;
    const headStart = fullTravelMs / 2;

    let spawned = 0;
    let elapsed = headStart;
    while (elapsed >= 0) {
      const position = edgeX - (speedMag * elapsed) / 1000;
      this.spawnPipePair(position);
      spawned += 1;
      elapsed = headStart - spawned * interval;
    }

    this.scheduleNextPipe(interval - (headStart % interval));
  }

  scheduleNextPipe(delay) {
    const useDelay = delay ?? this.getPipeIntervalMs();

    this.pipeTimer = this.time.delayedCall(useDelay, () => {
      this.spawnPipePair();
      this.scheduleNextPipe();
    });
  }

  flap() {
    this.bird.setVelocityY(flapVelocity);
  }

  spawnPipePair(spawnX = this.width + 40) {
    const minGapY = pipeHorizontalMargin + pipeGap / 2;
    const maxGapY = Math.max(
      this.height - groundHeight - pipeHorizontalMargin - pipeGap / 2,
      minGapY
    );
    const gapY = Phaser.Math.Between(minGapY, maxGapY);
    const x = spawnX;
    const pipeWidth = 52;

    const topHeight = gapY - pipeGap / 2;
    const topPipe = this.makePipeSegment(x, topHeight / 2, pipeWidth, topHeight);

    const bottomTop = gapY + pipeGap / 2;
    const bottomHeight = this.height - groundHeight - bottomTop;
    const bottomPipe = this.makePipeSegment(x, bottomTop + bottomHeight / 2, pipeWidth, bottomHeight);

    this.pipePairs.push({ top: topPipe, bottom: bottomPipe, scored: false });
  }

  makePipeSegment(x, y, width, height) {
    const segment = this.add.tileSprite(x, y, width, height, 'pipe');
    this.physics.add.existing(segment);
    this.pipesGroup.add(segment);
    segment.body.setAllowGravity(false);
    segment.body.immovable = true;
    segment.body.setVelocity(this.pipeSpeed, 0);
    return segment;
  }

  handleGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;

    this.physics.pause();
    if (this.pipeTimer) this.pipeTimer.remove();
    this.bird.setTint(0xff4444);

    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', { score: this.score, speed: this.speedKey });
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
