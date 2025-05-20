import React, { Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars as DreiStars, useGLTF, KeyboardControls, useKeyboardControls, Plane, useTexture } from '@react-three/drei';
import { useGameState } from '../../context/GameStateContext';
import * as THREE from 'three';
import DevNoteSticky from '../../components/DevNotes/DevNoteSticky';
import ShootingStars from './ShootingStars';

// Component to render stars that follow the camera and have a constant drift
function MovingStars({ constantDriftSpeed = 0.1, ...props }) {
  const starsRef = useRef();
  const groupRef = useRef(); // Ref for the group that follows the camera
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.copy(camera.position); // Group follows camera for parallax
    }
    if (starsRef.current) {
      // Stars drift constantly towards the camera (negative Z in their local space)
      starsRef.current.position.z += constantDriftSpeed * delta;
      // Optional: Reset stars if they drift too far behind the camera origin of the group
      // This depends on the depth and radius of the stars
      if (starsRef.current.position.z > (props.depth || 50) * 0.5) { // Reset if halfway through depth
        starsRef.current.position.z = -(props.depth || 50) * 0.5; // Reset to back
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* The Stars component itself will be parented to this group */}
      {/* We apply the constant drift to the Stars ref directly */}
      <DreiStars ref={starsRef} {...props} />
    </group>
  );
}

// Define control mapping
const Controls = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  boost: 'boost',
  pitchUp: 'pitchUp',
  pitchDown: 'pitchDown',
  rollLeft: 'rollLeft',
  rollRight: 'rollRight',
};

