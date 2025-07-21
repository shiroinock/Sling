import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial dark mode state
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        isDark ? 'bg-blue-600' : 'bg-gray-200'
      )}
      aria-label="Toggle dark mode"
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          isDark ? 'translate-x-6' : 'translate-x-1'
        )}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-blue-600 m-0.5" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500 m-0.5" />
        )}
      </span>
    </button>
  )
}
