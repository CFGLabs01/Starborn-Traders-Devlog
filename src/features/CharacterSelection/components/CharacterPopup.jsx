// Component: CharacterPopup
// Purpose: Orchestrates the layout and content sections within the character selection modal.
import React, { useEffect, useRef } from 'react';
// import ModelView from './ModelView';
import Header from './Header';
import BackgroundSection from './BackgroundSection';
import AttributesSection from './AttributesSection';
import AbilitiesSection from './AbilitiesSection';
import NavigationArrowIcon from '../../../components/UI/NavigationArrowButton'; // Adjust path if needed

// NEW: Import a button component or define styles
// TODO: Create a reusable button component later if needed

const CharacterPopup = ({ characterDetails, onConfirm, onPrevious, onNext, isNavDisabled, previewHostRef }) => {
  if (!characterDetails) return null; // Don't render if no character selected

  // useEffect related to showPreview/hidePreview can remain commented as CharacterSelection now passes the ref directly to App.jsx's showPreview

  return (
    // Changed from grid to flex for simpler 2-column layout with fixed left and scrollable right
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Left Column: Preview Area - RESTORED */}
      <div className="w-full lg:w-[45%] flex-shrink-0 flex items-center justify-center p-4 relative bg-black/20"> 
        <div 
          ref={previewHostRef} // Assign the ref here
          className="w-full h-full max-w-[300px] max-h-[300px] lg:max-w-full lg:max-h-[400px] relative" 
          // style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }} // Optional: debug background
        />
        {/* Character Name Overlay (optional, if not handled by a global preview title) */}
         <h2 className="absolute top-6 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white text-shadow-md z-10 bg-black/30 backdrop-blur-sm px-6 py-2 rounded-lg font-display pointer-events-none">
          {characterDetails.name}
        </h2>
      </div>

      {/* Right Column: Scrollable Info */}
      <div className="w-full lg:w-[55%] flex flex-col p-6 overflow-y-auto custom-scrollbar">
        {/* Removed Header component call, name is now an overlay on preview */}
        <BackgroundSection
          shortBio={characterDetails.shortBio}
          longBio={characterDetails.longBio}
          faction={characterDetails.faction}
          origin={characterDetails.origin}
          // Removed mt-10, spacing handled by parent or section itself
        />
        <AttributesSection
          attributes={characterDetails.stats}
          className="mt-6" // Adjusted margin
        />
        <AbilitiesSection
          abilities={characterDetails.specialAbilities}
          className="mt-6" // Adjusted margin
        />
      </div>

      {/* Bottom Row: Buttons - Fixed at bottom, centered, pill-shaped cluster */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center py-4 lg:py-6">
        <div className="flex items-center space-x-3 bg-slate-900/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl border border-slate-700/50">
            <button
                className="button button--icon-navarrow rounded-full p-2 hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onPrevious}
                disabled={isNavDisabled}
                aria-label="Previous Character"
            >
                <NavigationArrowIcon direction="left" />
            </button>
            <button
                onClick={onConfirm}
                className="button button--confirm rounded-full text-sm px-6 py-2.5 min-w-[150px] whitespace-nowrap disabled:opacity-50 disabled:bg-slate-600"
                disabled={!characterDetails}
            >
                Select {characterDetails.name}
            </button>
            <button
                className="button button--icon-navarrow rounded-full p-2 hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onNext}
                disabled={isNavDisabled}
                aria-label="Next Character"
            >
                <NavigationArrowIcon direction="right" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterPopup; 