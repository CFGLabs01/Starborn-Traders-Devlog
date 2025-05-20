import React from 'react';

// Simple component to render a drifting asteroid visual
const AsteroidVisual = () => {
  // Adjust path if your asset structure is different
  const asteroidImagePath = '/assets/Models/asteroid_placeholder.png'; 

  return (
    <div className="fixed top-1/3 left-0 w-16 h-16 pointer-events-none z-40 animate-drift">
      <img 
        src={asteroidImagePath} 
        alt="Drifting Asteroid" 
        className="w-full h-full object-contain filter drop-shadow-md" 
      />
    </div>
  );
};

export default AsteroidVisual; 