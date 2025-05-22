export const screenVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }
};

export const gridVariants = {
  hidden: { opacity: 1 }, // Keep parent visible
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Slightly increased stagger
      delayChildren: 0.2 // Slightly reduced initial delay
    }
  }
};

export const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.98 }, // Start slightly closer
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
        duration: 0.6, // Increased duration
        ease: "circOut" // Smoother easing curve
    } 
  },
  // Hover/Tap effects should be handled by CSS (:hover)
};

// Example with spring (adjust damping/stiffness as needed)
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,     // Controls bounciness (lower = more bounce)
      stiffness: 150,  // Controls speed (higher = faster)
      // delay: 0.1 // Optional slight delay
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

// Variants for backdrop fade
export const modalBackdropVariants = { 
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}; 