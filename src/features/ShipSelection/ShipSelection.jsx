import React, { useState, useEffect } from 'react';
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

// Accept the new props from App.jsx
const ShipSelection = ({ onSelectionComplete, showPreview, hidePreview, previewHostRef }) => {
  const { setShip } = useGameState(); // Already using the hook, ensure correct setter name
  // const navigate = useNavigate(); // Not needed
  const [selectedShipDetails, setSelectedShipDetails] = useState(null); // Renamed for clarity
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Renamed state for clarity

  // REMOVED Redirect logic - Assumed handled by parent routing

  // Handlers
  const handleShipSelect = (ship) => {
     console.log("[ShipSelection.jsx] handleShipSelect called with:", ship);
    setSelectedShipDetails(ship);
    setShowDetailsModal(true);
    // Trigger the preview in App.jsx's <View />
    if (showPreview && ship.modelPath) {
      showPreview({ 
        type: 'ship', 
        modelPath: ship.modelPath,
        scale: ship.scale,
        initialRotationY: ship.initialRotationY
      }); 
    } else {
      console.warn("[ShipSelection.jsx] showPreview not available or modelPath missing for ship:", ship.id);
    }
  };

  const handleCloseModal = () => {
    console.log("[ShipSelection.jsx] handleCloseModal called.");
    setShowDetailsModal(false);
    setSelectedShipDetails(null);
    // Hide the preview in App.jsx's <View />
    if (hidePreview) hidePreview(); 
  };

  const handleConfirmSelection = () => {
    if (selectedShipDetails) {
        console.log('[ShipSelection.jsx] handleConfirmSelection called for:', selectedShipDetails);
        // Update context with the selected ship's details
        setShip(selectedShipDetails); // Pass the whole selected object
        
        setShowDetailsModal(false);
        if (hidePreview) hidePreview(); // Hide preview on confirm
        console.log("[ShipSelection.jsx] Calling onSelectionComplete('planet')");
        onSelectionComplete('planet'); // Proceed to next step
    } else {
      console.warn('[ShipSelection.jsx] handleConfirmSelection called but no ship selected.');
    }
  };

  // useEscapeKey(handleCloseModal); // Ensure this is correctly placed if used

  // --- Navigation Logic ---
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
    } else { // direction === 'previous'
        nextIndex = (currentIndex - 1 + shipData.length) % shipData.length;
    }
    const nextShip = shipData[nextIndex];
    setSelectedShipDetails(nextShip);
    // Update the preview content
    if (showPreview && nextShip.modelPath) {
        console.log("[ShipSelection.jsx] Navigating, showing preview for:", nextShip);
        showPreview({ 
          type: 'ship', 
          modelPath: nextShip.modelPath,
          scale: nextShip.scale,
          initialRotationY: nextShip.initialRotationY
        }); 
    }
  };

  const handleNextShip = () => navigateShip('next');
  const handlePreviousShip = () => navigateShip('previous');
  // --- End Navigation Logic ---

  return (
    // Main container: Center content vertically and horizontally, ADD relative
    <div className="flex flex-col items-center justify-center h-screen container mx-auto px-4 py-8 text-center relative bg-transparent">

      {/* Grid Section Wrapper (Centers Header + Grid Block) */}
      <div className="w-full flex flex-col items-center"> 
        <h2 className="text-3xl font-bold mb-2 text-teal-300">SELECT YOUR SHIP</h2>
        <p className="text-lg text-slate-400 mb-8">Your vessel for navigating the void. Choose wisely.</p>
        
        {/* Grid - Constrained width and centered */}
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

      {/* Modal - Renders UI, but 3D view is handled by App.jsx's <View /> */}
      {showDetailsModal && selectedShipDetails && (
         <>
            <SelectionModal isOpen={showDetailsModal} onClose={handleCloseModal}>
                <div className="flex flex-col h-full overflow-hidden"> 
                    {/* Top Section: DIV for the 3D Preview Viewport */}
                    <div className="w-full h-[65%] flex-shrink-0 relative p-4 bg-black/30"> {/* Added bg for contrast */}
                        {/* This div will be tracked by the <View /> in App.jsx */}
                        <div ref={previewHostRef} style={{ width: '100%', height: '100%', position: 'relative' }} />
                        {/* Title Overlay remains here */}
                        <h3 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xl font-bold text-white text-shadow-md z-10 bg-black/30 backdrop-blur-sm px-4 py-1 rounded-md pointer-events-none">
                            {selectedShipDetails.name}
                        </h3>
                        {/* REMOVED direct <ShipModelViewer /> call */}
                    </div>
                    {/* Bottom Section: Scrollable Info */}
                    {/* Make this section scrollable and take remaining space */}
                    <div className="w-full flex-grow flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar"> 
                        {/* Ship Class (Moved below model) */}
                        <div className="text-center"> 
                          {/* Removed h2 name, already in overlay */}
                          <p className="text-lg text-amber-400 font-light italic">{selectedShipDetails.class}</p>
                        </div>

                        {/* Description & Stats Container */}
                        {/* Removed extra flex-col and space-y, handled by parent */}
                        {/* Description */}
                        <div>
                           <h3 className="text-xl font-semibold text-teal-400 mb-2 border-b border-teal-600/50 pb-1">Description</h3>
                           <p className="text-sm text-slate-300 mb-1">{selectedShipDetails.description}</p>
                        </div>

                        {/* Ship Statistics */}
                        <div>
                          <h3 className="text-xl font-semibold text-teal-400 mb-3 border-b border-teal-600/50 pb-1">Ship Statistics</h3>
                          <div className="space-y-4"> {/* Added div with space-y-4 for increased spacing */}
                            {/* Map over the actual stats object */}
                            {selectedShipDetails.stats && Object.entries(selectedShipDetails.stats).map(([statName, statValue]) => (
                                <StatBar 
                                    key={statName}
                                    label={statName.charAt(0).toUpperCase() + statName.slice(1)} // Capitalize label
                                    value={statValue}
                                    maxValue={10} // Assuming 10 is max for all
                                    statName={statName} // Pass statName for potential coloring
                                />
                            ))}
                          </div>
                        </div>

                        {/* --- Navigation and Select Buttons Container --- */}
                        <div className="mt-auto pt-6 flex flex-col items-center"> 
                          {/* All Three Buttons in Single Row */}
                          <div className="flex justify-center items-center space-x-12"> {/* Increased space-x from 4 to 12 */}
                            {/* Left Arrow Button */}  
                            <button 
                              className="button button--confirm rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed" 
                              onClick={handlePreviousShip} 
                              disabled={shipData.length <= 1}
                              aria-label="Previous Ship"
                            >
                              <NavigationArrowIcon direction="left" />
                            </button>
                            
                            {/* Select Button */}
                            <button
                              onClick={handleConfirmSelection}
                              className="button button--confirm rounded-full"
                              disabled={!selectedShipDetails}
                            >
                              Select {selectedShipDetails?.name || 'Ship'}
                            </button>
                            
                            {/* Right Arrow Button */}  
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
                        {/* --- End Buttons Container --- */}
                        
                    </div> {/* End Scrollable Info Section */}
                </div> {/* End Single Vertical Column */}
            </SelectionModal>

            {/* Navigation Arrows - REMOVED from here */}

        </> 
      )} 
    </div> // End Main Container
  );
};

export default ShipSelection;