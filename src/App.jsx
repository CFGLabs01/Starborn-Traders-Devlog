import React, { useState, useRef, Suspense, useEffect, useMemo, useCallback } from 'react';
import {
  BrowserRouter as Router,
  // Routes, // Routes might be managed differently or within Views
  // Route,
} from 'react-router-dom';
import { Canvas } from '@react-three/fiber'; // Import Canvas
import { View, KeyboardControls, Stars as DreiStars, OrbitControls as DreiOrbitControls, Box as DreiBox, PerspectiveCamera } from '@react-three/drei'; // Import View, KeyboardControls, DreiStars, AND PerspectiveCamera

import './styles/main.css'; 
import { GameStateProvider, useGameState } from './context/GameStateContext';
import { EventProvider } from './context/EventContext';
import { usePhase } from './state/phaseStore';

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

// Neural Echo HUD Indicator Component
function NeuralEchoIndicator() {
  const { getEchoEffects, neuralEcho } = useGameState();
  
  if (!getEchoEffects || !neuralEcho) return null;
  
  const echoEffects = getEchoEffects();
  
  if (echoEffects.hudIntensity === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-10 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-cyan-500/30">
      <div className="text-xs text-cyan-300 font-mono">
        Neural Echo: {echoEffects.echoTheme} | {Math.floor(echoEffects.hudIntensity * 100)}%
      </div>
      <div className="w-full h-1 bg-gray-700 rounded mt-1">
        <div 
          className={`h-full rounded transition-all duration-500 ${
            echoEffects.echoTheme === 'hero' ? 'bg-blue-400' :
            echoEffects.echoTheme === 'rogue' ? 'bg-red-400' : 'bg-cyan-400'
          }`}
          style={{ width: `${echoEffects.hudIntensity * 100}%` }}
        />
      </div>
    </div>
  );
}

function App() {
  const { phase } = usePhase(); 
  
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
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'c' && !e.ctrlKey) {
        setShowPreviewToggle(v => !v);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPreviewToggle]);

  const handleSelectionComplete = (nextPhase) => {
    usePhase.getState().set(nextPhase);
    setPreviewContent(null); 
    setActivePreviewTarget(null);
  };

  const startGame = () => {
    usePhase.getState().set('character');
  }

  // MODIFIED: showPreview now accepts a targetRef - Stabilized with useCallback
  const showPreview = useCallback((content, targetRef) => {
    if (targetRef && targetRef.current) {
      setPreviewContent(content); 
      setActivePreviewTarget(targetRef);
      setPreviewKey(k => k + 1); 
    } else {
      setPreviewContent(null);
      setActivePreviewTarget(null);
    }
  }, []);

  const hidePreview = useCallback(() => {
    setPreviewContent(null); 
    setActivePreviewTarget(null);
  }, []);

  const renderCurrentPhaseComponent = () => {
    switch (phase) {
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
      case 'flight':
        return null; 
      default:
        return <TitleScreen onStartGame={startGame} />;
    }
  };

  // MODIFIED: renderPreviewView now uses activePreviewTarget
  const renderPreviewView = () => {
    if (!previewContent || !activePreviewTarget || !activePreviewTarget.current || !showPreviewToggle) {
      return null;
    }
    
    return (
      <View track={activePreviewTarget} index={1} key={previewKey}>
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
                zIndex: previewContent ? 52 : 0,
                pointerEvents: (phase === 'flight' || previewContent) ? 'auto' : 'none' 
              }}
              shadows
              onPointerDown={(event) => {
                if (phase === 'flight' && event.target.requestPointerLock) {
                  event.target.requestPointerLock()
                    .catch(err => console.error('[App.jsx] Error requesting pointer lock:', err));
                }
              }}
            >
              {/* Global Stars - Background for all phases - Conditionally Rendered */}
              {!previewContent && (
                <>
                  <DreiStars radius={150} depth={80} count={5000} factor={3} saturation={0} fade speed={0.05} />
                  <DreiStars radius={90} depth={40} count={2500} factor={4} saturation={0} fade speed={0.1} />
                </>
              )}
              <Suspense fallback={null}>
                {renderPreviewView()}
                {phase === 'flight' && (
                  <KeyboardControls map={controlsMap}>
                    <MainGameScene />
                  </KeyboardControls>
                )}
              </Suspense>
            </Canvas>

            {/* Neural Echo Indicator */}
            <NeuralEchoIndicator />
          </div>
        </Router>
      </EventProvider>
    </GameStateProvider>
  );
}

export default App;