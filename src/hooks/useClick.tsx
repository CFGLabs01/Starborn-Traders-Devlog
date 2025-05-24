import { useCallback } from 'react';
import { Howl } from 'howler';

// Create a simple click sound - will be replaced with actual audio file
const clickSound = new Howl({ 
  src: ['/assets/audio/ui_click.wav'], 
  volume: 0.2,
  onloaderror: () => {
    console.log('Audio file not found, using silent click');
  }
});

export const useClick = () => {
  return useCallback(
    (handler?: () => void) => {
      try {
        clickSound.play();
      } catch (e) {
        console.log('Audio playback failed, continuing silently');
      }
      if (handler) handler();
    },
    [],
  );
}; 