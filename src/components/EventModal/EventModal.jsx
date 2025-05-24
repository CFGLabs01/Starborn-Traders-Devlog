import React from 'react';
import SelectionModal from '../SelectionModal/SelectionModal';
import { useHud } from '../../state/hudStore';
import { useClick } from '../../hooks/useClick';

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

  if (!event) {
    console.warn(`Event ${eventId} not found`);
    return null;
  }

  const handleOptionSelect = (option) => {
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
      addOre(option.ore);
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
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-tiffany_blue mb-4">{event.title}</h2>
        <p className="text-lg text-slate-300 mb-6">{event.prompt}</p>
        
        <div className="space-y-3">
          {event.options.map((option, index) => (
            <button
              key={index}
              className="ui-btn w-full px-6 py-3 bg-gradient-to-r from-midnight_green to-dark_cyan hover:from-dark_cyan hover:to-tiffany_blue text-white font-semibold rounded-lg transition-all duration-300"
              onClick={() => click(() => handleOptionSelect(option))}
              onPointerDown={() => click(() => handleOptionSelect(option))}
            >
              {option.label}
              {option.fuelCost && <span className="text-amber-400 ml-2">(-{option.fuelCost} fuel)</span>}
              {option.healthCost && <span className="text-red-400 ml-2">(-{option.healthCost} health)</span>}
              {option.ore && <span className="text-yellow-400 ml-2">(+{option.ore} ore)</span>}
              {option.fuelGain && <span className="text-amber-400 ml-2">(+{option.fuelGain} fuel)</span>}
              {option.creditsGain && <span className="text-green-400 ml-2">(+{option.creditsGain} credits)</span>}
            </button>
          ))}
        </div>
      </div>
    </SelectionModal>
  );
} 