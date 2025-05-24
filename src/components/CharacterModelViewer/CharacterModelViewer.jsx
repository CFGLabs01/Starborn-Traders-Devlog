import React, { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, useAnimations, PerspectiveCamera } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
// import { EffectComposer, Bloom } from '@react-three/postprocessing'; // Commented out for now
import { useGameState } from '../../context/GameStateContext';
import CharacterPlatform from '../CharacterPlatform/CharacterPlatform';
import ShowcaseRig from '../ShowcaseRig';
import CharacterModelErrorBoundary from './ErrorBoundary';

// Store TARGET_HEIGHT so all models align
const TARGET_HEIGHT = 1.8;

// Simple reusable Model loader with animation support
const Model = React.memo(({ modelPath, animationName, ...props }) => {
  const group = useRef();
  const { scene, animations, error } = useGLTF(modelPath, true);
  const { actions } = useAnimations(animations, group);

  // Play idle animation or first available animation
  useEffect(() => {
    if (error) {
      console.error(`[Character Model] Error loading ${modelPath}:`, error);
      return;
    }
    
    // Guard: if no animations, skip gracefully
    if (!actions || Object.keys(actions).length === 0) {
      console.log(`[Character Model] No animations found for ${modelPath}`);
      return;
    }

    // Try to find Idle animation, fallback to first available
    const idle = actions['Idle'] ?? actions[animationName] ?? Object.values(actions)[0];
    
    if (idle) {
      idle.reset().fadeIn(0.3).play();
      console.log(`[Character Model] Playing animation: ${idle.getClip().name}`);
    }

    return () => {
      if (idle) {
        idle.fadeOut(0.3);
      }
    };
  }, [actions, animationName, error, modelPath]);

  // Auto-scale and position model based on bounding box
  useEffect(() => {
    if (scene && group.current) {
      // Center all mesh geometries
      scene.traverse(o => {
        if (o.isMesh) {
          o.geometry.center();
          if (o.material) {
            o.material.metalness = 0.6;
            o.material.roughness = 0.2;
          }
        }
      });

      // Compute bounding box for auto-scaling
      const box = new Box3().setFromObject(scene);
      const height = box.max.y - box.min.y;
      
      if (height > 0) {
        const scale = TARGET_HEIGHT / height;
        group.current.scale.setScalar(scale);
        group.current.position.y = -box.min.y * scale; // feet to 0
        console.log(`[Character Model] Auto-scaled: height=${height.toFixed(2)}, scale=${scale.toFixed(2)}`);
      }
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

// Renamed and Exported: Scene Content for the character PREVIEW view with proper pivot
export const CharacterPreviewContent = React.memo(({ modelPath, scale, animationName, autoRotate = true, rotationSpeed = 0.3 }) => {
  const groupRef = useRef();
  const pedestalRef = useRef();  // meshes
  const pivotRef = useRef();     // NEW group for rotation

  useThree(({ camera }) => {
    camera.layers.enableAll();
  });

  // Frame loop – rotate the pivot not the mesh
  useFrame((_, delta) => {
    if (autoRotate && pivotRef.current) {
      pivotRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  // Memoize the animation name to prevent unnecessary re-renders
  const finalAnimationName = useMemo(() => {
    return animationName || 'Armature|Idle|baselayer';
  }, [animationName]);

  // Camera positioning based on character height
  const cameraPosition = useMemo(() => {
    const characterHeight = TARGET_HEIGHT;
    return [0, characterHeight * 0.8, characterHeight * 2];
  }, []);

  return (
    <CharacterModelErrorBoundary>
      <PerspectiveCamera makeDefault position={cameraPosition} fov={45} />
      <ambientLight intensity={0.4} color="#0A1320" />
      
      {/* Simplified lighting setup */}
      <directionalLight position={[2, 3, 5]} intensity={1.2} color="#23E6CD" />
      <directionalLight position={[-3, 2, -4]} intensity={0.8} color="#FF8733" />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#F77F00" />
      
      {/* Rim lighting for aesthetic */}
      <directionalLight position={[0, 0, -5]} intensity={0.6} color="#0A9396" />

      <group ref={groupRef} position={[0, -0.1, 0]}>
        {/* Pivot group for rotation */}
        <group ref={pivotRef}>
          <ShowcaseRig>
            {/* Wireframe Platform - locked flat with original rotation */}
            <mesh ref={pedestalRef} position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.0, 1.3, 64]} />
              <meshBasicMaterial 
                color="#0a9396"
                wireframe={true} 
                transparent={true} 
                opacity={0.6}
              />
            </mesh>
            
            {/* Character Model */}
            <Suspense fallback={<ModelLoadingFallback />}>
              <Model 
                modelPath={modelPath}
                scale={scale || 1.0}
                animationName={finalAnimationName}
                castShadow 
                receiveShadow
                position={[0, -1.25, 0]} 
              />
              <Preload all />
            </Suspense>
          </ShowcaseRig>
        </group>
      </group>
      
      {/* Simplified OrbitControls */}
      <OrbitControls 
        target={[0, TARGET_HEIGHT * 0.5, 0]}
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
    </CharacterModelErrorBoundary>
  );
});

// Add display names for debugging
Model.displayName = 'Model';
WireframePlatform.displayName = 'WireframePlatform';
CharacterPreviewContent.displayName = 'CharacterPreviewContent';

// Main CharacterModelViewer component is no longer needed as App.jsx renders the content
// export default CharacterModelViewer; 
