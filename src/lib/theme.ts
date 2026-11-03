import { ResolvedTheme, THEME_CLASS, THEME_COLORS, THEME_SWITCH_MS, ThemeMode } from '@/constants/theme'

export const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Light or dark for a preference (`System` asks the OS). */
export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === ThemeMode.System) return window.matchMedia(DARK_QUERY).matches ? ResolvedTheme.Dark : ResolvedTheme.Light
  return mode
}

let switchTimer: number | undefined

/**
 * Puts the theme on <html>. With `animate`, `.theme-switching` is on for a moment so colours fade (see `index.css`;
 * nothing animates for people who prefer reduced motion).
 */
export function applyTheme(theme: ResolvedTheme, { animate }: { animate: boolean }) {
  const root = document.documentElement
  if (animate) {
    root.classList.add(THEME_CLASS.switching)
    window.clearTimeout(switchTimer)
    switchTimer = window.setTimeout(() => root.classList.remove(THEME_CLASS.switching), THEME_SWITCH_MS)
  }
  root.classList.toggle(THEME_CLASS.dark, theme === ResolvedTheme.Dark)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}
