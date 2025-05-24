import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Pedestal = ({ position = [0, -1.2, 0], scale = 1, rotate = false }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (rotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1; // Slow clockwise rotation
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <cylinderGeometry args={[1.2, 1.2, 0.1, 16]} />
      <meshBasicMaterial 
        color="#0a9396"
        wireframe={true}
        transparent={true}
        opacity={0.3}
      />
    </mesh>
  );
};

export default Pedestal; 