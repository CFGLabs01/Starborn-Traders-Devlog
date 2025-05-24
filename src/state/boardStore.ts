import { create } from 'zustand';

interface BoardState {
  tiles: string[];
}

export const useBoard = create<BoardState>(() => ({
  tiles: Array(37).fill('empty')
})); 