/** @type {import('tailwindcss').Config} */

const gameColors = {
  rich_black: '#001219',
  midnight_green: '#005f73',
  dark_cyan: '#0a9396',
  tiffany_blue: '#94d2bd',
  vanilla: '#e9d8a6',
  gamboge: '#ee9b00',
  alloy_orange: '#ca6702',
  rust: '#bb3e03',
  rufous: '#ae2012',
  auburn: '#9b2226'
};

// Define the gradient classes to safelist
const gradientClasses = [
  'from-purple-500', 'to-indigo-600',
  'from-blue-400', 'to-cyan-500',
  'from-teal-400', 'to-emerald-500',
  'from-green-500', 'to-lime-600',
  'from-red-500', 'to-orange-600',
  'from-yellow-400', 'to-amber-500',
  'from-slate-500', 'to-slate-600',
];

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure it scans your src files
  ],
  safelist: [
    ...gradientClasses, // Add all gradient classes
    // FORCE GENERATION of problematic classes for testing
    'h-4',
    'left-0',
    'rounded-t-xl',
    'rounded-b-xl',
    // Optionally add other classes you construct dynamically
    'bg-gradient-to-r', // Might be good to safelist the base gradient direction too
  ],
  theme: {
    extend: {
      colors: gameColors, // Add your custom colors here
      backdropBlur: {
        DEFAULT: '8px',
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      // You can add other theme extensions here (fonts, animations, etc.)
    },
  },
  plugins: [],
  corePlugins: { 
    preflight: false, // Disable Tailwind's base styles (reset)
  }
} 