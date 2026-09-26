// Button indices in the W3C "standard" gamepad mapping (Xbox layout).
export const PAD_A = 0;
export const PAD_X = 2;
export const PAD_CONFIRM = [PAD_A, PAD_X];
export const PAD_UP = 12;
export const PAD_DOWN = 13;

// Calls `callback` whenever `buttons` (an index or array of indices) is pressed
// on any connected gamepad.
// Each scene gets fresh pad state from Phaser, so a button still held from the
// previous scene would fire immediately; that first carried-over press is skipped.
export function onPadButton(scene, buttons, callback) {
  const plugin = scene.input.gamepad;
  if (!plugin) return;

  const indices = [].concat(buttons);
  const key = (pad, index) => `${pad.index}:${index}`;
  const heldAtStart = new Set();
  for (const pad of navigator.getGamepads?.() ?? []) {
    for (const index of indices) {
      if (pad?.buttons[index]?.pressed) heldAtStart.add(key(pad, index));
    }
  }

  plugin.on('down', (pad, button) => {
    if (!indices.includes(button.index)) return;
    if (heldAtStart.delete(key(pad, button.index))) return;
    callback();
  });
  plugin.on('up', (pad, button) => {
    heldAtStart.delete(key(pad, button.index));
  });
}
