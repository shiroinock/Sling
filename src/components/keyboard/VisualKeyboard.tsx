import { useState } from 'react'
import type { LayoutType } from '@/data/keyboardLayouts'
import { getLayout } from '@/data/keyboardLayouts'
import { cn } from '@/lib/utils'
import type { SimpleModification } from '@/types/karabiner'
import { Key } from './Key'

interface VisualKeyboardProps {
  layout?: LayoutType
  simpleModifications?: SimpleModification[]
  selectedFromKey?: string | null
  selectedToKey?: string | null
  onFromKeySelect?: (keyCode: string) => void
  onToKeySelect?: (keyCode: string) => void
  onKeyClick?: (keyCode: string) => void
  mode?: 'from' | 'to' | 'view'
  className?: string
}

export function VisualKeyboard({
  layout = 'us-ansi',
  simpleModifications = [],
  selectedFromKey,
  selectedToKey,
  onFromKeySelect,
  onToKeySelect,
  onKeyClick,
  mode = 'view',
  className
}: VisualKeyboardProps) {
  const keyboardLayout = getLayout(layout)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  // Create a map of key mappings for quick lookup
  const mappingsMap = new Map<
    string,
    { toKey: string; fromModifiers?: string[]; toModifiers?: string[] }
  >()
  simpleModifications.forEach(mod => {
    if (mod.from.key_code && mod.to[0]?.key_code) {
      mappingsMap.set(mod.from.key_code, {
        toKey: mod.to[0].key_code,
        fromModifiers: mod.from.modifiers?.mandatory,
        toModifiers: mod.to[0].modifiers
      })
    }
  })

  const handleKeyClick = (keyCode: string) => {
    if (mode === 'from' && onFromKeySelect) {
      onFromKeySelect(keyCode)
    } else if (mode === 'to' && onToKeySelect) {
      onToKeySelect(keyCode)
    } else if (mode === 'view' && onKeyClick) {
      onKeyClick(keyCode)
    }
  }

  // Calculate keyboard dimensions
  const keyboardWidth = keyboardLayout.width * 60 // 60px per unit
  const keyboardHeight = keyboardLayout.height * 60 + 40 // +40 for mapping indicators

  return (
    <div
      className={cn('relative bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-inner', className)}
      style={{
        width: `${keyboardWidth + 32}px`, // +32 for padding
        minHeight: `${keyboardHeight + 32}px`
      }}
    >
      {/* Layout selector */}
      <div className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400">
        {keyboardLayout.name}
      </div>

      {/* Keyboard rows */}
      <div className="relative">
        {keyboardLayout.rows.map((row, rowIndex) => {
          const rowY = (row.y || rowIndex) * 60 // 60px per unit

          return (
            <div
              key={`row-${rowY}`}
              className="absolute flex gap-1"
              style={{
                top: `${rowY}px`,
                left: 0
              }}
            >
              {row.keys.map((keyData, keyIndex) => {
                const keyX =
                  keyData.x !== undefined
                    ? keyData.x * 60
                    : row.keys
                        .slice(0, keyIndex)
                        .reduce((acc, k) => acc + (k.width || 1) * 60 + 4, 0) // 4px gap

                const isFromKey = selectedFromKey === keyData.keyCode
                const isToKey = selectedToKey === keyData.keyCode
                const isMapped = mappingsMap.has(keyData.keyCode)
                const mappingInfo = mappingsMap.get(keyData.keyCode)
                const mappedTo = mappingInfo?.toKey

                let isSelected = false
                if (mode === 'from') {
                  isSelected = isFromKey
                } else if (mode === 'to') {
                  isSelected = isToKey
                }

                return (
                  <div
                    key={`key-${keyData.keyCode}-${keyIndex}`}
                    className="absolute"
                    style={{
                      left: `${keyX}px`,
                      top: keyData.y ? `${keyData.y * 60}px` : 0
                    }}
                  >
                    <Key
                      keyData={keyData}
                      isSelected={isSelected}
                      isMapped={isMapped}
                      mappedTo={mappedTo}
                      fromModifiers={mappingInfo?.fromModifiers}
                      toModifiers={mappingInfo?.toModifiers}
                      onClick={handleKeyClick}
                      onMouseEnter={setHoveredKey}
                      onMouseLeave={() => setHoveredKey(null)}
                      disabled={mode === 'view' && !onKeyClick}
                    />

                    {/* Tooltip */}
                    {hoveredKey === keyData.keyCode && mode === 'view' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
                        {isMapped ? `Original: ${keyData.label}` : 'Click to map this key'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Mode indicator */}
      {mode !== 'view' && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400">
          {mode === 'from' ? 'Select source key' : 'Select target key'}
        </div>
      )}
    </div>
  )
}
