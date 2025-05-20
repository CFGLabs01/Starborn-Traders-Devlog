import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Preload, PerspectiveCamera, Box as DreiBox } from '@react-three/drei';
import * as THREE from 'three';

// Simple reusable Model loader
function Model({ modelPath, initialRotationY = 0, ...props }) {
  console.log(`[Model Component] Attempting to load: ${modelPath}`);
  console.log(`[Model Component] Received scale prop: ${props.scale}`);
  const { scene, error } = useGLTF(modelPath, true);
  const modelRef = useRef();

  useEffect(() => {
    if (scene && modelRef.current) {
      // Apply initial rotation when the model is loaded/ref is available
      modelRef.current.rotation.y = initialRotationY;
    }
  }, [scene, initialRotationY]);

  useEffect(() => {
    if (scene) {
      console.log('[Model Component] Loaded model scene:', scene);
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
  console.log(`[Model Component] Successfully loaded scene for: ${modelPath}`, scene);

  // Auto-rotation for preview
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3; 
    }
  });

  // Force scale for card preview
  const cardScale = props.scale || 1.2;
  return <primitive object={scene.clone()} ref={modelRef} {...props} scale={cardScale} />;
}

// Renamed to ShipPreviewContent - this is what will be rendered inside the View
export function ShipPreviewContent({ modelPath, scale, initialRotationY }) {
  console.log('[ShipPreviewContent] Rendering with modelPath:', modelPath, 'Scale:', scale, 'InitialRotationY:', initialRotationY);

  // TEMPORARILY SIMPLIFIED FOR DEBUGGING
  return (
    <>
      <ambientLight intensity={1.0} />
      <DreiBox args={[1, 1, 1]} material-color="green" />
      <OrbitControls makeDefault />
    </>
  );

  /* Original Content:
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} /> 
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Suspense fallback={<mesh><boxGeometry args={[0.5,0.5,0.5]}/><meshStandardMaterial color="blue" wireframe /></mesh>}> 
        <Model 
          modelPath={modelPath} 
          scale={scale || 1} 
          position={[0, 0, 0]}
          initialRotationY={initialRotationY}
        />
        <Preload all />
      </Suspense>
      <OrbitControls enableZoom={true} enablePan={true} makeDefault />
    </>
  );
  */
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
        {/* Debug mesh at origin */}
        <mesh position={[0,0,0]}>
          <boxGeometry args={[0.3,0.3,0.3]} />
          <meshStandardMaterial color="lime" wireframe />
        </mesh>
        {/* Ship model */}
        {modelPath && <Model modelPath={modelPath} scale={1.2} position={[0,0,0]} />}
        <Preload all />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
    </Canvas>
  );
};
export default ShipModelViewer; 