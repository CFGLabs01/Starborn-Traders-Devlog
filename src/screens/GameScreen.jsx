import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts & Providers
import { GameStateProvider, useGameState } from '../context/GameStateContext';
import { EventProvider, useEventContext } from '../context/EventContext';

// Core Feature Components
import EventManager from '../features/EventManager/EventManager';
import TutorialManager from '../features/Tutorial/TutorialManager'; // Assuming tutorial runs here

// UI / Visual Components
import Starfield from '../components/Background/Starfield';
import HudAlert from '../components/HUD/HudAlert';
import FuelGauge from '../components/HUD/FuelGauge';
import EventActionLayer from '../components/EventActionLayer';

// Placeholder for Ship/Planet rendering (replace with actual 3D/2D components later)
const PlayerShipVisual = ({ shipData, position }) => {
  if (!shipData?.image) return null;
  // Basic idle animation with Tailwind
  return (
    <img 
      src={shipData.image} 
      alt={shipData.name}
      className="absolute w-24 h-auto transform -translate-x-1/2 -translate-y-1/2 filter drop-shadow-lg animate-pulse"
      style={{ left: `${position.x}%`, top: `${position.y}%`, transition: 'left 0.1s linear, top 0.1s linear' }} 
    />
  );
};

const DistantPlanetVisual = ({ planetData }) => {
   if (!planetData?.image) return null;
   // Basic rotation animation with CSS (add to index.css if desired)
   // @keyframes slow-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
   // .animate-slow-rotate { animation: slow-rotate 120s linear infinite; }
   return (
     <img 
       src={planetData.image} 
       alt={planetData.name} 
       className="absolute top-[10%] right-[10%] w-40 h-40 opacity-50 object-contain filter blur-sm" // Removed animate-slow-rotate for now
     />
   );
};

// Main Game Screen Logic Component
const GameScreenLogic = () => {
  const navigate = useNavigate();
  const { playerCharacter, ship, startingPlanet, currentLocation, setCurrentLocation } = useGameState();
  const { activeEvent } = useEventContext(); // Use event context if needed here
  
  // Basic ship position state for controls demo
  const [shipPosition, setShipPosition] = useState({ x: 50, y: 75 }); // Center-bottom start
  const moveSpeed = 1; // Adjust speed

  // Redirect if core game state is missing
  useEffect(() => {
    if (!playerCharacter || !ship || !ship.name || !startingPlanet) {
      console.warn('GameScreen: Missing core state, redirecting to setup.');
      // Optional: Add more specific redirects based on what's missing
      navigate('/select-character'); 
    }
  }, [playerCharacter, ship, startingPlanet, navigate]);

  // Basic WASD Controls Effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      setShipPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        switch (e.key.toLowerCase()) {
          case 'w': newY -= moveSpeed; break;
          case 's': newY += moveSpeed; break;
          case 'a': newX -= moveSpeed; break;
          case 'd': newX += moveSpeed; break;
          default: return prev; // No change if other key pressed
        }
        // Clamp position to screen bounds (approximate)
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(10, Math.min(90, newY));
        return { x: newX, y: newY };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveSpeed]); // Dependency on moveSpeed

  // Return null if state isn't ready yet (avoids rendering issues during redirect)
  if (!playerCharacter || !ship || !ship.name || !startingPlanet) {
      return null;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-rich_black">
      <Starfield />

      {/* Scene Elements */} 
      <DistantPlanetVisual planetData={startingPlanet} />
      <PlayerShipVisual shipData={ship} position={shipPosition} />

      {/* HUD Overlay */} 
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top-Left: Mini Radar Placeholder */}
        <div className="absolute top-4 left-4 w-24 h-24 bg-midnight_green/50 backdrop-blur-sm rounded-full border border-tiffany_blue/30 flex items-center justify-center text-tiffany_blue text-xs shadow-lg">
          RADAR
        </div>
        
        {/* Bottom-Left: Fuel Gauge (Actual Component) */}
        {/* Note: FuelGauge itself uses fixed positioning, might need adjustment if placed inside this container */}
        {/* For now, let's assume FuelGauge is positioned correctly by itself */}
        {/* <FuelGauge />  <- Rendered outside this container or adjust its positioning */}

        {/* Top-Right: Comm Link Placeholder */}
        <div className="absolute top-4 right-4 p-2 bg-midnight_green/50 backdrop-blur-sm rounded border border-tiffany_blue/30 text-tiffany_blue text-xs shadow-lg">
          COMM
        </div>

        {/* Bottom-Center: Navigation Placeholder */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-midnight_green/50 backdrop-blur-sm rounded border border-tiffany_blue/30 text-tiffany_blue text-xs shadow-lg">
          {currentLocation?.system || 'Unknown System'} - {currentLocation?.station || currentLocation?.planet || 'Deep Space'}
        </div>
      </div>
      
      {/* Event System Components (Rendered on top, handling their own UI) */} 
      {/* Render FuelGauge here if it needs context or specific positioning relative to Event Mgr? */}
      <FuelGauge id="hud-fuel-gauge" /> {/* Pass ID for tutorial */} 
      <HudAlert />
      <EventActionLayer />
      <TutorialManager />
      <EventManager /> 

    </div>
  );
};

// Main Exported Component with Providers
const GameScreen = () => {
  return (
    // GameStateProvider should ideally wrap higher up if needed by routing/App shell
    // But wrapping here ensures context is available for GameScreenLogic
    <GameStateProvider>
      <EventProvider>
        <GameScreenLogic />
      </EventProvider>
    </GameStateProvider>
  );
};

export default GameScreen; 