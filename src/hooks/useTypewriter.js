import { useState, useEffect } from 'react';

/**
 * A custom hook for creating a typewriter effect.
 * 
 * @param {string} text The full text to display.
 * @param {number} [speed=50] The typing speed in milliseconds per character.
 * @returns {string} The currently typed portion of the text.
 */
const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayText(''); // Reset display text when text or speed changes
    
    if (text) { // Only run if text is provided
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prevText => prevText + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);

      // Cleanup function to clear interval if component unmounts or dependencies change
      return () => {
        clearInterval(typingInterval);
      };
    }

  }, [text, speed]); // Re-run effect if text or speed changes

  return displayText;
};

export default useTypewriter; 