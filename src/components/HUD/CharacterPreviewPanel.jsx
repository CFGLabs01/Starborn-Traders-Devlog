import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, useAnimations, PerspectiveCamera } from '@react-three/drei';
// import { EffectComposer, Bloom } from '@react-three/postprocessing'; // Commented out for now
import * as THREE from 'three';

// Simple reusable Model loader with material polish
function Model({ modelPath, animationName, ...props }) {
  const group = useRef();
  const { scene, animations, error } = useGLTF(modelPath, true);
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (error) {
      console.error(`[Character Model] Error loading ${modelPath}:`, error);
      return;
    }
    if (!actions || Object.keys(actions).length === 0) {
      console.warn(`[Character Model] No actions found for ${modelPath}. Animations array length: ${animations?.length}`);
      return;
    }

    console.log(`[Character Model] Attempting to play animation. Requested: '${animationName}'. Available actions:`, Object.keys(actions));

    const action = actions[animationName];
    if (action) {
      console.log(`[Character Model] Action '${animationName}' found. Playing...`, action);
      action.reset().fadeIn(0.5).play();
    } else {
      // Attempt to play the first available animation if the requested one isn't found
      const firstActionKey = Object.keys(actions)[0];
      if (firstActionKey && actions[firstActionKey]) {
        console.warn(`[Character Model] Explicitly: Action '${animationName}' NOT found. Playing first available action: '${firstActionKey}'`);
        actions[firstActionKey].reset().fadeIn(0.5).play();
      } else {
        console.warn(`[Character Model] Explicitly: Action '${animationName}' NOT found, and no other actions available.`);
      }
    }

    return () => {
      if (action) {
        console.log(`[Character Model] Fading out action '${animationName}'`);
        action.fadeOut(0.5);
      }
    };
  }, [actions, animationName, error, modelPath, mixer, animations]);

  // Material polish - loop through materials and enhance them
  useEffect(() => {
    if (scene) {
      scene.traverse(o => {
        if (o.isMesh) {
          o.material.metalness = 0.6;
          o.material.roughness = 0.2;
        }
      });
    }
  }, [scene]);

  if (error) return <mesh><boxGeometry /><meshBasicMaterial color="purple" wireframe /></mesh>;
  if (!scene) return <mesh><boxGeometry /><meshBasicMaterial color="orange" wireframe /></mesh>;

  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} ref={group} {...props} />;
}

// Helper component for Suspense fallback
function ModelLoadingFallback() {
  return null;
}

// Enhanced Character Preview Panel with improved lighting and animations
export function CharacterPreviewPanel({ modelPath, scale, animationName }) {
  console.log('[CharacterPreviewPanel] Rendering Model - ModelPath:', modelPath, 'Scale Prop:', scale, 'AnimationName:', animationName);
  const groupRef = useRef();
  const turnRef = useRef(); // For pedestal turntable if it exists

  // Enable all camera layers
  useThree(({ camera }) => camera.layers.enableAll());

  // Idle sway animation
  useFrame((state, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
    
    // Pedestal turntable animation (if pedestal mesh exists)
    if (turnRef.current) {
      turnRef.current.rotation.y += 0.015 * dt;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.2, 3.5]} fov={45} /> 
      
      {/* Three-Point Lighting Rig */}
      <ambientLight intensity={0.25} color="#0A1320" />
      <directionalLight
        position={[2, 3, 5]}
        intensity={1}
        color="#23E6CD"
      />
      <directionalLight
        position={[-3, 2, -4]}
        intensity={0.6}
        color="#FF8733"
      />
      
      {/* Idle Sway Animation Group */}
      <group ref={groupRef} position={[0, -0.1, 0]}>
        <Suspense fallback={<ModelLoadingFallback />}>
          <Model 
            modelPath={modelPath}
            scale={scale || 1.0}
            animationName={animationName}
            castShadow 
            receiveShadow
            position={[0, 0, 0]} 
          />
          <Preload all />
        </Suspense>
      </group>
      
      <OrbitControls 
        target={[0, 0.85, 0]}
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={8} 
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.1}
      />
      
      {/* EffectComposer with Bloom - Commented out for now */}
      {/* <EffectComposer>
           <Bloom ... />
         </EffectComposer> */}
    </>
  );
}

export default CharacterPreviewPanel; 