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
import { useClick } from '../../hooks/useClick';
import AutoGrid from '../../components/AutoGrid';

// REMOVED Shared Animation Variants - Not used here

// Removed previewHostRef from props as it will be created and managed internally
const ShipSelection = ({ onSelectionComplete, showPreview, hidePreview }) => {
  const { setShip } = useGameState();
  const click = useClick(); 
  const [selectedShipDetails, setSelectedShipDetails] = useState(null); 
  const [showDetailsModal, setShowDetailsModal] = useState(false); 
  const modalPreviewBoxRef = useRef(null); // Create ref for the modal's preview div

  const handleShipSelect = (ship) => {
    console.log("[ShipSelection.jsx] handleShipSelect called with:", ship);
    if (!ship?.stats) {
      console.error('Missing stats for ship:', ship);
      return;
    }
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
        <AutoGrid>
           {shipData.map((ship) => (
                 <ShipCard 
                     key={ship.id}
                     ship={ship}
                     onSelect={() => handleShipSelect(ship)}
                 />
            ))}
        </AutoGrid>
      </div> 

      {showDetailsModal && selectedShipDetails && (
         <>
            <SelectionModal isOpen={showDetailsModal} onClose={handleCloseModal}>
                <div className="w-full h-full p-6">
                  {/* Two-column layout */}
                  <div className="grid grid-cols-2 gap-8 h-full">
                    {/* Left Column - Content */}
                    <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4">
                      <div className="text-center"> 
                        <h2 className="text-2xl font-bold text-white text-center font-display mb-2">
                          {selectedShipDetails.name}
                        </h2>
                        <p className="text-lg text-amber-400 font-light italic">{selectedShipDetails.class}</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6">
                         <h3 className="text-xl font-semibold text-teal-400 mb-2 border-b border-teal-600/50 pb-1">Description</h3>
                         <p className="text-sm text-slate-300 mb-1">{selectedShipDetails.description}</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6">
                         <h3 className="text-xl font-semibold text-teal-400 mb-3 border-b border-teal-600/50 pb-1">Specifications</h3>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Hull Integrity:</span>
                              <span className="text-white font-mono">{selectedShipDetails.stats?.integrity || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Speed:</span>
                              <span className="text-white font-mono">{selectedShipDetails.stats?.speed || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Cargo:</span>
                              <span className="text-white font-mono">{selectedShipDetails.stats?.capacity || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Weapons:</span>
                              <span className="text-white font-mono">{selectedShipDetails.stats?.firepower || 'N/A'}</span>
                            </div>
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
                            SELECT SHIP
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

export default ShipSelection;