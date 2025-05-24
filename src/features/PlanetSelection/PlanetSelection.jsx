import React, { useState, useRef } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { planets as planetData } from './planetData';
import SelectionModal from '../../components/SelectionModal/SelectionModal';
import useEscapeKey from '../../hooks/useEscapeKey.js';
import PlanetCard from './PlanetCard';
import StatBar from '../../components/UI/StatBar';
import NavigationArrowIcon from '../../components/UI/NavigationArrowButton';
import { useClick } from '../../hooks/useClick';
import AutoGrid from '../../components/AutoGrid';

const PlanetSelection = ({ onSelectionComplete, showPreview, hidePreview }) => {
  const [selectedPlanetDetails, setSelectedPlanetDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { setStartingPlanet } = useGameState();
  const click = useClick();
  const modalPreviewBoxRef = useRef(null);

  const handlePlanetSelect = (planet) => {
    console.log("[PlanetSelection.jsx] handlePlanetSelect called with:", planet);
    setSelectedPlanetDetails(planet);
    setShowDetailsModal(true);
    if (showPreview) {
      showPreview({ type: 'planet', planetData: planet, scale: planet.scale || 1 }, modalPreviewBoxRef);
    } else {
      console.warn("[PlanetSelection.jsx] showPreview not available for planet:", planet.id);
    }
  };

  const handleCloseModal = () => {
    console.log("[PlanetSelection.jsx] handleCloseModal called.");
    setShowDetailsModal(false);
    setSelectedPlanetDetails(null);
    if (hidePreview) hidePreview();
  };

  const handleConfirmSelection = () => {
    if (selectedPlanetDetails) {
      console.log('[PlanetSelection.jsx] handleConfirmSelection called for:', selectedPlanetDetails);
      setStartingPlanet(selectedPlanetDetails);
      setShowDetailsModal(false);
      if (hidePreview) hidePreview();
      console.log("[PlanetSelection.jsx] Calling onSelectionComplete('flight')");
      onSelectionComplete('flight');
    } else {
      console.warn('[PlanetSelection.jsx] handleConfirmSelection called but no planet selected.');
    }
  };

  useEscapeKey(handleCloseModal);

  const navigatePlanet = (direction) => {
    if (!selectedPlanetDetails) {
      console.log("[PlanetSelection.jsx] navigatePlanet called but no planet selected.");
      return;
    }
    console.log(`[PlanetSelection.jsx] navigatePlanet called with direction: ${direction}`);
    const currentIndex = planetData.findIndex(p => p.id === selectedPlanetDetails.id);
    if (currentIndex === -1) return;
    let nextIndex;
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % planetData.length;
    } else { 
        nextIndex = (currentIndex - 1 + planetData.length) % planetData.length;
    }
    const nextPlanet = planetData[nextIndex];
    setSelectedPlanetDetails(nextPlanet);
    if (showPreview) {
      console.log("[PlanetSelection.jsx] Navigating, showing preview for:", nextPlanet);
      showPreview({ type: 'planet', planetData: nextPlanet, scale: nextPlanet.scale || 1 }, modalPreviewBoxRef);
    }
  };

  const handleNextPlanet = () => navigatePlanet('next');
  const handlePreviousPlanet = () => navigatePlanet('previous');

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen px-4 py-16 text-center relative bg-transparent">
      <div className="w-full container mx-auto max-w-5xl flex flex-col items-center pt-8 pb-8">
        <h2 className="text-3xl font-bold mb-2 text-teal-300">SELECT YOUR STARTING PLANET</h2>
        <p className="text-lg text-slate-400 mb-8">Where will your interstellar adventure begin?</p>

        <AutoGrid>
          {planetData.map((planet) => (
            <PlanetCard 
              key={planet.id}
              planet={planet}
              onSelect={() => handlePlanetSelect(planet)}
            />
          ))}
        </AutoGrid>
      </div>

      {showDetailsModal && selectedPlanetDetails && (
        <>
          <SelectionModal isOpen={showDetailsModal} onClose={handleCloseModal}>
            <div className="w-full h-full p-6">
              {/* Two-column layout */}
              <div className="grid grid-cols-2 gap-8 h-full">
                {/* Left Column - Content */}
                <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white text-center font-display mb-2">
                      {selectedPlanetDetails.name}
                    </h2>
                    <p className="text-lg text-amber-400 font-light italic">{selectedPlanetDetails.type}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-teal-400 mb-2 border-b border-teal-600/50 pb-1">Overview</h3>
                    <p className="text-sm text-slate-300 mb-4">{selectedPlanetDetails.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Population:</span>
                        <span className="text-white font-mono">{selectedPlanetDetails.population}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Government:</span>
                        <span className="text-white font-mono">{selectedPlanetDetails.government}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Economy:</span>
                        <span className="text-white font-mono">{selectedPlanetDetails.economy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tech Level:</span>
                        <span className="text-white font-mono">{selectedPlanetDetails.techLevel}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-teal-400 mb-3 border-b border-teal-600/50 pb-1">Trade Resources</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlanetDetails.resources.map((resource, index) => (
                        <span key={index} className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm border border-teal-500/30">
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center mt-6">
                    <button
                      className="ui-btn px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-500 hover:to-slate-400 text-white font-semibold rounded-xl transition-all duration-300"
                      onClick={handleCloseModal}
                    >
                      Back
                    </button>
                    <button
                      className="ui-btn px-8 py-4 bg-gradient-to-r from-dark_cyan to-tiffany_blue hover:from-tiffany_blue hover:to-vanilla text-rich_black font-bold rounded-xl transition-all duration-300 text-lg"
                      onClick={() => click(handleConfirmSelection)}
                      onPointerDown={() => click(handleConfirmSelection)}
                    >
                      BEGIN HERE
                    </button>
                  </div>
                </div>

                {/* Right Column - 3D Model Preview */}
                <div className="flex flex-col justify-center items-center">
                  <div 
                    ref={modalPreviewBoxRef} 
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
          </SelectionModal>
        </>
      )}
    </div>
  );
};

export default PlanetSelection; 