// Simple utility to play a sound effect using HTML5 Audio
// Note: Browser policies might prevent autoplay unless triggered by user interaction initially.

/**
 * Plays a sound effect from the specified path.
 * @param {string} src - The path to the sound file (e.g., '/assets/sfx/alert.wav')
 * @param {number} [volume=0.5] - Volume level (0.0 to 1.0)
 */
const playSound = (src, volume = 0.5) => {
  if (!src) {
    console.warn('playSound: No source provided.');
    return;
  }
  
  const sound = new Audio(src);
  sound.volume = Math.max(0, Math.min(1, volume)); // Clamp volume
  
  sound.play().catch(error => {
    // Autoplay was prevented.
    console.warn(`playSound Error for ${src}:`, error);
    // You might want to queue sounds or enable them after a user interaction.
  });
};

export default playSound; 