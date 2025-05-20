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
  
  const setPlayerCharacter = (character) => {
    console.log('[GameStateContext] Setting player character:', character);
    setPlayerCharacterInternal(character);
  };

  const setShip = (newShipData) => {
    console.log('[GameStateContext] Setting ship:', newShipData);
    setShipInternal(prevShip => ({ ...prevShip, ...newShipData }));
  };

  const setStartingPlanet = (planet) => {
    console.log('[GameStateContext] Setting starting planet:', planet);
    setStartingPlanetInternal(planet);
  };
  
  // Save game state to localStorage whenever state changes
  useEffect(() => {
    // Only save if a character has been selected
    if (playerCharacter) {
      console.log('[GameStateContext] Saving game state to localStorage.');
      const gameState = {
        playerCharacter,
        credits,
        currentLocation,
        factionReputation,
        ship,
        gameProgress,
        gameTime,
        startingPlanet // Add startingPlanet to saved state
      };
      
      localStorage.setItem('starborneGameState', JSON.stringify(gameState));
    }
    // Add startingPlanet to dependency array
  }, [playerCharacter, credits, currentLocation, factionReputation, ship, gameProgress, gameTime, startingPlanet]);

  // Function to update player's ship after character selection
  useEffect(() => {
    if (playerCharacter && !ship.name) {
      setShip({
        ...ship,
        name: playerCharacter.shipName,
        class: playerCharacter.shipClass
      });
    }
  }, [playerCharacter, ship]);
  
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
    setStartingPlanet(null); // Reset starting planet on new game
    
    // Clear saved game
    localStorage.removeItem('starborneGameState');
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
    setStartingPlanet
  }), [playerCharacter, credits, currentLocation, factionReputation, ship, gameProgress, gameTime, startingPlanet]);

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export default GameStateProvider; 