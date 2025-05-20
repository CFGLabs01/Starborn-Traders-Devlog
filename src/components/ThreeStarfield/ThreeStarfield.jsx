import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars({ count = 5000 }) {
  const meshRef = useRef();

  const particles = useMemo(() => {
    const temp = [];
    const range = 2000; // Distribution range
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(range);
      const y = THREE.MathUtils.randFloatSpread(range);
      const z = THREE.MathUtils.randFloatSpread(range);
      const speedOffset = THREE.MathUtils.randFloat(-10, 10); // Random speed variation
      const phaseOffset = Math.random() * Math.PI * 2; // Random phase for oscillation
      temp.push({ x, y, z, speedOffset, phaseOffset });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const viewport = state.viewport;
    const maxDist = 1000;
    const minDist = -1000;
    const movementSpeed = 50; // Base speed

    particles.forEach((particle, i) => {
      let { x, y, z } = particle;
      
      // Introduce slight speed variation per star
      const speed = movementSpeed + (particle.speedOffset || 0); // Add stored offset
      z += delta * speed;

      // Wrap around in Z dimension
      if (z > maxDist) z = minDist;
      particle.z = z;

      // Optional: Add subtle sideways drift or oscillation (example)
      // particle.x += Math.sin(state.clock.elapsedTime + particle.phaseOffset * 5) * delta * 5;
      // particle.y += Math.cos(state.clock.elapsedTime + particle.phaseOffset * 3) * delta * 5;
      
      // Optional: Keep stars within viewport bounds if desired (might look less infinite)
      // if (particle.x > viewport.width / 2) particle.x = -viewport.width / 2;
      // if (particle.x < -viewport.width / 2) particle.x = viewport.width / 2;
      // if (particle.y > viewport.height / 2) particle.y = -viewport.height / 2;
      // if (particle.y < -viewport.height / 2) particle.y = viewport.height / 2;

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.updateMatrix();
      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} roughness={0.9} />
    </instancedMesh>
  );
}

const ThreeStarfield = ({ starCount = 5000, speedFactor = 1 }) => {
  // Note: speedFactor is not currently used by the internal Stars useFrame.
  // This would require modifying the useFrame logic inside Stars if needed.
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 'var(--z-background, -10)'
    }}>
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <Suspense fallback={null}>
          <Stars count={starCount} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeStarfield; 