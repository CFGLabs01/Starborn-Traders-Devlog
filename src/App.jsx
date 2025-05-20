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
};

function App() {
  const [currentPhase, setCurrentPhase] = useState('title'); 
  
  // Ref for the DOM element that the preview <View /> will track
  const previewViewRef = useRef(); 
  // State to control what content the preview View should render
  const [previewContent, setPreviewContent] = useState(null);
  const [previewKey, setPreviewKey] = useState(0); // Restore previewKey state

  // Define controls map here using useMemo
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
  ], []);

  useEffect(() => {
    console.log('[App.jsx] Current phase changed to:', currentPhase);
  }, [currentPhase]);

  const handleSelectionComplete = (nextPhase) => {
    console.log(`[App.jsx] Transitioning from ${currentPhase} to ${nextPhase}`);
    setCurrentPhase(nextPhase);
    setPreviewContent(null); // Clear preview when transitioning
  };

  const startGame = () => {
    console.log('[App.jsx] startGame called, setting phase to character');
    setCurrentPhase('character');
  }

  const showPreview = (content) => {
    console.log('[App.jsx] showPreview called:', content);
    setPreviewContent(content); 
    setPreviewKey(k => k + 1); // Increment previewKey to force View remount
  };

  const hidePreview = () => {
    console.log('[App.jsx] hidePreview called.');
    setPreviewContent(null); 
  };

  const renderCurrentPhaseComponent = () => {
    switch (currentPhase) {
      case 'title':
        return <TitleScreen onStartGame={startGame} />;
      case 'character':
        return (
          <CharacterSelection
            onSelectionComplete={handleSelectionComplete}
            showPreview={showPreview}
            hidePreview={hidePreview}
          />
        );
      case 'ship':
        return <ShipSelection onSelectionComplete={handleSelectionComplete} showPreview={showPreview} hidePreview={hidePreview} />;
      case 'planet':
        return <PlanetSelection onSelectionComplete={handleSelectionComplete} showPreview={showPreview} hidePreview={hidePreview} />;
      case 'game':
        // MainGameScene will render its content directly into the main canvas or a dedicated game View later
        return null; // No separate component, its content will be driven by the 'game' phase inside the main Canvas
      default:
        return <TitleScreen onStartGame={startGame} />;
    }
  };

  // Update the preview view rendering logic
  const renderPreviewView = () => {
    if (!previewContent) return null;

    if (!previewViewRef.current) {
      console.warn('[App.jsx Canvas Render] PREVIEW VIEW: previewContent is set, BUT previewViewRef.current IS NULL. Preview will not render. This should be rare now.');
      return null;
    }

    console.log('[App.jsx Canvas Render] PREVIEW VIEW: previewViewRef.current IS SET. Rendering View component for type:', previewContent.type);
    
    return (
      <View track={previewViewRef} index={0} key={previewKey}>
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
            {renderCurrentPhaseComponent()}

            {/* Preview Container - HTML part - Always rendered, visibility controlled by style */}
            <div 
              ref={previewViewRef}
              className="fixed z-[110]"
              style={{
                display: previewContent ? 'block' : 'none',
                width: '400px',
                height: '400px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255, 0, 0, 0.2)',
                border: '2px solid red'
              }}
            >
              {/* Inner div removed for this test, View will track the red div directly */}
              {/* <div 
                className="relative w-full h-full max-w-4xl max-h-[80vh] pointer-events-auto" 
                style={{
                  backgroundColor: 'rgba(0, 0, 255, 0.3)', 
                  border: '2px solid yellow', 
                  borderRadius: '1rem',
                  overflow: 'hidden',
                }}
              /> */}
            </div>

            {/* Three.js Canvas */}
            <Canvas 
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh', 
                zIndex: 0, 
                pointerEvents: 'none' 
              }}
              shadows
            >
              {/* Ensure canvas background color is set */}
              <color attach="background" args={['#101015']} /> {/* Or '#000000' for pure black */}
              
              {/* Layer 1: More distant, smaller, slower stars */}
              <DreiStars radius={150} depth={80} count={2000} factor={3.5} saturation={0} fade speed={0.1} />
              {/* Layer 2: Closer, slightly larger, faster twinkling stars */}
              <DreiStars radius={90} depth={40} count={1000} factor={4.5} saturation={0} fade speed={0.2} />

              <Suspense fallback={null}>
                {renderPreviewView()}
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