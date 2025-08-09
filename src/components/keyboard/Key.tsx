import { useEffect, useState } from 'react'
import type { KeyData } from '@/data/keyboardLayouts'
import { cn } from '@/lib/utils'

function getModifierSymbol(modifier: string): string {
  const symbols: Record<string, string> = {
    left_command: '⌘',
    right_command: '⌘',
    left_option: '⌥',
    right_option: '⌥',
    left_control: '⌃',
    right_control: '⌃',
    left_shift: '⇧',
    right_shift: '⇧',
    fn: 'fn',
    caps_lock: '⇪'
  }
  return symbols[modifier] || modifier
}

interface KeyProps {
  keyData: KeyData
  isSelected?: boolean
  isMapped?: boolean
  mappedTo?: string
  fromModifiers?: string[]
  toModifiers?: string[]
  onClick?: (keyCode: string) => void
  onMouseEnter?: (keyCode: string) => void
  onMouseLeave?: () => void
  disabled?: boolean
  dimmed?: boolean
  highlighted?: boolean
}

export function Key({
  keyData,
  isSelected,
  isMapped,
  mappedTo,
  toModifiers,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  dimmed,
  highlighted
}: KeyProps) {
  const { keyCode, label, shiftLabel, width = 1, height = 1, shape, upperWidth, lowerWidth } = keyData

  // Calculate size based on standard key unit (1u = 60px)
  const keyWidth = width * 60
  const keyHeight = height * 60
  
  // Detect dark mode with state
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  )

  // Monitor dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])
  

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(keyCode)
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={() => onMouseEnter?.(keyCode)}
      onMouseLeave={onMouseLeave}
      className={cn(
        'relative flex flex-col items-center justify-center',
        shape === 'iso-enter' ? 'border-0 bg-transparent' : 'border-2', // ISO Enter transparent bg
        shape !== 'iso-enter' && 'rounded-md',
        'transition-all duration-150',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && onClick && 'cursor-pointer',
        dimmed && 'opacity-30',
        highlighted && 'ring-2 ring-yellow-400 dark:ring-yellow-500 ring-offset-2',
        isSelected && shape !== 'iso-enter'
          ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 shadow-lg'
          : isMapped && shape !== 'iso-enter'
            ? 'mapped-key shadow-md'
            : shape !== 'iso-enter' && 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
        !disabled && !isSelected && 'hover:border-gray-400 dark:hover:border-gray-500'
      )}
      style={{
        width: `${keyWidth}px`,
        height: `${keyHeight}px`,
        minWidth: `${keyWidth}px`,
        minHeight: `${keyHeight}px`
      }}
    >
      {/* SVG border and background for ISO Enter key */}
      {shape === 'iso-enter' && upperWidth && lowerWidth && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: keyWidth, height: keyHeight }}
          viewBox={`0 0 ${keyWidth} ${keyHeight}`}
          role="presentation"
          aria-hidden="true"
        >
          {/* Background fill */}
          <path
            d={`
              M 8 4
              L ${keyWidth - 8} 4
              Q ${keyWidth - 4} 4 ${keyWidth - 4} 8
              L ${keyWidth - 4} ${keyHeight - 8}
              Q ${keyWidth - 4} ${keyHeight - 4} ${keyWidth - 8} ${keyHeight - 4}
              L ${((upperWidth - lowerWidth) / upperWidth) * keyWidth + 4} ${keyHeight - 4}
              Q ${((upperWidth - lowerWidth) / upperWidth) * keyWidth} ${keyHeight - 4} ${((upperWidth - lowerWidth) / upperWidth) * keyWidth} ${keyHeight - 8}
              L ${((upperWidth - lowerWidth) / upperWidth) * keyWidth} ${keyHeight / 2 + 4}
              Q ${((upperWidth - lowerWidth) / upperWidth) * keyWidth} ${keyHeight / 2} ${((upperWidth - lowerWidth) / upperWidth) * keyWidth - 4} ${keyHeight / 2}
              L 8 ${keyHeight / 2}
              Q 4 ${keyHeight / 2} 4 ${keyHeight / 2 - 4}
              L 4 8
              Q 4 4 8 4
              Z
            `}
            fill={
              isDarkMode
                ? isSelected
                  ? 'rgba(30, 58, 138, 0.3)' // dark:blue-900/30
                  : isMapped
                    ? 'rgba(20, 83, 45, 0.3)' // dark:green-900/30
                    : 'rgb(31, 41, 55)' // dark:gray-800
                : isSelected
                  ? 'rgb(219, 234, 254)' // blue-100
                  : isMapped
                    ? 'rgb(240, 253, 244)' // green-50
                    : 'white'
            }
          />
          
          {/* Border */}
          <path
            d={`
              M 8 4
              L ${keyWidth - 8} 4
              Q ${keyWidth - 4} 4 ${keyWidth - 4} 8
              L ${keyWidth - 4} ${keyHeight - 8}
              Q ${keyWidth - 4} ${keyHeight - 4} ${keyWidth - 8} ${keyHeight - 4}
              L ${((upperWidth - lowerWidth) / upperWidth) * keyWidth + 4} ${keyHeight - 4}
              Q ${((upperWidth - lowerWidth) / upperWidth) * keyWidth} ${keyHeight - 4} ${((upperWidth - lowerWidth) / upperWidth) * keyWidth} ${keyHeight - 8}
              L ${((upperWidth - lowerWidth) / upperWidth) * keyWidth} ${keyHeight / 2 + 4}
              Q ${((upperWidth - lowerWidth) / upperWidth) * keyWidth} ${keyHeight / 2} ${((upperWidth - lowerWidth) / upperWidth) * keyWidth - 4} ${keyHeight / 2}
              L 8 ${keyHeight / 2}
              Q 4 ${keyHeight / 2} 4 ${keyHeight / 2 - 4}
              L 4 8
              Q 4 4 8 4
              Z
            `}
            fill="none"
            strokeWidth="2"
            stroke={
              isSelected
                ? 'rgb(59, 130, 246)' // blue-500
                : isMapped
                  ? isDarkMode ? 'rgb(34, 197, 94)' : 'rgb(5, 150, 105)' // green-500 / green-600
                  : isDarkMode ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)' // gray-600 / gray-300
            }
          />
        </svg>
      )}

      {/* Shift label (top left) */}
      {shiftLabel && (
        <span className="absolute top-1 left-2 text-xs text-gray-500 dark:text-gray-400 z-10">
          {shiftLabel}
        </span>
      )}

      {/* Main label - show mapped key if mapped, otherwise show original */}
      <div className="relative z-10 flex flex-col items-center">
        {isMapped && toModifiers && toModifiers.length > 0 && (
          <span className="text-xs mapped-text-secondary mb-0.5">
            {toModifiers.map(m => getModifierSymbol(m)).join('')}
          </span>
        )}
        <span
          className={cn(
            'text-sm font-medium',
            isSelected
              ? 'text-blue-700 dark:text-blue-300'
              : isMapped
                ? 'mapped-text'
                : 'text-gray-700 dark:text-gray-300',
            (isMapped && mappedTo ? mappedTo.length : label.length) > 5 && 'text-xs'
          )}
        >
          {isMapped && mappedTo ? mappedTo : label}
        </span>
      </div>
    </button>
  )
}
