import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Rotating wireframe sphere for the minimap
const WireframeSphere = () => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 16, 12]} />
      <meshBasicMaterial 
        color="#0a9396"
        wireframe={true}
        transparent={true}
        opacity={0.6}
      />
    </mesh>
  );
};

// Player ship indicator (small sphere at center)
const PlayerShip = () => (
  <mesh position={[0, 0, 0]}>
    <sphereGeometry args={[0.08, 8, 6]} />
    <meshBasicMaterial color="#94d2bd" />
  </mesh>
);

// Objective markers with different shapes and colors
const ObjectiveMarker = ({ position, type, isHovered, onHover, onLeave }) => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current && isHovered) {
      meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  const getGeometry = () => {
    switch (type) {
      case 'planet': return <sphereGeometry args={[0.12, 8, 6]} />;
      case 'station': return <boxGeometry args={[0.2, 0.2, 0.2]} />;
      case 'enemy': return <coneGeometry args={[0.1, 0.2, 6]} />;
      case 'asteroid': return <coneGeometry args={[0.08, 0.16, 4]} />;
      default: return <coneGeometry args={[0.1, 0.2, 8]} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'planet': return '#e9d8a6';
      case 'station': return '#0a9396';
      case 'enemy': return '#bb3e03';
      case 'asteroid': return '#ca6702';
      default: return '#94d2bd';
    }
  };

  return (
    <mesh 
      ref={meshRef}
      position={position}
      onPointerEnter={onHover}
      onPointerLeave={onLeave}
    >
      {getGeometry()}
      <meshBasicMaterial color={getColor()} />
    </mesh>
  );
};

// Pedestal base (same as character selection)
const Pedestal = () => (
  <mesh position={[0, -1.2, 0]}>
    <cylinderGeometry args={[1.2, 1.2, 0.1, 16]} />
    <meshBasicMaterial 
      color="#0a9396"
      wireframe={true}
      transparent={true}
      opacity={0.3}
    />
  </mesh>
);

const Minimap = ({ objectives = [] }) => {
  const [hoveredObjective, setHoveredObjective] = useState(null);

  // Sample objectives for demonstration
  const defaultObjectives = [
    { id: 1, position: [0.8, 0.2, -0.3], type: 'planet', name: 'Kepler Station' },
    { id: 2, position: [-0.6, -0.4, 0.7], type: 'station', name: 'Trade Hub Alpha' },
    { id: 3, position: [0.3, 0.8, -0.5], type: 'asteroid', name: 'Mining Site' },
    { id: 4, position: [-0.9, 0.1, 0.2], type: 'enemy', name: 'Pirate Vessel' },
  ];

  const allObjectives = objectives.length > 0 ? objectives : defaultObjectives;

  return (
    <div className="relative w-40 h-40">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 5]} intensity={0.8} color="#0a9396" />
        
        <Pedestal />
        <WireframeSphere />
        <PlayerShip />
        
        {allObjectives.map((objective) => (
          <ObjectiveMarker
            key={objective.id}
            position={objective.position}
            type={objective.type}
            isHovered={hoveredObjective === objective.id}
            onHover={() => setHoveredObjective(objective.id)}
            onLeave={() => setHoveredObjective(null)}
          />
        ))}
      </Canvas>

      {/* Overlay Info */}
      {hoveredObjective && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-rich_black/90 text-tiffany_blue text-xs px-2 py-1 rounded border border-tiffany_blue/30 font-ui">
          {allObjectives.find(obj => obj.id === hoveredObjective)?.name}
        </div>
      )}
      
      {/* Minimap Label */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-tiffany_blue font-ui">
        LOCAL SPACE
      </div>
    </div>
  );
};

export default Minimap; 