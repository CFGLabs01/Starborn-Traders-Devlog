import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventContext } from '../../context/EventContext'; // Import context hook

// Placeholder for icons - map icon names to actual SVG components or image paths
const iconMap = {
  MiningActive: 'assets/HUD/mining_icon.png', // Example paths
  CombatMode: 'assets/HUD/combat_icon.png',
  SystemMalfunction: 'assets/HUD/malfunction_icon.png',
  CommLinkIcon: 'assets/HUD/comms_icon.png',
  // Add more icons as needed
};

const alertVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.2, ease: 'easeIn' } },
};

// Now uses useEventContext instead of props for message/icon/type
const HudAlert = () => {
  const { activeEvent } = useEventContext(); // Consume context
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (activeEvent?.hudAlert) { // Check context for message
      setIsVisible(true);
    } else {
      setIsVisible(false); 
    }
  }, [activeEvent]); // Depend on context value

  const alertStyles = {
    info: 'border-tiffany_blue/50 text-tiffany_blue', // OK for default/info
    opportunity: 'border-gamboge/50 text-gamboge',     // Uses Gamboge (OK, user asked for Gamboge for hazards)
    hazard: 'border-alloy_orange/60 text-alloy_orange', // Currently uses Alloy Orange
    combat: 'border-rufous/70 text-rufous font-semibold', // Uses Rufous (Correct)
  };

  const message = activeEvent?.hudAlert || null;
  const icon = activeEvent?.hudIcon || null;
  const type = activeEvent?.type || 'info'; // Type comes from eventConfig

  const IconComponent = icon && iconMap[icon] ? (
    <img src={iconMap[icon]} alt={`${icon} icon`} className="w-5 h-5 mr-2 flex-shrink-0 opacity-80" />
  ) : null;

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 p-3 px-4 max-w-sm w-full pointer-events-auto z-[60] \
                      bg-midnight_green/80 backdrop-blur-sm rounded-lg shadow-xl border \
                      ${alertStyles[type] || alertStyles['info']}`}
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-center text-sm">
            {IconComponent}
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HudAlert; 