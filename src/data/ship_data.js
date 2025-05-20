export const shipColorSchemes = {
    'Aeon Runner': {
      primary: '#001219',
      secondary: '#0a9396',
      accent: '#94d2bd',
      glow: '#94d2bd',
      background: 'linear-gradient(135deg, #001219 0%, #005f73 100%)'
    },
    'Titan Hauler': {
      primary: '#6b705c',
      secondary: '#a5a58d',
      accent: '#b7b7a4',
      glow: '#ddbea9',
      background: 'linear-gradient(135deg, #3a3a3a 0%, #6b705c 100%)'
    },
    'Nova Fang': {
      primary: '#0a9396',
      secondary: '#94d2bd',
      accent: '#ee9b00',
      glow: '#13d8ff',
      background: 'linear-gradient(135deg, #001219 0%, #0a9396 100%)'
    },
    'Solis Warden': {
      primary: '#94d2bd',
      secondary: '#e9d8a6',
      accent: '#ee9b00',
      glow: '#f95104',
      background: 'linear-gradient(135deg, #005f73 0%, #94d2bd 100%)'
    },
    'Obsidian Wyrm': {
      primary: '#bb3e03',
      secondary: '#ae2012',
      accent: '#9b2226',
      glow: '#ca6702',
      background: 'linear-gradient(135deg, #ae2012 0%, #9b2226 100%)'
    },
    'Vantar Nomad': {
      primary: '#e9d8a6',
      secondary: '#ca6702',
      accent: '#ee9b00',
      glow: '#13d8ff',
      background: 'linear-gradient(135deg, #e9d8a6 0%, #ca6702 100%)'
    }
};

export const shipStats = {
    'Aeon Runner': [
      { thrust: 8.5, efficiency: 5.0, hull: 8.7, agility: 6.5, coreSystems: 5.5, firepower: 5.5 },
      { thrust: 8.8, efficiency: 5.3, hull: 9.0, agility: 6.8, coreSystems: 5.7, firepower: 5.7 },
      { thrust: 9.1, efficiency: 5.5, hull: 9.2, agility: 7.0, coreSystems: 6.0, firepower: 6.0 },
      { thrust: 9.4, efficiency: 5.8, hull: 9.5, agility: 7.3, coreSystems: 6.2, firepower: 6.2 },
      { thrust: 9.7, efficiency: 6.0, hull: 9.8, agility: 7.5, coreSystems: 6.5, firepower: 6.5 }
    ],
    'Titan Hauler': [
      { thrust: 6.0, efficiency: 8.0, hull: 4.5, agility: 7.5, coreSystems: 6.0, firepower: 6.0 },
      { thrust: 6.3, efficiency: 8.3, hull: 4.8, agility: 7.7, coreSystems: 6.3, firepower: 6.3 },
      { thrust: 6.5, efficiency: 8.6, hull: 5.0, agility: 8.0, coreSystems: 6.5, firepower: 6.5 },
      { thrust: 6.8, efficiency: 8.8, hull: 5.3, agility: 8.2, coreSystems: 6.8, firepower: 6.8 },
      { thrust: 7.0, efficiency: 9.0, hull: 5.5, agility: 8.5, coreSystems: 7.0, firepower: 7.0 }
    ],
    'Nova Fang': [
      { thrust: 8.0, efficiency: 6.5, hull: 7.5, agility: 6.0, coreSystems: 8.5, firepower: 8.5 },
      { thrust: 8.3, efficiency: 6.8, hull: 7.8, agility: 6.3, coreSystems: 8.8, firepower: 8.8 },
      { thrust: 8.6, efficiency: 7.0, hull: 8.0, agility: 6.6, coreSystems: 9.0, firepower: 9.0 },
      { thrust: 8.8, efficiency: 7.3, hull: 8.3, agility: 6.8, coreSystems: 9.3, firepower: 9.3 },
      { thrust: 9.0, efficiency: 7.5, hull: 8.5, agility: 7.0, coreSystems: 9.5, firepower: 9.5 }
    ],
    'Solis Warden': [
      { thrust: 7.0, efficiency: 7.5, hull: 7.0, agility: 8.0, coreSystems: 7.0, firepower: 7.0 },
      { thrust: 7.3, efficiency: 7.8, hull: 7.3, agility: 8.3, coreSystems: 7.3, firepower: 7.3 },
      { thrust: 7.5, efficiency: 8.0, hull: 7.6, agility: 8.6, coreSystems: 7.5, firepower: 7.5 },
      { thrust: 7.8, efficiency: 8.3, hull: 7.8, agility: 8.8, coreSystems: 7.8, firepower: 7.8 },
      { thrust: 8.0, efficiency: 8.5, hull: 8.0, agility: 9.0, coreSystems: 8.0, firepower: 8.0 }
    ],
    'Obsidian Wyrm': [
      { thrust: 6.5, efficiency: 9.0, hull: 4.0, agility: 7.0, coreSystems: 8.0, firepower: 8.0 },
      { thrust: 6.8, efficiency: 9.3, hull: 4.3, agility: 7.3, coreSystems: 8.3, firepower: 8.3 },
      { thrust: 7.0, efficiency: 9.5, hull: 4.6, agility: 7.6, coreSystems: 8.6, firepower: 8.6 },
      { thrust: 7.3, efficiency: 9.7, hull: 4.8, agility: 7.8, coreSystems: 8.8, firepower: 8.8 },
      { thrust: 7.5, efficiency: 10.0, hull: 5.0, agility: 8.0, coreSystems: 9.0, firepower: 9.0 }
    ],
    'Vantar Nomad': [
      { thrust: 4.6, efficiency: 7.8, hull: 3.2, agility: 6.5, coreSystems: 1.0, firepower: 1.0 },
      { thrust: 5.1, efficiency: 8.3, hull: 3.5, agility: 6.9, coreSystems: 1.4, firepower: 1.4 },
      { thrust: 5.5, efficiency: 8.7, hull: 3.8, agility: 7.3, coreSystems: 1.9, firepower: 1.9 },
      { thrust: 5.9, efficiency: 9.1, hull: 4.0, agility: 7.7, coreSystems: 2.3, firepower: 2.3 },
      { thrust: 6.2, efficiency: 9.4, hull: 4.3, agility: 8.1, coreSystems: 2.7, firepower: 2.7 }
    ]
};

