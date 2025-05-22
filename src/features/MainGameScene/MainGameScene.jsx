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
      groupRef.current.position.copy(camera.position); // Group follows camera
    }
    if (starsRef.current) {
      starsRef.current.position.z += constantDriftSpeed * delta; // Stars drift locally
      if (starsRef.current.position.z > (props.depth || 50) * 0.5) {
        starsRef.current.position.z = -(props.depth || 50) * 0.5; // Reset
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
  strafeUp: 'strafeUp',     // New, matches App.jsx
  strafeDown: 'strafeDown'  // New, matches App.jsx
};

// Ship Component
const Ship = ({ modelPath, initialRotationY = 0, baseSpeedStat = 5, agilityStat = 5 }) => {
  const { scene } = useGLTF(modelPath);
  const shipPrimitiveRef = useRef(); 
  const thrusterLightRef = useRef();
  const { camera, gl } = useThree();
  const angularVelocity = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3());

  // Mouse input refs
  const mouseMovementX = useRef(0);
  const mouseMovementY = useRef(0);
  const isPointerLocked = useRef(false);

  // Gamepad refs
  const gamepadRef = useRef(null); // Stores the connected gamepad object
  const gamepadIndexRef = useRef(null); // Stores the index of the connected gamepad

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
  const strafeUpPressed = useKeyboardControls(state => state[Controls.strafeUp]);
  const strafeDownPressed = useKeyboardControls(state => state[Controls.strafeDown]);

  // Movement parameters 
  const baseMoveValue = 0.01; 
  const baseRotationValue = 0.012; 
  const moveSpeed = useMemo(() => baseMoveValue * baseSpeedStat, [baseSpeedStat]);
  const rotationSensitivity = useMemo(() => baseRotationValue * agilityStat, [agilityStat]);
  const mouseSensitivity = 0.002;
  const gamepadSensitivity = 0.025; // New: Gamepad sensitivity factor
  const gamepadDeadZone = 0.15; // New: Gamepad dead zone
  const boostMultiplier = 1.8; 
  const dampingFactor = 0.92;
  const rotationDamping = 0.90;
  const strafeSpeed = useMemo(() => moveSpeed * 0.8, [moveSpeed]);

  useEffect(() => {
    if (shipPrimitiveRef.current) { 
      shipPrimitiveRef.current.rotation.y = initialRotationY;
      if(angularVelocity.current) {
        angularVelocity.current.set(0,0,0);
      }
      velocity.current.set(0,0,0); 
    }
  }, [initialRotationY, shipPrimitiveRef]); 

  // Effect for mouse controls and pointer lock
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isPointerLocked.current) {
        mouseMovementX.current += event.movementX;
        mouseMovementY.current += event.movementY;
      }
    };

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === gl.domElement) {
        isPointerLocked.current = true;
        console.log('[Ship.jsx] Pointer Locked');
      } else {
        isPointerLocked.current = false;
        console.log('[Ship.jsx] Pointer Unlocked');
        mouseMovementX.current = 0;
        mouseMovementY.current = 0;
      }
    };
    
    // Pointer lock request is handled in App.jsx via canvas click

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      // Ensure pointer is unlocked if component unmounts while locked
      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [gl.domElement]);

  // Effect for gamepad connection/disconnection
  useEffect(() => {
    const handleGamepadConnected = (event) => {
      console.log('[Ship.jsx] Gamepad connected:', event.gamepad);
      // Prefer the first connected gamepad if multiple are present and one isn't already selected
      if (gamepadIndexRef.current === null) {
        gamepadIndexRef.current = event.gamepad.index;
        gamepadRef.current = event.gamepad; // Store the gamepad object
        console.log(`[Ship.jsx] Gamepad ${event.gamepad.id} assigned to index ${event.gamepad.index}`);
      }
    };

    const handleGamepadDisconnected = (event) => {
      console.log('[Ship.jsx] Gamepad disconnected:', event.gamepad);
      if (gamepadIndexRef.current === event.gamepad.index) {
        gamepadIndexRef.current = null;
        gamepadRef.current = null; // Clear the stored gamepad object
        console.log(`[Ship.jsx] Gamepad at index ${event.gamepad.index} unassigned.`);
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Check for already connected gamepads
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        handleGamepadConnected({ gamepad: gamepads[i] });
        break; // Assign the first one found
      }
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);


  useFrame((state, delta) => {
    if (!shipPrimitiveRef.current) return; 
    const ship = shipPrimitiveRef.current; 
    let currentThrustMagnitude = 0; 

    // --- Gamepad Input ---
    let gamepadYaw = 0;
    let gamepadPitch = 0;

    if (gamepadIndexRef.current !== null) {
      const gp = navigator.getGamepads()[gamepadIndexRef.current];
      if (gp) {
        gamepadRef.current = gp; // Keep ref updated
        // Left stick: axes[0] for X (Yaw), axes[1] for Y (Pitch)
        const rawGamepadYaw = gp.axes[0] || 0;
        const rawGamepadPitch = gp.axes[1] || 0;

        if (Math.abs(rawGamepadYaw) > gamepadDeadZone) {
          gamepadYaw = rawGamepadYaw;
        }
        if (Math.abs(rawGamepadPitch) > gamepadDeadZone) {
          gamepadPitch = rawGamepadPitch;
        }
      } else {
         // Gamepad might have been disconnected without event firing (rare)
         console.warn(`[Ship.jsx] Gamepad at index ${gamepadIndexRef.current} is null. Clearing.`);
         gamepadIndexRef.current = null;
         gamepadRef.current = null;
      }
    }
    
    // --- Rotation ---
    const rotationImpulse = rotationSensitivity * delta * 60; 
    // Keyboard rotation
    if (pitchUpPressed) angularVelocity.current.x -= rotationImpulse;
    if (pitchDownPressed) angularVelocity.current.x += rotationImpulse;
    if (yawLeftPressed) angularVelocity.current.y += rotationImpulse;
    if (yawRightPressed) angularVelocity.current.y -= rotationImpulse;
    if (rollLeftPressed) angularVelocity.current.z += rotationImpulse;
    if (rollRightPressed) angularVelocity.current.z -= rotationImpulse;

    // Mouse rotation (if pointer is locked)
    if (isPointerLocked.current) {
      const effectiveMouseSensitivity = mouseSensitivity; 
      angularVelocity.current.y -= mouseMovementX.current * effectiveMouseSensitivity; 
      angularVelocity.current.x -= mouseMovementY.current * effectiveMouseSensitivity; 
      
      mouseMovementX.current = 0;
      mouseMovementY.current = 0;
    }

    // Gamepad rotation (additive to keyboard/mouse for now, could be exclusive)
    // Note: gamepad axes are typically -1 to 1. Positive Y on left stick is often "down".
    angularVelocity.current.y += gamepadYaw * gamepadSensitivity * delta * 60; // Yaw
    angularVelocity.current.x += gamepadPitch * gamepadSensitivity * delta * 60; // Pitch
    
    // Apply angular velocity
    ship.rotateX(angularVelocity.current.x * delta);
    ship.rotateY(angularVelocity.current.y * delta);
    ship.rotateZ(angularVelocity.current.z * delta);
    angularVelocity.current.multiplyScalar(rotationDamping);
    
    // --- Translation & Other Logic ---
    let currentThrust = 0;
    if (forwardPressed) {
      currentThrust = moveSpeed;
      currentThrustMagnitude = 1.0;
    }
    if (backPressed) currentThrust = -moveSpeed * 0.6; 
    
    if (boostPressed && forwardPressed) {
      currentThrust *= boostMultiplier;
      currentThrustMagnitude = 2.5; 
    }

    if (thrusterLightRef.current) {
      const baseIntensity = 1.5; 
      const maxIntensity = 5.0;  
      const offIntensity = 0.1;   
      let targetIntensity = offIntensity;

      if (currentThrustMagnitude > 0) {
        targetIntensity = baseIntensity + (maxIntensity - baseIntensity) * ((currentThrustMagnitude - 1.0) / (2.5 - 1.0));
        targetIntensity = Math.max(baseIntensity, Math.min(targetIntensity, maxIntensity)); 
      } else if (currentThrust < 0) { 
        targetIntensity = 0.3;
      }
      
      thrusterLightRef.current.intensity = THREE.MathUtils.lerp(
        thrusterLightRef.current.intensity,
        targetIntensity,
        0.15 
      );
    }

    const actualDelta = delta * 60; 

    const forwardVector = new THREE.Vector3(0, 0, -1);
    forwardVector.applyQuaternion(ship.quaternion); 
    const thrustComponent = forwardVector.multiplyScalar(currentThrust * actualDelta);
    
    let strafeComponentY = 0;
    if (strafeUpPressed) strafeComponentY += strafeSpeed * actualDelta;
    if (strafeDownPressed) strafeComponentY -= strafeSpeed * actualDelta;

    velocity.current.add(thrustComponent); 
    velocity.current.multiplyScalar(dampingFactor); 
    
    ship.position.add(velocity.current); 
    ship.position.y += strafeComponentY; 
    
    const cameraIdealOffset = new THREE.Vector3(0, 1.5, 4.5); 
    const cameraIdealLookAt = new THREE.Vector3(0, 0.5, -10); 

    const idealPosition = ship.localToWorld(cameraIdealOffset.clone());
    const idealLookAtTarget = ship.localToWorld(cameraIdealLookAt.clone());

    camera.position.lerp(idealPosition, 0.15);
    camera.lookAt(idealLookAtTarget);
  });

  const thrusterPosition = [0, 0.1, 1]; 
  const thrusterColor = "#66ccff";

  return (
    <primitive object={scene} ref={shipPrimitiveRef} scale={1.0} position={[0, 0, 0]}> 
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
    camera.position.set(0, 2, 10); // Closer initial camera: Z from 20 to 10, Y from 5 to 2
    camera.fov = 70; // Slightly reduced FoV from 75
    camera.near = 0.1;
    camera.far = 2000; // Ensure far plane can see distant stars
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