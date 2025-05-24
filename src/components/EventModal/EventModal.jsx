import React, { useEffect, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import SelectionModal from '../SelectionModal/SelectionModal';
import { useHud } from '../../state/hudStore';
import { useClick } from '../../hooks/useClick';
import { quantumRoll } from '../../utils/roll';
import AsteroidGeometry from '../AsteroidGeometry/AsteroidGeometry';
import ElementScanner from '../ElementScanner/ElementScanner';
import Pedestal from '../Pedestal/Pedestal';
import CombatSystem from '../CombatSystem/CombatSystem';
import AnimatedDice from '../AnimatedDice';

// Import event data - in a real app this would be dynamic
import asteroidEvent from '../../../events/asteroid.json';
import merchantEvent from '../../../events/merchant.json';
import hijackEvent from '../../../events/hijack.json';

const events = {
  asteroid_probe: asteroidEvent,
  merchant_contact: merchantEvent,
  hijack_attempt: hijackEvent,
};

export default function EventModal({ eventId, onClose, onComplete }) {
  const event = events[eventId];
  const { takeDamage, consumeFuel, setFuel, fuel, addOre, addCredits } = useHud();
  const click = useClick();
  
  // Combat state for hijack events
  const [showCombat, setShowCombat] = useState(false);
  
  // Dice state for escape attempts
  const [diceOut, setDiceOut] = useState(null);
  const [showDice, setShowDice] = useState(false);

  // Keyboard shortcuts for options (1, 2, 3)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '1' && e.key <= '3') {
        const optionIndex = parseInt(e.key) - 1;
        if (event?.options?.[optionIndex]) {
          handleOptionSelect(event.options[optionIndex]);
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [event, onClose]);

  if (!event) {
    console.warn(`Event ${eventId} not found`);
    return null;
  }

  const handleCombatEnd = (result) => {
    setShowCombat(false);
    if (result === 'victory') {
      console.log('[EventModal] Combat victory! Player defeated hijackers.');
    } else {
      console.log('[EventModal] Combat defeat! Player was defeated.');
    }
    // Close event modal after combat
    onClose();
    if (onComplete) {
      onComplete({ label: result === 'victory' ? 'Victory' : 'Defeat' });
    }
  };

  const resolveEscape = (rollValue) => {
    const success = rollValue > 12; // 40% chance (8/20)
    consumeFuel(10); // Always costs fuel
    
    if (success) {
      console.log(`[EventModal] Escape successful! Rolled ${rollValue}`);
    } else {
      console.log(`[EventModal] Escape failed! Rolled ${rollValue}`);
      takeDamage(15); // Failed escape damage
    }
    
    // Close modal after escape attempt
    setTimeout(() => {
      onClose();
      if (onComplete) {
        onComplete({ label: success ? 'Successful escape' : 'Failed escape' });
      }
    }, 2000); // Give time to see the result
  };

  const handleOptionSelect = (option) => {
    // Special handling for hijack event combat option
    if (eventId === 'hijack_attempt' && option.label === 'Fight back') {
      setShowCombat(true);
      return;
    }
    
    // Special handling for escape attempts with dice
    if (option.label === 'Attempt escape' && option.escapeChance) {
      setShowDice(true);
      return;
    }
    
    // Apply effects based on option
    if (option.fuelCost) {
      consumeFuel(option.fuelCost);
    }
    if (option.healthCost) {
      takeDamage(option.healthCost);
    }
    if (option.fuelGain) {
      setFuel(fuel + option.fuelGain);
    }
    if (option.ore) {
      // Add quantum roll for mining success
      const roll = quantumRoll();
      const baseOre = option.ore;
      const bonusOre = roll > 15 ? Math.floor(baseOre * 0.5) : 0; // 25% chance for 50% bonus
      addOre(baseOre + bonusOre);
      
      if (bonusOre > 0) {
        console.log(`[Event] Quantum roll ${roll}: Bonus ore found! +${bonusOre}`);
      }
    }
    if (option.creditsGain) {
      addCredits(option.creditsGain);
    }
    
    // Handle escape chance
    if (option.escapeChance) {
      const success = Math.random() < option.escapeChance;
      if (!success) {
        takeDamage(15); // Failed escape damage
      }
    }

    // Close modal and notify completion
    onClose();
    if (onComplete) {
      onComplete(option);
    }
  };

  return (
    <SelectionModal isOpen={true} onClose={onClose}>
      <div className="w-full h-full p-6">
        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-8 h-full">
          {/* Left Column - Scanner and Options */}
          <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4">
            {/* Event Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-tiffany_blue font-ui mb-2">
                {event.title}
              </h2>
              <p className="text-lg text-slate-300 font-ui">{event.prompt}</p>
            </div>

            {/* Element Scanner - only for asteroid events */}
            {eventId === 'asteroid_probe' && (
              <ElementScanner />
            )}

            {/* Hijack Alert Panel */}
            {eventId === 'hijack_attempt' && (
              <div className="bg-gradient-to-br from-rufous/20 via-red-900/10 to-rufous/30 backdrop-blur-sm border border-rufous/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-rufous">THREAT DETECTED</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-slate-300">
                    <span className="text-rufous">Vessel Type:</span> Unknown Marauder
                  </div>
                  <div className="text-slate-300">
                    <span className="text-rufous">Threat Level:</span> High
                  </div>
                  <div className="text-slate-300">
                    <span className="text-rufous">Weapons:</span> Plasma Cannons Detected
                  </div>
                </div>
              </div>
            )}

            {/* Merchant Panel */}
            {eventId === 'merchant_contact' && (
              <div className="bg-gradient-to-br from-gamboge/20 via-yellow-900/10 to-gamboge/30 backdrop-blur-sm border border-gamboge/30 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gamboge">TRADE OPPORTUNITY</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-slate-300">
                    <span className="text-gamboge">Merchant:</span> Independent Trader
                  </div>
                  <div className="text-slate-300">
                    <span className="text-gamboge">Reputation:</span> Trustworthy
                  </div>
                  <div className="text-slate-300">
                    <span className="text-gamboge">Offering:</span> Credits for Services
                  </div>
                </div>
              </div>
            )}

            {/* Resource Icons and Currency */}
            <div className="flex gap-4 justify-start items-center">
              <div className="flex items-center gap-1 bg-rich_black/40 px-3 py-2 rounded-lg border border-amber-400/30">
                <span className="text-amber-400 text-lg">⚡</span>
                <span className="text-white text-sm">{fuel}</span>
              </div>
              <div className="flex items-center gap-1 bg-rich_black/40 px-3 py-2 rounded-lg border border-green-400/30">
                <span className="text-green-400 text-lg">¤</span>
                <span className="text-white text-sm">Credits</span>
              </div>
            </div>

            {/* Action Options */}
            <div className="space-y-3 mt-4">
              {event.options.map((option, index) => (
                <button
                  key={index}
                  className="ui-btn w-full px-6 py-4 bg-gradient-to-r from-deepBlue/60 to-teal-500/60 hover:from-teal-500/80 hover:to-vanilla/80 text-cream font-semibold rounded-xl transition-all duration-300 relative group border border-tiffany_blue/20 backdrop-blur-sm"
                  onClick={() => click(() => handleOptionSelect(option))}
                  onPointerDown={() => click(() => handleOptionSelect(option))}
                >
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-teal-500/80 text-rich_black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <span className="ml-8 text-left block">{option.label}</span>
                  <div className="flex gap-2 justify-end mt-1">
                    {option.fuelCost && <span className="text-amber-300 text-sm">(-{option.fuelCost} ⚡)</span>}
                    {option.healthCost && <span className="text-red-300 text-sm">(-{option.healthCost} ❤️)</span>}
                    {option.ore && <span className="text-yellow-300 text-sm">(+{option.ore} ⛏)</span>}
                    {option.fuelGain && <span className="text-amber-300 text-sm">(+{option.fuelGain} ⚡)</span>}
                    {option.creditsGain && <span className="text-green-300 text-sm">(+{option.creditsGain} ¤)</span>}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Dice Roll Section */}
            {showDice && (
              <div className="bg-gradient-to-br from-tiffany_blue/20 via-cyan-900/10 to-tiffany_blue/30 backdrop-blur-sm border border-tiffany_blue/30 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-semibold text-tiffany_blue mb-4">ESCAPE ATTEMPT</h3>
                {!diceOut && (
                  <div className="flex flex-col items-center gap-4">
                    <AnimatedDice onRoll={(v) => { setDiceOut(v); resolveEscape(v); }} />
                    <p className="text-sm text-slate-300">Rolling for escape...</p>
                  </div>
                )}
                {diceOut && (
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-white">You rolled {diceOut}!</p>
                    <p className="text-lg text-white">
                      {diceOut > 12 ? '✅ Successful escape!' : '❌ Failed escape!'}
                    </p>
                    {diceOut <= 12 && <p className="text-sm text-red-300">Taking damage from pursuit...</p>}
                  </div>
                )}
              </div>
            )}
            
            <p className="text-xs text-slate-500 mt-4 font-ui text-center">Press 1, 2, or 3 for quick selection • ESC to close</p>
          </div>

          {/* Right Column - 3D Model or Event Visual */}
          <div className="flex flex-col justify-center items-center">
            <div className="w-full h-full relative bg-rich_black/20 rounded-2xl border border-tiffany_blue/30 overflow-hidden">
              {eventId === 'asteroid_probe' && (
                <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[2, 2, 5]} intensity={1} color="#0a9396" />
                  <directionalLight position={[-2, -1, -2]} intensity={0.5} color="#94d2bd" />
                  <Suspense fallback={null}>
                    <Pedestal rotate={true} />
                    <AsteroidGeometry scale={0.8} />
                  </Suspense>
                </Canvas>
              )}
              
              {eventId === 'hijack_attempt' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rufous/10 to-red-900/20">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">⚔️</div>
                    <h3 className="text-2xl font-bold text-rufous mb-2">HOSTILE VESSEL</h3>
                    <p className="text-slate-300">Unknown marauder ship</p>
                    <p className="text-sm text-slate-400 mt-2">Weapons charged and ready</p>
                  </div>
                </div>
              )}
              
              {eventId === 'merchant_contact' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gamboge/10 to-yellow-900/20">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🚢</div>
                    <h3 className="text-2xl font-bold text-gamboge mb-2">MERCHANT VESSEL</h3>
                    <p className="text-slate-300">Independent trader</p>
                    <p className="text-sm text-slate-400 mt-2">Broadcasting trade signals</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Combat System Overlay */}
      <CombatSystem 
        isActive={showCombat}
        onCombatEnd={handleCombatEnd}
        enemyType="marauder"
      />
    </SelectionModal>
  );
} 