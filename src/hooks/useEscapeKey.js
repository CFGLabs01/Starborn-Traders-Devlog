import { useEffect } from 'react';

/**
 * Custom hook to execute a callback function when the Escape key is pressed.
 * @param {Function} callback - The function to call when Escape is pressed.
 */
const useEscapeKey = (callback) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                callback();
            }
        };

        // Add event listener when the component mounts (or callback changes)
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener when the component unmounts (or callback changes)
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [callback]); // Re-run effect if the callback function identity changes
};

export default useEscapeKey; 