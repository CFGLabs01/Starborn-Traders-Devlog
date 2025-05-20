import rawPlanetData from '../../../data/locations.json';

// Basic processing, can be enhanced later
// Convert the object of locations into an array of location objects
const locationsArray = Object.values(rawPlanetData);

const planets = locationsArray.map((planet, index) => {
  // Determine asset paths based on planet name
  let imagePath = '/assets/planets/placeholder.png'; // Default placeholder
  let modelPath = '/assets/models/planets/placeholder.glb'; // Default placeholder

  // --- Set specific paths based on provided assets ---
  switch (planet.name) {
    case 'Aetheria':
      imagePath = '/assets/planets/Aetheria.png';
      modelPath = '/assets/models/Planets/Aetheria.glb';
      break;
    case 'Cosmic Core':
      imagePath = '/assets/planets/Cosmic Core.png';
      modelPath = '/assets/models/Planets/Cosmic Core.glb';
      break;
    case 'Outlaw\'s Haven': // Ensure name matches JSON key exactly
      imagePath = '/assets/planets/Outlaw\'s Haven.png';
      modelPath = '/assets/models/Planets/Outlaw\'s Haven.glb';
      break;
    case 'Quantara':
      imagePath = '/assets/planets/Quantara.png';
      modelPath = '/assets/models/Planets/Quantara.glb';
      break;
    // Add cases for Frontier's Edge and Sovereign Reach
    case "Frontier\'s Edge": 
      imagePath = "/assets/planets/Frontier\'s Edge.png";
      modelPath = '/assets/models/Planets/Frontier\'s Edge.glb';
      break;
    case "Sovereign Reach":
      imagePath = "/assets/planets/Sovereign Reach.png";
      modelPath = '/assets/models/Planets/Sovereign Reach.glb';
      break;
    default:
      // Keep placeholders for any unexpected entries
      break;
  }

  // --- Return the processed planet object ---
  return {
    id: `planet-${index + 1}`, // Or use planet.name as ID if unique
    name: planet.name,
    // Get properties from the new locations.json structure
    symbol: planet.symbol || planet.name.substring(0, 3).toUpperCase(),
    type: planet.type || 'Unknown Type',
    x: planet.x !== undefined ? planet.x : null, // Handle potential missing coords
    y: planet.y !== undefined ? planet.y : null,
    faction: planet.faction?.symbol || 'Independent',
    traits: planet.traits?.map(t => t.name) || [], 
    description: planet.description || `Details for ${planet.name}.`,
    // Use the determined paths
    image: imagePath,
    modelPath: modelPath, // Renamed from 'model' to match other components
    scale: 1, // Added scale for the planet model

    // --- ADDED NEW FIELDS --- 
    stats: {
      population: planet.populationRating || Math.round((Math.random() * 8 + 2) * 10) / 10, // Placeholder 2.0-10.0
      taxLevel: planet.taxRating || Math.round((Math.random() * 9 + 1) * 10) / 10,      // Placeholder 1.0-10.0
      exports: planet.exportRating || Math.round((Math.random() * 7 + 1) * 10) / 10,    // Placeholder 1.0-8.0
      imports: planet.importRating || Math.round((Math.random() * 7 + 1) * 10) / 10,    // Placeholder 1.0-8.0
      security: planet.securityRating || Math.round((Math.random() * 9 + 1) * 10) / 10,    // Placeholder 1.0-10.0
    },
    notableFeatures: planet.features || [
      `Unique characteristics of ${planet.name} will be detailed here.`,
      `Atmosphere conditions are currently nominal.`
    ], // Placeholder features
    importItems: planet.imports || ['Basic Supplies', 'Machine Parts'], // Placeholder imports
    exportItems: planet.exports || ['Raw Ores', 'Scrap Metal'],       // Placeholder exports
  };
});

export { planets }; 