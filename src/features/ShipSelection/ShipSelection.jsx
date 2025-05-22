import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom'; // Not used if onSelectionComplete is passed
// import { motion } from 'framer-motion'; // Not needed directly
// import ShipModelViewer from '../../components/ShipModelViewer/ShipModelViewer'; // No longer import this directly
// Import the content component we now export from ShipModelViewer.jsx
import { ShipPreviewContent } from '../../components/ShipModelViewer/ShipModelViewer'; 
import SelectionModal from '../../components/SelectionModal/SelectionModal'; 
import StatBar from '../../components/UI/StatBar';
import { useGameState } from '../../context/GameStateContext'; // Already using hook
import { ships as shipData } from './shipData'; // Correct named import, aliased
import useEscapeKey from '../../hooks/useEscapeKey.js';
// Assuming ShipCard exists and is imported correctly
import ShipCard from './ShipCard'; 
// Import the icon component
import NavigationArrowIcon from '../../components/UI/NavigationArrowButton';

// REMOVED Shared Animation Variants - Not used here

// Removed previewHostRef from props as it will be created and managed internally
const ShipSelection = ({ onSelectionComplete, showPreview, hidePreview }) => {
  const { setShip } = useGameState(); 
  const [selectedShipDetails, setSelectedShipDetails] = useState(null); 
  const [showDetailsModal, setShowDetailsModal] = useState(false); 
  const modalPreviewBoxRef = useRef(null); // Create ref for the modal's preview div

  const handleShipSelect = (ship) => {
    console.log("[ShipSelection.jsx] handleShipSelect called with:", ship);
    setSelectedShipDetails(ship);
    setShowDetailsModal(true);
    if (showPreview && ship.modelPath) {
      showPreview({ 
        type: 'ship', 
        modelPath: ship.modelPath,
        scale: ship.scale,
        initialRotationY: ship.initialRotationY
      }, modalPreviewBoxRef); // Pass the created ref
    } else {
      console.warn("[ShipSelection.jsx] showPreview not available or modelPath missing for ship:", ship.id);
    }
  };

  const handleCloseModal = () => {
    console.log("[ShipSelection.jsx] handleCloseModal called.");
    setShowDetailsModal(false);
    setSelectedShipDetails(null);
    if (hidePreview) hidePreview(); 
  };

  const handleConfirmSelection = () => {
    if (selectedShipDetails) {
        console.log('[ShipSelection.jsx] handleConfirmSelection called for:', selectedShipDetails);
        setShip(selectedShipDetails); 
        setShowDetailsModal(false);
        if (hidePreview) hidePreview(); 
        console.log("[ShipSelection.jsx] Calling onSelectionComplete('planet')");
        onSelectionComplete('planet'); 
    } else {
      console.warn('[ShipSelection.jsx] handleConfirmSelection called but no ship selected.');
    }
  };

  // useEscapeKey(handleCloseModal); 

  const navigateShip = (direction) => {
    if (!selectedShipDetails) {
        console.log("[ShipSelection.jsx] navigateShip called but no ship selected.");
        return;
    }
    console.log(`[ShipSelection.jsx] navigateShip called with direction: ${direction}`);
    const currentIndex = shipData.findIndex(s => s.id === selectedShipDetails.id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % shipData.length;
    } else { 
        nextIndex = (currentIndex - 1 + shipData.length) % shipData.length;
    }
    const nextShip = shipData[nextIndex];
    setSelectedShipDetails(nextShip);
    if (showPreview && nextShip.modelPath) {
        console.log("[ShipSelection.jsx] Navigating, showing preview for:", nextShip);
        showPreview({ 
          type: 'ship', 
          modelPath: nextShip.modelPath,
          scale: nextShip.scale,
          initialRotationY: nextShip.initialRotationY
        }, modalPreviewBoxRef); // Pass the created ref
    }
  };

  const handleNextShip = () => navigateShip('next');
  const handlePreviousShip = () => navigateShip('previous');

  return (
    <div className="w-full min-h-screen bg-transparent relative flex flex-col items-center justify-start text-center py-16">
      <div className="w-full container mx-auto max-w-5xl flex flex-col items-center pt-8 pb-8 px-4">
        <h2 className="text-3xl font-bold mb-2 text-teal-300">SELECT YOUR SHIP</h2>
        <p className="text-lg text-slate-400 mb-8">Your vessel for navigating the void. Choose wisely.</p>
        <div className="grid gap-6 justify-center justify-items-center selection-grid max-w-5xl mx-auto">
           {shipData.map((ship) => (
                 <ShipCard 
                     key={ship.id}
                     ship={ship}
                     onSelect={() => handleShipSelect(ship)}
                 />
            ))}
        </div>
      </div> 

      {showDetailsModal && selectedShipDetails && (
         <>
            <SelectionModal isOpen={showDetailsModal} onClose={handleCloseModal}>
                <div className="flex flex-col h-full overflow-hidden"> 
                    <div className="w-full h-[65%] flex-shrink-0 relative p-4 bg-black/30"> 
                        {/* Assign the created ref to this div */}
                        <div ref={modalPreviewBoxRef} style={{ width: '100%', height: '100%', position: 'relative' }} />
                        <h3 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xl font-bold text-white text-shadow-md z-10 bg-black/30 backdrop-blur-sm px-4 py-1 rounded-md pointer-events-none">
                            {selectedShipDetails.name}
                        </h3>
                    </div>
                    <div className="w-full flex-grow flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar"> 
                        <div className="text-center"> 
                          <p className="text-lg text-amber-400 font-light italic">{selectedShipDetails.class}</p>
                        </div>
                        <div>
                           <h3 className="text-xl font-semibold text-teal-400 mb-2 border-b border-teal-600/50 pb-1">Description</h3>
                           <p className="text-sm text-slate-300 mb-1">{selectedShipDetails.description}</p>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-teal-400 mb-3 border-b border-teal-600/50 pb-1">Ship Statistics</h3>
                          <div className="space-y-4"> 
                            {selectedShipDetails.stats && Object.entries(selectedShipDetails.stats).map(([statName, statValue]) => (
                                <StatBar 
                                    key={statName}
                                    label={statName.charAt(0).toUpperCase() + statName.slice(1)} 
                                    value={statValue}
                                    maxValue={10} 
                                    statName={statName} 
                                />
                            ))}
                          </div>
                        </div>
                        <div className="mt-auto pt-6 flex flex-col items-center"> 
                          <div className="flex justify-center items-center space-x-12"> 
                            <button 
                              className="button button--confirm rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed" 
                              onClick={handlePreviousShip} 
                              disabled={shipData.length <= 1}
                              aria-label="Previous Ship"
                            >
                              <NavigationArrowIcon direction="left" />
                            </button>
                            <button
                              onClick={handleConfirmSelection}
                              className="button button--confirm rounded-full"
                              disabled={!selectedShipDetails}
                            >
                              Select {selectedShipDetails?.name || 'Ship'}
                            </button>
                            <button 
                              className="button button--confirm rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={handleNextShip} 
                              disabled={shipData.length <= 1}
                              aria-label="Next Ship"
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

export default ShipSelection;