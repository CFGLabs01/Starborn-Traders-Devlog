import React, { createContext, useState, useContext, useMemo } from 'react';

// Create the context
const EventContext = createContext();

// Custom hook to use the event context
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

// Context Provider component
export const EventProvider = ({ children }) => {
  const [activeEvent, setActiveEvent] = useState(null);
  
  // You could add other event-related states here if needed (e.g., combat state)
  // const [isInCombat, setIsInCombat] = useState(false);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    activeEvent,
    setActiveEvent,
    // isInCombat,
    // setIsInCombat,
  }), [activeEvent /*, isInCombat*/]);

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 