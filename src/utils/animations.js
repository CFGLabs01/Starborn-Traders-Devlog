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

// Advanced modal variants with Porsche/Tron/Zaha Hadid aesthetics
export const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.75, 
    y: 50,
    rotateX: -15,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 200,
      mass: 0.8,
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94], // Porsche-inspired easing curve
    }
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: -30,
    rotateX: 10,
    filter: "blur(5px)",
    transition: { 
      duration: 0.4, 
      ease: [0.55, 0.085, 0.68, 0.53] // Zaha Hadid flowing exit
    }
  }
};

// Enhanced backdrop with dynamic blur
export const modalBackdropVariants = { 
  hidden: { 
    opacity: 0,
    backdropFilter: "blur(0px) saturate(100%)",
  },
  visible: { 
    opacity: 1,
    backdropFilter: "blur(8px) saturate(120%)",
    transition: { 
      duration: 0.8,
      ease: "easeOut",
    }
  },
  exit: { 
    opacity: 0,
    backdropFilter: "blur(0px) saturate(100%)",
    transition: { 
      duration: 0.3,
      ease: "easeIn"
    }
  },
}; 