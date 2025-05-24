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
            <div className="flex flex-col lg:flex-row overflow-hidden h-full">
              <div className="w-full lg:w-[45%] flex items-center justify-center p-4 relative bg-black/20">
                <div 
                  ref={modalPreviewBoxRef} 
                  style={{ 
                    width: '100%', 
                    height: '300px', 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                  }} 
                />
                <h2 className="absolute top-6 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white text-shadow-md z-10 bg-black/30 backdrop-blur-sm px-6 py-2 rounded-lg font-display pointer-events-none">
                  {selectedPlanetDetails.name}
                </h2>
              </div>
              <div className="w-full lg:w-[55%] flex flex-col p-6 space-y-4 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-slate-300 italic mb-4">
                  {selectedPlanetDetails.description || `Details for ${selectedPlanetDetails.name}.`}
                </p>
                <div>
                  <h3 className="text-xl font-semibold text-teal-400 mb-3 border-b border-teal-600/50 pb-1">Planetary Statistics</h3>
                  {selectedPlanetDetails.stats ? (
                    <div className="space-y-2"> 
                      {Object.entries(selectedPlanetDetails.stats).map(([key, value]) => (
                        <StatBar 
                          key={key} 
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                          value={value} 
                          maxValue={10} 
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Statistics not available.</p>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-teal-400 mb-2 mt-4 border-b border-teal-600/50 pb-1">Notable Features</h3>
                  {selectedPlanetDetails.notableFeatures && selectedPlanetDetails.notableFeatures.length > 0 ? (
                      <ul className="text-sm text-slate-300 list-disc list-inside space-y-1 mb-3">
                        {selectedPlanetDetails.notableFeatures.map((feature, index) => <li key={index}>{feature}</li>)}
                      </ul>
                  ) : (
                       <p className="text-sm text-slate-500 italic mb-3">No unique features listed.</p>
                  )}
                  <h4 className="text-lg font-semibold text-teal-400 mb-1">Primary Imports</h4>
                  <p className="text-sm text-slate-300 mb-3">
                    {selectedPlanetDetails.importItems?.join(', ') || 'None specified'}
                  </p>
                  <h4 className="text-lg font-semibold text-teal-400 mb-1">Primary Exports</h4>
                  <p className="text-sm text-slate-300 mb-3">
                    {selectedPlanetDetails.exportItems?.join(', ') || 'None specified'}
                  </p>
                  <p className="text-xs text-slate-500 italic mt-2">
                    Note: Specific commodity availability and pricing may fluctuate based on market conditions and player actions.
                  </p>
                </div>
                <div className="mt-auto pt-6 flex flex-col items-center"> 
                  <div className="flex justify-center items-center space-x-12">
                    <button 
                      className="ui-btn button button--icon-navarrow rounded-full disabled:opacity-50 disabled:cursor-not-allowed" 
                      onClick={() => click(() => handlePreviousPlanet())}
                      onPointerDown={() => click(() => handlePreviousPlanet())}
                      disabled={planetData.length <= 1}
                      aria-label="Previous Planet"
                    >
                      <NavigationArrowIcon direction="left" />
                    </button>
                    <button
                      className="ui-btn button button--confirm rounded-full"
                      onClick={() => click(() => handleConfirmSelection())}
                      onPointerDown={() => click(() => handleConfirmSelection())}
                      disabled={!selectedPlanetDetails}
                    >
                      Select {selectedPlanetDetails.name}
                    </button>
                    <button 
                      className="ui-btn button button--icon-navarrow rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => click(() => handleNextPlanet())}
                      onPointerDown={() => click(() => handleNextPlanet())}
                      disabled={planetData.length <= 1}
                      aria-label="Next Planet"
                    >
                      <NavigationArrowIcon direction="right" />
                    </button>
                  </div>
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