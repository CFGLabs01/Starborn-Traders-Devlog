import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing game sounds
 * @param {Object} soundConfig - Configuration object for sounds
 * @returns {Object} Sound control methods
 */
const useSound = (soundConfig) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState([]);
  const audioRefs = useRef({});
  
  // Initialize audio elements
  useEffect(() => {
    // Clean up existing audio elements
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.remove();
    });
    
    // Initialize new audio elements for each sound
    const newAudioRefs = {};
    
    Object.entries(soundConfig).forEach(([key, config]) => {
      const audio = new Audio(config.src);
      audio.volume = config.volume || 0.5;
      audio.loop = config.loop || false;
      
      // Store reference
      newAudioRefs[key] = audio;
      
      // Add event listener to remove from currently playing list when ended
      if (!config.loop) {
        audio.addEventListener('ended', () => {
          setCurrentlyPlaying(prev => prev.filter(item => item !== key));
        });
      }
    });
    
    audioRefs.current = newAudioRefs;
    
    // Clean up function
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.remove();
      });
    };
  }, [soundConfig]);
  
  // Effect to handle muting/unmuting
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.muted = isMuted;
    });
  }, [isMuted]);
  
  // Play sound function
  const playSound = useCallback((key) => {
    const audio = audioRefs.current[key];
    
    if (!audio) {
      console.warn(`Sound with key "${key}" not found in configuration.`);
      return;
    }
    
    // For non-looping sounds, restart if already playing
    if (!audio.loop) {
      audio.currentTime = 0;
    }
    
    // Play the sound
    audio.play().catch(error => {
      // Handle autoplay restrictions
      console.warn(`Error playing sound "${key}":`, error);
    });
    
    // Add to currently playing list if not already there
    if (!currentlyPlaying.includes(key)) {
      setCurrentlyPlaying(prev => [...prev, key]);
    }
  }, [currentlyPlaying]);
  
  // Stop sound function
  const stopSound = useCallback((key) => {
    const audio = audioRefs.current[key];
    
    if (!audio) {
      console.warn(`Sound with key "${key}" not found in configuration.`);
      return;
    }
    
    // Pause and reset the sound
    audio.pause();
    audio.currentTime = 0;
    
    // Remove from currently playing list
    setCurrentlyPlaying(prev => prev.filter(item => item !== key));
  }, []);
  
  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    setCurrentlyPlaying([]);
  }, []);
  
  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);
  
  // Set volume for a specific sound
  const setVolume = useCallback((key, volume) => {
    const audio = audioRefs.current[key];
    
    if (!audio) {
      console.warn(`Sound with key "${key}" not found in configuration.`);
      return;
    }
    
    // Clamp volume between 0 and 1
    const clampedVolume = Math.min(Math.max(volume, 0), 1);
    audio.volume = clampedVolume;
  }, []);
  
  // Set master volume for all sounds
  const setMasterVolume = useCallback((volume) => {
    // Clamp volume between a 0 and 1
    const clampedVolume = Math.min(Math.max(volume, 0), 1);
    
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = clampedVolume;
    });
  }, []);
  
  return {
    playSound,
    stopSound,
    stopAllSounds,
    toggleMute,
    setVolume,
    setMasterVolume,
    isMuted,
    currentlyPlaying
  };
};

export default useSound; 