import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePokemonStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      recentSearches: [],
      activeType: null,
      activeRegion: null,
      currentPage: 'home',

      toggleFavorite: (pokemon) => {
        const { favorites } = get();
        const exists = favorites.find(f => f.id === pokemon.id);
        if (exists) {
          set({ favorites: favorites.filter(f => f.id !== pokemon.id) });
        } else {
          set({ favorites: [...favorites, pokemon] });
        }
      },

      isFavorite: (id) => {
        return get().favorites.some(f => f.id === id);
      },

      addRecentSearch: (query) => {
        const { recentSearches } = get();
        const filtered = recentSearches.filter(s => s !== query);
        set({ recentSearches: [query, ...filtered].slice(0, 5) });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      setActiveType: (type) => set({ activeType: type }),
      setActiveRegion: (region) => set({ activeRegion: region }),
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'pokedex-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        recentSearches: state.recentSearches,
      }),
    }
  )
);