export const shipShapes = {
    'Aeon Runner': [
      {
        fuselage: "Elongated hexagonal prism",
        cockpit: "Stretched sphere dome",
        wings: "Dual triangle fins",
        engines: "Dual cylinders"
      },
      {
        fuselage: "Hexagonal prism, bevelled and stretched",
        cockpit: "Raised dome with glyphs",
        wings: "Fins with micro-fins",
        engines: "Enhanced dual cylinders"
      },
      {
        fuselage: "Curved top, hexagonal base with edge outlines",
        cockpit: "Octagonal dome",
        wings: "Forked fins with extrusions",
        engines: "Cylinders + conduits"
      },
      {
        fuselage: "Longer prism with armor ribs",
        cockpit: "Crystal dome with interior light",
        wings: "Serrated angled fins",
        engines: "Layered exhaust trails"
      },
      {
        fuselage: "Panel-textured prism, layered armor",
        cockpit: "Clear dome with interior light",
        wings: "Glowing channeled fins",
        engines: "Torus glow ring exhaust"
      }
    ],
    'Nova Fang': [
      {
        fuselage: "Fang-shaped triangle extrusion",
        cockpit: "Octahedral capsule",
        wings: "Stub wings",
        engines: "Triple rear engines"
      },
      {
        fuselage: "Fang with downward curve and etching",
        cockpit: "Rimmed capsule with glow",
        wings: "Extended razor-tips",
        engines: "Rear nozzles + flap"
      },
      {
        fuselage: "Beveled fang with armor extrusions",
        cockpit: "Sharp capsule",
        wings: "Swept-diamond blades",
        engines: "SpriteTrail engines"
      },
      {
        fuselage: "Angled triangle with side panels",
        cockpit: "Capsule with antenna fins",
        wings: "Double layer with shocks",
        engines: "Multi-array boosts"
      },
      {
        fuselage: "Dual-blade winged triangle",
        cockpit: "Lathed tapered glass dome",
        wings: "Blade wings with glow veins",
        engines: "Five V-cluster engines"
      }
    ],
    'Solis Warden': [
      {
        fuselage: "Saucer dome",
        cockpit: "Vertical-scaled sphere",
        wings: "Underside torus rings",
        engines: "3 cylinder nozzles"
      },
      {
        fuselage: "Expanded dome with ring ridges",
        cockpit: "Hex cap with gold band",
        wings: "Triple stabilizer rings",
        engines: "Trail cones with glow"
      },
      {
        fuselage: "Dome with armor ribs and antenna",
        cockpit: "Faceted dome + antenna",
        wings: "Ribbed stabilizers",
        engines: "Multilayer thrusts"
      },
      {
        fuselage: "Dome + floating ring",
        cockpit: "Pentagonal top with shimmer",
        wings: "Floating rings with struts",
        engines: "Exhaust pads under hull"
      },
      {
        fuselage: "Concentric panel armored dome",
        cockpit: "Beacon with bloom",
        wings: "Glowing glyph pads",
        engines: "Solar shimmer array"
      }
    ],
    'Obsidian Wyrm': [
      {
        fuselage: "Segmented box spine",
        cockpit: "Box with beveled crest",
        wings: "None (armor panels)",
        engines: "Twin cylinder blocks"
      },
      {
        fuselage: "Box spine with top ridges",
        cockpit: "Extended crest with fins",
        wings: "Tail stabilizer plates",
        engines: "Expanded blocks + vents"
      },
      {
        fuselage: "Box chain with angled tail",
        cockpit: "Swept cockpit arc",
        wings: "Angle-mounted tail fins",
        engines: "Layered exhausts + heat bar"
      },
      {
        fuselage: "Segmented ridge with belts",
        cockpit: "Clawed cockpit with ridges",
        wings: "Armor belts, no wings",
        engines: "Glow shimmer trails"
      },
      {
        fuselage: "Extended ridge with blade tail",
        cockpit: "Dome + orb emitter",
        wings: "Dragon-style tail",
        engines: "Four exhausts, flame trail"
      }
    ],
    'Vantar Nomad': [
      {
        fuselage: "Blocky oval frame",
        cockpit: "Short dome midship",
        wings: "None (bulk freighter)",
        engines: "Basic dual engines"
      },
      {
        fuselage: "Lengthened capsule with ribs",
        cockpit: "Inset dome with panel glow",
        wings: "Mini stabilizers",
        engines: "Engine cones with glow"
      },
      {
        fuselage: "Reinforced hauler with struts",
        cockpit: "Lensed cockpit with golden edge",
        wings: "Retractable pods",
        engines: "Engine boxes with trailing mist"
      },
      {
        fuselage: "Hexagonal core with rings",
        cockpit: "Faceted glass shield",
        wings: "Cargo net fins",
        engines: "4-wide ventral boosters"
      },
      {
        fuselage: "Segmented hull with hover pods",
        cockpit: "Multi-eye cockpit with trails",
        wings: "Hover disks and stabilizer blades",
        engines: "Magnetic ring thrusters"
      }
    ],
    'Titan Hauler': [
      {
        fuselage: "Heavy rectangular block",
        cockpit: "Forward command bridge",
        wings: "Stub stabilizers",
        engines: "Quad thruster array"
      },
      {
        fuselage: "Reinforced block with side plating",
        cockpit: "Armored bridge with viewports",
        wings: "Reinforced stabilizer fins",
        engines: "Quad enhanced thrusters with glow"
      },
      {
        fuselage: "Segmented cargo hull with reinforced joints",
        cockpit: "Extended bridge with scanner array",
        wings: "Angled cargo stabilizers",
        engines: "Six-point thrust system"
      },
      {
        fuselage: "Multi-section cargo frame with armor plating",
        cockpit: "Elevated bridge pod with sensor suite",
        wings: "Deployable cargo guides",
        engines: "Eight-point vectored thrust system"
      },
      {
        fuselage: "Massive frame with interlocked cargo modules",
        cockpit: "Command sphere with extended sensor array",
        wings: "Retractable support arms with stabilizers",
        engines: "Ten-point advanced thrust matrix"
      }
    ]
};

