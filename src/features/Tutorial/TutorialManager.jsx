import React, { useState, useEffect, useRef, useCallback } from 'react';
import { tutorialSteps } from './tutorialSteps';
import useTypewriter from '../../hooks/useTypewriter';
import FuelGauge from '../../components/HUD/FuelGauge';

// Placeholder for HUD components - we'll create FuelGauge next
// import FuelGauge from '../../components/HUD/FuelGauge';

const hudComponentMap = {
  FuelGauge: FuelGauge,
  // Add other HUD components here as needed
};

const TutorialManager = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true); // Manages tutorial visibility
  const [highlightedElementId, setHighlightedElementId] = useState(null); // Track highlighted ID
  const [showEventVisual, setShowEventVisual] = useState(null); // State for the event visual path
  const timeoutRef = useRef(null); // Ref to store timeout ID

  // --- Smart Skip Check --- 
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (tutorialCompleted === 'true') { // Explicit check for string 'true'
      setShowTutorial(false);
    }
  }, []); // Run only once on mount
  // --- End Smart Skip Check ---

  const currentStep = tutorialSteps[currentStepIndex];
  const displayedText = useTypewriter(currentStep?.text || '', 40); // Use the hook

  // --- Step Advancement / Finish --- 
  const finishTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorialCompleted', 'true'); // Set flag
    console.log('Tutorial finished or skipped!');
    // Ensure any active highlight is removed when finishing/skipping
    if (highlightedElementId) {
      const elem = document.getElementById(highlightedElementId);
      if (elem) elem.classList.remove('highlight');
      setHighlightedElementId(null);
    }
    setShowEventVisual(null); // Ensure event visual is hidden on finish/skip
    clearTimeout(timeoutRef.current); // Clear any pending timeout
  };

  const handleNextStep = useCallback(() => { // Wrap in useCallback for useEffect dependency
    clearTimeout(timeoutRef.current); // Clear timeout if manually advancing
    setShowEventVisual(null); // Hide previous event visual
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    } else {
      finishTutorial(); // Call dedicated finish function
    }
  }, [currentStepIndex, finishTutorial]); // Add dependencies
  // --- End Step Advancement / Finish ---
  
  // --- Skip Handler --- 
  const handleSkipTutorial = () => {
      finishTutorial(); // Use the same logic as finishing naturally
  };
  // --- End Skip Handler ---

  // --- Highlighting Logic --- 
  useEffect(() => {
    let previousElement = null;
    if (highlightedElementId) {
        previousElement = document.getElementById(highlightedElementId);
        if (previousElement) {
            previousElement.classList.remove('highlight');
        }
    }

    const targetId = currentStep?.targetElementId;
    let currentElement = null;
    if (targetId) {
        currentElement = document.getElementById(targetId);
        if (currentElement) {
            currentElement.classList.add('highlight');
            setHighlightedElementId(targetId); // Store the new highlighted ID
        } else {
            console.warn(`TutorialManager: Element with ID "${targetId}" not found.`);
            setHighlightedElementId(null); // Reset if not found
        }
    } else {
         setHighlightedElementId(null); // Reset if no target ID for this step
    }

    // Cleanup on component unmount or if tutorial finishes early
    return () => {
        if (currentElement) {
            currentElement.classList.remove('highlight');
        } else if (previousElement) { // Fallback if currentElement wasn't found but previous existed
            previousElement.classList.remove('highlight');
        }
         setHighlightedElementId(null); // Clear state on cleanup
    };

  }, [currentStepIndex, currentStep]); // Depend on step index and the step object itself
  // --- End Highlighting Logic ---

  // --- Action Handling & Event Visual Logic --- 
  useEffect(() => {
    if (!showTutorial || !currentStep) return;

    // Clear previous timeout and hide visual
    clearTimeout(timeoutRef.current);
    setShowEventVisual(null); 
    
    // Show event visual if specified for the current step
    if (currentStep.eventVisual) {
        // Assuming images are in /public/assets/UI_Panels/ or similar
        // Adjust the path based on your actual asset structure and Vite public dir handling
        setShowEventVisual(`/assets/UI_Panels/${currentStep.eventVisual}`); 
    }

    let targetElement = null;

    const handleKeyPress = (event) => {
      if (currentStep.keys?.includes(event.key)) {
        console.log(`Tutorial: Keypress action triggered (${event.key})`);
        handleNextStep();
      }
    };

    const handleClick = (event) => {
      console.log(`Tutorial: Click action triggered`);
      handleNextStep();
    };

    if (currentStep.action === 'keypress') {
      window.addEventListener('keydown', handleKeyPress);
    } else if (currentStep.action === 'click') {
      targetElement = document.getElementById(currentStep.targetElementId);
      if (targetElement) {
          // Make clickable during tutorial step
          targetElement.style.pointerEvents = 'auto'; 
          targetElement.addEventListener('click', handleClick);
      } else {
          console.warn(`TutorialManager: Click target "${currentStep.targetElementId}" not found for step "${currentStep.id}".`);
      }
    } else if (currentStep.action === 'timeout') {
      timeoutRef.current = setTimeout(() => {
        console.log(`Tutorial: Timeout action triggered after ${currentStep.duration}ms`);
        handleNextStep();
      }, currentStep.duration || 3000); // Default timeout if duration not specified
    }

    // Cleanup function
    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener('keydown', handleKeyPress);
      if (targetElement) {
          targetElement.removeEventListener('click', handleClick);
          // Restore default pointer events if necessary (assuming none was default)
          // targetElement.style.pointerEvents = 'none'; 
      }
      // No need to explicitly hide event visual here, done on step advance
    };
    
  // Rerun when step changes, or tutorial visibility changes
  }, [currentStep, currentStepIndex, showTutorial, handleNextStep]); 
  // --- End Action Handling & Event Visual Logic ---

  const CurrentHudElement = currentStep?.hudElement ? hudComponentMap[currentStep.hudElement] : null;

  if (!showTutorial || !currentStep) {
    return null; // Don't render anything if tutorial is skipped or finished
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none"> {/* Overlay container */} 
      
      {/* Display the relevant HUD element for the current step */}
      {CurrentHudElement && <CurrentHudElement id={currentStep.targetElementId} />}
      
      {/* Render Event Visual Placeholder */} 
      {showEventVisual && (
        <div className="absolute top-1/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
          {/* Adjust styling/position as needed */} 
          <img 
            src={showEventVisual} 
            alt="Distant Event Visual" 
            className="w-20 h-auto opacity-80" 
          />
        </div>
      )}
      
      {/* Tutorial Prompt Panel */} 
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-5 max-w-md w-full pointer-events-auto">
        <div className="bg-slate-800/70 backdrop-blur-md text-slate-100 rounded-lg shadow-xl border border-slate-600/50 p-4 text-sm">
          <p className="mb-3 font-mono leading-relaxed">{displayedText}</p>
          <div className="flex gap-2 mt-3"> {/* Button container */} 
            {/* Only show Next button for steps that require it */} 
            {(currentStep.action === 'next') && (
              <button 
                onClick={handleNextStep} 
                className="button button--secondary button--sm flex-grow"
              >
                Next
              </button>
            )}
            {/* Show message for other actions */} 
            {currentStep.action === 'keypress' && (
                <p className="text-center text-xs text-slate-400 italic flex-grow py-1">Press {currentStep.keys.slice(0, 4).join(', ')}...</p>
            )}
             {currentStep.action === 'click' && (
                <p className="text-center text-xs text-slate-400 italic flex-grow py-1">Click the highlighted element...</p>
            )}
            
            {/* Always show Skip button */} 
            <button 
              onClick={handleSkipTutorial} 
              className="button button--danger button--outline button--sm flex-shrink-0"
              title="Skip Tutorial"
            >
              Skip
            </button>
          </div>
        </div>
      </div>

      {/* Highlighting overlay element removed - direct style on element now */}
      
    </div>
  );
};

export default TutorialManager; 