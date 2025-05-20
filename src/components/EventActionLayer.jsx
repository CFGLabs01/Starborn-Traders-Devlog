import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { useGameState } from '../../context/GameStateContext'; // Needed for combat placeholders
import AsteroidVisual from './EventVisuals/AsteroidVisual';

// Placeholder for Combat UI components
const PlaceholderCombatUI = () => {
  const { ship } = useGameState();
  // TODO: Add actual combat logic handlers
  const handleFire = () => console.log('Combat: Fire!');
  const handleEvade = () => console.log('Combat: Evade!');

  return (
    <div className="fixed bottom-5 left-5 right-5 pointer-events-auto z-[51] flex justify-between items-end gap-4">
      {/* Placeholder Ship Status */}
      <div className="bg-midnight_green/70 backdrop-blur-sm p-2 px-3 rounded border border-rufous/50 text-sm text-slate-200">
        <div>Hull: <span className="font-semibold text-rufous">{ship.hull}%</span></div>
        {/* Add Shield display if applicable */}
        {/* <div>Shield: <span className="font-semibold text-cyan-400">{ship.shield || 0}%</span></div> */}
      </div>

      {/* Placeholder Action Buttons */} 
      <div className="flex gap-3">
        <button onClick={handleFire} className="button button--danger">Fire</button>
        <button onClick={handleEvade} className="button button--secondary">Evasive Maneuvers</button>
      </div>
    </div>
  );
};

// This component renders UI based on the active event from context
const EventActionLayer = () => {
  const { activeEvent } = useEventContext();
  
  // Action handlers would ideally be passed down or called via context actions
  // For now, copying handlers from EventManager (Needs Refactor)
  const { addCargo } = useGameState();
  const { setActiveEvent } = useEventContext(); // Need setter to clear event
  
  const handleMineAction = () => {
    if (activeEvent?.id === 'miningOpportunity') {
      const amount = Math.floor(Math.random() * 5) + 1; 
      const success = addCargo({ name: 'Raw Ore', description: 'Unprocessed mineral chunks.' }, amount);
      if (success) {
        console.log(`ActionLayer: Mined ${amount} Raw Ore.`);
        setActiveEvent(null); // Clear event via context
        // TODO: Reschedule next event check? EventManager might handle this now
      } else {
        console.log('ActionLayer: Mining failed (Cargo full?)');
      }
    }
  };

  const handleInvestigateAction = () => {
      if (activeEvent?.id === 'distressSignal') {
          console.log('ActionLayer: Investigating distress signal...');
          // TODO: Trigger a specific scenario/dialogue/mission
          setActiveEvent(null); // Clear event via context
      }
  };
  // --- End Temp Action Handlers ---

  if (!activeEvent) return null; // Nothing to render if no active event

  return (
    <>
      {/* Render Visuals */} 
      {activeEvent.id === 'miningOpportunity' && <AsteroidVisual />} 
      {/* Add other visuals like Marauder ships, solar flares here */} 

      {/* Render Action Buttons/UI */} 
      {activeEvent.id === 'miningOpportunity' && activeEvent.actionLabel && (
        <button 
          className="fixed bottom-20 right-5 button button--primary pointer-events-auto z-[51]"
          onClick={handleMineAction}
        >
          {activeEvent.actionLabel}
        </button>
      )}
      {activeEvent.id === 'distressSignal' && activeEvent.actionLabel && (
        <button 
          className="fixed bottom-20 right-5 button button--secondary pointer-events-auto z-[51]"
          onClick={handleInvestigateAction}
        >
          {activeEvent.actionLabel}
        </button>
      )}
      {activeEvent.type === 'combat' && (
          <PlaceholderCombatUI />
      )}
      {/* Add Hazard overlays etc. */} 
    </>
  );
};

export default EventActionLayer; 