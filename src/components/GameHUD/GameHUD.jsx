import React from 'react';
import { motion } from 'framer-motion';
import { useHud } from '../../state/hudStore';

export default function GameHUD() {
  const { health, maxHealth, fuel, maxFuel, ore, credits } = useHud();
  
  const healthPercentage = (health / maxHealth) * 100;
  const fuelPercentage = (fuel / maxFuel) * 100;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Minimap */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <img src="/assets/ui/Minimap_frame.svg" className="w-40 h-40" alt="Minimap" />
      </div>

      {/* Health Bar */}
      <div className="absolute bottom-6 left-10 w-60">
        <div className="relative">
          <img src="/assets/ui/Health_empty.svg" className="absolute w-full h-full" alt="Health Background" />
          <motion.div
            className="relative overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - healthPercentage}% 0 0)` }}
            animate={{ clipPath: `inset(0 ${100 - healthPercentage}% 0 0)` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img src="/assets/ui/Health_full.svg" className="w-full h-full" alt="Health" />
          </motion.div>
        </div>
        <div className="text-xs text-tiffany_blue font-mono mt-1 text-center">
          HEALTH: {Math.round(health)}/{maxHealth}
        </div>
      </div>

      {/* Fuel Bar */}
      <div className="absolute bottom-6 right-10 w-60">
        <div className="relative">
          <img src="/assets/ui/Fuel_empty.svg" className="absolute w-full h-full" alt="Fuel Background" />
          <motion.div
            className="relative overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - fuelPercentage}% 0 0)` }}
            animate={{ clipPath: `inset(0 ${100 - fuelPercentage}% 0 0)` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img src="/assets/ui/Fuel_full.svg" className="w-full h-full" alt="Fuel" />
          </motion.div>
        </div>
        <div className="text-xs text-amber-400 font-mono mt-1 text-center">
          FUEL: {Math.round(fuel)}/{maxFuel}
        </div>
      </div>

      {/* Resource Counters */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-8 text-cream font-mono text-sm">
        <span>⛏ {ore}</span>
        <span>⚡ {fuel}</span>
        <span>¤ {credits}</span>
      </div>
    </div>
  );
} 