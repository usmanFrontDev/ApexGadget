import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { THEME_STORAGE_KEY, ThemeMode } from '@/constants/theme'
import { safeLocalStorage } from '@/lib/safeStorage'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

/** The shopper's theme preference (light / dark / follow the system), persisted. */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: ThemeMode.System,
      setMode: (mode) => set({ mode }),
    }),
    {
      name: THEME_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
)
