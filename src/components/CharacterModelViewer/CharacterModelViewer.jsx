import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, useAnimations, PerspectiveCamera } from '@react-three/drei';
import CharacterPlatform from '../CharacterPlatform/CharacterPlatform';

// Simple reusable Model loader
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

  if (error) return <mesh><boxGeometry /><meshBasicMaterial color="purple" wireframe /></mesh>;
  if (!scene) return <mesh><boxGeometry /><meshBasicMaterial color="orange" wireframe /></mesh>;

  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} ref={group} {...props} />;
}

// Helper component for Suspense fallback
function ModelLoadingFallback() {
  return null;
}

// Renamed and Exported: Scene Content for the character PREVIEW view
export function CharacterPreviewContent({ modelPath, scale, animationName }) {
  console.log('[CharacterPreviewContent] Rendering Model - ModelPath:', modelPath, 'Scale Prop:', scale, 'AnimationName:', animationName);
  const contentGroupRef = useRef();

  // Auto-rotation
  useFrame((state, delta) => {
    if (contentGroupRef.current) {
      contentGroupRef.current.rotation.y += delta * 0.2; // Adjust speed as needed
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.2, 3.5]} fov={45} /> 
      
      {/* Lighting Setup */}
      <ambientLight intensity={0.4} color={"#e0f2fe"} /> {/* Soft cream ambient light */}
      
      {/* Key Light (Main) - Tealish */}
      <directionalLight 
        position={[3, 3, 2]} 
        intensity={1.8} 
        color={"#67e8f9"} // Teal
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill Light - Soft Orange/Cream */}
      <directionalLight 
        position={[-3, 2, -2]} 
        intensity={0.8} 
        color={"#fed7aa"} // Pale Orange/Cream
      />
      
      {/* Rim Light (Backlight) - Subtle Cream */}
      <pointLight 
        position={[0, 2, -3]} 
        intensity={0.7} 
        color={"#fef3c7"} // Cream
        distance={10}
        decay={1.5}
      />

      <group ref={contentGroupRef} position={[0, -0.1, 0]}> {/* Slight adjustment down for platform */}
        <Suspense fallback={<ModelLoadingFallback />}>
          <Model 
            modelPath={modelPath}
            scale={scale || 1.0}
            animationName={animationName} // Pass the animation name
            castShadow 
            receiveShadow
            position={[0, 0, 0]} 
          />
          {/* <CharacterPlatform receiveShadow castShadow /> */}{/* Add platform later if needed, ensure it interacts with shadows */}
          <Preload all />
        </Suspense>
      </group>
      
      <OrbitControls 
        target={[0, 0.85, 0]} // Adjusted target slightly higher for character focus
        enableZoom={true}
        enablePan={false} // Disable panning for a cleaner preview
        minDistance={1.5}
        maxDistance={8} 
        autoRotate={false} // Disable orbit controls auto-rotate, we have our own
        enableDamping={true}
        dampingFactor={0.1}
      />
    </>
  );
}

// Main CharacterModelViewer component is no longer needed as App.jsx renders the content
// export default CharacterModelViewer; 
