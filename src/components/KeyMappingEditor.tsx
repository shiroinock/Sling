import { ArrowRight, Keyboard, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { LayoutType } from '@/data/keyboardLayouts'
import { cn } from '@/lib/utils'
import { useKarabinerStore } from '@/store/karabiner'
import type { SimpleModification } from '@/types/karabiner'
import { VisualKeyboard } from './keyboard/VisualKeyboard'

interface KeyMappingEditorProps {
  isOpen: boolean
  onClose: () => void
  editingModification?: SimpleModification | null
  editingIndex?: number | null
}

export function KeyMappingEditor({
  isOpen,
  onClose,
  editingModification,
  editingIndex
}: KeyMappingEditorProps) {
  const { addSimpleModification, updateSimpleModification, deleteSimpleModification } =
    useKarabinerStore()

  const [fromKey, setFromKey] = useState<string>('')
  const [toKey, setToKey] = useState<string>('')
  const [layout, setLayout] = useState<LayoutType>('us-ansi')

  // Update state when editingModification changes
  useEffect(() => {
    if (isOpen && editingModification) {
      setFromKey(editingModification.from.key_code || '')
      setToKey(editingModification.to[0]?.key_code || '')
    }
  }, [isOpen, editingModification])

  if (!isOpen) return null

  const handleSave = () => {
    if (!fromKey || !toKey) return

    const modification: SimpleModification = {
      from: { key_code: fromKey },
      to: [{ key_code: toKey }]
    }

    if (editingIndex !== null && editingIndex !== undefined) {
      updateSimpleModification(editingIndex, modification)
    } else {
      addSimpleModification(modification)
    }

    handleClose()
  }

  const handleClose = () => {
    setFromKey('')
    setToKey('')
    onClose()
  }

  const handleDelete = () => {
    if (editingIndex !== null && editingIndex !== undefined) {
      deleteSimpleModification(editingIndex)
      handleClose()
    }
  }

  const handleToKeySelect = (keyCode: string) => {
    setToKey(keyCode)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            {editingModification ? 'Edit Key Mapping' : 'Add Key Mapping'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Layout selector */}
          <div className="flex items-center gap-4">
            <label
              htmlFor="keyboard-layout"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Keyboard Layout:
            </label>
            <select
              id="keyboard-layout"
              value={layout}
              onChange={e => setLayout(e.target.value as LayoutType)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="us-ansi">US ANSI</option>
              <option value="jis">JIS (Japanese)</option>
              <option value="macbook-us">MacBook US</option>
              <option value="macbook-jis">MacBook JIS</option>
            </select>
          </div>

          {/* Current mapping display */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">From</div>
              <div className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
                {fromKey}
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400" />

            <div className="px-6 py-3 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">To</div>
              <div className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
                {toKey || 'Select key'}
              </div>
            </div>
          </div>

          {/* Visual keyboard */}
          <div className="flex justify-center">
            <VisualKeyboard
              layout={layout}
              mode="to"
              selectedFromKey={fromKey}
              selectedToKey={toKey}
              onToKeySelect={handleToKeySelect}
            />
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Click on a key to map "{fromKey}" to that key
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          {/* Delete button on the left */}
          <div>
            {editingIndex !== null && editingIndex !== undefined && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Mapping
              </button>
            )}
          </div>

          {/* Save and Cancel buttons on the right */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!fromKey || !toKey}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                fromKey && toKey
                  ? 'text-white bg-blue-600 hover:bg-blue-700'
                  : 'text-gray-400 bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
              )}
            >
              {editingModification ? 'Update' : 'Add'} Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
