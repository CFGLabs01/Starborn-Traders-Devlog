// Component: AbilitiesSection
// Purpose: Displays the character's special abilities or a placeholder message.
import React from 'react';

const AbilitiesSection = ({ abilities, className = '' }) => {
  return (
    // Abilities Section - Apply passed className
    <div className={`bg-slate-800/95 p-4 rounded-2xl shadow-xl ${className}`}>
      <h3 className="text-lg font-semibold text-teal-400 mb-2 font-display">Abilities</h3>
      {(abilities && abilities.length > 0) ? (
        <ul className="text-sm text-slate-300 list-disc list-inside space-y-1">
          {abilities.map((ability, index) => (
            <li key={index}>
              <span className="font-semibold">{ability.name}:</span> {ability.description}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 italic">No special abilities noted.</p>
      )}
    </div>
  );
};

export default AbilitiesSection; 