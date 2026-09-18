// The canvas resizes to fill the actual browser window (see main.js's
// Phaser.Scale.RESIZE), so scenes read their layout size from
// `this.scale.width` / `this.scale.height` rather than a fixed constant.

export const GAME_SETTINGS = {
  gravity: 900,
  flapVelocity: -320,
  maxFallSpeed: 500,
  pipeSpeed: -160,
  pipeGap: 230,
  // Horizontal distance between consecutive pipe pairs is derived from
  // this fraction of the current window width (floored below), so pipes
  // stay well spaced on a wide desktop window instead of bunching up.
  pipeHorizontalGapFactor: 0.315,
  minPipeHorizontalGap: 225,
  pipeHorizontalMargin: 60,
  groundHeight: 40,
};

// Advanced mode ramps difficulty as the player scores: every
// `scoreStep` points, pipe speed increases and the gap narrows, each
// clamped so the game never becomes literally impossible.
export const DIFFICULTY_RAMP = {
  scoreStep: 3,
  speedIncrement: 14,
  gapDecrement: 8,
  maxPipeSpeed: -320,
  minPipeGap: 160,
};

export const GAME_MODES = {
  CLASSIC: 'classic',
  ADVANCED: 'advanced',
};

export const STORAGE_KEY = 'hephataFlapBestScore';
