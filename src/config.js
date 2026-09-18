// The canvas resizes to fill the actual browser window (see main.js's
// Phaser.Scale.RESIZE), so scenes read their layout size from
// `this.scale.width` / `this.scale.height` rather than a fixed constant.

export const GAME_SETTINGS = {
  gravity: 900,
  flapVelocity: -320,
  maxFallSpeed: 500,
  pipeGap: 230,
  // Horizontal distance between consecutive pipe pairs is derived from
  // this fraction of the current window width (floored below), so pipes
  // stay well spaced on a wide desktop window instead of bunching up.
  pipeHorizontalGapFactor: 0.315,
  minPipeHorizontalGap: 225,
  pipeHorizontalMargin: 60,
  groundHeight: 40,
};

// Pipe speed is picked once at the start screen and stays fixed for the
// run. 'medium' is the original tuned speed.
export const SPEED_PRESETS = {
  slow: { label: 'Langsam', pipeSpeed: -120 },
  medium: { label: 'Mittel', pipeSpeed: -160 },
  fast: { label: 'Schnell', pipeSpeed: -210 },
};

export const DEFAULT_SPEED = 'medium';

export const STORAGE_KEY = 'hephataFlapBestScore';
