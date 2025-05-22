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
  const modelGroupRef = useRef(); // Ref for the group containing the PlanetModel

  // This useFrame is for the overall group, if needed for additional animations later.
  // The PlanetModel itself handles its own Y-axis rotation.
  // useFrame((state, delta) => {
  //   if (modelGroupRef.current) {
  //     // Example: modelGroupRef.current.rotation.x += delta * 0.01; 
  //   }
  // });

  return (
    <>
      {/* Enhanced Lighting for Planets */}
      <ambientLight intensity={0.3} color={"#b0c4de"} /> {/* Softer, cool ambient (like starlight) */}
      
      {/* Main "Sun" Light - Stronger, slightly warm/orangey */}
      <directionalLight 
        position={[10, 5, 10]} 
        intensity={2.2} 
        color={"#ffedd5"} // Warm cream/pale orange
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Fill/Bounce Light - Subtle Teal from the opposite side */}
      <directionalLight 
        position={[-8, -3, -5]} 
        intensity={0.6} 
        color={"#5eead4"} // Lighter Teal
      />
      
      {/* Optional Rim/Accent Light */}
      {/* <pointLight position={[0, 0, -15]} intensity={0.5} color={"#a5f3fc"} /> */}

      <Suspense fallback={<mesh><boxGeometry args={[0.1,0.1,0.1]}/><meshBasicMaterial color="gray" wireframe/></mesh>}>
        <group ref={modelGroupRef}> {/* Added group for potential future collective transformations */}
          <PlanetModel
            modelPath={modelPath} 
            scale={scale || 0.5} 
            position={[0, 0, 0]} 
            castShadow // Ensure planet model casts shadow
            receiveShadow // Ensure planet model receives shadow
          />
        </group>
        <Preload all />
      </Suspense>
      
      <OrbitControls
        enableZoom={true}
        enablePan={true} 
        autoRotate={false} // PlanetModel handles its own Y rotation, disable here
        // autoRotateSpeed={0.2} // Keep commented as autoRotate is false
        minDistance={1.5} 
        maxDistance={15}
        target={[0, 0, 0]}
        enableDamping={true} // Smoother interaction
        dampingFactor={0.1}
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