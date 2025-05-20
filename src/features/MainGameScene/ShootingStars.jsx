import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ShootingStars = ({ count = 150, speed = 150 }) => {
  const meshRef = useRef();
  const { camera } = useThree();
  const baseSceneSize = 700;

  // For instanced color and scale
  const color = useMemo(() => new THREE.Color(), []);
  const colorArray = useMemo(() => 
    Float32Array.from(
      new Array(count).fill(0).flatMap(() => {
        const grayscale = THREE.MathUtils.randFloat(0.5, 1.0); // From medium gray to white
        return color.setRGB(grayscale, grayscale, grayscale).toArray();
      })
    ),
  [count]);

  const particles = useMemo(() => {
    const temp = [];
    const initialSpawnRadiusMin = baseSceneSize * 2.5;
    const initialSpawnRadiusMax = baseSceneSize * 3.5;

    for (let i = 0; i < count; i++) {
      const r = THREE.MathUtils.randFloat(initialSpawnRadiusMin, initialSpawnRadiusMax);
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      temp.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(0.3),
          THREE.MathUtils.randFloatSpread(0.3),
          THREE.MathUtils.randFloat(-0.8, -1.2) // Bias towards camera
        ).normalize().multiplyScalar(speed * THREE.MathUtils.randFloat(0.8, 1.2)),
        baseScale: THREE.MathUtils.randFloat(0.7, 1.3) // Base scale variation
      });
    }
    return temp;
  }, [count, speed, baseSceneSize]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (meshRef.current) {
      // Apply the instanced colors once
      meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3));
    }
  }, [colorArray]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const camCenter = camera.position;
    const resetDistance = baseSceneSize * 2.0;

    particles.forEach((particle, i) => {
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      if (particle.position.distanceTo(camCenter) > resetDistance) {
        const randomVec = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(1),
            THREE.MathUtils.randFloatSpread(1),
            THREE.MathUtils.randFloat(1.5, 2.5) // Spawn further out in front
        ).normalize();
        
        particle.position.copy(camCenter).add(randomVec.clone().multiplyScalar(baseSceneSize * 1.5)); 
        
        // Reset velocity
        particle.velocity.set(
            THREE.MathUtils.randFloatSpread(0.3),
            THREE.MathUtils.randFloatSpread(0.3),
            THREE.MathUtils.randFloat(-0.8, -1.2)
        ).normalize().multiplyScalar(speed * THREE.MathUtils.randFloat(0.8, 1.2));
        
        // Potentially re-randomize color and scale on reset if desired, but for now color is set once
        // particle.baseScale = THREE.MathUtils.randFloat(0.7, 1.3);
      }

      dummy.position.copy(particle.position);
      dummy.scale.set(particle.baseScale, particle.baseScale, particle.baseScale); // Apply individual scale
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {/* Base sphere geometry, scale will be applied per instance */}
      <sphereGeometry args={[0.25, 8, 8]}> {/* Slightly more segments for roundness */}
        {/* The color attribute will be picked up if vertexColors is true */}
      </sphereGeometry>
      <meshBasicMaterial vertexColors transparent opacity={0.75} />
    </instancedMesh>
  );
};

export default ShootingStars; 