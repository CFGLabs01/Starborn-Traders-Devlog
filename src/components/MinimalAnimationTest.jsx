import React from 'react';
import { motion } from 'framer-motion';

const MinimalAnimationTest = () => {
  return (
    <motion.div
      style={{
        width: 100,
        height: 100,
        background: 'blue',
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 9999,
      }}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <p style={{ color: 'white', textAlign: 'center', paddingTop: '30px' }}>Test</p>
    </motion.div>
  );
};

export default MinimalAnimationTest; 