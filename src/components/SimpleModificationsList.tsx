import { ArrowRight, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { SimpleModification } from '@/types/karabiner'
import { useKarabinerStore } from '../store/karabiner'
import { KeyMappingEditor } from './KeyMappingEditor'

export function SimpleModificationsList() {
  const { config, selectedProfileIndex, deleteSimpleModification } = useKarabinerStore()
  const [editingModification, setEditingModification] = useState<SimpleModification | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  if (!config) return null

  const profile = config.profiles[selectedProfileIndex]
  const simpleModifications = profile.simple_modifications || []

  if (simpleModifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No simple modifications defined</p>
        <p className="text-sm mt-2">Add your first key mapping</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {simpleModifications.map((mod, index) => (
        <div
          key={`simple-mod-${mod.from.key_code || mod.from.consumer_key_code || mod.from.pointing_button || 'any'}-to-${mod.to[0]?.key_code || mod.to[0]?.consumer_key_code || mod.to[0]?.pointing_button || 'unknown'}-${index}`}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <code className="px-3 py-1 bg-white dark:bg-gray-800 rounded-md font-mono text-sm">
              {mod.from.key_code}
            </code>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <code className="px-3 py-1 bg-white dark:bg-gray-800 rounded-md font-mono text-sm">
              {mod.to[0].key_code}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingModification(mod)
                setEditingIndex(index)
                setIsEditorOpen(true)
              }}
              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              aria-label="Edit modification"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => deleteSimpleModification(index)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Delete modification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Key Mapping Editor Modal */}
      <KeyMappingEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false)
          setEditingModification(null)
          setEditingIndex(null)
        }}
        editingModification={editingModification}
        editingIndex={editingIndex}
      />
    </div>
  )
}
