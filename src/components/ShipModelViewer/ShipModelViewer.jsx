import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Simple reusable Model loader
function Model({ modelPath, initialRotationY = 0, ...props }) {
  console.log(`[Model Component] Attempting to load: ${modelPath}`);
  console.log(`[Model Component] Received scale prop: ${props.scale}`);
  const { scene, error } = useGLTF(modelPath, true);
  const modelRef = useRef();

  useEffect(() => {
    if (scene && modelRef.current) {
      modelRef.current.rotation.y = initialRotationY;
    }
  }, [scene, initialRotationY]);

  useEffect(() => {
    if (scene) {
      // console.log('[Model Component] Loaded model scene:', scene); // Keep commented unless debugging
    }
  }, [scene]);

  if (error) {
    console.error(`[Model Component] Error loading model ${modelPath}:`, error);
    return <mesh><boxGeometry /><meshBasicMaterial color="purple" wireframe /></mesh>;
  }
  if (!scene) {
    console.warn(`[Model Component] No scene returned from useGLTF for: ${modelPath}`);
    return <mesh><boxGeometry /><meshBasicMaterial color="orange" wireframe /></mesh>;
  }
  // console.log(`[Model Component] Successfully loaded scene for: ${modelPath}`, scene); // Keep commented

  useFrame((state, delta) => {
    if (modelRef.current && props.autoRotate) { // Added autoRotate prop check for model card
      modelRef.current.rotation.y += delta * 0.3; 
    }
  });

  const clonedScene = scene.clone(); // Clone outside of return
  return <primitive object={clonedScene} ref={modelRef} {...props} />; // Pass scale from props directly
}

// Renamed to ShipPreviewContent - this is what will be rendered inside the View
export function ShipPreviewContent({ modelPath, scale, initialRotationY }) {
  console.log('[ShipPreviewContent] Rendering with modelPath:', modelPath, 'Scale:', scale, 'InitialRotationY:', initialRotationY);
  const contentGroupRef = useRef(); // Added for auto-rotation

  // Auto-rotation for the ship model group
  useFrame((state, delta) => {
    if (contentGroupRef.current) {
      contentGroupRef.current.rotation.y += delta * 0.15; // Adjust speed as needed
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.5, 6]} fov={45} /> {/* Adjusted camera slightly */}
      
      {/* Lighting Setup - Consistent with CharacterPreview */}
      <ambientLight intensity={0.5} color={"#e0f2fe"} /> {/* Soft cream ambient */}
      
      <directionalLight 
        position={[4, 4, 3]} 
        intensity={1.9} 
        color={"#67e8f9"} // Teal key light
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      <directionalLight 
        position={[-4, 3, -3]} 
        intensity={0.9} 
        color={"#fed7aa"} // Pale Orange/Cream fill
      />
      
      <pointLight 
        position={[0, 3, -4]} 
        intensity={0.8} 
        color={"#fef3c7"} // Cream rim/accent
        distance={12}
        decay={1.5}
      />

      {/* Group for rotation and model positioning */}
      <group ref={contentGroupRef} position={[0, 0, 0]}>
        <Suspense fallback={<mesh><boxGeometry args={[0.5,0.5,0.5]}/><meshStandardMaterial color="blue" wireframe /></mesh>}> 
          <Model 
            modelPath={modelPath} 
            scale={scale || 1} 
            position={[0, 0, 0]}
            initialRotationY={initialRotationY}
            castShadow  // Ensure model casts shadows
            receiveShadow // Ensure model receives shadows
          />
          <Preload all />
        </Suspense>
      </group>

      <OrbitControls 
        target={[0, 0.5, 0]} // Adjust target based on typical ship height/center
        enableZoom={true} 
        enablePan={false} // Disable pan for cleaner preview
        minDistance={2}
        maxDistance={15} 
        autoRotate={false} // Our group handles rotation
        enableDamping={true}
        dampingFactor={0.1}
      />
    </>
  );
}

// Default export: ShipModelViewer for use in ShipCard (renders a small Canvas with debug mesh and model)
const ShipModelViewer = ({ modelPath }) => {
  // Card preview: small, simple, robust
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{ width: '100%', height: '100%', background: 'transparent', borderRadius: '0.5rem' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 2]} intensity={1.5} />
      <Suspense fallback={<mesh><boxGeometry args={[0.3,0.3,0.3]}/><meshBasicMaterial color="gray" wireframe/></mesh>}>
        <>
          {/* Debug mesh at origin - can be removed later */}
          {/* <mesh position={[0,0,0]}>
            <boxGeometry args={[0.3,0.3,0.3]} />
            <meshStandardMaterial color="lime" wireframe />
          </mesh> */}
          {/* Ship model */}
          {modelPath && <Model modelPath={modelPath} scale={1.2} position={[0,0,0]} autoRotate={true} />}
          <Preload all />
        </>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
    </Canvas>
  );
};
export default ShipModelViewer; 