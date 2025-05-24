import React from 'react';
import { elements } from '../../data/elements';

const ElementIcon = ({ element, quantity }) => {
  const elementData = elements[element];
  
  if (!elementData) return null;

  return (
    <div className="flex items-center gap-2 bg-rich_black/40 border border-tiffany_blue/20 rounded-lg p-2">
      <div 
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold"
        style={{ 
          borderColor: elementData.color,
          backgroundColor: `${elementData.color}20`,
          color: elementData.color
        }}
      >
        {elementData.symbol}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-white font-semibold">{elementData.name}</span>
        <span className="text-xs text-slate-400">{quantity} units</span>
      </div>
    </div>
  );
};

const ElementScanner = ({ scanResults = {} }) => {
  // Default scan results for asteroid
  const defaultResults = {
    nickel: 18, // High nickel content as mentioned
    iron: 12,
    carbon: 8,
    silicon: 6,
    titanium: 3,
    hydrogen: 15
  };

  const results = Object.keys(scanResults).length > 0 ? scanResults : defaultResults;

  return (
    <div className="bg-gradient-to-br from-rich_black/30 via-midnight_green/10 to-rich_black/40 backdrop-blur-sm border border-tiffany_blue/15 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <h3 className="text-lg font-semibold text-tiffany_blue">Scanner Analysis</h3>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-slate-300 mb-3">
          <span className="text-tiffany_blue">Status:</span> High nickel content detected
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(results).map(([elementId, quantity]) => (
            <ElementIcon key={elementId} element={elementId} quantity={quantity} />
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-tiffany_blue/10 border border-tiffany_blue/30 rounded-lg">
          <div className="text-xs text-slate-300">
            <span className="text-tiffany_blue font-semibold">Estimated Value:</span>
            <span className="ml-2 text-green-400">₡ 1,240</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Mining difficulty: Moderate • Required fuel: 5 units
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementScanner; 