// src/utils/colorUtils.js

// Mapping from Tailwind config names to hex codes
const colorMap = {
  purple: { 500: '#a855f7' }, // Approx Tailwind purple-500
  indigo: { 600: '#4f46e5' }, // Approx Tailwind indigo-600
  blue:   { 400: '#60a5fa' }, // Approx Tailwind blue-400
  cyan:   { 500: '#06b6d4' }, // Approx Tailwind cyan-500
  teal:   { 400: '#2dd4bf' }, // Approx Tailwind teal-400
  emerald:{ 500: '#10b981' }, // Approx Tailwind emerald-500
  green:  { 500: '#22c55e' }, // Approx Tailwind green-500
  lime:   { 600: '#65a30d' }, // Approx Tailwind lime-600
  red:    { 500: '#ef4444' }, // Approx Tailwind red-500
  orange: { 600: '#ea580c' }, // Approx Tailwind orange-600
  yellow: { 400: '#facc15' }, // Approx Tailwind yellow-400
  amber:  { 500: '#f59e0b' }, // Approx Tailwind amber-500
  slate:  { 500: '#64748b', 600: '#475569' } // Approx Tailwind slate-500/600
  // Add other colors from tailwind config if needed
};

// Helper function to get START and END colors for StatBar gradient
export const getStatBarColor = (statName) => {
  switch (statName?.toLowerCase()) {
    case 'speed':
      return { start: colorMap.purple[500], end: colorMap.indigo[600] };
    case 'agility':
      return { start: colorMap.blue[400], end: colorMap.cyan[500] };
    case 'capacity':
      return { start: colorMap.teal[400], end: colorMap.emerald[500] };
    case 'endurance':
      return { start: colorMap.green[500], end: colorMap.lime[600] };
    case 'firepower':
      return { start: colorMap.red[500], end: colorMap.orange[600] };
    case 'integrity':
      return { start: colorMap.yellow[400], end: colorMap.amber[500] };
    default:
      return { start: colorMap.slate[500], end: colorMap.slate[600] };
  }
};

// Add other color-related utils here if needed 