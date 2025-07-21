import { cn } from '@/lib/utils'

interface ModifierKeySelectorProps {
  selectedModifiers: string[]
  onModifiersChange: (modifiers: string[]) => void
  mode?: 'mandatory' | 'optional'
}

const MODIFIER_KEYS = [
  { code: 'left_command', label: '⌘ Cmd (L)', shortLabel: '⌘' },
  { code: 'right_command', label: '⌘ Cmd (R)', shortLabel: '⌘' },
  { code: 'left_option', label: '⌥ Opt (L)', shortLabel: '⌥' },
  { code: 'right_option', label: '⌥ Opt (R)', shortLabel: '⌥' },
  { code: 'left_control', label: '⌃ Ctrl (L)', shortLabel: '⌃' },
  { code: 'right_control', label: '⌃ Ctrl (R)', shortLabel: '⌃' },
  { code: 'left_shift', label: '⇧ Shift (L)', shortLabel: '⇧' },
  { code: 'right_shift', label: '⇧ Shift (R)', shortLabel: '⇧' },
  { code: 'fn', label: 'fn', shortLabel: 'fn' },
  { code: 'caps_lock', label: '⇪ Caps', shortLabel: '⇪' }
]

export function ModifierKeySelector({
  selectedModifiers,
  onModifiersChange,
  mode = 'mandatory'
}: ModifierKeySelectorProps) {
  const toggleModifier = (modifier: string) => {
    if (selectedModifiers.includes(modifier)) {
      onModifiersChange(selectedModifiers.filter(m => m !== modifier))
    } else {
      onModifiersChange([...selectedModifiers, modifier])
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {mode === 'mandatory' ? 'Required Modifiers' : 'Optional Modifiers'}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {MODIFIER_KEYS.map(modifier => (
          <button
            key={modifier.code}
            type="button"
            onClick={() => toggleModifier(modifier.code)}
            className={cn(
              'px-3 py-2 text-sm font-medium rounded-lg border transition-all',
              selectedModifiers.includes(modifier.code)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
            title={modifier.label}
          >
            <span className="hidden sm:inline">{modifier.label}</span>
            <span className="sm:hidden">{modifier.shortLabel}</span>
          </button>
        ))}
      </div>
      {selectedModifiers.length > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Selected: {selectedModifiers.join(' + ')}
        </div>
      )}
    </div>
  )
}
