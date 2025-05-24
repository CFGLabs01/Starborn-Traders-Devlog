// Element System for Starborne Traders
// Progression from common periodic table elements to exotic synthetic materials

export const elementCategories = {
  COMMON: 'common',
  RARE: 'rare', 
  EXOTIC: 'exotic',
  SYNTHETIC: 'synthetic'
};

export const elements = {
  // Common Elements (Periodic Table Basics)
  hydrogen: {
    id: 'hydrogen',
    name: 'Hydrogen',
    symbol: 'H',
    category: elementCategories.COMMON,
    baseValue: 10,
    rarity: 0.9,
    description: 'The most abundant element in the universe. Essential for fusion reactors.',
    uses: ['Fuel production', 'Life support systems', 'Fusion reactors'],
    color: '#ffffff'
  },
  helium: {
    id: 'helium',
    name: 'Helium',
    symbol: 'He',
    category: elementCategories.COMMON,
    baseValue: 15,
    rarity: 0.7,
    description: 'Inert gas used in cooling systems and pressurization.',
    uses: ['Cooling systems', 'Pressurization', 'Leak detection'],
    color: '#ffc0cb'
  },
  carbon: {
    id: 'carbon',
    name: 'Carbon',
    symbol: 'C',
    category: elementCategories.COMMON,
    baseValue: 25,
    rarity: 0.8,
    description: 'Fundamental building block for organic compounds and advanced materials.',
    uses: ['Hull construction', 'Life support', 'Electronics'],
    color: '#2f2f2f'
  },
  oxygen: {
    id: 'oxygen',
    name: 'Oxygen',
    symbol: 'O',
    category: elementCategories.COMMON,
    baseValue: 20,
    rarity: 0.85,
    description: 'Essential for life support and combustion processes.',
    uses: ['Life support', 'Fuel oxidizer', 'Medical systems'],
    color: '#87ceeb'
  },
  iron: {
    id: 'iron',
    name: 'Iron',
    symbol: 'Fe',
    category: elementCategories.COMMON,
    baseValue: 50,
    rarity: 0.6,
    description: 'Versatile metal for construction and manufacturing.',
    uses: ['Hull construction', 'Tools', 'Magnetic systems'],
    color: '#b87333'
  },
  silicon: {
    id: 'silicon',
    name: 'Silicon',
    symbol: 'Si',
    category: elementCategories.COMMON,
    baseValue: 40,
    rarity: 0.75,
    description: 'Essential for electronics and computing systems.',
    uses: ['Computer systems', 'Solar panels', 'Sensors'],
    color: '#8a8a8a'
  },

  // Rare Elements (Valuable Periodic Table)
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    symbol: 'Pt',
    category: elementCategories.RARE,
    baseValue: 500,
    rarity: 0.2,
    description: 'Precious metal with excellent catalytic properties.',
    uses: ['Catalysts', 'High-end electronics', 'Jewelry'],
    color: '#e5e4e2'
  },
  nickel: {
    id: 'nickel',
    name: 'Nickel',
    symbol: 'Ni',
    category: elementCategories.RARE,
    baseValue: 150,
    rarity: 0.35,
    description: 'Magnetic metal essential for alloys and batteries.',
    uses: ['Steel alloys', 'Magnetic systems', 'Battery production'],
    color: '#8a8a5c'
  },
  titanium: {
    id: 'titanium',
    name: 'Titanium',
    symbol: 'Ti',
    category: elementCategories.RARE,
    baseValue: 300,
    rarity: 0.3,
    description: 'Lightweight, strong metal perfect for spacecraft.',
    uses: ['Advanced hull plating', 'Engine components', 'Medical implants'],
    color: '#c0c0c0'
  },
  uranium: {
    id: 'uranium',
    name: 'Uranium',
    symbol: 'U',
    category: elementCategories.RARE,
    baseValue: 800,
    rarity: 0.1,
    description: 'Radioactive element used in nuclear reactors.',
    uses: ['Nuclear reactors', 'Weapons', 'Power generation'],
    color: '#008000'
  },
  lithium: {
    id: 'lithium',
    name: 'Lithium',
    symbol: 'Li',
    category: elementCategories.RARE,
    baseValue: 200,
    rarity: 0.4,
    description: 'Essential for advanced battery technology.',
    uses: ['Energy storage', 'Ion drives', 'Quantum batteries'],
    color: '#cc99ff'
  },
  palladium: {
    id: 'palladium',
    name: 'Palladium',
    symbol: 'Pd',
    category: elementCategories.RARE,
    baseValue: 600,
    rarity: 0.15,
    description: 'Rare metal with unique hydrogen absorption properties.',
    uses: ['Catalysts', 'Fuel cells', 'Quantum computers'],
    color: '#cec2d0'
  },

  // Exotic Elements (Future Synthetic)
  quantium: {
    id: 'quantium',
    name: 'Quantium',
    symbol: 'Qm',
    category: elementCategories.EXOTIC,
    baseValue: 2000,
    rarity: 0.05,
    description: 'Synthetically created element that exists in quantum superposition.',
    uses: ['Quantum computers', 'FTL drives', 'Reality manipulation'],
    color: '#9932cc'
  },
  neuralite: {
    id: 'neuralite',
    name: 'Neuralite',
    symbol: 'Nr',
    category: elementCategories.EXOTIC,
    baseValue: 1500,
    rarity: 0.08,
    description: 'Bio-synthetic element that interfaces with neural networks.',
    uses: ['AI cores', 'Neural interfaces', 'Consciousness transfer'],
    color: '#ff69b4'
  },
  voidsteel: {
    id: 'voidsteel',
    name: 'Voidsteel',
    symbol: 'Vs',
    category: elementCategories.EXOTIC,
    baseValue: 3000,
    rarity: 0.02,
    description: 'Ultra-dense material that absorbs energy from vacuum.',
    uses: ['Zero-point energy', 'Dimensional anchors', 'Void shields'],
    color: '#191970'
  },
  chronium: {
    id: 'chronium',
    name: 'Chronium',
    symbol: 'Ch',
    category: elementCategories.EXOTIC,
    baseValue: 5000,
    rarity: 0.01,
    description: 'Temporal element that affects the flow of time.',
    uses: ['Time dilation fields', 'Temporal anchors', 'Causality shields'],
    color: '#ffd700'
  },

  // Synthetic Compounds (AI-Designed)
  alphaEvolution: {
    id: 'alphaEvolution',
    name: 'Alpha-Evolution Catalyst',
    symbol: 'αE',
    category: elementCategories.SYNTHETIC,
    baseValue: 10000,
    rarity: 0.005,
    description: 'AI-designed catalyst that accelerates evolution and adaptation.',
    uses: ['Biological enhancement', 'Rapid terraforming', 'Species adaptation'],
    color: '#00ff7f'
  },
  deepmindMatrix: {
    id: 'deepmindMatrix',
    name: 'Deep-Mind Matrix',
    symbol: 'DM',
    category: elementCategories.SYNTHETIC,
    baseValue: 8000,
    rarity: 0.008,
    description: 'Crystalline structure that mimics advanced AI processing.',
    uses: ['Superintelligent AI', 'Predictive algorithms', 'Reality simulation'],
    color: '#4169e1'
  },
  stellarForge: {
    id: 'stellarForge',
    name: 'Stellar Forge Composite',
    symbol: 'SF',
    category: elementCategories.SYNTHETIC,
    baseValue: 15000,
    rarity: 0.002,
    description: 'Material that can withstand and harness stellar energies.',
    uses: ['Dyson sphere construction', 'Star lifting', 'Stellar engineering'],
    color: '#ff4500'
  },
  omegaPoint: {
    id: 'omegaPoint',
    name: 'Omega Point Particle',
    symbol: 'Ω',
    category: elementCategories.SYNTHETIC,
    baseValue: 50000,
    rarity: 0.001,
    description: 'Theoretical end-state matter that transcends known physics.',
    uses: ['Universe creation', 'Physical law modification', 'Omniscience interfaces'],
    color: '#ffffff'
  }
};

export const getElementsByCategory = (category) => {
  return Object.values(elements).filter(element => element.category === category);
};

export const getElementValue = (elementId, marketModifier = 1) => {
  const element = elements[elementId];
  if (!element) return 0;
  
  // Base value modified by rarity and market conditions
  return Math.floor(element.baseValue * (2 - element.rarity) * marketModifier);
};

export const getRandomElement = (category = null) => {
  let availableElements = Object.values(elements);
  
  if (category) {
    availableElements = getElementsByCategory(category);
  }
  
  // Weight by rarity (more common elements more likely)
  const weightedElements = [];
  availableElements.forEach(element => {
    const weight = Math.floor(element.rarity * 100);
    for (let i = 0; i < weight; i++) {
      weightedElements.push(element);
    }
  });
  
  return weightedElements[Math.floor(Math.random() * weightedElements.length)];
};

export default elements; 