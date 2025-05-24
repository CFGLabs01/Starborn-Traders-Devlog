// Component: AttributesSection
// Purpose: Renders the character's stats using StatBar components.
import React from 'react';
import StatBar from '../../../components/UI/StatBar';

const AttributesSection = ({ attributes, className = '' }) => {
  // Function to format the label (e.g., 'combat' -> 'Combat')
  const formatLabel = (key) => key.charAt(0).toUpperCase() + key.slice(1);

  return (
    // Attributes Section - Apply passed className, remove hardcoded background
    <div className={className}>
      <h3 className="text-lg font-semibold text-tiffany_blue mb-2 font-display">Attributes</h3>
      <div className="space-y-1">
        {/* Iterate directly over the keys of the passed attributes object */}
        {attributes && Object.entries(attributes).map(([key, value]) => (
          <StatBar
            key={key} // Use the actual key from the data
            label={formatLabel(key)} // Use the actual key as the label (formatted)
            value={value ?? 0} // Use the value directly
            maxValue={10} // Assuming max value is 10 for all stats
          />
        ))}
        {/* Add a message if no attributes are found */}
        {!attributes || Object.keys(attributes).length === 0 && (
          <p className="text-sm text-tiffany_blue/60 italic">No attributes defined.</p>
        )}
      </div>
    </div>
  );
};

export default AttributesSection; 