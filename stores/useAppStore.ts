import { create } from 'zustand';

type AppState = {
  isSearchActive: boolean;
  setSearchActive: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isSearchActive: false,
  setSearchActive: (value) => set({ isSearchActive: value }),
}));