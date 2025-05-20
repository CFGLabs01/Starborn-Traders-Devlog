import React from 'react';

// Simple placeholder Fuel Gauge HUD element
const FuelGauge = ({ id }) => {
  // In a real scenario, this would likely get fuel level from game state
  const fuelLevel = 75; // Example static value
  const fuelPercentage = Math.max(0, Math.min(100, fuelLevel));

  return (
    <div 
      id={id} // ID used for targeting by the tutorial
      className="fixed top-5 left-5 p-2 bg-slate-900/60 backdrop-blur-sm rounded border border-cyan-500/30 text-cyan-300 shadow-lg pointer-events-auto"
    >
      <div className="text-xs uppercase tracking-wider mb-1 font-semibold">Fuel</div>
      <div className="w-32 h-3 bg-cyan-900/50 rounded-full overflow-hidden border border-cyan-700/50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${fuelPercentage}%` }}
        />
      </div>
      <div className="text-right text-xs font-mono mt-1">{fuelPercentage}%</div>
    </div>
  );
};

export default FuelGauge; 