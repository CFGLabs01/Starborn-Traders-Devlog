import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, useAnimations, PerspectiveCamera } from '@react-three/drei';
// import { EffectComposer, Bloom } from '@react-three/postprocessing'; // Commented out for now
import { useGameState } from '../../context/GameStateContext';
import CharacterPlatform from '../CharacterPlatform/CharacterPlatform';
import ShowcaseRig from '../ShowcaseRig';

// Simple reusable Model loader
const Model = React.memo(({ modelPath, animationName, ...props }) => {
  const group = useRef();
  const { scene, animations, error } = useGLTF(modelPath, true);
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    if (error) {
      console.error(`[Character Model] Error loading ${modelPath}:`, error);
      return;
    }
    if (!actions || Object.keys(actions).length === 0) {
      return;
    }

    const action = actions[animationName];
    if (action) {
      action.reset().fadeIn(0.5).play();
    } else {
      const firstActionKey = Object.keys(actions)[0];
      if (firstActionKey && actions[firstActionKey]) {
        actions[firstActionKey].reset().fadeIn(0.5).play();
      }
    }

    return () => {
      if (action) {
        action.fadeOut(0.5);
      }
    };
  }, [actions, animationName, error, modelPath, mixer, animations]);

  useEffect(() => {
    if (scene) {
      scene.traverse(o => {
        if (o.isMesh) {
          o.geometry.center(); // Center the geometry for proper pivot
          if (o.material) {
            o.material.metalness = 0.6;
            o.material.roughness = 0.2;
          }
        }
      });
    }
  }, [scene]);

  const clonedScene = useMemo(() => {
    if (!scene) return null;
    return scene.clone();
  }, [scene]);

  if (error) {
    return <mesh><boxGeometry /><meshBasicMaterial color="purple" wireframe /></mesh>;
  }
  if (!clonedScene) {
    return <mesh><boxGeometry /><meshBasicMaterial color="orange" wireframe /></mesh>;
  }

  return <primitive object={clonedScene} ref={group} {...props} />;
});

// Helper component for Suspense fallback
function ModelLoadingFallback() {
  return <mesh><boxGeometry args={[0.1, 0.1, 0.1]} /><meshBasicMaterial color="gray" transparent opacity={0.3} /></mesh>;
}

// Simplified Wireframe Platform Component with 2D Horizontal Rotation (Car Showroom Style)
const WireframePlatform = React.memo(({ radius = 1.2 }) => {
  const platformRef = useRef();
  const innerRingRef = useRef();
  const { getEchoEffects } = useGameState();

  // Get current echo effects
  const echoEffects = getEchoEffects ? getEchoEffects() : { 
    hudIntensity: 0, 
    echoTheme: 'neutral',
    hudGlitch: false,
    hudHarmonic: false 
  };

  // Memoize colors to prevent recalculation on every render
  const colors = useMemo(() => {
    switch (echoEffects.echoTheme) {
      case 'hero':
        return {
          primary: "#0a9396", // Official dark_cyan
          secondary: "#005f73", // Official midnight_green  
          accent: "#94d2bd", // Official tiffany_blue
          core: "#001219" // Official rich_black
        };
      case 'rogue':
        return {
          primary: "#bb3e03", // Official rust
          secondary: "#ca6702", // Official alloy_orange
          accent: "#ee9b00", // Official gamboge
          core: "#ae2012" // Official rufous
        };
      default:
        return {
          primary: "#0a9396", // Official dark_cyan
          secondary: "#005f73", // Official midnight_green
          accent: "#94d2bd", // Official tiffany_blue
          core: "#001219" // Official rich_black
        };
    }
  }, [echoEffects.echoTheme]);

  useFrame((state, delta) => {
    // FIXED: Pure horizontal turntable rotation - like a record player
    if (platformRef.current) {
      // Rotate ONLY on Y-axis for horizontal turntable motion
      platformRef.current.rotation.y += delta * 0.4; // Increased speed for visibility
      
      // REMOVED: Excessive debug logging that was flooding console
    }
    
    if (innerRingRef.current) {
      // Counter-rotate the inner ring for visual effect
      innerRingRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main Platform Disc - FIXED: Horizontal platform that rotates around center */}
      <mesh ref={platformRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.8, radius, 64]} />
        <meshBasicMaterial 
          color={colors.primary}
          wireframe={true} 
          transparent={true} 
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner Rotating Ring - FIXED: Horizontal that counter-rotates */}
      <mesh ref={innerRingRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.6, radius * 0.7, 32]} />
        <meshBasicMaterial 
          color={colors.secondary}
          wireframe={true} 
          transparent={true} 
          opacity={0.5}
        />
      </mesh>

      {/* Outer Detail Ring - Static horizontal */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.05, radius * 1.1, 48]} />
        <meshBasicMaterial 
          color={colors.accent}
          wireframe={true} 
          transparent={true} 
          opacity={0.4}
        />
      </mesh>

      {/* Central Core - Static horizontal */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, radius * 0.3, 16]} />
        <meshBasicMaterial 
          color={colors.core}
          wireframe={true} 
          transparent={true} 
          opacity={0.7}
        />
      </mesh>

      {/* REMOVED: Vertical grid lines that might be causing axis confusion */}
    </group>
  );
});

// Renamed and Exported: Scene Content for the character PREVIEW view with ShowcaseRig
export const CharacterPreviewContent = React.memo(({ modelPath, scale, animationName }) => {
  const groupRef = useRef();

  useThree(({ camera }) => {
    camera.layers.enableAll();
  });

  // Memoize the animation name to prevent unnecessary re-renders
  const finalAnimationName = useMemo(() => {
    return animationName || 'Armature|Idle|baselayer';
  }, [animationName]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.2, 3.5]} fov={45} />
      <ambientLight intensity={0.4} color="#0A1320" />
      
      {/* Simplified lighting setup */}
      <directionalLight position={[2, 3, 5]} intensity={1.2} color="#23E6CD" />
      <directionalLight position={[-3, 2, -4]} intensity={0.8} color="#FF8733" />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#F77F00" />
      
      {/* Rim lighting for aesthetic */}
      <directionalLight position={[0, 0, -5]} intensity={0.6} color="#0A9396" />

      <group ref={groupRef} position={[0, -0.1, 0]}>
        {/* Simplified Wireframe Platform */}
        <WireframePlatform radius={1.3} />
        
        {/* Character Model with ShowcaseRig for smooth rotation and floating */}
        <ShowcaseRig speed={0.5}>
          <Suspense fallback={<ModelLoadingFallback />}>
            <Model 
              modelPath={modelPath}
              scale={scale || 1.0}
              animationName={finalAnimationName}
              castShadow 
              receiveShadow
              position={[0, 0.1, 0]} 
            />
            <Preload all />
          </Suspense>
        </ShowcaseRig>
      </group>
      
      {/* Simplified OrbitControls */}
      <OrbitControls 
        target={[0, 0.85, 0]}
        enableZoom={true}
        enablePan={false}
        minDistance={2.0}
        maxDistance={6.0} 
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
        rotateSpeed={0.5}
      />
    </>
  );
});

// Add display names for debugging
Model.displayName = 'Model';
WireframePlatform.displayName = 'WireframePlatform';
CharacterPreviewContent.displayName = 'CharacterPreviewContent';

// Main CharacterModelViewer component is no longer needed as App.jsx renders the content
// export default CharacterModelViewer; 
