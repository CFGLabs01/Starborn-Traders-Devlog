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
    // FIXED: Fully transparent layout without dark background
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-transparent backdrop-blur-sm">
      {/* Left Column: Preview Area - FIXED with square aspect ratio */}
      <div className="w-full lg:w-[45%] flex-shrink-0 flex items-center justify-center p-4 relative"> 
        {/* Square flex box for perfect centering */}
        <div className="w-full aspect-square flex items-center justify-center max-w-[400px]">
          <div 
            ref={previewHostRef}
            className="w-full h-full relative bg-transparent rounded-2xl" 
            style={{ 
              backgroundColor: 'transparent',
              border: '2px solid rgba(148, 210, 189, 0.3)',
              borderRadius: '1rem',
              boxShadow: '0 0 30px rgba(10, 147, 150, 0.2)'
            }}
          />
        </div>
        
        {/* Character Name Overlay - FIXED to not block clicks */}
         <h2 className="absolute top-6 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-tiffany_blue text-shadow-md z-10 bg-gradient-to-r from-rich_black/90 via-midnight_green/80 to-rich_black/90 backdrop-blur-md px-8 py-3 rounded-2xl font-display pointer-events-none border border-dark_cyan/30 shadow-2xl">
          {characterDetails.name}
        </h2>
      </div>

      {/* RIGHT COLUMN: Simplified scrollable content */}
      <div className="w-full lg:w-[55%] flex flex-col">
        {/* Scrollable Content Area - FIXED */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <BackgroundSection
            shortBio={characterDetails.shortBio}
            longBio={characterDetails.longBio}
            faction={characterDetails.faction}
            origin={characterDetails.origin}
            className="bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-tiffany_blue/30 hover:shadow-2xl hover:shadow-tiffany_blue/10 hover:transform hover:translate-y-[-2px] hover:bg-gradient-to-br hover:from-rich_black/40 hover:via-midnight_green/20 hover:to-rich_black/50"
          />
          <AttributesSection
            attributes={characterDetails.stats}
            className="mt-6 bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-tiffany_blue/30 hover:shadow-2xl hover:shadow-tiffany_blue/10 hover:transform hover:translate-y-[-2px] hover:bg-gradient-to-br hover:from-rich_black/40 hover:via-midnight_green/20 hover:to-rich_black/50"
          />
          <AbilitiesSection
            abilities={characterDetails.specialAbilities}
            className="mt-6 bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-tiffany_blue/30 hover:shadow-2xl hover:shadow-tiffany_blue/10 hover:transform hover:translate-y-[-2px] hover:bg-gradient-to-br hover:from-rich_black/40 hover:via-midnight_green/20 hover:to-rich_black/50"
          />
          
          {/* 🧠 Neural Echo Panel - Enhanced transparency with hover effects */}
          {echoEffects && neuralEcho && (neuralEcho.echoScore !== 0 || neuralEcho.echoIntensity > 0) && (
            <div className="mt-6 p-6 bg-gradient-to-br from-rich_black/40 via-midnight_green/20 to-rich_black/50 backdrop-blur-md rounded-2xl border border-dark_cyan/20 shadow-xl transition-all duration-300 hover:border-dark_cyan/40 hover:shadow-2xl hover:shadow-dark_cyan/10 hover:transform hover:translate-y-[-2px] hover:bg-gradient-to-br hover:from-rich_black/50 hover:via-midnight_green/30 hover:to-rich_black/60">
              <h3 className="text-lg font-semibold text-tiffany_blue mb-3">Neural Echo Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-tiffany_blue/70">Echo Score:</span>
                  <span className={`ml-2 font-mono ${neuralEcho.echoScore > 0 ? 'text-tiffany_blue' : 'text-red-300'}`}>
                    {neuralEcho.echoScore}
                  </span>
                </div>
                <div>
                  <span className="text-tiffany_blue/70">Intensity:</span>
                  <span className="ml-2 font-mono text-orange-300">{neuralEcho.echoIntensity}/10</span>
                </div>
                <div>
                  <span className="text-tiffany_blue/70">Theme:</span>
                  <span className={`ml-2 font-mono ${
                    echoEffects.echoTheme === 'hero' ? 'text-blue-300' : 
                    echoEffects.echoTheme === 'rogue' ? 'text-red-300' : 'text-slate-300'
                  }`}>
                    {echoEffects.echoTheme}
                  </span>
                </div>
                <div>
                  <span className="text-tiffany_blue/70">Access Level:</span>
                  <span className="ml-2 font-mono text-yellow-300">{echoEffects.accessLevel}/5</span>
                </div>
              </div>
              
              {/* Echo Test Buttons - Enhanced */}
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => testEchoAction('hero')}
                  className="px-3 py-1 bg-gradient-to-r from-blue-600/40 to-blue-500/30 text-blue-300 rounded-lg text-xs hover:from-blue-600/60 hover:to-blue-500/50 transition-all duration-300 border border-blue-400/20"
                >
                  +Hero
                </button>
                <button 
                  onClick={() => testEchoAction('betray')}
                  className="px-3 py-1 bg-gradient-to-r from-red-600/40 to-red-500/30 text-red-300 rounded-lg text-xs hover:from-red-600/60 hover:to-red-500/50 transition-all duration-300 border border-red-400/20"
                >
                  +Betray
                </button>
                <button 
                  onClick={() => testEchoAction('trade')}
                  className="px-3 py-1 bg-gradient-to-r from-orange-600/40 to-orange-500/30 text-orange-300 rounded-lg text-xs hover:from-orange-600/60 hover:to-orange-500/50 transition-all duration-300 border border-orange-400/20"
                >
                  +Trade
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FIXED Button Container with proper z-index and centering */}
        <div className="w-full flex justify-center py-8 bg-rich_black/90 relative z-20">
          <div className="flex items-center space-x-4 relative z-20 mx-auto">
              {/* Previous Character Button - FIXED */}
              <button
                  className="ui-btn w-16 h-16 rounded-xl bg-midnight_green/80 hover:bg-dark_cyan/80 border-2 border-tiffany_blue/50 hover:border-tiffany_blue text-white transition-all duration-300 cursor-pointer"
                  onClick={() => click(() => onPrevious?.())}
                  onPointerDown={() => click(() => onPrevious?.())}
                  disabled={false}
                  aria-label="Previous Character"
              >
                <NavigationArrowIcon direction="left" />
              </button>

              {/* SELECT BUTTON - FIXED */}
              <button
                  className="ui-btn px-8 py-4 bg-gradient-to-r from-dark_cyan to-tiffany_blue hover:from-tiffany_blue hover:to-vanilla text-rich_black font-bold rounded-2xl transition-all duration-300 text-lg cursor-pointer"
                  onClick={() => click(() => handleSelect())}
                  onPointerDown={() => click(() => handleSelect())}
                  disabled={false}
              >
                  SELECT {characterDetails?.name || 'CHARACTER'}
              </button>

              {/* Next Character Button - FIXED */}
              <button
                  className="ui-btn w-16 h-16 rounded-xl bg-midnight_green/80 hover:bg-dark_cyan/80 border-2 border-tiffany_blue/50 hover:border-tiffany_blue text-white transition-all duration-300 cursor-pointer"
                  onClick={() => click(() => onNext?.())}
                  onPointerDown={() => click(() => onNext?.())}
                  disabled={false}
                  aria-label="Next Character"
              >
                <NavigationArrowIcon direction="right" />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPopup; 