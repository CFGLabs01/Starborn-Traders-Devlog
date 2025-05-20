import React from 'react';

/**
 * A reusable component to display a value as a horizontal bar graph,
 * styled to resemble a semi-transparent cylinder.
 * Props:
 *  - label: string - The name of the stat (e.g., "Speed")
 *  - value: number - The current value of the stat
 *  - maxValue: number - The maximum possible value for calculating percentage
 *  - unit: string (optional) - Unit for context, not displayed directly
 */
const StatBar = ({ label, value, maxValue, unit = '' }) => {
  // Ensure value is a number and handle null/undefined
  const numericValue = Number(value) || 0;
  const numericMaxValue = Number(maxValue) || 1; // Avoid division by zero

  // Calculate percentage, ensuring it's between 0 and 100
  const rawPercentage = Math.max(0, Math.min(100, (numericValue / numericMaxValue) * 100));
  // Ensure a minimum visual width (e.g., 2%) if value > 0, otherwise 0%
  const displayPercentage = numericValue > 0 ? Math.max(2, rawPercentage) : 0;

  // Format the displayed value (e.g., one decimal place)
  const displayValue = numericValue.toFixed(1);

  return (
    <div className="flex items-center space-x-3 w-full text-sm">
      {/* Left: Label - Increase width maybe? */}
      <span className="w-1/3 flex-shrink-0 text-left text-slate-300 capitalize truncate font-medium">
        {label}
      </span>

      {/* Middle: Bar Container (Track) - Use new track class */}
      <div className="stat-bar-track">
        {/* Actual Bar Div - Use new fill class */}
        <div
          className="stat-bar-cylinder-fill" 
          // Set width via inline style
          style={{ 
            width: `${displayPercentage}%` 
          }}
          role="progressbar"
          aria-valuenow={numericValue}
          aria-valuemin="0"
          aria-valuemax={numericMaxValue}
          aria-label={`${label} stat bar`}
        />
      </div>

      {/* Right: Value - Adjusted width and alignment */}
      <span className="w-10 text-right font-mono text-cyan-300 text-xs">
        {displayValue}
      </span>
    </div>
  );
};

export default StatBar; 