import React from 'react';
// import styles from './CharacterSelection.module.css'; // Removed unused import
import { motion } from 'framer-motion';

// Animation variant for the card itself (can be simpler)
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};


// Character Card Component - Now simpler, using shared CSS
const CharacterCard = ({ character, onSelect }) => {
    if (!character) {
        console.error("CharacterCard received undefined character");
        return null; // Or return a placeholder/error indicator
    }

    return (
        <motion.div
            className="selection-card" // Use shared base class
            onClick={onSelect} 
            variants={cardVariants} // Apply simple variant
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03, transition: { duration: 0.15 } }} // Subtle hover scale
            whileTap={{ scale: 0.98 }} // Subtle tap scale
            layout // Enable smooth layout changes if grid rearranges
        >
             {/* Image Container - Prioritize portrait, remove 3D model fallback */}
             <div className="w-full aspect-[3/4] mb-2 overflow-hidden rounded-md flex items-center justify-center bg-slate-800/50">
                {character.portrait ? ( 
                    <img 
                        src={character.portrait} 
                        alt={character.name} 
                        className="w-full h-full object-contain" 
                        loading="lazy"
                    />
                ) : ( 
                    // Fallback if no portrait - previously showed model, now shows placeholder
                    <div className="text-slate-500 text-xs">No Portrait</div> 
                )}
             </div>

            {/* Text Content - Added stats */}
            <div className="text-center px-1 pt-1 flex-grow flex flex-col justify-end">
                <h3 className="text-base font-semibold text-slate-100 truncate" title={character.name}>
                    {character.name}
                </h3>
                <p className="text-sm text-teal-400 truncate" title={character.archetype}>
                    {character.archetype || 'No Archetype'} 
                </p>
                {/* Display key stats */}
                <div className="text-xs text-slate-400 mt-1 flex justify-center space-x-2">
                    <span>Pilot: {character.stats?.pilot || '-'}</span>
                    <span>Mech: {character.stats?.mechanic || '-'}</span>
                    <span>Trade: {character.stats?.trade || '-'}</span>
                </div>
            </div>
        </motion.div>
    );
};

// Removed PropTypes definition for brevity, ensure data is consistent

export default CharacterCard; 