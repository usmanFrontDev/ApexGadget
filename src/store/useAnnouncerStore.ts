import { create } from 'zustand'

/** Appended to an identical consecutive message so the live region still announces it. */
const REPEAT_SUFFIX = String.fromCharCode(160)

interface AnnouncerState {
  message: string
  /** Sends a message to the polite live region (`CartLiveRegion`). */
  announce: (message: string) => void
}

/** Screen-reader announcements (cart changes). A repeated message is re-announced via an invisible suffix. */
export const useAnnouncerStore = create<AnnouncerState>((set, get) => ({
  message: '',
  announce: (message) => set({ message: get().message === message ? `${message}${REPEAT_SUFFIX}` : message }),
}))

export const announce = (message: string) => useAnnouncerStore.getState().announce(message)
