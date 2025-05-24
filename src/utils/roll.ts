export function quantumRoll(sides = 20) {
  // simple RNG for now
  return Math.ceil(Math.random() * sides);
} 