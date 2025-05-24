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
import BackgroundStars from './components/BackgroundStars';

import TitleScreen from './features/TitleScreen/TitleScreen';
import CharacterSelection from './features/CharacterSelection/CharacterSelection';
import ShipSelection from './features/ShipSelection/ShipSelection';
import PlanetSelection from './features/PlanetSelection/PlanetSelection';
import MainGameScene from './features/MainGameScene/MainGameScene';
import GameHUD from './components/GameHUD/GameHUD';
import EventModal from './components/EventModal/EventModal'; 
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
  
  // Event system state
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventQueue, setEventQueue] = useState([]);

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

  // Event system - trigger events during flight phase with proper tutorial sequence
  useEffect(() => {
    if (phase === 'flight' && !currentEvent) {
      // Tutorial sequence: 3 events in specific order with long intervals
      const tutorialEvents = ['asteroid_probe', 'merchant_contact', 'hijack_attempt'];
      const completedEvents = JSON.parse(localStorage.getItem('completedTutorialEvents') || '[]');
      
      if (completedEvents.length < 3) {
        const nextEventIndex = completedEvents.length;
        const nextEvent = tutorialEvents[nextEventIndex];
        
        // Much longer intervals: 2-3 minutes between events
        const delay = nextEventIndex === 0 ? 30000 : 120000; // 30s for first, 2min for others
        
        const timer = setTimeout(() => {
          console.log(`[App.jsx] Triggering tutorial event ${nextEventIndex + 1}/3: ${nextEvent}`);
          setCurrentEvent(nextEvent);
        }, delay);

        return () => clearTimeout(timer);
      } else {
        console.log('[App.jsx] Tutorial events completed. Free flight mode active.');
      }
    }
  }, [phase, currentEvent]);

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

  const handleEventComplete = (option) => {
    console.log('Event completed with option:', option);
    
    // Track completed tutorial events
    const completedEvents = JSON.parse(localStorage.getItem('completedTutorialEvents') || '[]');
    if (currentEvent && !completedEvents.includes(currentEvent)) {
      completedEvents.push(currentEvent);
      localStorage.setItem('completedTutorialEvents', JSON.stringify(completedEvents));
      console.log(`[App.jsx] Tutorial event completed: ${currentEvent}. Progress: ${completedEvents.length}/3`);
    }
    
    setCurrentEvent(null);
    
    // Only queue next event if tutorial isn't complete
    if (completedEvents.length < 3) {
      console.log(`[App.jsx] Next tutorial event will trigger automatically after delay.`);
    } else {
      console.log(`[App.jsx] Tutorial sequence complete! Player now has free flight time.`);
      // Future: Implement random events with much longer intervals (5-10 minutes)
    }
  };

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
            {/* Background Stars - Always visible */}
            <BackgroundStars />
            
            {/* <MinimalAnimationTest /> */}
            {renderCurrentPhaseComponent()}

            {/* Three.js Canvas - Main scene canvas, index 0 */}
            <div className="relative z-10">
              <Canvas 
                style={{ 
                  position: 'fixed', 
                  top: 0, 
                  left: 0, 
                  width: '100vw', 
                  height: '100vh', 
                  zIndex: phase === 'flight' ? 1 : -1,
                  pointerEvents: phase === 'flight' ? 'auto' : 'none' 
                }}
                shadows
                onPointerDown={(event) => {
                  if (phase === 'flight' && event.target.requestPointerLock) {
                    event.target.requestPointerLock()
                      .catch(err => console.error('[App.jsx] Error requesting pointer lock:', err));
                  }
                }}
              >
              <Suspense fallback={null}>
                {renderPreviewView()}
                {phase === 'flight' && (
                  <KeyboardControls map={controlsMap}>
                    <MainGameScene />
                  </KeyboardControls>
                )}
              </Suspense>
            </Canvas>
            </div>

            {/* Neural Echo Indicator */}
            <NeuralEchoIndicator />
            
            {/* Game HUD - only show during flight phase */}
            {phase === 'flight' && <GameHUD />}
            
            {/* Event Modal */}
            {currentEvent && (
              <EventModal
                eventId={currentEvent}
                onClose={() => setCurrentEvent(null)}
                onComplete={handleEventComplete}
              />
            )}
          </div>
        </Router>
      </EventProvider>
    </GameStateProvider>
  );
}

export default App;