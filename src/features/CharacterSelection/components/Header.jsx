// Component: Header
// Purpose: Renders character name in the top bar of the popup.
import React from 'react';

const Header = ({ name }) => {
  return (
    // Character Name Section - Reverted to previous simpler style
    <div className="bg-slate-800/95 p-4 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-white text-center font-display">
        {name || 'Character Name'}
      </h2>
    </div>
  );
};

export default Header; 