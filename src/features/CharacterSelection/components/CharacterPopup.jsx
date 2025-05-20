// Component: CharacterPopup
// Purpose: Orchestrates the layout and content sections within the character selection modal.
import React, { useEffect } from 'react';
// import ModelView from './ModelView';
import Header from './Header';
import BackgroundSection from './BackgroundSection';
import AttributesSection from './AttributesSection';
import AbilitiesSection from './AbilitiesSection';
import NavigationArrowIcon from '../../../components/UI/NavigationArrowButton'; // Adjust path if needed

// NEW: Import a button component or define styles
// TODO: Create a reusable button component later if needed

const CharacterPopup = ({ characterDetails, onConfirm, onPrevious, onNext, isNavDisabled /*, previewHostRef, showPreview, hidePreview */ }) => {
  if (!characterDetails) return null; // Don't render if no character selected

  // Removed useEffect that was calling showPreview, as CharacterSelection handles this.
  // The previewHostRef is also removed as App.jsx controls the global preview View.

  /*
  useEffect(() => {
    if (previewHostRef && previewHostRef.current && characterDetails && showPreview) {
      showPreview({
        type: 'character',
        modelPath: characterDetails.modelPath,
        scale: characterDetails.scale || 1,
        animationName: 'Armature|Idle|baselayer'
      });
    }
    return () => {
      if (hidePreview) hidePreview();
    };
  }, [previewHostRef, characterDetails, showPreview, hidePreview]);
  */

  return (
    <div className="h-full grid grid-rows-[1fr_auto] grid-cols-1 lg:grid-rows-1 gap-0">
      {/* 
        The lg:grid-cols-[45%_55%] might need adjustment now that the left 3D preview div is removed.
        For now, we'll let the right info panel expand or be the sole focus within the modal's content area.
        The actual 3D preview is handled globally by App.jsx.
      */}
      {/* Main Content: Info (Right side of original layout) */}
      <div className="flex flex-col p-6 overflow-y-auto custom-scrollbar h-full lg:col-span-2"> {/* lg:col-span-2 to take full width if it was a 2-col grid */}
        <Header name={characterDetails.name} />
        <BackgroundSection
          shortBio={characterDetails.shortBio}
          longBio={characterDetails.longBio}
          faction={characterDetails.faction}
          origin={characterDetails.origin}
          className="mt-10"
        />
        <AttributesSection
          attributes={characterDetails.stats}
          className="mt-14"
        />
        <AbilitiesSection
          abilities={characterDetails.specialAbilities}
          className="mt-14"
        />
      </div>
      {/* Bottom Row: Buttons */}
      <div className="flex justify-center items-center space-x-16 py-6 col-span-1 lg:col-span-2">
        <button
          className="button button--icon-navarrow rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onPrevious}
          disabled={isNavDisabled}
          aria-label="Previous Character"
        >
          <NavigationArrowIcon direction="left" />
        </button>
        <button
          onClick={onConfirm}
          className="button button--confirm rounded-full"
          disabled={!characterDetails}
        >
          Select {characterDetails.name}
        </button>
        <button
          className="button button--icon-navarrow rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onNext}
          disabled={isNavDisabled}
          aria-label="Next Character"
        >
          <NavigationArrowIcon direction="right" />
        </button>
      </div>
    </div>
  );
};

export default CharacterPopup; 