import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
// import { EffectComposer, Bloom } from '@react-three/postprocessing'; // Commented out
import GlowingWireframeSphere from './GlowingWireframeSphere';
// import * as THREE from 'three'; // THREE is not directly used in this file anymore

/**
 * HudExample Component
 *
 * Demonstrates the usage of the GlowingWireframeSphere component within a simulated
 * 1920x1080 HUD viewport. It includes a Canvas setup and a starfield background.
 * Post-processing (Bloom effect) is temporarily commented out.
 */
const HudExample = ({ 
  sphereRadius = 1.5,
  sphereSegments = 64,
  sphereOpacity = 0.15, // Reduced default opacity to better see stars through it
  sphereGradientColors = ['#00FFFF', '#FF00FF'], // Cyan to Magenta for example
  sphereEmissiveIntensity = 0.7,
  // bloomEffectIntensity = 1.2, // Related to Bloom, commented out
  // bloomLuminanceThreshold = 0.1, // Related to Bloom, commented out
  // bloomLuminanceSmoothing = 0.3, // Related to Bloom, commented out
  starCount = 5000,
}) => {
  // Props for the sphere, derived from HudExample's props
  const sphereProps = {
    radius: sphereRadius,
    segments: sphereSegments,
    opacity: sphereOpacity,
    gradientColors: sphereGradientColors,
    emissiveIntensity: sphereEmissiveIntensity,
  };

  return (
    <div 
      style={{
        width: '1920px', 
        height: '1080px', 
        background: '#101015', // Dark background for contrast
        border: '1px solid #333' // Optional: to visualize the viewport bounds
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Set a dark background color for the scene */}
        <color attach="background" args={['#101015']} />
        
        {/* Starfield background */}
        <Stars radius={100} depth={50} count={starCount} factor={4} saturation={0} fade speed={1} />

        {/* Basic lighting for the scene */}
        <ambientLight intensity={0.1} /> {/* Softer ambient light */}
        {/* PointLight can be removed if the glow is sufficient or add for highlights */}
        {/* <pointLight position={[0, 3, 3]} intensity={0.5} /> */}

        <Suspense fallback={null}> {/* Suspense for asynchronous loading of assets */}
          <GlowingWireframeSphere {...sphereProps} />
        </Suspense>

        {/* OrbitControls for camera manipulation (zoom, pan, rotate) */}
        <OrbitControls enableZoom={true} enablePan={true} />

        {/* <EffectComposer>
          <Bloom 
            intensity={bloomEffectIntensity} 
            luminanceThreshold={bloomLuminanceThreshold}
            luminanceSmoothing={bloomLuminanceSmoothing}
            mipmapBlur
            kernelSize={5}
          />
        </EffectComposer> */}
      </Canvas>
    </div>
  );
};

export default HudExample; 