// Ship Component - Remove React.forwardRef and the ref parameter for now
const Ship = ({ modelPath, initialRotationY = 0, baseSpeedStat = 5, agilityStat = 5 }) => {
  const { scene } = useGLTF(modelPath);
  const shipPrimitiveRef = useRef(); // Local ref for the primitive if needed by ship itself
  const thrusterLightRef = useRef();
  const { camera } = useThree();
  const angularVelocity = useRef(new THREE.Vector3(0, 0, 0));

  console.log(`[MainGameScene > Ship] Component created/re-rendered. modelPath: ${modelPath}, initialRotationY: ${initialRotationY}, baseSpeed: ${baseSpeedStat}, agility: ${agilityStat}`);

  // Keyboard control states
  const forwardPressed = useKeyboardControls(state => state[Controls.forward]);
  const backPressed = useKeyboardControls(state => state[Controls.back]);
  const yawLeftPressed = useKeyboardControls(state => state[Controls.left]);
  const yawRightPressed = useKeyboardControls(state => state[Controls.right]);
  const boostPressed = useKeyboardControls(state => state[Controls.boost]);
  const pitchUpPressed = useKeyboardControls(state => state[Controls.pitchUp]);
  const pitchDownPressed = useKeyboardControls(state => state[Controls.pitchDown]);
  const rollLeftPressed = useKeyboardControls(state => state[Controls.rollLeft]);
  const rollRightPressed = useKeyboardControls(state => state[Controls.rollRight]);

  // Movement parameters - now derived from stats
  // Define base values and scaling factors for stats
  const baseMoveValue = 0.01; // Base speed unit per stat point
  const baseRotationValue = 0.008; // Increased baseRotationValue for more responsive turning
  const moveSpeed = useMemo(() => baseMoveValue * baseSpeedStat, [baseSpeedStat]);
  const rotationSensitivity = useMemo(() => baseRotationValue * agilityStat, [agilityStat]);
  const boostMultiplier = 1.8; // Keep boost as a multiplier for now
  const dampingFactor = 0.92;
  const rotationDamping = 0.90;

  // State for velocity and rotation
  const velocity = useRef(new THREE.Vector3());

  useEffect(() => {
    if (shipPrimitiveRef.current) { // Use local ref
      console.log(`[MainGameScene > Ship useEffect] Applying initialRotationY=${initialRotationY} to local shipPrimitiveRef. Current rotation.y before: ${shipPrimitiveRef.current.rotation.y}`);
      shipPrimitiveRef.current.rotation.y = initialRotationY;
      console.log(`[MainGameScene > Ship useEffect] After applying, rotation.y: ${shipPrimitiveRef.current.rotation.y}`);
      if(angularVelocity.current) {
        angularVelocity.current.set(0,0,0);
      }
    }
  }, [initialRotationY, shipPrimitiveRef]); // Depend on local ref

  useFrame((state, delta) => {
    if (!shipPrimitiveRef.current) return; // Use local ref
    const ship = shipPrimitiveRef.current; // Use local ref
    let currentThrustMagnitude = 0; // To control thruster light intensity

    let currentThrust = 0;
    if (forwardPressed) {
      currentThrust = moveSpeed;
      currentThrustMagnitude = 1.0;
    }
    if (backPressed) currentThrust = -moveSpeed * 0.6; // Reverse doesn't typically have strong forward thrusters
    
    if (boostPressed && forwardPressed) {
      currentThrust *= boostMultiplier;
      currentThrustMagnitude = 2.5; // Higher intensity for boost
    }

    // --- Rotation --- (Temporarily disable live rotation updates for debugging orientation)
    const rotationImpulse = rotationSensitivity * delta * 60; // This was re-enabled by user
    // if (pitchUpPressed) angularVelocity.current.x -= rotationImpulse;
    // if (pitchDownPressed) angularVelocity.current.x += rotationImpulse;
    // if (yawLeftPressed) angularVelocity.current.y += rotationImpulse;
    // if (yawRightPressed) angularVelocity.current.y -= rotationImpulse;
    // if (rollLeftPressed) angularVelocity.current.z += rotationImpulse;
    // if (rollRightPressed) angularVelocity.current.z -= rotationImpulse;

    // ship.rotateX(angularVelocity.current.x * delta);
    // ship.rotateY(angularVelocity.current.y * delta);
    // ship.rotateZ(angularVelocity.current.z * delta);
    // angularVelocity.current.multiplyScalar(rotationDamping);

    // --- Thruster Light Intensity ---
    if (thrusterLightRef.current) {
      const baseIntensity = 1.5; // Base visible intensity when thrusting
      const maxIntensity = 5.0;  // Max intensity for full boost
      const offIntensity = 0.1;   // Dim glow when idle
      let targetIntensity = offIntensity;

      if (currentThrustMagnitude > 0) {
        // Scale intensity: if currentThrustMagnitude is 1 (normal) -> baseIntensity, if 2.5 (boost) -> maxIntensity
        targetIntensity = baseIntensity + (maxIntensity - baseIntensity) * ((currentThrustMagnitude - 1.0) / (2.5 - 1.0));
        targetIntensity = Math.max(baseIntensity, Math.min(targetIntensity, maxIntensity)); // Clamp for safety
      } else if (currentThrust < 0) { // Small glow for reverse if desired
        targetIntensity = 0.3;
      }
      
      thrusterLightRef.current.intensity = THREE.MathUtils.lerp(
        thrusterLightRef.current.intensity,
        targetIntensity,
        0.15 // Smoothing factor
      );
    }

    // --- Translation --- 
    const forwardVector = new THREE.Vector3(0, 0, -1);
    forwardVector.applyQuaternion(ship.quaternion); // Get ship's current forward direction
    velocity.current.add(forwardVector.multiplyScalar(currentThrust * delta * 60));
    velocity.current.multiplyScalar(dampingFactor);
    ship.position.add(velocity.current);

    // --- Camera Follow --- 
    // More robust camera: fixed offset, looking at a point slightly in front of the ship
    const cameraIdealOffset = new THREE.Vector3(0, 1.5, 4.5); // Offset from ship's center
    const cameraIdealLookAt = new THREE.Vector3(0, 0.5, -10); // Point in front of ship to look at (local space)

    const idealPosition = ship.localToWorld(cameraIdealOffset.clone());
    const idealLookAtTarget = ship.localToWorld(cameraIdealLookAt.clone());

    camera.position.lerp(idealPosition, 0.15);
    camera.lookAt(idealLookAtTarget);

    // Optional: Clamp camera movement to avoid extreme angles if desired
    // This can be complex with full 3D rotation; for now, rely on lerp and lookAt
  });

  // Scale and position the thruster light relative to the ship model
  // These values are guesses and will need adjustment based on your ship models
  const thrusterPosition = [0, 0.1, 1]; 
  const thrusterColor = "#66ccff";

  return (
    <primitive object={scene} ref={shipPrimitiveRef} scale={1.0} position={[0, 0, 0]}> {/* Restored scale to 1.0 */}
      <pointLight 
        ref={thrusterLightRef} 
        position={thrusterPosition} 
        intensity={0.2} 
        color={thrusterColor} 
        distance={4} 
        decay={2} 
      />
    </primitive>
  );
};

