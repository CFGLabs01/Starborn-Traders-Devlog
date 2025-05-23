import React, { useState, useRef, Suspense, useEffect, useMemo } from 'react';
import {
  BrowserRouter as Router,
  // Routes, // Routes might be managed differently or within Views
  // Route,
} from 'react-router-dom';
import { Canvas } from '@react-three/fiber'; // Import Canvas
import { View, KeyboardControls, Stars as DreiStars, OrbitControls as DreiOrbitControls, Box as DreiBox, PerspectiveCamera } from '@react-three/drei'; // Import View, KeyboardControls, DreiStars, AND PerspectiveCamera

import './styles/main.css'; 
import { GameStateProvider } from './context/GameStateContext';
import { EventProvider } from './context/EventContext';

import TitleScreen from './features/TitleScreen/TitleScreen';
import CharacterSelection from './features/CharacterSelection/CharacterSelection';
import ShipSelection from './features/ShipSelection/ShipSelection';
import PlanetSelection from './features/PlanetSelection/PlanetSelection';
import MainGameScene from './features/MainGameScene/MainGameScene'; 
// EventManager and HudAlert will be conditionally rendered with MainGameScene content
// import MinimalAnimationTest from './components/MinimalAnimationTest';

// The old ThreeStarfield might need to be integrated into the main canvas or a specific view
// import ThreeStarfield from './components/ThreeStarfield/ThreeStarfield';

// Import the preview content component
import { ShipPreviewContent } from './components/ShipModelViewer/ShipModelViewer'; 
// Import Character preview content
import { CharacterPreviewContent } from './components/CharacterModelViewer/CharacterModelViewer'; 
// Import Planet preview content
import { PlanetPreviewContent } from './components/PlanetModelViewer/PlanetModelViewer';

// Define control mapping (moved from MainGameScene)
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
  strafeUp: 'strafeUp',
  strafeDown: 'strafeDown',
};

