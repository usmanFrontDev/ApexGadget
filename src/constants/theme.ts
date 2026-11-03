/** Theme preference: `System` follows the OS and is the default. */
export const ThemeMode = {
  Light: 'light',
  Dark: 'dark',
  System: 'system',
} as const
export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode]

/** What is actually shown. */
export const ResolvedTheme = {
  Light: 'light',
  Dark: 'dark',
} as const
export type ResolvedTheme = (typeof ResolvedTheme)[keyof typeof ResolvedTheme]

/**
 * Zustand persist key. `index.html` reads the same key in an inline script (before React loads, so the page never
 * flashes the wrong theme): keep both in sync.
 */
export const THEME_STORAGE_KEY = 'apex.theme.v1'

/** Classes on <html> (styles in `index.css`). */
export const THEME_CLASS = { dark: 'dark', switching: 'theme-switching' } as const

/** How long `.theme-switching` stays on <html> (a little longer than the 350 ms colour fade). */
export const THEME_SWITCH_MS = 450

/** Browser chrome colour per theme (`<meta name="theme-color">`). */
export const THEME_COLORS: Record<ResolvedTheme, string> = {
  [ResolvedTheme.Light]: '#f2f2f3',
  [ResolvedTheme.Dark]: '#08080a',
}

export const THEME_CONTENT = {
  toggle: 'Dark mode',
} as const
