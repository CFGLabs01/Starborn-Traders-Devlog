import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Create the game state context
const GameStateContext = createContext();

// Custom hook to access the game state
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

// Game state provider component
export const GameStateProvider = ({ children }) => {
  // Load any saved game data from localStorage
  const loadSavedState = () => {
    try {
      const savedState = localStorage.getItem('starborneGameState');
      return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
      console.error('Error loading saved game state:', error);
      return null;
    }
  };

  // Initialize state with saved data or defaults
  const savedState = loadSavedState();
  
  // Player character state
  const [playerCharacter, setPlayerCharacterInternal] = useState(savedState?.playerCharacter || null);
  
  // Credits state
  const [credits, setCredits] = useState(savedState?.credits || 5000);
  
  // Current location state
  const [currentLocation, setCurrentLocation] = useState(savedState?.currentLocation || {
    system: 'Azimir',
    planet: 'Azimir 4',
    station: 'Starport Alpha'
  });
  
  // Reputation with different factions
  const [factionReputation, setFactionReputation] = useState(savedState?.factionReputation || {
    Trade: 0,
    Pirates: 0,
    Military: 0,
    Science: 0,
    Diplomats: 0
  });
  
  // Ship state
  const [ship, setShipInternal] = useState(savedState?.ship || {
    name: '',
    class: '',
    hull: 100,
    fuel: 100,
    cargoCapacity: 100,
    cargo: []
  });
  
  // Game progress tracking
  const [gameProgress, setGameProgress] = useState(savedState?.gameProgress || {
    mainStoryProgress: 0,
    completedMissions: [],
    discoveredLocations: []
  });
  
  // Game time state
  const [gameTime, setGameTime] = useState(savedState?.gameTime || 0);
  // Starting planet state (selected during setup)
  const [startingPlanet, setStartingPlanetInternal] = useState(savedState?.startingPlanet || null);
  
  // 🧠 NEURAL ECHO SYSTEM - Living AI Memory Layer
  const [neuralEcho, setNeuralEcho] = useState(savedState?.neuralEcho || {
    tradeHistory: [],
    battleLogs: [],
    discoveryTags: [],
    betrayalFlags: 0,
    heroismFlags: 0,
    factionFavor: {
      Trade: 0,
      Pirates: 0,
      Military: 0,
      Science: 0,
      Diplomats: 0
    },
    echoScore: 0, // Total karma weight of player's legend
    echoIntensity: 0, // How strongly the echo affects the world (0-10)
    lastEchoUpdate: Date.now()
  });
  
  const setPlayerCharacter = (character) => {
    setPlayerCharacterInternal(character);
  };

  const setShip = (newShipData) => {
    setShipInternal(prevShip => ({ ...prevShip, ...newShipData }));
  };

  const setStartingPlanet = (planet) => {
    setStartingPlanetInternal(planet);
  };
  
  // Save game state to localStorage whenever state changes
  useEffect(() => {
    // Only save if a character has been selected
    if (playerCharacter) {
      const gameState = {
        playerCharacter,
        credits,
        currentLocation,
        factionReputation,
        ship,
        gameProgress,
        gameTime,
        startingPlanet,
        neuralEcho
      };
      
      localStorage.setItem('starborneGameState', JSON.stringify(gameState));
    }
  }, [playerCharacter, credits, currentLocation, factionReputation, ship, gameProgress, gameTime, startingPlanet, neuralEcho]);

  // Function to update player's ship after character selection
  useEffect(() => {
    if (playerCharacter && !ship.name) {
      setShip({
        name: playerCharacter.shipName,
        class: playerCharacter.shipClass
      });
    }
  }, [playerCharacter?.shipName, playerCharacter?.shipClass, ship.name]);
  
  // Function to update credits
  const updateCredits = (amount) => {
    setCredits(prevCredits => {
      const newBalance = prevCredits + amount;
      // Prevent negative credits
      return newBalance >= 0 ? newBalance : prevCredits;
    });
  };
  
  // Function to update faction reputation
  const updateReputation = (faction, amount) => {
    setFactionReputation(prevRep => ({
      ...prevRep,
      [faction]: Math.min(Math.max(prevRep[faction] + amount, -100), 100)
    }));
  };
  
  // Function to add cargo to ship
  const addCargo = (item, quantity) => {
    setShip(prevShip => {
      const currentCargo = [...prevShip.cargo];
      const existingItem = currentCargo.find(cargo => cargo.name === item.name);
      
      // Calculate total cargo weight
      const currentWeight = currentCargo.reduce((total, cargo) => total + cargo.quantity, 0);
      const availableSpace = prevShip.cargoCapacity - currentWeight;
      
      // Determine how much we can actually add
      const addableQuantity = Math.min(quantity, availableSpace);
      
      if (addableQuantity <= 0) {
        return prevShip; // Cargo hold is full
      }
      
      if (existingItem) {
        // Update existing item
        existingItem.quantity += addableQuantity;
      } else {
        // Add new item
        currentCargo.push({
          ...item,
          quantity: addableQuantity
        });
      }
      
      return {
        ...prevShip,
        cargo: currentCargo
      };
    });
    
    return true;
  };
  
  // Function to remove cargo from ship
  const removeCargo = (itemName, quantity) => {
    setShip(prevShip => {
      const currentCargo = [...prevShip.cargo];
      const itemIndex = currentCargo.findIndex(cargo => cargo.name === itemName);
      
      if (itemIndex === -1) {
        return prevShip; // Item not found
      }
      
      const item = currentCargo[itemIndex];
      
      if (item.quantity <= quantity) {
        // Remove the entire stack
        currentCargo.splice(itemIndex, 1);
      } else {
        // Remove partial stack
        item.quantity -= quantity;
      }
      
      return {
        ...prevShip,
        cargo: currentCargo
      };
    });
    
    return true;
  };
  
  // Function to update game progress
  const updateGameProgress = (key, value) => {
    setGameProgress(prevProgress => ({
      ...prevProgress,
      [key]: value
    }));
  };
  
  // Start a new game (reset all state)
  const startNewGame = () => {
    setPlayerCharacter(null);
    setCredits(5000);
    setCurrentLocation({
      system: 'Azimir',
      planet: 'Azimir 4',
      station: 'Starport Alpha'
    });
    setFactionReputation({
      Trade: 0,
      Pirates: 0,
      Military: 0,
      Science: 0,
      Diplomats: 0
    });
    setShip({
      name: '',
      class: '',
      hull: 100,
      fuel: 100,
      cargoCapacity: 100,
      cargo: []
    });
    setGameProgress({
      mainStoryProgress: 0,
      completedMissions: [],
      discoveredLocations: []
    });
    setGameTime(0);
    setStartingPlanet(null);
    setNeuralEcho({
      tradeHistory: [],
      battleLogs: [],
      discoveryTags: [],
      betrayalFlags: 0,
      heroismFlags: 0,
      factionFavor: { Trade: 0, Pirates: 0, Military: 0, Science: 0, Diplomats: 0 },
      echoScore: 0,
      echoIntensity: 0,
      lastEchoUpdate: Date.now()
    });
    
    // Clear saved game
    localStorage.removeItem('starborneGameState');
  };

  // 🧠 NEURAL ECHO FUNCTIONS - Living AI Memory System
  
  // Log player actions to build their neural echo
  const logEchoAction = (actionType, data) => {
    setNeuralEcho(prevEcho => {
      const newEcho = { ...prevEcho };
      const timestamp = Date.now();
      
      switch (actionType) {
        case 'trade':
          newEcho.tradeHistory.push({ ...data, timestamp });
          if (data.rarity === 'rare') newEcho.discoveryTags.push(data.item);
          newEcho.echoScore += data.value > 1000 ? 2 : 1;
          break;
          
        case 'betray':
          newEcho.betrayalFlags += 1;
          newEcho.factionFavor[data.faction] -= 2;
          newEcho.echoScore -= 3;
          break;
          
        case 'hero':
          newEcho.heroismFlags += 1;
          newEcho.factionFavor[data.faction] += 2;
          newEcho.echoScore += 5;
          break;
          
        case 'battle':
          newEcho.battleLogs.push({ ...data, timestamp });
          newEcho.echoScore += data.victory ? 1 : -1;
          break;
          
        case 'discovery':
          newEcho.discoveryTags.push(data.discovery);
          newEcho.echoScore += 3;
          break;
      }
      
      // Calculate echo intensity (0-10 scale)
      const totalActions = newEcho.tradeHistory.length + newEcho.battleLogs.length + 
                          newEcho.betrayalFlags + newEcho.heroismFlags;
      newEcho.echoIntensity = Math.min(Math.floor(totalActions / 5), 10);
      
      newEcho.lastEchoUpdate = timestamp;
      return newEcho;
    });
  };

  // Get echo effects for HUD styling
  const getEchoEffects = () => {
    const { echoScore, echoIntensity, betrayalFlags, heroismFlags } = neuralEcho;
    
    return {
      hudGlitch: betrayalFlags > 3,
      hudHarmonic: heroismFlags > 3,
      hudIntensity: echoIntensity / 10,
      priceModifier: echoScore > 0 ? 1.1 : 0.9,
      accessLevel: Math.floor(echoIntensity / 2), // 0-5 access levels
      echoTheme: echoScore > 10 ? 'hero' : echoScore < -5 ? 'rogue' : 'neutral'
    };
  };

  // Check if player has access to echo-gated content
  const hasEchoAccess = (requiredLevel) => {
    return Math.floor(neuralEcho.echoIntensity / 2) >= requiredLevel;
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    playerCharacter,
    setPlayerCharacter,
    credits,
    updateCredits,
    currentLocation,
    setCurrentLocation,
    factionReputation,
    updateReputation,
    ship,
    setShip,
    gameProgress,
    updateGameProgress,
    addCargo,
    removeCargo,
    startNewGame,
    gameTime,
    setGameTime,
    startingPlanet,
    setStartingPlanet,
    neuralEcho,
    logEchoAction,
    getEchoEffects,
    hasEchoAccess
  }), [playerCharacter, credits, currentLocation, factionReputation, ship, gameProgress, gameTime, startingPlanet, neuralEcho]);

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider; 