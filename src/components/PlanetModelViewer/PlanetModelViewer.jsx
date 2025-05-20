import React, { Suspense, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Preload, OrbitControls } from '@react-three/drei';

// Reusable Model loader
function PlanetModel({ modelPath, scale, ...props }) {
  const { scene, error } = useGLTF(modelPath, true);
  const modelRef = useRef();

  if (error) {
    console.error(`[PlanetModel Component] Error loading ${modelPath}:`, error);
    return <mesh><boxGeometry /><meshBasicMaterial color="purple" wireframe /></mesh>;
  }
  if (!scene) {
    console.warn(`[PlanetModel Component] No scene from useGLTF for ${modelPath}`);
    return <mesh><boxGeometry /><meshBasicMaterial color="orange" wireframe /></mesh>;
  }

  // Auto-rotation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.05; // Even slower rotation for planets
    }
  });
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} ref={modelRef} scale={scale} {...props} />;
}

// Renamed and Exported: Scene Content for the planet PREVIEW view
export function PlanetPreviewContent({ planetData }) {
  if (!planetData) {
    console.warn('[PlanetPreviewContent] No planetData provided.');
    return null; // Or a fallback UI
  }
  console.log('[PlanetPreviewContent] Rendering with planetData:', planetData);
  const { modelPath, scale, name } = planetData; // Destructure needed values

  return (
    <>
      {/* Basic Lighting - slightly adjusted */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color='blue' /> {/* Corrected color from #blue to blue */}

      {/* DEBUG BOX - can be removed later */}
      {/* <mesh position={[0, 0, -2]} scale={[1,1,1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="cyan" wireframe />
      </mesh> */} 

      <Suspense fallback={<mesh><boxGeometry args={[0.1,0.1,0.1]}/><meshBasicMaterial color="gray" wireframe/></mesh>}>
        <PlanetModel
          modelPath={modelPath} // Use destructured modelPath
          scale={scale || 0.5} // Use destructured scale, default to 0.5 if undefined (planets might be large)
          position={[0, 0, 0]} 
        />
        <Preload all />
      </Suspense>
      {/* OrbitControls for Planet Preview View */}
      <OrbitControls
        enableZoom={true}
        enablePan={true} // Enabled pan
        autoRotate={true} 
        autoRotateSpeed={0.2} // Slowed down auto-rotate further
        minDistance={1.5} // Adjusted distances
        maxDistance={15}
        target={[0, 0, 0]}
      />
    </>
  );
}

// Add a default export for PlanetCard to consume
const PlanetModelViewer = ({ modelPath, isCardView }) => {
  // This component is imported by PlanetCard.jsx.
  // For now, it returns a placeholder as 3D rendering directly in cards is complex.
  // console.log('PlanetModelViewer (card placeholder) received modelPath:', modelPath, 'isCardView:', isCardView);
  return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#777', fontSize: '12px' }}>3D Preview Disabled in Card</div>;
};
export default PlanetModelViewer; 