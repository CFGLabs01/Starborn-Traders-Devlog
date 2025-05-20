import React, { useMemo } from 'react';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './GlowingWireframeSphere.shaders';

// Define GlowMaterial using shaderMaterial
const GlowMaterial = shaderMaterial(
  // Uniforms
  {
    topColor: new THREE.Color('#0A9396'),      // Default top color (Teal)
    bottomColor: new THREE.Color('#EE9B00'),   // Default bottom color (Orange)
    opacity: 0.25,                             // Default opacity
    radius: 1.0,                               // Default radius (used for gradient calculation)
    // emissive related uniforms are not needed here, as emissive is a material property
  },
  // Vertex Shader
  vertexShader,
  // Fragment Shader
  fragmentShader
);

// Extend R3F to recognize <glowMaterial />
extend({ GlowMaterial });

/**
 * GlowingWireframeSphere Component
 *
 * Renders a sphere with a wireframe that has a latitude-based color gradient,
 * transparency, emissive properties, and is designed to work with a Bloom post-processing pass.
 */
const GlowingWireframeSphere = ({
  radius = 1,
  segments = 64, // Combined widthSegments and heightSegments for simplicity
  opacity = 0.25,
  gradientColors = ['#0A9396', '#EE9B00'], // [topColor, bottomColor]
  emissiveIntensity = 0.7, // Intensity of the material's emissive property
  // bloomIntensity is a prop for the Bloom effect in the parent Canvas, not directly used here.
}) => {

  // Memoize uniforms to prevent recreation on every render unless dependencies change.
  const uniforms = useMemo(() => ({
    topColor: { value: new THREE.Color(gradientColors[0]) },
    bottomColor: { value: new THREE.Color(gradientColors[1]) },
    opacity: { value: opacity },
    radius: { value: radius },
  }), [gradientColors, opacity, radius]);

  return (
    <mesh>
      {/* Sphere geometry: uses radius and segments props */}
      <sphereGeometry args={[radius, segments, segments]} />
      
      {/* 
        Custom GlowMaterial for the wireframe effect.
        - wireframe={true} renders only the edges.
        - uniforms pass the dynamic color, opacity, and radius to the shader.
        - transparent={true} and blending={THREE.AdditiveBlending} achieve the see-through glow.
        - depthWrite={false} is often needed for correct rendering of transparent additive materials.
        - emissive and emissiveIntensity make the material glow, which is picked up by the Bloom pass.
      */}
      {/* @ts-ignore FlowMaterial is not a known JSX element */}
      <glowMaterial
        key={GlowMaterial.key} // Add key for material updates if needed
        attach="material"
        uniforms={uniforms}
        wireframe={true} // Render as wireframe
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        emissive={new THREE.Color('white')} // Emissive color is white to not tint the shader color
        emissiveIntensity={emissiveIntensity} // Controls the "strength" of the glow
        side={THREE.DoubleSide} // Ensures material is visible from all angles
      />
    </mesh>
  );
};

export default GlowingWireframeSphere; 