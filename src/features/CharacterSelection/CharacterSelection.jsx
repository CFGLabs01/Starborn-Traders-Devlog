import React, { useState, useRef, useEffect, useCallback } from 'react';
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
    const { setPlayerCharacter, logEchoAction } = useGameState();
    const [selectedCharacterDetails, setSelectedCharacterDetails] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const modalPreviewBoxRef = useRef(null);

    // Memoize the character select handler to prevent re-renders
    const handleCharacterSelect = useCallback((character) => {
        setSelectedCharacterDetails(character);
        setShowDetailsModal(true);
    }, []);

    // Stable reference for showPreview effect
    const selectedCharacterId = selectedCharacterDetails?.id;
    const selectedCharacterModelPath = selectedCharacterDetails?.modelPath;
    const selectedCharacterScale = selectedCharacterDetails?.scale;

    useEffect(() => {
        if (showDetailsModal && selectedCharacterDetails && modalPreviewBoxRef.current && showPreview) {
            const idleModelPath = selectedCharacterModelPath?.endsWith('Idle.glb') 
                ? selectedCharacterModelPath 
                : selectedCharacterModelPath?.replace(/\.glb$/, ' Idle.glb');
                
            if (idleModelPath) {
                const previewData = {
                    type: 'character',
                    modelPath: idleModelPath,
                    scale: selectedCharacterScale || 1,
                    animationName: 'Armature|Idle|baselayer'
                };
                
                // Only call showPreview if we have a valid model path
                showPreview(previewData, modalPreviewBoxRef);
            }
        } else if (!showDetailsModal && hidePreview) {
            hidePreview();
        }
    }, [showDetailsModal, selectedCharacterId, selectedCharacterModelPath, selectedCharacterScale, showPreview]);
    
    // Separate effect for cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (hidePreview) {
                hidePreview();
            }
        };
    }, [hidePreview]);

    const handleConfirmSelection = useCallback(() => {
        if (selectedCharacterDetails) {
            setPlayerCharacter(selectedCharacterDetails);
            
            // 🧠 LOG NEURAL ECHO: Character choice sets initial echo signature
            if (logEchoAction) {
                logEchoAction('discovery', {
                    discovery: `chosen_${selectedCharacterDetails.faction.toLowerCase()}`,
                    character: selectedCharacterDetails.name,
                    faction: selectedCharacterDetails.faction
                });
            }
            
            setShowDetailsModal(false);
            if (hidePreview) hidePreview();
            onSelectionComplete('ship');
        }
    }, [selectedCharacterDetails, setPlayerCharacter, logEchoAction, hidePreview, onSelectionComplete]);

    const handleCloseModal = useCallback(() => {
        setShowDetailsModal(false);
        setSelectedCharacterDetails(null);
        if (hidePreview) hidePreview();
    }, [hidePreview]);

    const navigateCharacter = useCallback((direction) => {
        if (!selectedCharacterDetails) return;
        
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
    }, [selectedCharacterDetails]);

    const handleNextCharacter = useCallback(() => navigateCharacter('next'), [navigateCharacter]);
    const handlePreviousCharacter = useCallback(() => navigateCharacter('previous'), [navigateCharacter]);

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