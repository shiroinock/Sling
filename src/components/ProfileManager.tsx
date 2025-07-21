import { Copy, Edit2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useKarabinerStore } from '@/store/karabiner'
import type { Profile } from '@/types/karabiner'

interface ProfileManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileManager({ isOpen, onClose }: ProfileManagerProps) {
  const { config, selectedProfileIndex, addProfile, updateProfile, deleteProfile } =
    useKarabinerStore()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  const createInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingIndex])

  useEffect(() => {
    if (isCreating && createInputRef.current) {
      createInputRef.current.focus()
    }
  }, [isCreating])

  if (!isOpen || !config) return null

  const handleCreate = () => {
    if (!newProfileName.trim()) return

    const newProfile: Profile = {
      name: newProfileName.trim(),
      selected: false,
      simple_modifications: [],
      complex_modifications: {
        rules: []
      },
      virtual_hid_keyboard: {
        keyboard_type: 'ansi'
      }
    }

    addProfile(newProfile)
    setNewProfileName('')
    setIsCreating(false)
  }

  const handleDuplicate = (index: number) => {
    const originalProfile = config.profiles[index]
    const duplicatedProfile: Profile = {
      ...originalProfile,
      name: `${originalProfile.name} (Copy)`,
      selected: false
    }

    addProfile(duplicatedProfile)
  }

  const handleStartEdit = (index: number) => {
    setEditingIndex(index)
    setEditingName(config.profiles[index].name)
  }

  const handleSaveEdit = () => {
    if (editingIndex === null || !editingName.trim()) return

    const updatedProfile = {
      ...config.profiles[editingIndex],
      name: editingName.trim()
    }

    updateProfile(editingIndex, updatedProfile)
    setEditingIndex(null)
    setEditingName('')
  }

  const handleDelete = (index: number) => {
    if (config.profiles.length <= 1) {
      alert('Cannot delete the last profile')
      return
    }

    if (confirm(`Delete profile "${config.profiles[index].name}"?`)) {
      deleteProfile(index)
    }
  }

  const handleSetDefault = (index: number) => {
    // Update all profiles to set selected: false
    config.profiles.forEach((profile, i) => {
      updateProfile(i, {
        ...profile,
        selected: i === index
      })
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Profiles</h2>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-200px)]">
          {/* Profile list */}
          {config.profiles.map((profile, index) => (
            <div
              key={`profile-${profile.name}-${index}`}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              {editingIndex === index ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveEdit()
                      if (e.key === 'Escape') setEditingIndex(null)
                    }}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIndex(null)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {profile.name}
                    </span>
                    {profile.selected && (
                      <span className="px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded">
                        Default
                      </span>
                    )}
                    {selectedProfileIndex === index && (
                      <span className="px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!profile.selected && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(index)}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        title="Set as default"
                      >
                        <span className="text-xs">Set default</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(index)}
                      className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      title="Edit name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(index)}
                      className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      title="Delete"
                      disabled={config.profiles.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Create new profile */}
          {isCreating ? (
            <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <input
                ref={createInputRef}
                type="text"
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCreate()
                  if (e.key === 'Escape') {
                    setIsCreating(false)
                    setNewProfileName('')
                  }
                }}
                placeholder="Profile name"
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 flex-1"
              />
              <button
                type="button"
                onClick={handleCreate}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false)
                  setNewProfileName('')
                }}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Profile</span>
            </button>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
