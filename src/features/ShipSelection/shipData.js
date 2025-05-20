export const ships = [
  {
    id: 'freighter-base',
    name: 'Aeon Runner',
    class: 'Light Freighter',
    versionName: 'Stock Model',
    description: 'A reliable freighter known in fringe ports for always making it through - barely. It\'s not fast or fancy, but in the right hands, it becomes something greater.',
    image: '/assets/ships/Aeon Runner.png',
    modelPath: '/assets/models/Ships/Aeon Runner.glb',
    initialRotationY: 0,
    scale: 1,
    stats: {
      speed: 4.2,
      agility: 4.0,
      capacity: 4.5,
      firepower: 3.5,
      integrity: 4.0,
    },
    special: {
      traits: ['Modular cargo racks', 'Hidden smuggler hold'],
      history: 'Once belonged to an old trade monk who mapped forgotten wormholes.'
    },
  },
  {
    id: 'explorer-base',
    name: 'Vantar Nomad',
    class: 'Explorer',
    versionName: 'Surveyor Class',
    description: 'For those who see the edge of the known universe and ask, "what lies past?" Packed with sensors and engineered to slip through time distortions.',
    image: '/assets/ships/Vantar Nomad.png',
    modelPath: '/assets/models/Ships/Vantar Nomad.glb',
    initialRotationY: Math.PI / 2,
    scale: 1,
    stats: {
      speed: 5.0,
      agility: 4.5,
      capacity: 4.0,
      firepower: 3.0,
      integrity: 3.8,
    },
    special: {
      traits: ['Quantum scanner array', 'Self-repair nanobots'],
      history: 'Used in the first mapping of the Aetheria Rift and rumored to have seen sentient void matter.'
    },
  },
  {
    id: 'fighter-base',
    name: 'Nova Fang',
    class: 'Fighter',
    versionName: 'Interceptor Mk. II',
    description: 'A weaponized dart built for the voidborn who strike hard and vanish. Responds like instinct, hits like vengeance.',
    image: '/assets/ships/Nova Fang.png',
    modelPath: '/assets/models/Ships/Nova Fang.glb',
    initialRotationY: Math.PI,
    scale: 1,
    stats: {
      speed: 5.8,
      agility: 5.9,
      capacity: 3.0,
      firepower: 5.5,
      integrity: 3.2,
    },
    special: {
      traits: ['Adaptive thrusters', 'Shield-piercing railgun'],
      history: 'Known across Sovereign Reach for taking down two interceptors while drifting engine-dead.'
    },
  },
  {
    id: 'hauler-base',
    name: 'Solis Warden',
    class: 'Heavy Hauler',
    versionName: 'Bulk Transport',
    description: 'A moving vault. It\'s not pretty or fast, but it\'s the spine of the trade lanes. With the right crew, it\'s a floating fortress.',
    image: '/assets/ships/Solis Warden.png',
    modelPath: '/assets/models/Ships/Solis Warden.glb',
    initialRotationY: 0,
    scale: 1,
    stats: {
      speed: 3.2,
      agility: 3.0,
      capacity: 6.0,
      firepower: 3.0,
      integrity: 5.8,
    },
    special: {
      traits: ['Reinforced hull', 'Aetherium shock dampeners'],
      history: 'Used in the great exodus from Quantara during the solar burst blackout.'
    },
  },
  {
    id: 'smuggler-base',
    name: 'Obsidian Wyrn',
    class: 'Blockade Runner',
    versionName: 'Modified Courier',
    description: 'Forged in the underworld circuits of Aetheria. This ship doesn\'t just move cargo - it moves legends.',
    image: '/assets/ships/Obsidian Wyrn.png',
    modelPath: '/assets/models/Ships/Obsidian Wyrn.glb',
    initialRotationY: Math.PI,
    scale: 1,
    stats: {
      speed: 5.5,
      agility: 5.2,
      capacity: 3.5,
      firepower: 4.0,
      integrity: 3.5,
    },
    special: {
      traits: ['Cloaking field', 'Quantum escape drive'],
      history: 'Was once seen evading 12 interceptors through a black dust corridor no larger than a meter wide.'
    },
  },
];