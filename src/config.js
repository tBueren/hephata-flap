export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 600;

export const GAME_SETTINGS = {
  gravity: 900,
  flapVelocity: -320,
  maxFallSpeed: 500,
  pipeSpeed: -160,
  pipeGap: 230,
  pipeSpawnInterval: 1500,
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
