import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import CharacterCard from './CharacterCard';
import { characters as characterData } from './characterData';
import SelectionModal from '../../components/SelectionModal/SelectionModal';
import CharacterPopup from './components/CharacterPopup';
import NavigationArrowButton from '../../components/UI/NavigationArrowButton';

const CharacterSelection = ({ onSelectionComplete, showPreview, hidePreview, previewHostRef }) => {
    const { setPlayerCharacter } = useGameState();
    const [selectedCharacterDetails, setSelectedCharacterDetails] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleCharacterSelect = (character) => {
        console.log("[CharacterSelection.jsx] handleCharacterSelect called with:", character);
        setSelectedCharacterDetails(character);
        setShowDetailsModal(true);
        if (showPreview && character.modelPath) {
            showPreview({ 
                type: 'character', 
                modelPath: character.modelPath,
                scale: character.scale || 1,
                animationName: 'Armature|Idle|baselayer'
            });
        } else {
            console.warn("[CharacterSelection.jsx] showPreview not available or modelPath missing for character:", character.id);
        }
    };

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
        if (showPreview && nextCharacter.modelPath) {
            console.log("[CharacterSelection.jsx] Navigating, showing preview for:", nextCharacter);
            showPreview({ 
                type: 'character', 
                modelPath: nextCharacter.modelPath,
                scale: nextCharacter.scale || 1,
                animationName: 'Armature|Idle|baselayer'
            });
        }
    };

    const handleNextCharacter = () => navigateCharacter('next');
    const handlePreviousCharacter = () => navigateCharacter('previous');

    return (
        <div className="flex flex-col items-center justify-center container mx-auto px-4 py-8 text-center relative text-white">
            <div className="w-full flex flex-col items-center"> 
                <h2 className="text-3xl font-bold mb-2 text-teal-300">SELECT YOUR CHARACTER</h2>
                <p className="text-lg text-slate-400 mb-8">Choose the person you'll embody in your journey through the cosmos.</p>
                
                <div className="grid gap-6 justify-center justify-items-center selection-grid max-w-5xl mx-auto">
                    {characterData.map((character) => (
                        <CharacterCard 
                            key={character.id}
                            character={character}
                            onSelect={() => handleCharacterSelect(character)}
                        />
                    ))}
                </div>
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
                            previewHostRef={previewHostRef}
                        />
                    </SelectionModal>
                </>
            )}
        </div>
    );
};

export default CharacterSelection;