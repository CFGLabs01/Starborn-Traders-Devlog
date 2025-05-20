import React from 'react';
import * as THREE from 'three';

// Constants for radius
const platformRadius = 0.672; // 0.84 * 0.8 (reduced by 20%)
const ringInnerRadius = platformRadius - 0.012; // Make ring thin

// Pre-create geometry instances for the platform
const topDiscGeometry = new THREE.CircleGeometry(platformRadius, 32);
const bottomHemisphereGeometry = new THREE.SphereGeometry(platformRadius, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
const topRingGeometry = new THREE.RingGeometry(ringInnerRadius, platformRadius, 32); // Outline ring

const CharacterPlatform = ({ position = [0, 0, 0] }) => {
  return (
    // Rotate group 180 deg on X to flip upside down
    // Position Y remains 0, placing the flat disc at the character's feet level
    <group position={position} rotation={[Math.PI, 0, 0]}>
      {/* Frosted Top Disc (Now on top after group rotation) */}
      <mesh
        geometry={topDiscGeometry}
        position={[0, 0.0, 0]}
        rotation={[-Math.PI / 2, 0, 0]} // Needs to be flat relative to the group's new orientation
        receiveShadow
      >
        <meshStandardMaterial
          color="#0D9488" // Darker Blue-Teal (like teal-600)
          transparent={true}
          opacity={0.5} // More transparent
          roughness={0.1} // Sharper reflection
          metalness={0.8} // More reflective
          side={THREE.DoubleSide} // Render both sides in case of slight overlap/view angle
        />
      </mesh>

      {/* Wireframe Bottom Hemisphere (Now under after group rotation) */}
      <mesh
        geometry={bottomHemisphereGeometry}
        position={[0, 0.0, 0]}
        // No rotation needed for hemisphere relative to group
      >
        <meshBasicMaterial
          color="#083344" // Dark Blue (like cyan-900)
          wireframe={true}
          toneMapped={false}
        />
      </mesh>

      {/* Glowing Outline Ring for the Top Disc */}
      <mesh
        geometry={topRingGeometry}
        position={[0, 0.0, 0]} // Coincident with the disc
        rotation={[-Math.PI / 2, 0, 0]} // Rotate flat
      >
        <meshBasicMaterial
          color="#008B8B" // Dark Cyan
          wireframe={true}
          toneMapped={false} // Ensure glow
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default CharacterPlatform; 