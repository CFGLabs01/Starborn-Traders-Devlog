import React from 'react';
import { motion } from 'framer-motion';
import { useHud } from '../../state/hudStore';
import Minimap from '../Minimap/Minimap';

export default function GameHUD() {
  const { health, maxHealth, fuel, maxFuel, ore, credits } = useHud();
  
  const healthPercentage = (health / maxHealth) * 100;
  const fuelPercentage = (fuel / maxFuel) * 100;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Enhanced Minimap */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <Minimap />
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
        <div className="text-xs text-tiffany_blue font-ui mt-1 text-center">
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
        <div className="text-xs text-amber-400 font-ui mt-1 text-center">
          FUEL: {Math.round(fuel)}/{maxFuel}
        </div>
      </div>

      {/* Resource Counters - Positioned over minimap */}
      <div className="absolute bottom-52 left-1/2 -translate-x-1/2 bg-rich_black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-tiffany_blue/30">
        <div className="flex gap-6 text-cream font-ui text-sm items-center">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⛏</span>
            <span>{ore}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-400">⚡</span>
            <span>{fuel}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-400">¤</span>
            <span>{credits}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 