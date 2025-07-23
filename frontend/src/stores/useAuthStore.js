import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isAuthenticated: false,

      problemsSolved: [],

      playlists: [],

      setAuth: ({ user }) =>
        set({
          authUser: user,
          isAuthenticated: true,
          problemsSolved: user?.problemsSolved || [],
          playlists: user?.playlists || [],
        }),

      clearAuth: () => set({ authUser: null, isAuthenticated: false, problemsSolved: [] }),

      addSolvedProblem: (problemId) => {
        const current = get().problemsSolved;
        if (!current.includes(problemId)) {
          set({ problemsSolved: [...current, problemId] });
        }
      },

      addPlaylist: ({ id, name }) => {
        const current = get().playlists;
        if (!current.find((playlist) => playlist.id === id)) {
          set({ playlists: [...current, { id, name }] });
        }
      },

      removePlaylist: (id) => {
        const current = get().playlists;
        set({ playlists: current.filter((playlist) => playlist.id !== id) });
      },
    }),
    {
      name: 'x-auth-store',
    }
  )
);
