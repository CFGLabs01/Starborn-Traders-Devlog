import React from 'react';
import { motion } from 'framer-motion';
// Assuming PlanetModelViewer path is correct relative to this new file
import PlanetModelViewer from '../../components/PlanetModelViewer/PlanetModelViewer';

// Animation variant for the card (consistent with other cards)
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Basic Planet Card Component
const PlanetCard = ({ planet, onSelect }) => {
    if (!planet) {
        console.error("PlanetCard received undefined planet");
        return null;
    }

    // Determine security color
    const securityColor = planet.isSafe ? 'text-green-400' : 'text-red-400';
    const securityText = planet.isSafe ? 'Secure' : 'Hazardous';

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
            {/* Image/Model Container - Adjusted for vertical aspect and image priority */}
            <div className="w-full aspect-[3/4] mb-2 overflow-hidden rounded-md flex items-center justify-center bg-slate-800/50">
                {/* Prioritize image if available */}
                {planet.image ? (
                    <img 
                        src={planet.image} 
                        alt={planet.name} 
                        className="w-full h-full object-cover" // Use cover
                        loading="lazy"
                    />
                 ) : planet.modelPath && !planet.modelPath.includes('placeholder') ? (
                    <PlanetModelViewer 
                        modelPath={planet.modelPath} 
                        isCardView={true}
                    />
                ) : (
                    <div className="text-slate-500 text-xs">No Visual</div>
                )}
            </div>

            {/* Text Content - Added key info */}
            <div className="text-center px-1 pt-1 flex-grow flex flex-col justify-end">
                <h3 className="text-base font-semibold text-slate-100 truncate" title={planet.name}>
                    {planet.name}
                </h3>
                <p className="text-sm text-teal-400 truncate" title={planet.region}>
                    {planet.region || 'Unknown Region'}
                </p>
                 {/* Display key info (Economy, Security) */}
                 <div className="text-xs text-slate-400 mt-1 flex justify-center space-x-2">
                     <span>Eco: {planet.economy || 'N/A'}</span>
                     <span className={securityColor}>Sec: {securityText}</span>
                 </div>
            </div>
        </motion.div>
    );
};

export default PlanetCard; 