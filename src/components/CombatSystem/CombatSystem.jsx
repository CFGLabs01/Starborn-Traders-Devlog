import React, { useState, useEffect, useRef } from 'react';
import { useHud } from '../../state/hudStore';
import { useClick } from '../../hooks/useClick';

const CombatSystem = ({ isActive, onCombatEnd, enemyType = 'pirate' }) => {
  const { health, takeDamage, addCredits } = useHud();
  const click = useClick();
  
  // Get enemy model path based on type
  const getEnemyModelPath = (type) => {
    switch (type) {
      case 'pirate':
      case 'marauder':
        return '/assets/models/temp/pirate.glb';
      case 'civilian':
      case 'merchant':
        return '/assets/models/temp/civilian.glb';
      default:
        return '/assets/models/temp/pirate.glb';
    }
  };
  
  // Combat state
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(health);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [combatLog, setCombatLog] = useState([]);
  const [weaponCharge, setWeaponCharge] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  
  const combatTimerRef = useRef(null);

  // Update player health when HUD health changes
  useEffect(() => {
    setPlayerHealth(health);
  }, [health]);

  // Enemy AI turn
  useEffect(() => {
    if (isActive && !isPlayerTurn && enemyHealth > 0) {
      combatTimerRef.current = setTimeout(() => {
        const enemyDamage = Math.floor(Math.random() * 20) + 10; // 10-30 damage
        takeDamage(enemyDamage);
        
        const newLog = `Enemy ${enemyType} fires! You take ${enemyDamage} damage.`;
        setCombatLog(prev => [...prev.slice(-3), newLog]); // Keep last 4 entries
        
        setIsPlayerTurn(true);
      }, 2000); // Enemy attacks after 2 seconds
    }
    
    return () => clearTimeout(combatTimerRef.current);
  }, [isPlayerTurn, isActive, enemyHealth, enemyType, takeDamage]);

  // Check for combat end conditions
  useEffect(() => {
    if (enemyHealth <= 0) {
      const reward = Math.floor(Math.random() * 500) + 200; // 200-700 credits
      addCredits(reward);
      setCombatLog(prev => [...prev, `Victory! Earned ${reward} credits.`]);
      setTimeout(() => onCombatEnd('victory'), 2000);
    } else if (playerHealth <= 0) {
      setCombatLog(prev => [...prev, 'Defeat! Emergency systems engaged.']);
      setTimeout(() => onCombatEnd('defeat'), 2000);
    }
  }, [enemyHealth, playerHealth, addCredits, onCombatEnd]);

  // Weapon charging system
  useEffect(() => {
    if (isCharging && weaponCharge < 100) {
      const chargeTimer = setInterval(() => {
        setWeaponCharge(prev => Math.min(100, prev + 5));
      }, 100);
      return () => clearInterval(chargeTimer);
    }
  }, [isCharging, weaponCharge]);

  const handleFire = () => {
    if (!isPlayerTurn || weaponCharge < 20) return;
    
    const damage = Math.floor(weaponCharge / 5) + Math.floor(Math.random() * 15); // Variable damage based on charge
    const actualDamage = Math.min(damage, enemyHealth);
    
    setEnemyHealth(prev => Math.max(0, prev - actualDamage));
    setWeaponCharge(0);
    setIsCharging(true);
    
    const newLog = `You fire plasma cannon! Enemy takes ${actualDamage} damage.`;
    setCombatLog(prev => [...prev.slice(-3), newLog]);
    
    setIsPlayerTurn(false);
  };

  const handleEvade = () => {
    if (!isPlayerTurn) return;
    
    const evadeSuccess = Math.random() > 0.4; // 60% success rate
    const newLog = evadeSuccess 
      ? 'Evasive maneuvers successful! Enemy misses.' 
      : 'Evasion failed!';
    
    setCombatLog(prev => [...prev.slice(-3), newLog]);
    
    if (evadeSuccess) {
      setIsPlayerTurn(true);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const handleCharge = () => {
    if (!isPlayerTurn) return;
    
    setIsCharging(true);
    setWeaponCharge(prev => Math.min(100, prev + 30));
    
    const newLog = 'Charging weapons...';
    setCombatLog(prev => [...prev.slice(-3), newLog]);
    
    setIsPlayerTurn(false);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-rich_black/90 via-midnight_green/20 to-rich_black/90 border-2 border-rufous/50 rounded-2xl p-8 max-w-2xl w-full mx-4">
        {/* Combat Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-rufous mb-2">COMBAT ENGAGED</h2>
          <p className="text-slate-300">Hostile {enemyType} vessel detected!</p>
        </div>

        {/* Health Bars */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-rich_black/40 p-4 rounded-lg border border-tiffany_blue/30">
            <h3 className="text-tiffany_blue font-semibold mb-2">Your Ship</h3>
            <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-tiffany_blue to-green-400 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(playerHealth / 100) * 100}%` }}
              />
            </div>
            <p className="text-sm text-slate-300">{playerHealth}/100 Hull Integrity</p>
          </div>

          <div className="bg-rich_black/40 p-4 rounded-lg border border-rufous/30">
            <h3 className="text-rufous font-semibold mb-2">Enemy {enemyType}</h3>
            <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-rufous to-red-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${enemyHealth}%` }}
              />
            </div>
            <p className="text-sm text-slate-300">{enemyHealth}/100 Hull Integrity</p>
          </div>
        </div>

        {/* Weapon Charge */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-amber-400 font-semibold">Weapon Charge</span>
            <span className="text-amber-300">{weaponCharge}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-amber-600 to-yellow-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${weaponCharge}%` }}
            />
          </div>
        </div>

        {/* Combat Log */}
        <div className="bg-rich_black/60 p-4 rounded-lg border border-slate-600 mb-6 h-24 overflow-y-auto">
          {combatLog.map((entry, index) => (
            <p key={index} className="text-sm text-slate-300 mb-1">{entry}</p>
          ))}
        </div>

        {/* Combat Actions */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => click(handleFire)}
            disabled={!isPlayerTurn || weaponCharge < 20}
            className={`ui-btn px-6 py-4 rounded-xl transition-all duration-300 font-semibold ${
              isPlayerTurn && weaponCharge >= 20
                ? 'bg-gradient-to-r from-rufous to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            🔫 FIRE
            <div className="text-xs mt-1">Min: 20% charge</div>
          </button>

          <button
            onClick={() => click(handleEvade)}
            disabled={!isPlayerTurn}
            className={`ui-btn px-6 py-4 rounded-xl transition-all duration-300 font-semibold ${
              isPlayerTurn
                ? 'bg-gradient-to-r from-tiffany_blue to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            🚀 EVADE
            <div className="text-xs mt-1">60% success</div>
          </button>

          <button
            onClick={() => click(handleCharge)}
            disabled={!isPlayerTurn || weaponCharge >= 100}
            className={`ui-btn px-6 py-4 rounded-xl transition-all duration-300 font-semibold ${
              isPlayerTurn && weaponCharge < 100
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            ⚡ CHARGE
            <div className="text-xs mt-1">+30% charge</div>
          </button>
        </div>

        {/* Turn Indicator */}
        <div className="text-center mt-4">
          <p className={`text-sm font-semibold ${isPlayerTurn ? 'text-tiffany_blue' : 'text-rufous'}`}>
            {isPlayerTurn ? 'YOUR TURN' : `ENEMY ${enemyType.toUpperCase()} TURN`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CombatSystem; 