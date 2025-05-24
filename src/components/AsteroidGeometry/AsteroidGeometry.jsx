import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AsteroidGeometry = ({ scale = 1, autoRotate = true }) => {
  const meshRef = useRef();
  const innerMeshRef = useRef();

  // Create irregular asteroid geometry
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 1);
    
    // Deform vertices to make it irregular like an asteroid
    const positionAttribute = geo.getAttribute('position');
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      
      // Add random deformation
      const noise = 0.2 + Math.random() * 0.3;
      vertex.multiplyScalar(noise);
      
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Create inner structure geometry
  const innerGeometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.6, 0);
    
    // Add different deformation to inner structure
    const positionAttribute = geo.getAttribute('position');
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      
      // Less deformation for inner structure
      const noise = 0.8 + Math.random() * 0.4;
      vertex.multiplyScalar(noise);
      
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.z += delta * 0.1;
    }
    
    if (autoRotate && innerMeshRef.current) {
      // Inner structure rotates at different speed
      innerMeshRef.current.rotation.x += delta * 0.15;
      innerMeshRef.current.rotation.y += delta * 0.25;
      innerMeshRef.current.rotation.z += delta * 0.08;
    }
    
    // Color oscillation
    if (meshRef.current && meshRef.current.material) {
      const time = state.clock.elapsedTime;
      
      // Oscillate between terrestrial colors
      const colorPhase = Math.sin(time * 0.3) * 0.5 + 0.5;
      const greenPhase = Math.sin(time * 0.4 + 1) * 0.5 + 0.5;
      const brownPhase = Math.sin(time * 0.2 + 2) * 0.5 + 0.5;
      
      // Mix of colors
      const r = 0.3 + brownPhase * 0.4; // Browns and oranges
      const g = 0.2 + greenPhase * 0.6; // Greens
      const b = 0.1 + colorPhase * 0.3; // Subtle blues
      
      meshRef.current.material.color.setRGB(r, g, b);
    }

    // Inner structure color changes
    if (innerMeshRef.current && innerMeshRef.current.material) {
      const time = state.clock.elapsedTime;
      const neonPhase = Math.sin(time * 0.8) * 0.5 + 0.5;
      
      // Neon accents for inner structure
      const r = 0.1 + neonPhase * 0.8;
      const g = 0.8 + neonPhase * 0.2;
      const b = 0.3 + neonPhase * 0.5;
      
      innerMeshRef.current.material.color.setRGB(r, g, b);
      innerMeshRef.current.material.opacity = 0.3 + neonPhase * 0.4;
    }
  });

  return (
    <group scale={scale}>
      {/* Outer asteroid structure */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial 
          color="#4a5d23" // Starting with earth green
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      {/* Inner structure */}
      <mesh ref={innerMeshRef} geometry={innerGeometry}>
        <meshBasicMaterial 
          color="#00ff88" // Starting with neon green
          wireframe={true}
          transparent={true}
          opacity={0.4}
        />
      </mesh>
      
      {/* Core dots/particles */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent={true}
          opacity={0.6}
        />
      </mesh>
      
      {/* Additional small core elements */}
      <mesh position={[0.2, 0.1, -0.1]}>
        <sphereGeometry args={[0.05, 6, 4]} />
        <meshBasicMaterial 
          color="#ffaa00"
          transparent={true}
          opacity={0.5}
        />
      </mesh>
      
      <mesh position={[-0.15, -0.2, 0.2]}>
        <sphereGeometry args={[0.07, 6, 4]} />
        <meshBasicMaterial 
          color="#ff4400"
          transparent={true}
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

export default AsteroidGeometry; 