export const shipClassDescriptions = {
    'Aeon Runner': "SPEED / SCOUT CLASS - Prioritizing velocity and maneuverability, the Aeon Runner excels at reconnaissance and rapid response missions. Its sleek hexagonal profile and advanced propulsion systems make it the fastest ship in the Starborn fleet.",
    'Titan Hauler': "CARGO / TRANSPORT CLASS - Built for maximum carrying capacity, the Titan Hauler serves as the backbone of any fleet operation. Its reinforced frame can withstand significant damage while maintaining efficient energy consumption.",
    'Nova Fang': "FIGHTER / STRIKER CLASS - The Nova Fang is designed for combat excellence, combining impressive weaponry with tactical agility. Its distinctive fang-shaped profile houses advanced targeting systems and formidable firepower.",
    'Solis Warden': "BALANCED CLASS - A versatile ship that performs admirably across all metrics, the Solis Warden is the preferred choice for pilots seeking adaptability. Its unique saucer configuration houses balanced systems for various mission profiles.",
    'Obsidian Wyrm': "TANK / DESTROYER CLASS - The most durable vessel in the Starborn lineup, the Obsidian Wyrm can absorb tremendous damage while delivering devastating attacks. Its segmented spine design allows for impressive weapons integration.",
    'Vantar Nomad': "CARGO / TRADER CLASS - The civilian-market variant focused on commercial transport, the Vantar Nomad sacrifices combat capabilities for cargo capacity and efficiency. Its modular design allows for customized configurations to suit various trading operations."
}; 