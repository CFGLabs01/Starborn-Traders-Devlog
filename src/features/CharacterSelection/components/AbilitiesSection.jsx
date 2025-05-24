// Component: AbilitiesSection
// Purpose: Displays the character's special abilities or a placeholder message.
import React from 'react';

const AbilitiesSection = ({ abilities, className = '' }) => {
  return (
    // Abilities Section - Apply passed className, remove hardcoded background
    <div className={className}>
      <h3 className="text-lg font-semibold text-tiffany_blue mb-2 font-display">Abilities</h3>
      {(abilities && abilities.length > 0) ? (
        <ul className="text-sm text-vanilla/80 list-disc list-inside space-y-1">
          {abilities.map((ability, index) => (
            <li key={index}>
              <span className="font-semibold text-tiffany_blue">{ability.name}:</span> {ability.description}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-tiffany_blue/60 italic">No special abilities noted.</p>
      )}
    </div>
  );
};

export default AbilitiesSection; 