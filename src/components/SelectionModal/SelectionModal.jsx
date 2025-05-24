import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    modalVariants, 
    modalBackdropVariants
} from '../../utils/animations'; // Import shared animations

// Reusable Modal Component - Now accepts a title prop
const SelectionModal = ({ 
    isOpen,         
    onClose,        
    title,         // <-- Added title prop
    children       // Children prop contains the main panel content
}) => {

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-backdrop"
                    onClick={onClose} 
                    variants={modalBackdropVariants} 
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    role="dialog" 
                    aria-modal="true"
                    style={{ 
                        background: 'rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 30
                    }}
                >
                    {/* Panel - Keep relative positioning for absolute children */}
                    <motion.div
                        className="modal-panel flex flex-col shadow-lg overflow-visible"
                        variants={modalVariants}
                        onClick={e => e.stopPropagation()} 
                        style={{ zIndex: 31 }}
                    >
                        {/* Close Button (position absolutely within panel) */}
                        <button 
                            onClick={onClose} 
                            // Use more specific button classes, positioned top-right
                            className="absolute top-4 right-4 z-20 button button--icon button--close text-white hover:text-accent-cyan text-2xl"
                            aria-label="Close details"
                        >
                            &times;
                        </button>
                        
                        {/* Content Area (apply padding and scrolling here) */}
                        {/* This div uses modal-panel-content class for styling */}
                        <div className="modal-panel-content custom-scrollbar">
                            {children} {/* Render content passed from parent */}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SelectionModal; 