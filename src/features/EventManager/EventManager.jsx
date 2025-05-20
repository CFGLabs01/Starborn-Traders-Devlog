import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { useEventContext } from '../../context/EventContext'; // Import context hook
import { eventConfig, getRandomEventTime, selectRandomEvent } from './eventConfig';
import HudAlert from '../../components/HUD/HudAlert';
import AsteroidVisual from '../../components/EventVisuals/AsteroidVisual';
import playSound from '../../utils/playSound'; // Import the utility

const EventManager = () => {
  const { addCargo /* , deductHull, setShipStatus, etc. */ } = useGameState(); // Get needed actions from context
  const { activeEvent, setActiveEvent } = useEventContext(); // Use context
  const [isPaused, setIsPaused] = useState(true); // Start paused until tutorial is done
  const eventTimerRef = useRef(null); // Ref for the main event trigger timeout
  const eventDurationTimerRef = useRef(null); // Ref for the active event duration timeout

  // Check if tutorial is completed to start the manager
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (tutorialCompleted === 'true') {
        console.log('EventManager: Tutorial complete, starting event triggers.');
        setIsPaused(false);
    } else {
        console.log('EventManager: Waiting for tutorial completion...');
    }
    // Optional: Add listener for tutorial completion if it can happen dynamically
    // const handleTutorialComplete = () => setIsPaused(false);
    // window.addEventListener('tutorialCompleteEvent', handleTutorialComplete); 
    // return () => window.removeEventListener('tutorialCompleteEvent', handleTutorialComplete);

  }, []);

  // Function to clear the active event - now uses context setter
  const clearActiveEvent = useCallback(() => {
    if (activeEvent) { // Check if there *is* an active event before logging/clearing
        console.log(`EventManager: Clearing event "${activeEvent.id}"`);
        clearTimeout(eventDurationTimerRef.current);
        setActiveEvent(null); // Use context setter
        // TODO: Potentially reset related game states (e.g., combat mode off)
    }
  }, [activeEvent, setActiveEvent]); // Add setActiveEvent dependency

  // Function to trigger a new random event - now uses context setter
  const triggerRandomEvent = useCallback(() => {
    if (isPaused || activeEvent) return; 
    
    const selectedEvent = selectRandomEvent();
    console.log(`EventManager: Triggering event "${selectedEvent.id}"`);
    setActiveEvent(selectedEvent); // Use context setter
    
    // Play SFX if defined
    if (selectedEvent.sfx) {
      // Assuming sounds are in /public/assets/sfx/
      playSound(`/assets/sfx/${selectedEvent.sfx}`, 0.4); // Play sound at 40% volume
    }

    // Handle immediate effects or setup based on event type
    if (selectedEvent.type === 'hazard') {
      // TODO: Apply hazard effect (e.g., setShipStatus('navigation_offline'))
    } else if (selectedEvent.type === 'combat') {
       // TODO: Enter combat mode (setCombatState(true))
    }

    // Set timeout for event duration if applicable
    if (selectedEvent.duration) {
        clearTimeout(eventDurationTimerRef.current); // Clear previous duration timeout just in case
        eventDurationTimerRef.current = setTimeout(clearActiveEvent, selectedEvent.duration);
    }

    // Schedule the next event check
    scheduleNextEventCheck(); 

  }, [isPaused, activeEvent, setActiveEvent, clearActiveEvent /*, scheduleNextEventCheck */]); // Add context setters/getters, scheduleNextEventCheck

  // Function to schedule the next random event check
  const scheduleNextEventCheck = useCallback(() => {
    clearTimeout(eventTimerRef.current);
    if (!isPaused) { // Only schedule if not paused
        const timeToNextEvent = getRandomEventTime();
        console.log(`EventManager: Scheduling next event check in ${(timeToNextEvent / 1000).toFixed(1)}s`);
        eventTimerRef.current = setTimeout(triggerRandomEvent, timeToNextEvent);
    }
  }, [isPaused, triggerRandomEvent]);

  // Start scheduling when the manager unpauses
  useEffect(() => {
    if (!isPaused) {
      scheduleNextEventCheck();
    } else {
      // Clear timers if paused
      clearTimeout(eventTimerRef.current);
      clearTimeout(eventDurationTimerRef.current);
    }

    // Cleanup timers on unmount
    return () => {
      clearTimeout(eventTimerRef.current);
      clearTimeout(eventDurationTimerRef.current);
    };
  }, [isPaused, scheduleNextEventCheck]);

  // --- Placeholder Event Action Handlers ---
  const handleMineAction = () => {
    if (activeEvent?.id === 'miningOpportunity') {
      const amount = Math.floor(Math.random() * 5) + 1; // Random ore amount 1-5
      const success = addCargo({ name: 'Raw Ore', description: 'Unprocessed mineral chunks.' /* Add other item props */ }, amount);
      if (success) {
        console.log(`EventManager: Mined ${amount} Raw Ore.`);
        // TODO: Provide player feedback (visual/audio cue for mining success)
        // Maybe clear event early after successful mining?
        clearActiveEvent(); 
        scheduleNextEventCheck(); // Reschedule immediately after action
      } else {
        console.log('EventManager: Mining failed (Cargo full?)');
        // TODO: Provide feedback (cargo full message)
      }
    }
  };

  const handleInvestigateAction = () => {
      if (activeEvent?.id === 'distressSignal') {
          console.log('EventManager: Investigating distress signal...');
          // TODO: Trigger a specific scenario/dialogue/mission related to the signal
          clearActiveEvent();
          scheduleNextEventCheck();
      }
  };

  // TODO: Add handleCombatAction, handleHazardAcknowledgement etc.

  // --- Render Logic --- 
  // EventManager now primarily manages the event loop and state updates via context.
  // It doesn't need to render the UI elements directly anymore.
  // HudAlert, AsteroidVisual, and the action buttons will consume the context.
  return null; // Or <></> - this component is now mostly logic

  /* 
  // OLD RENDER LOGIC (MOVED/REPLACED BY CONTEXT CONSUMERS): 
  return (
    <>
      <HudAlert 
        message={activeEvent?.hudAlert || null} 
        icon={activeEvent?.hudIcon || null} 
        type={activeEvent?.type || 'info'} 
      />

      {activeEvent?.id === 'miningOpportunity' && (
        <> 
          <AsteroidVisual /> 
          <button className="..." onClick={handleMineAction}>
            {activeEvent.actionLabel}
           </button>
        </>
      )}
      {activeEvent?.id === 'distressSignal' && (
         <button className="..." onClick={handleInvestigateAction}>
            {activeEvent.actionLabel}
         </button>
      )}
    </>
  );
  */
};

export default EventManager; 