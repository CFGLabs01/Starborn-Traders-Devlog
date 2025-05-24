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
                        className="modal-panel p-8 sm:p-10 lg:p-12 relative rounded-3xl bg-rich_black/40 backdrop-blur-md flex flex-col shadow-lg overflow-hidden"
                        variants={modalVariants}
                        onClick={e => e.stopPropagation()} 
                        style={{ 
                            zIndex: 31,
                            width: 'clamp(300px, 90vw, 1200px)',
                            maxHeight: '85vh',
                            marginTop: '5vh',
                            marginBottom: '5vh'
                        }}
                    >
                        {/* Close Button (position absolutely within panel) */}
                        <button 
                            onClick={onClose} 
                            className="absolute top-4 right-4 text-2xl leading-none text-white hover:text-accent-cyan z-20"
                            aria-label="Close details"
                        >
                            ×
                        </button>
                        
                        {/* Content Area with proper scrolling */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {children} {/* Render content passed from parent */}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SelectionModal; 