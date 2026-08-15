'use client'

import { useTheme } from '@payloadcms/ui'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      className={`admin-theme-toggle ${isDark ? 'is-dark' : 'is-light'}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-label light-label">LIGHT</span>

        <span className="theme-toggle-label dark-label">DARK</span>

        <span className="theme-toggle-slider" />
      </span>
    </button>
  )
}
