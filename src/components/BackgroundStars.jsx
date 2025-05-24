import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const BackgroundStars = (props) => {
  return (
    <Canvas 
      className="!fixed !inset-0 !-z-10" 
      resize={{scroll: false}} 
      {...props}
    >
      <Stars radius={200} depth={60} count={6000} />
    </Canvas>
  );
};

export default BackgroundStars; 