// Component for a distant galaxy/nebula billboard
function DistantGalaxy({ texturePath = '/assets/textures/milky_way_placeholder.png' }) {
  const texture = useTexture(texturePath);
  const { camera } = useThree();
  const planeRef = useRef();

  useFrame(() => {
    if (planeRef.current) {
      // Position far away and always face the camera (billboard effect)
      // Adjust distance and scale as needed
      const distance = 800; 
      planeRef.current.position.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(distance));
      planeRef.current.lookAt(camera.position);
    }
  });

  // Adjust size of the plane as needed. Texture aspect ratio should be considered.
  return (
    <Plane ref={planeRef} args={[600, 300]} > {/* Example size, adjust based on texture */}
      <meshStandardMaterial 
        map={texture} 
        transparent 
        opacity={0.25} // Make it subtle
        depthWrite={false} // To prevent issues with other transparent objects
        blending={THREE.AdditiveBlending} // For a luminous effect against dark bg
        emissive="#ffffff" // Give it some self-illumination
        emissiveIntensity={0.1}
        side={THREE.DoubleSide}
      />
    </Plane>
  );
}

const MainGameScene = () => {
  const { ship: shipDataFromContext } = useGameState();
  const shipModelPath = shipDataFromContext?.modelPath || '/assets/models/Ships/Solis Warden.glb';
  const shipInitialRotationY = shipDataFromContext?.initialRotationY || 0;
  const shipBaseSpeed = shipDataFromContext?.stats?.speed || 5;
  const shipAgility = shipDataFromContext?.stats?.agility || 5;

  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 3, 12); // AAA-style third-person
    camera.fov = 70;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  console.log('[MainGameScene] Rendering R3F elements.');
  if (shipDataFromContext) {
    console.log('[MainGameScene] shipDataFromContext:', shipDataFromContext);
    console.log(`[MainGameScene] Derived ship props: modelPath: ${shipModelPath}, initialRotationY: ${shipInitialRotationY}, baseSpeed: ${shipBaseSpeed}, agility: ${shipAgility}`);
  } else {
    console.warn('[MainGameScene] shipDataFromContext is null/undefined. Using default ship props.');
  }

  // NOTE: HUD, DevNoteSticky, KeyboardControls must be handled in App.jsx or another parent component outside the main Canvas
  const showDistantGalaxy = false; // This should be respected, but we'll also comment out the usage

  return (
    <>
      {/* Scene Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.0} color="#FFFFFF" />
      
      {/* Scene Content */}
      <Suspense fallback={null}>
        <Ship 
          modelPath={shipModelPath} 
          initialRotationY={shipInitialRotationY} 
          baseSpeedStat={shipBaseSpeed} 
          agilityStat={shipAgility} 
        />
        {/* {showDistantGalaxy && <DistantGalaxy />} */}{/* Forcefully commented out */}
        <ShootingStars count={25} speed={15} />
      </Suspense>
      
      {/* Layer 1: Distant, Dense Stars */}
      <MovingStars 
        constantDriftSpeed={0.05} // Slower drift for distant layer
        radius={350}      // Wider field
        depth={180}       // More depth
        count={7000}      
        factor={5}        // Smaller factor for more point-like distant stars
        saturation={0}    
        fade              
        speed={0.3}       // Slower fade twinkle speed
      /> 
      {/* Layer 2: Mid-ground, Sparser, Faster Drift Stars */}
      <MovingStars 
        constantDriftSpeed={0.2} // Faster drift for closer layer
        radius={200}      // Smaller radius, appears closer
        depth={80}        // Less depth than distant layer
        count={1500}      // Sparser count
        factor={7}        // Larger factor for more prominent closer stars
        saturation={0}    
        fade              
        speed={0.7}       // Faster fade twinkle speed
      /> 
      <DreiStars radius={200} depth={100} count={3000} factor={4} fade speed={0.2} />
    </>
  );
};

export default MainGameScene; 