function App() {
  const [currentPhase, setCurrentPhase] = useState('title'); 
  
  // State to control what content the preview View should render
  const [previewContent, setPreviewContent] = useState(null);
  // NEW: State to hold the ref of the DOM element the View should track
  const [activePreviewTarget, setActivePreviewTarget] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  // Quick Toggle for QA - preview visibility state
  const [showPreviewToggle, setShowPreviewToggle] = useState(true);

  const controlsMap = useMemo(() => [
    { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
    { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
    { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
    { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
    { name: Controls.boost, keys: ['ShiftLeft', 'ShiftRight'] },
    { name: Controls.pitchUp, keys: ['KeyR'] },
    { name: Controls.pitchDown, keys: ['KeyF'] },
    { name: Controls.rollLeft, keys: ['KeyQ'] },
    { name: Controls.rollRight, keys: ['KeyE'] },
    { name: Controls.strafeUp, keys: ['Space'] },
    { name: Controls.strafeDown, keys: ['ControlLeft', 'KeyC'] },
  ], []);

  useEffect(() => {
    console.log('[App.jsx] Current phase changed to:', currentPhase);
  }, [currentPhase]);

  // Quick Toggle for QA - 'C' key toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'c' && !e.ctrlKey) { // Avoid conflict with Ctrl+C
        setShowPreviewToggle(v => !v);
        console.log('[App.jsx] Preview toggle:', !showPreviewToggle);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPreviewToggle]);

  // DualShock Smoke Test - Optional gamepad detection
  useEffect(() => {
    const checkGamepad = () => {
      const pad = navigator.getGamepads()[0];
      if (pad) {
        console.log('[App.jsx] DualShock connected:', pad.id, 'Axes:', pad.axes);
        // Confirm right stick moves camera orbit - log right stick axes
        if (pad.axes.length >= 4) {
          const rightStickX = pad.axes[2];
          const rightStickY = pad.axes[3];
          if (Math.abs(rightStickX) > 0.1 || Math.abs(rightStickY) > 0.1) {
            console.log('[App.jsx] Right stick movement detected:', { x: rightStickX, y: rightStickY });
          }
        }
      }
    };

    // Check gamepad status periodically
    const gamepadInterval = setInterval(checkGamepad, 1000);
    return () => clearInterval(gamepadInterval);
  }, []);

  const handleSelectionComplete = (nextPhase) => {
    console.log(`[App.jsx] Transitioning from ${currentPhase} to ${nextPhase}`);
    setCurrentPhase(nextPhase);
    setPreviewContent(null); 
    setActivePreviewTarget(null); // Clear target on phase change
  };

  const startGame = () => {
    console.log('[App.jsx] startGame called, setting phase to character');
    setCurrentPhase('character');
  }

  // MODIFIED: showPreview now accepts a targetRef
  const showPreview = (content, targetRef) => {
    console.log('[App.jsx] showPreview called with content and targetRef:', content, targetRef);
    if (targetRef && targetRef.current) {
      setPreviewContent(content); 
      setActivePreviewTarget(targetRef); // Store the ref itself
      setPreviewKey(k => k + 1); 
    } else {
      console.warn('[App.jsx] showPreview called without a valid targetRef.current. Preview will not be shown.');
      setPreviewContent(null);
      setActivePreviewTarget(null);
    }
  };

  const hidePreview = () => {
    console.log('[App.jsx] hidePreview called.');
    setPreviewContent(null); 
    setActivePreviewTarget(null); // Clear target on hide
  };

  const renderCurrentPhaseComponent = () => {
    switch (currentPhase) {
      case 'title':
        return <TitleScreen onStartGame={startGame} />;
      case 'character':
        return (
          <CharacterSelection
            onSelectionComplete={handleSelectionComplete}
            showPreview={showPreview} // Pass modified showPreview
            hidePreview={hidePreview}
          />
        );
      case 'ship':
        return (
          <ShipSelection 
            onSelectionComplete={handleSelectionComplete} 
            showPreview={showPreview} // Pass modified showPreview
            hidePreview={hidePreview} 
          />
        );
      case 'planet':
        return (
          <PlanetSelection 
            onSelectionComplete={handleSelectionComplete} 
            showPreview={showPreview} // Pass modified showPreview
            hidePreview={hidePreview} 
          />
        );
      case 'game':
        return null; 
      default:
        return <TitleScreen onStartGame={startGame} />;
    }
  };

  // MODIFIED: renderPreviewView now uses activePreviewTarget
  const renderPreviewView = () => {
    if (!previewContent || !activePreviewTarget || !activePreviewTarget.current || !showPreviewToggle) {
      // console.log('[App.jsx Canvas Render] PREVIEW VIEW: No previewContent or activePreviewTarget.current. Preview will not render.');
      return null;
    }

    console.log('[App.jsx Canvas Render] PREVIEW VIEW: activePreviewTarget.current IS SET. Rendering View component for type:', previewContent.type);
    
    return (
      <View track={activePreviewTarget} index={1} key={previewKey}> {/* Use activePreviewTarget, ensure index is > 0 if main canvas has index 0 */}
        {previewContent.type === 'character' && (
          <CharacterPreviewContent
            modelPath={previewContent.modelPath}
            scale={previewContent.scale}
            animationName={previewContent.animationName}
          />
        )}
        {previewContent.type === 'ship' && (
          <ShipPreviewContent
            modelPath={previewContent.modelPath}
            scale={previewContent.scale}
            initialRotationY={previewContent.initialRotationY}
          />
        )}
        {previewContent.type === 'planet' && (
          <PlanetPreviewContent
            planetData={previewContent.planetData}
            scale={previewContent.scale}
          />
        )}
      </View>
    );
  };

  return (
    <GameStateProvider>
      <EventProvider>
        <Router>
          <div className="relative w-full h-screen overflow-hidden">
            {/* <MinimalAnimationTest /> */}
            {renderCurrentPhaseComponent()}

            {/* Three.js Canvas - Main scene canvas, index 0 */}
            <Canvas 
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh', 
                zIndex: 0, // Main scene canvas
                // Pointer events for canvas controlled by phase and preview state
                pointerEvents: (currentPhase === 'game' || previewContent) ? 'auto' : 'none' 
              }}
              shadows
              onPointerDown={(event) => {
                if (currentPhase === 'game' && event.target.requestPointerLock) {
                  console.log('[App.jsx] Attempting to lock pointer for game phase.');
                  event.target.requestPointerLock()
                    .catch(err => console.error('[App.jsx] Error requesting pointer lock:', err));
                }
              }}
              // camera={{ position: [0,0,0]}} // Let MainGameScene control its camera
            >
              {/* Global Stars - Background for all phases - Conditionally Rendered */}
              {!previewContent && (
                <>
                  {/* Layer 1: More distant, smaller, slower stars - Reduced factor and speed for subtlety */}
                  <DreiStars radius={150} depth={80} count={5000} factor={3} saturation={0} fade speed={0.05} />
                  {/* Layer 2: Closer, slightly larger, faster twinkling stars - Reduced factor and speed for subtlety */}
                  <DreiStars radius={90} depth={40} count={2500} factor={4} saturation={0} fade speed={0.1} />
                </>
              )}
              
              <Suspense fallback={null}>
                {/* Preview View - renders into modal's div, index 1 */}
                {renderPreviewView()} 
                
                {/* Game Scene - only when currentPhase is 'game' */}
                {currentPhase === 'game' && (
                  <KeyboardControls map={controlsMap}>
                    <MainGameScene />
                  </KeyboardControls>
                )}
              </Suspense>
            </Canvas>
          </div>
        </Router>
      </EventProvider>
    </GameStateProvider>
  );
}

export default App;