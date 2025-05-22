import React, { useState, useRef, useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';
import CharacterCard from './CharacterCard';
import { characters as characterData } from './characterData';
import SelectionModal from '../../components/SelectionModal/SelectionModal';
import CharacterPopup from './components/CharacterPopup';
import NavigationArrowButton from '../../components/UI/NavigationArrowButton';
import { motion } from 'framer-motion';

// Container variants for staggering
const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        // transition: { // Temporarily remove staggerChildren
        //     staggerChildren: 0.08, 
        // },
    },
};

const CharacterSelection = ({ onSelectionComplete, showPreview, hidePreview }) => {
    console.log('[CharacterSelection.jsx] Loaded characterData:', characterData);
    const { setPlayerCharacter } = useGameState();
    const [selectedCharacterDetails, setSelectedCharacterDetails] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const modalPreviewBoxRef = useRef(null);

    const handleCharacterSelect = (character) => {
        console.log("[CharacterSelection.jsx] handleCharacterSelect called with:", character);
        setSelectedCharacterDetails(character);
        setShowDetailsModal(true);
    };

    useEffect(() => {
        if (showDetailsModal && selectedCharacterDetails && modalPreviewBoxRef.current) {
            if (showPreview && selectedCharacterDetails.modelPath) {
                const idleModelPath = selectedCharacterDetails.modelPath.replace(/\.glb$/, 'Idle.glb');
                console.log(`[CharacterSelection.jsx useEffect] Showing preview for ${selectedCharacterDetails.name} in ref. Path: ${idleModelPath}`);
                showPreview(
                    {
                        type: 'character',
                        modelPath: idleModelPath,
                        scale: selectedCharacterDetails.scale || 1,
                        animationName: 'Armature|Idle|baselayer',
                    },
                    modalPreviewBoxRef
                );
            } else {
                console.warn("[CharacterSelection.jsx useEffect] Conditions not met to show preview or modelPath missing.");
            }
        } else if (!showDetailsModal && hidePreview) {
            console.log("[CharacterSelection.jsx useEffect] Modal not shown or details cleared, hiding preview.");
        }
    }, [showDetailsModal, selectedCharacterDetails, modalPreviewBoxRef, showPreview, hidePreview]);

    const handleConfirmSelection = () => {
        if (selectedCharacterDetails) {
            console.log("[CharacterSelection.jsx] handleConfirmSelection called for:", selectedCharacterDetails);
            setPlayerCharacter(selectedCharacterDetails);
            setShowDetailsModal(false);
            if (hidePreview) hidePreview();
            console.log("[CharacterSelection.jsx] Calling onSelectionComplete('ship')");
            onSelectionComplete('ship');
        } else {
            console.warn("[CharacterSelection.jsx] handleConfirmSelection called but no character selected.");
        }
    };

    const handleCloseModal = () => {
        console.log("[CharacterSelection.jsx] handleCloseModal called.");
        setShowDetailsModal(false);
        setSelectedCharacterDetails(null);
        if (hidePreview) hidePreview();
    };

    const navigateCharacter = (direction) => {
        if (!selectedCharacterDetails) {
            console.log("[CharacterSelection.jsx] navigateCharacter called but no character selected.");
            return;
        }
        console.log(`[CharacterSelection.jsx] navigateCharacter called with direction: ${direction}`);
        const currentIndex = characterData.findIndex(c => c.id === selectedCharacterDetails.id);
        if (currentIndex === -1) return;
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % characterData.length;
        } else {
            nextIndex = (currentIndex - 1 + characterData.length) % characterData.length;
        }
        const nextCharacter = characterData[nextIndex];
        setSelectedCharacterDetails(nextCharacter);
    };

    const handleNextCharacter = () => navigateCharacter('next');
    const handlePreviousCharacter = () => navigateCharacter('previous');

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen px-4 py-16 text-center relative text-white bg-transparent">
            <div className="w-full flex flex-col items-center"> 
                <h2 className="text-3xl font-bold mb-2 text-teal-300">SELECT YOUR CHARACTER</h2>
                <p className="text-lg text-slate-400 mb-8">Choose the person you'll embody in your journey through the cosmos.</p>
                
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center justify-items-center selection-grid max-w-5xl mx-auto"
                    variants={gridContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {characterData.map((character) => (
                        <CharacterCard 
                            key={character.id}
                            character={character}
                            onSelect={() => handleCharacterSelect(character)}
                        />
                    ))}
                </motion.div>
            </div>

            {showDetailsModal && selectedCharacterDetails && (
                <>
                    <SelectionModal
                        isOpen={showDetailsModal}
                        onClose={handleCloseModal}
                    >
                        <CharacterPopup 
                            characterDetails={selectedCharacterDetails} 
                            onConfirm={handleConfirmSelection}
                            onPrevious={handlePreviousCharacter}
                            onNext={handleNextCharacter}
                            previewHostRef={modalPreviewBoxRef}
                        />
                    </SelectionModal>
                </>
            )}
        </div>
    );
};

export default CharacterSelection;