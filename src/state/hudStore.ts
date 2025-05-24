import { create } from 'zustand';

interface HudState {
  health: number;
  maxHealth: number;
  fuel: number;
  maxFuel: number;
  setHealth: (health: number) => void;
  setFuel: (fuel: number) => void;
  takeDamage: (damage: number) => void;
  consumeFuel: (amount: number) => void;
}

export const useHud = create<HudState>((set, get) => ({
  health: 100,
  maxHealth: 100,
  fuel: 100,
  maxFuel: 100,
  setHealth: (health) => set({ health: Math.max(0, Math.min(health, get().maxHealth)) }),
  setFuel: (fuel) => set({ fuel: Math.max(0, Math.min(fuel, get().maxFuel)) }),
  takeDamage: (damage) => {
    const currentHealth = get().health;
    set({ health: Math.max(0, currentHealth - damage) });
  },
  consumeFuel: (amount) => {
    const currentFuel = get().fuel;
    set({ fuel: Math.max(0, currentFuel - amount) });
  },
})); 