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
  disabled
}: KeyProps) {
  const { keyCode, label, shiftLabel, width = 1, height = 1 } = keyData

  // Calculate size based on standard key unit (1u = 60px)
  const keyWidth = width * 60
  const keyHeight = height * 60

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
        'rounded-md border-2 transition-all duration-150',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && onClick && 'cursor-pointer',
        isSelected
          ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 shadow-lg'
          : isMapped
            ? 'border-green-500 bg-green-100 dark:bg-green-900/30 shadow-md'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
        !disabled && !isSelected && 'hover:border-gray-400 dark:hover:border-gray-500'
      )}
      style={{
        width: `${keyWidth}px`,
        height: `${keyHeight}px`,
        minWidth: `${keyWidth}px`,
        minHeight: `${keyHeight}px`
      }}
    >
      {/* Shift label (top left) */}
      {shiftLabel && (
        <span className="absolute top-1 left-2 text-xs text-gray-500 dark:text-gray-400">
          {shiftLabel}
        </span>
      )}

      {/* Main label - show mapped key if mapped, otherwise show original */}
      <div className="flex flex-col items-center">
        {isMapped && toModifiers && toModifiers.length > 0 && (
          <span className="text-xs text-green-600 dark:text-green-400 mb-0.5">
            {toModifiers.map(m => getModifierSymbol(m)).join('')}
          </span>
        )}
        <span
          className={cn(
            'text-sm font-medium',
            isSelected
              ? 'text-blue-700 dark:text-blue-300'
              : isMapped
                ? 'text-green-700 dark:text-green-300'
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
