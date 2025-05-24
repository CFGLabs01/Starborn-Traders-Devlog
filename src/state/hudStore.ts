import { create } from 'zustand';

interface HudState {
  health: number;
  maxHealth: number;
  fuel: number;
  maxFuel: number;
  ore: number;
  credits: number;
  setHealth: (health: number) => void;
  setFuel: (fuel: number) => void;
  setOre: (ore: number) => void;
  setCredits: (credits: number) => void;
  takeDamage: (damage: number) => void;
  consumeFuel: (amount: number) => void;
  addOre: (amount: number) => void;
  addCredits: (amount: number) => void;
}

export const useHud = create<HudState>((set, get) => ({
  health: 100,
  maxHealth: 100,
  fuel: 100,
  maxFuel: 100,
  ore: 0,
  credits: 500,
  setHealth: (health) => set({ health: Math.max(0, Math.min(health, get().maxHealth)) }),
  setFuel: (fuel) => set({ fuel: Math.max(0, Math.min(fuel, get().maxFuel)) }),
  setOre: (ore) => set({ ore: Math.max(0, ore) }),
  setCredits: (credits) => set({ credits: Math.max(0, credits) }),
  takeDamage: (damage) => {
    const currentHealth = get().health;
    set({ health: Math.max(0, currentHealth - damage) });
  },
  consumeFuel: (amount) => {
    const currentFuel = get().fuel;
    set({ fuel: Math.max(0, currentFuel - amount) });
  },
  addOre: (amount) => {
    const currentOre = get().ore;
    set({ ore: currentOre + amount });
  },
  addCredits: (amount) => {
    const currentCredits = get().credits;
    set({ credits: currentCredits + amount });
  },
})); 