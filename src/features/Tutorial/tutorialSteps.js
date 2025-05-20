export const tutorialSteps = [
  {
    id: 'welcome',
    text: "Welcome, Captain! Let's get you familiar with your ship's controls. This is your fuel gauge.",
    targetElementId: 'hud-fuel-gauge', // We'll use this ID later for highlighting
    action: 'next', // Proceeds with the button
    hudElement: 'FuelGauge' // Component to show during this step
  },
  {
    id: 'movement_intro',
    text: "Good. Now, try moving your ship. Use W, A, S, or D to engage thrusters.",
    targetElementId: null, // No specific element to highlight
    action: 'keypress', // Wait for specific keypresses
    keys: ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'], // Keys to listen for
    hudElement: null // No specific HUD element needed for this step
  },
  {
    id: 'distant_event',
    text: "Keep an eye on your surroundings, Captain. Notice that vessel? Opportunities and dangers alike await in the void.",
    targetElementId: null, // No specific element to highlight
    action: 'timeout', // Automatically advance after a delay
    duration: 5000, // Wait 5 seconds
    eventVisual: 'distant_ship_placeholder.png', // Specify the visual to show
    hudElement: null
  },
  // Add more steps here later...
  // {
  //   id: 'clickable_prompt',
  //   text: "Excellent. Now, click on the Communications Panel to check for messages.",
  //   targetElementId: 'hud-comms-panel',
  //   action: 'click', // Wait for click on target element
  //   hudElement: 'CommsPanel' 
  // },
]; 