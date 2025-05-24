// Component: CharacterPopup
// Purpose: Orchestrates the layout and content sections within the character selection modal.
import React, { useEffect, useRef, useState, useCallback } from 'react';
// import ModelView from './ModelView';
import Header from './Header';
import BackgroundSection from './BackgroundSection';
import AttributesSection from './AttributesSection';
import AbilitiesSection from './AbilitiesSection';
import NavigationArrowIcon from '../../../components/UI/NavigationArrowButton'; // Adjust path if needed
import { useGameState } from '../../../context/GameStateContext';
import { useClick } from '../../../hooks/useClick';

// NEW: Import a button component or define styles
// TODO: Create a reusable button component later if needed

const CharacterPopup = ({ characterDetails, onConfirm, onPrevious, onNext, isNavDisabled, previewHostRef }) => {
  const { logEchoAction, getEchoEffects, neuralEcho } = useGameState();
  const click = useClick();
  
  if (!characterDetails) {
    return null;
  }

  // Connect handler for select button
  const handleSelect = () => {
    onConfirm?.(characterDetails);
  };

  // Get current echo effects for demonstration
  const echoEffects = getEchoEffects ? getEchoEffects() : null;

  // Test functions for Neural Echo (for development/demonstration)
  const testEchoAction = (actionType) => {
    if (!logEchoAction) return;
    
    switch (actionType) {
      case 'hero':
        logEchoAction('hero', { faction: characterDetails.faction });
        break;
      case 'betray':
        logEchoAction('betray', { faction: characterDetails.faction });
        break;
      case 'trade':
        logEchoAction('trade', { item: 'Quantum Core', value: 1500, rarity: 'rare' });
        break;
    }
  };

  return (
    <div className="w-full h-full">
      {/* Title Header */}
      <h2 className="w-full mb-6 rounded-xl bg-rich_black/60 py-3 text-center text-xl font-bold tracking-wide text-white">
        {characterDetails.name}
      </h2>
      
      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-8 h-full">
        {/* Left Column - Content */}
        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4">
          <Header name={characterDetails.name} />
          
          <BackgroundSection
            shortBio={characterDetails.shortBio}
            longBio={characterDetails.longBio}
            faction={characterDetails.faction}
            origin={characterDetails.origin}
            className="bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-tiffany_blue/30 hover:shadow-2xl hover:shadow-tiffany_blue/10 hover:transform hover:translate-y-[-2px] hover:bg-gradient-to-br hover:from-rich_black/40 hover:via-midnight_green/20 hover:to-rich_black/50"
          />
          
          <AttributesSection
            attributes={characterDetails.stats}
            className="bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-tiffany_blue/30 hover:shadow-2xl hover:shadow-tiffany_blue/10 hover:transform hover:translate-y-[-2px] hover:bg-gradient-to-br hover:from-rich_black/40 hover:via-midnight_green/20 hover:to-rich_black/50"
          />
          
          <AbilitiesSection
            abilities={characterDetails.specialAbilities}
            className="bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-tiffany_blue/30 hover:shadow-2xl hover:shadow-tiffany_blue/10 hover:transform hover:translate-y-[-2px] hover:bg-gradient-to-br hover:from-rich_black/40 hover:via-midnight_green/20 hover:to-rich_black/50"
          />

          {/* Selection buttons at bottom of left column */}
          <div className="flex gap-4 justify-center items-center mt-6">
            {/* Previous Character Button */}
            <button
                className="ui-arrow"
                onClick={() => click(() => onPrevious?.())}
                onPointerDown={() => click(() => onPrevious?.())}
                disabled={false}
                aria-label="Previous Character"
            >
              <NavigationArrowIcon direction="left" />
            </button>

            {/* SELECT BUTTON */}
            <button
                className="ui-btn px-8 py-4 text-lg"
                onClick={() => click(() => handleSelect())}
                onPointerDown={() => click(() => handleSelect())}
                disabled={false}
            >
                SELECT {characterDetails?.name || 'CHARACTER'}
            </button>

            {/* Next Character Button */}
            <button
                className="ui-arrow"
                onClick={() => click(() => onNext?.())}
                onPointerDown={() => click(() => onNext?.())}
                disabled={false}
                aria-label="Next Character"
            >
              <NavigationArrowIcon direction="right" />
            </button>
          </div>
        </div>

        {/* Right Column - 3D Model Preview */}
        <div className="flex flex-col justify-center items-center">
          <div 
            ref={previewHostRef}
            className="w-full h-full relative bg-transparent border-2 border-tiffany_blue/30 rounded-2xl" 
            style={{ 
              backgroundColor: 'transparent',
              boxShadow: '0 0 30px rgba(10, 147, 150, 0.2)',
              minHeight: '400px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterPopup; 