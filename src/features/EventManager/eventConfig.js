export const eventConfig = {
  // Timing configuration (in milliseconds)
  minTimeBetweenEvents: 15000, // 15 seconds minimum
  maxTimeBetweenEvents: 45000, // 45 seconds maximum
  
  // Event definitions
  possibleEvents: [
    {
      id: 'miningOpportunity',
      type: 'opportunity',
      weight: 5, // Higher weight = more common
      duration: 20000, // How long the opportunity lasts (e.g., asteroid drifts away)
      hudAlert: 'Mining Scan Detected!',
      hudIcon: 'MiningActive', // Corresponds to a HUD component/icon
      actionLabel: 'Mine Asteroid', // Label for interaction
      sfx: 'alert_scan.wav' // Placeholder sound effect
    },
    {
      id: 'marauderEncounter',
      type: 'combat',
      weight: 3,
      duration: null, // Combat duration managed by combat logic
      hudAlert: 'Warning: Hostile Vessels Detected!',
      hudIcon: 'CombatMode',
      actionLabel: null, // Actions handled by combat UI
      sfx: 'alert_combat.wav'
    },
    {
      id: 'solarFlare',
      type: 'hazard',
      weight: 2,
      duration: 10000, // Duration of the hazard effect
      hudAlert: 'Solar Flare Incoming! Navigation Disrupted!',
      hudIcon: 'SystemMalfunction',
      actionLabel: null, // No direct player action
      sfx: 'alert_hazard.wav'
    },
    {
      id: 'distressSignal',
      type: 'opportunity', // Or could be 'neutral'
      weight: 3,
      duration: 30000, // How long the signal is active
      hudAlert: 'Distress Signal Detected Nearby.',
      hudIcon: 'CommLinkIcon', // Reuse existing or add new icon
      actionLabel: 'Investigate Signal',
      sfx: 'alert_comms.wav'
    },
    // Add more events like derelict ships, merchant encounters, etc.
  ]
};

// Helper function to get a random time within the defined range
export const getRandomEventTime = () => {
    return Math.random() * (eventConfig.maxTimeBetweenEvents - eventConfig.minTimeBetweenEvents) + eventConfig.minTimeBetweenEvents;
};

// Helper function to select a weighted random event
export const selectRandomEvent = () => {
    const totalWeight = eventConfig.possibleEvents.reduce((sum, event) => sum + event.weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    for (const event of eventConfig.possibleEvents) {
        if (randomNum < event.weight) {
            return event;
        }
        randomNum -= event.weight;
    }
    
    // Fallback (should ideally not be reached if weights are correct)
    return eventConfig.possibleEvents[0]; 
}; 