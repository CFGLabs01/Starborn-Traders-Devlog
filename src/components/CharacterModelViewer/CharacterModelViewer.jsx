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
      console.warn(`[Character Model] Explicitly: Action '${animationName}' NOT found.`);
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
  console.log('[CharacterPreviewContent] DEBUGGING - ModelPath:', modelPath, 'Scale Prop:', scale, 'AnimationName:', animationName);
  const contentGroupRef = useRef();
  // const targetSettings = [0, 0.8, 0]; // OrbitControls target
  // const modelYPosition = -0.95;
  // const groupYRotationSpeed = -0.10; // Temporarily disable rotation

  // useFrame((state, delta) => {
  //   if (contentGroupRef.current) {
  //     contentGroupRef.current.rotation.y += delta * groupYRotationSpeed;
  //   }
  // });

  return (
    <>
      {/* Debug Camera */}
      <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
      
      {/* Simplified Debug Lighting */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2.0} />

      {/* Debug Box at model's intended position */}
      <mesh position={[0, 0, 0]}> {/* Centered for simplicity */}
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="magenta" wireframe />
      </mesh>

      <group ref={contentGroupRef} position={[0, 0, 0]}> {/* Centered group */}
        <Suspense fallback={null}>
          <Model 
            modelPath={modelPath}
            scale={1.5} // Force a larger, fixed scale for debug
            animationName={animationName}
            castShadow // Assuming models are set up to cast shadows
            position={[0,0,0]} // Ensure model is at group origin
          />
          {/* <CharacterPlatform position={[0, -0.05, 0]} /> */}
          {/* Temporarily remove platform if it might obscure things */}
          <Preload all />
        </Suspense>
      </group>
      
      <OrbitControls 
        target={[0, 0.75, 0]} // Adjust target if model is at origin
        enableZoom={true}
        enablePan={true}
        minDistance={1}
        maxDistance={10} 
      />

      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  );
}

// Main CharacterModelViewer component is no longer needed as App.jsx renders the content
// export default CharacterModelViewer; 
