'use client';

import { DrawType, Range, Rank, Results } from '@/type/lucky-draw';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LuckyDrawStore {
  // 상태
  range: Range;
  excludedNumbers: number[];
  ranks: Rank[];
  results: Results;
  drawType: DrawType;

  // 액션
  setDrawConfig: (range: Range, excludedNumbers: number[], ranks: Rank[], drawType: DrawType) => void;
  setResults: (rank: number, numbers: number[]) => void;
  reset: () => void;
}


export const useLuckyDrawStore = create<LuckyDrawStore>()(
  persist(
    (set) => ({
      // Initial state
      range: { start: 1, end: 100 },
      excludedNumbers: [],
      ranks: [],
      results: {},
      drawType: 'roulette',

      setDrawConfig: (range, excludedNumbers, ranks, drawType) => 
        set({ range, excludedNumbers, ranks, drawType, results: {} }),

      setResults: (rank, numbers) =>
        set((state) => ({
          results: {
            ...state.results,
            [rank]: numbers
          }
        })),

      reset: () => 
        set({
          range: { start: 1, end: 100 },
          excludedNumbers: [],
          ranks: [],
          results: {},
          drawType: 'roulette'
        })
    }),
    {
      name: 'lucky-draw-storage', // Storage key
    }
  )
);