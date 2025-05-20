import React from 'react';
import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom'; // Removed unused import
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
// import styles from './TitleScreen.module.css'; // Remove CSS module import
import useSound from '../../hooks/useSound';
// Use simple, space-free filenames for imports
// Ensure the actual files in public/assets/logo/ are renamed to match!
import mainLogoPath from '/assets/logo/StarbornTraderslogo.png'; 
import subLogoPath from '/assets/logo/CFGLabslogo.png';
// import StarfieldBackground from '../../components/StarfieldBackground/StarfieldBackground'; // Removed import

// Commented out missing audio file imports
// import titleMusic from '../../assets/audio/title-music.mp3';
// import buttonSound from '../../assets/audio/button-click.mp3';

// Accept onStartGame prop
const TitleScreen = ({ onStartGame }) => {
  const [loaded, setLoaded] = React.useState(false);
  // const navigate = useNavigate(); // Removed unused navigate
  
  const { playSound, stopSound, toggleMute, isMuted } = useSound({
    // Commented out sounds until files exist
    // background: { src: titleMusic, volume: 0.4, loop: true },
    // button: { src: buttonSound, volume: 0.5 }
  });
  
  React.useEffect(() => {
    // Start title animation and music
    const timer = setTimeout(() => {
      setLoaded(true);
      // playSound('background'); // Commented out
    }, 500);
    
    return () => {
      clearTimeout(timer);
      // stopSound('background'); // Commented out
    };
  // }, [playSound, stopSound]); // Removed dependencies
  }, []); // No dependencies needed if sounds aren't played
  
  // Updated handleStartGame to call the prop function
  const handleStartGameClick = () => {
    // playSound('button'); // Can uncomment if button sound exists
    
    // Call the function passed from App.jsx
    if (onStartGame) {
      // Optional: Add delay back if sound needs time to play
      // setTimeout(() => {
      //   onStartGame();
      // }, 150); // Shorter delay?
       onStartGame(); // Call directly for now
    } else {
        console.error("onStartGame prop is missing from TitleScreen");
    }
  };
  
  // --- Animation Variants ---

  // Variant for the main logo container (holds both logos)
  const logoContainerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.2, // Start slightly after background load
        duration: 1.0,
        ease: "easeOut"
      }
    }
  };
  
  // Variant for the button container
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.8, // Start after logos are mostly visible
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 0 15px rgba(0, 212, 255, 0.5)", // Keep hover effect
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)", // Keep tap effect
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="title-screen-container"> {/* Use a global class or inline styles if needed */}
      {/* <StarfieldBackground /> */} {/* Removed usage */}
      
      {/* Central Content Area */}
      <div className="content-container"> {/* Use a global class */}
        {/* Logo Container */}
        <motion.div 
          className="logo-container" // Use global class
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
          variants={logoContainerVariants} // Apply animation to the container
        >
            {/* Main Logo */}
            <img 
              src={mainLogoPath} // Use imported path
              alt="Starborn Traders Logo" 
              id="main-logo" // Keep original ID
              className="main-logo" // Style needed
            />

            {/* Sub Logo */}
            <img 
              src={subLogoPath} // Use imported path
              alt="CFG Labs 01 Logo" 
              id="sub-logo" // Keep original ID
              className="sub-logo" // Style needed
            />
        </motion.div>

        {/* Button Container */}
        <motion.div
          className="button-container" // Use global class
          initial="hidden"
          animate={loaded ? "visible" : "hidden"}
          variants={buttonVariants} // Apply button animation
        >
          <motion.button
            className="button button--primary button--round" 
            onClick={handleStartGameClick} // Call the updated handler
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants} // Apply hover/tap from variants
          >
            <span>Start Game</span> {/* Wrap text in span for z-index trick */}
          </motion.button>
        </motion.div>
      </div>
      
      {/* Footer with Audio Toggle (Keep as is) */}
      <div className="footer"> {/* Use global class */}
        <motion.button 
          className="button button--icon button--transparent audio-toggle" // Added specific class for potential targeting
          onClick={toggleMute}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isMuted ? "Enable audio" : "Disable audio"}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </motion.button>
      </div>
    </div>
  );
};

export default TitleScreen; 