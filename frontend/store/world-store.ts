'use client';

import { create } from 'zustand';

interface WorldUiState {
  selectedRepoId: number | null;
  languageFilter: string;
  sortBy: 'stars' | 'activity' | 'name';
  forestMode: boolean;
  reducedMotion: boolean;
  setSelectedRepoId: (repoId: number | null) => void;
  setLanguageFilter: (language: string) => void;
  setSortBy: (sortBy: 'stars' | 'activity' | 'name') => void;
  setForestMode: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
}

export const useWorldUiStore = create<WorldUiState>((set) => ({
  selectedRepoId: null,
  languageFilter: 'All',
  sortBy: 'activity',
  forestMode: true,
  reducedMotion: false,
  setSelectedRepoId: (selectedRepoId) => set({ selectedRepoId }),
  setLanguageFilter: (languageFilter) => set({ languageFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setForestMode: (forestMode) => set({ forestMode }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
