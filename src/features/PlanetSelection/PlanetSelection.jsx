import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { planets as planetData } from './planetData';
import SelectionModal from '../../components/SelectionModal/SelectionModal';
import useEscapeKey from '../../hooks/useEscapeKey.js';
import PlanetCard from './PlanetCard';
import StatBar from '../../components/UI/StatBar';
import NavigationArrowIcon from '../../components/UI/NavigationArrowButton';

const PlanetSelection = ({ onSelectionComplete, showPreview, hidePreview, previewHostRef }) => {
  const [selectedPlanetDetails, setSelectedPlanetDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { setStartingPlanet } = useGameState();

  const handlePlanetSelect = (planet) => {
    console.log("[PlanetSelection.jsx] handlePlanetSelect called with:", planet);
    setSelectedPlanetDetails(planet);
    setShowDetailsModal(true);
    if (showPreview && planet.modelPath) { // Ensure modelPath exists for planets if previews are desired
      showPreview({ type: 'planet', planetData: planet, scale: planet.scale || 1 }); // Pass scale
    } else if (showPreview) { // if no modelPath, still show preview with data (could be a 2D representation or basic sphere)
      showPreview({ type: 'planet', planetData: planet, scale: planet.scale || 1 });
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
      console.log("[PlanetSelection.jsx] Calling onSelectionComplete('game')");
      onSelectionComplete('game');
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
    if (currentIndex === -1) return; // Should not happen if selectedPlanetDetails is valid
    let nextIndex;
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % planetData.length;
    } else { 
        nextIndex = (currentIndex - 1 + planetData.length) % planetData.length;
    }
    const nextPlanet = planetData[nextIndex];
    setSelectedPlanetDetails(nextPlanet);
    if (showPreview && nextPlanet.modelPath) {
      console.log("[PlanetSelection.jsx] Navigating, showing preview for (with modelPath):", nextPlanet);
      showPreview({ type: 'planet', planetData: nextPlanet, scale: nextPlanet.scale || 1 });
    } else if (showPreview) {
      console.log("[PlanetSelection.jsx] Navigating, showing preview for (no modelPath, basic preview):", nextPlanet);
      showPreview({ type: 'planet', planetData: nextPlanet, scale: nextPlanet.scale || 1 });
    }
  };

  const handleNextPlanet = () => navigatePlanet('next');
  const handlePreviousPlanet = () => navigatePlanet('previous');

  return (
    <div className="flex flex-col items-center justify-center h-screen container mx-auto px-4 py-8 text-center relative">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2 text-teal-300">SELECT YOUR STARTING PLANET</h2>
        <p className="text-lg text-slate-400 mb-8">Where will your interstellar adventure begin?</p>

        <div className="grid gap-6 justify-center justify-items-center selection-grid max-w-5xl mx-auto">
          {planetData.map((planet) => (
            <PlanetCard 
              key={planet.id}
              planet={planet}
              onSelect={() => handlePlanetSelect(planet)}
            />
          ))}
        </div>
      </div>

      {showDetailsModal && selectedPlanetDetails && (
        <>
          <SelectionModal isOpen={showDetailsModal} onClose={handleCloseModal}>
            {/* Modal Content Wrapper */}
            <div className="flex flex-col lg:flex-row overflow-hidden h-full"> {/* Added h-full for modal content to fill */}
              
              {/* Left Column: Preview Area */}
              <div className="w-full lg:w-[45%] flex items-center justify-center p-4 relative bg-black/20"> {/* Consistent with CharacterPopup */}
                <div 
                  ref={previewHostRef} 
                  style={{ 
                    width: '100%', 
                    height: '300px', // Explicit height like CharacterPopup
                    position: 'absolute', 
                    top: '50%', // Center vertically
                    left: '50%', // Center horizontally
                    transform: 'translate(-50%, -50%)', // Adjust for centering
                    // backgroundColor: 'rgba(0, 0, 255, 0.1)' // Optional: faint blue bg for debug
                  }} 
                />
                <h2 className="absolute top-6 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white text-shadow-md z-10 bg-black/30 backdrop-blur-sm px-6 py-2 rounded-lg font-display pointer-events-none">
                  {selectedPlanetDetails.name}
                </h2>
              </div>

              {/* Right Column: Scrollable Info */}
              <div className="w-full lg:w-[55%] flex flex-col p-6 space-y-4 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-slate-300 italic mb-4">
                  {selectedPlanetDetails.description || `Details for ${selectedPlanetDetails.name}.`}
                </p>

                <div>
                  <h3 className="text-xl font-semibold text-teal-400 mb-3 border-b border-teal-600/50 pb-1">Planetary Statistics</h3>
                  {selectedPlanetDetails.stats ? (
                    <div className="space-y-2"> {/* Reduced space-y for tighter packing */}
                      {Object.entries(selectedPlanetDetails.stats).map(([key, value]) => (
                        <StatBar 
                          key={key} 
                          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} // Format key to label
                          value={value} 
                          maxValue={10} // Assuming max 10 for now
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

                {/* Navigation and Select Buttons */}
                <div className="mt-auto pt-6 flex flex-col items-center"> 
                  <div className="flex justify-center items-center space-x-12">
                    <button 
                      className="button button--icon-navarrow rounded-full disabled:opacity-50 disabled:cursor-not-allowed" 
                      onClick={handlePreviousPlanet} 
                      disabled={planetData.length <= 1}
                      aria-label="Previous Planet"
                    >
                      <NavigationArrowIcon direction="left" />
                    </button>
                    
                    <button
                      onClick={handleConfirmSelection}
                      className="button button--confirm rounded-full"
                      disabled={!selectedPlanetDetails}
                    >
                      Select {selectedPlanetDetails.name}
                    </button>
                    
                    <button 
                      className="button button--icon-navarrow rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleNextPlanet} 
                      disabled={planetData.length <= 1}
                      aria-label="Next Planet"
                    >
                      <NavigationArrowIcon direction="right" />
                    </button>
                  </div>
                </div>
              </div> {/* End Right Column */}
            </div> {/* End Modal Content Wrapper */}
          </SelectionModal>
        </>
      )}
    </div>
  );
};

export default PlanetSelection; 