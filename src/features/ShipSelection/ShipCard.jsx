import React from 'react';
import { motion } from 'framer-motion';

// Animation variant for the card
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Ship Card Component
const ShipCard = ({ ship, onSelect }) => {
    if (!ship) {
        console.error("ShipCard received undefined ship");
        return null;
    }

    return (
        <motion.div
            className="selection-card" // Use shared base class
            onClick={onSelect}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98 }}
            layout
        >
            {/* Image Container - Adjusted for vertical aspect ratio and PNG priority */}
            <div className="w-full aspect-[3/4] mb-2 overflow-hidden rounded-md flex items-center justify-center bg-slate-800/50">
                {/* Prioritize image if available */}
                {ship.image ? (
                    <img 
                        src={ship.image} 
                        alt={ship.name} 
                        className="w-full h-full object-cover" // Use cover to fill container
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-slate-500 text-xs font-semibold select-none">
                        <span>No Image</span>
                        <span>3D Preview in Modal</span>
                    </div>
                )}
            </div>

            {/* Text Content */}
            <div className="text-center px-1 pt-1 flex-grow flex flex-col justify-end"> {/* Adjusted text positioning */}
                <h3 className="text-base font-semibold text-slate-100 truncate" title={ship.name}>
                    {ship.name}
                </h3>
                <p className="text-sm text-teal-400 truncate uppercase" title={ship.class}>
                    {ship.class || 'Unknown Class'}
                </p>
                {/* Display key stats (e.g., SPD, AGI, CAP) */}
                <div className="text-xs text-slate-400 mt-1 flex justify-center space-x-2">
                    <span>SPD: {ship.stats?.speed || '-'}</span>
                    <span>AGI: {ship.stats?.agility || '-'}</span>
                    <span>CAP: {ship.stats?.capacity || '-'}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ShipCard; 