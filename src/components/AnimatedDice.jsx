import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function AnimatedDice({ sides = 20, onRoll }) {
  const ctrl = useAnimation();
  
  useEffect(() => {
    ctrl.start({ 
      rotate: [0, 720], 
      scale: [1, 1.4, 1], 
      transition: { duration: 1.2 } 
    })
    .then(() => onRoll(Math.ceil(Math.random() * sides)));
  }, [ctrl, sides, onRoll]);
  
  return (
    <motion.div
      initial={{ rotate: 0, scale: 1 }} 
      animate={ctrl}
      className="w-16 h-16 rounded-2xl bg-[--c-cyan]/60 flex items-center justify-center text-2xl font-bold"
    >
      🎲
    </motion.div>
  );
} 