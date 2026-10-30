import type { StateStorage } from 'zustand/middleware'

/**
 * `localStorage` that never throws (private mode, quota, blocked storage, SSR): reads give `null`, writes are
 * dropped. A persisted Zustand store on top of it keeps working in memory.
 */
export function createSafeStorage(getStorage: () => Storage | undefined): StateStorage {
  return {
    getItem: (name) => {
      try {
        return getStorage()?.getItem(name) ?? null
      } catch {
        return null
      }
    },
    setItem: (name, value) => {
      try {
        getStorage()?.setItem(name, value)
      } catch {
        // storage unavailable: keep working in memory
      }
    },
    removeItem: (name) => {
      try {
        getStorage()?.removeItem(name)
      } catch {
        // ignore
      }
    },
  }
}

export const safeLocalStorage = createSafeStorage(() => globalThis.localStorage)
/** Synchronous, never-throwing text storage on `sessionStorage` (form drafts). */
export const safeSessionText = {
  get: (key: string): string | null => {
    try {
      return globalThis.sessionStorage?.getItem(key) ?? null
    } catch {
      return null
    }
  },
  set: (key: string, value: string) => {
    try {
      globalThis.sessionStorage?.setItem(key, value)
    } catch {
      // ignore
    }
  },
  remove: (key: string) => {
    try {
      globalThis.sessionStorage?.removeItem(key)
    } catch {
      // ignore
    }
  },
}
