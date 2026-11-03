import { useEffect, useRef } from 'react'
import { ResolvedTheme, ThemeMode } from '@/constants/theme'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { applyTheme, DARK_QUERY } from '@/lib/theme'
import { useThemeStore } from '@/store/useThemeStore'

/** The theme being shown, and a toggle that picks the opposite one (an explicit choice from then on). */
export function useTheme() {
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)
  const systemDark = useMediaQuery(DARK_QUERY)
  const resolved: ResolvedTheme =
    mode === ThemeMode.System ? (systemDark ? ResolvedTheme.Dark : ResolvedTheme.Light) : mode

  return {
    mode,
    resolved,
    isDark: resolved === ResolvedTheme.Dark,
    setMode,
    toggle: () => setMode(resolved === ResolvedTheme.Dark ? ThemeMode.Light : ThemeMode.Dark),
  }
}

/** Keeps <html> in step with the preference (and with the OS while it is on "System"). Mount it once. */
export function useThemeSync() {
  const { resolved } = useTheme()
  const first = useRef(true)

  useEffect(() => {
    // The inline script in index.html already set the class before first paint: only later changes animate.
    applyTheme(resolved, { animate: !first.current })
    first.current = false
  }, [resolved])
}
