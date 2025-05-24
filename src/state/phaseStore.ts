import { create } from 'zustand';

export type GamePhase = 'title' | 'character' | 'ship' | 'planet' | 'flight';

export const usePhase = create<{
  phase: GamePhase;
  set: (p: GamePhase) => void;
  back: () => void;
}>((set, get) => ({
  phase: 'title',
  set: (p) => set({ phase: p }),
  back: () => {
    const order: GamePhase[] = ['title', 'character', 'ship', 'planet', 'flight'];
    const idx = order.indexOf(get().phase);
    set({ phase: order[Math.max(0, idx - 1)] });
  },
})); 