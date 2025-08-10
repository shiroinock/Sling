import { ArrowRight, Copy, Edit2, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { LayoutType } from '@/data/keyboardLayouts'
import { useKarabinerStore } from '@/store/karabiner'
import type { FromKeyCode, SimpleModification, ToKeyCode } from '@/types/karabiner'
import { CopyMappingsDialog } from './CopyMappingsDialog'
import { KeyMappingEditor } from './KeyMappingEditor'
import { VisualKeyboard } from './keyboard/VisualKeyboard'

interface UnifiedSimpleModificationsProps {
  keyboardLayout?: LayoutType
  selectedDeviceIndex: number | null
  isDeviceMode: boolean
}

export function UnifiedSimpleModifications({
  keyboardLayout = 'macbook-us',
  selectedDeviceIndex,
  isDeviceMode
}: UnifiedSimpleModificationsProps) {
  const { config, selectedProfileIndex, updateConfig, deleteSimpleModification } =
    useKarabinerStore()
  const [editingModification, setEditingModification] = useState<SimpleModification | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false)

  if (!config) return null

  const profile = config.profiles[selectedProfileIndex]
  const devices = profile.devices || []

  // Get modifications based on selected mode
  const getModifications = (): SimpleModification[] => {
    if (isDeviceMode && selectedDeviceIndex !== null && devices[selectedDeviceIndex]) {
      return devices[selectedDeviceIndex].simple_modifications || []
    }
    return profile.simple_modifications || []
  }

  const modifications = getModifications()

  const handleDelete = (index: number) => {
    if (isDeviceMode && selectedDeviceIndex !== null) {
      // Delete from device
      const device = devices[selectedDeviceIndex]
      const newModifications = device.simple_modifications?.filter((_, i) => i !== index) || []

      const newDevices = [...devices]
      newDevices[selectedDeviceIndex] = {
        ...device,
        simple_modifications: newModifications
      }

      const newProfiles = config.profiles.map((p, i) =>
        i === selectedProfileIndex ? { ...p, devices: newDevices } : p
      )

      updateConfig({ ...config, profiles: newProfiles })
    } else {
      // Delete from profile
      deleteSimpleModification(index)
    }
  }

  const handleKeyClick = (keyCode: string) => {
    const currentModifications = getModifications()
    const existingModIndex = currentModifications.findIndex(mod => mod.from.key_code === keyCode)

    if (existingModIndex !== -1) {
      // Edit existing mapping
      setEditingModification(currentModifications[existingModIndex])
      setEditingIndex(existingModIndex)
    } else {
      // Create new mapping
      const newModification: SimpleModification = {
        from: { key_code: keyCode },
        to: [{ key_code: '' }]
      }
      setEditingModification(newModification)
      setEditingIndex(null)
    }
    setIsEditorOpen(true)
  }

  const handleCopyMappings = (mappingsToCopy: SimpleModification[], mode: 'replace' | 'merge') => {
    if (isDeviceMode && selectedDeviceIndex !== null) {
      // Copy to device
      const device = devices[selectedDeviceIndex]
      let newModifications: SimpleModification[]

      if (mode === 'replace') {
        newModifications = [...mappingsToCopy]
      } else {
        // Merge mode - combine existing with new, overwriting duplicates
        const existingMods = device.simple_modifications || []
        const fromKeysMap = new Map<string, SimpleModification>()

        // Add existing modifications
        existingMods.forEach(mod => {
          const key =
            mod.from.key_code || mod.from.consumer_key_code || mod.from.pointing_button || 'any'
          fromKeysMap.set(key, mod)
        })

        // Add/overwrite with copied modifications
        mappingsToCopy.forEach(mod => {
          const key =
            mod.from.key_code || mod.from.consumer_key_code || mod.from.pointing_button || 'any'
          fromKeysMap.set(key, mod)
        })

        newModifications = Array.from(fromKeysMap.values())
      }

      const newDevices = [...devices]
      newDevices[selectedDeviceIndex] = {
        ...device,
        simple_modifications: newModifications
      }

      const newProfiles = config.profiles.map((p, i) =>
        i === selectedProfileIndex ? { ...p, devices: newDevices } : p
      )

      updateConfig({ ...config, profiles: newProfiles })
    } else {
      // Copy to profile
      let newModifications: SimpleModification[]

      if (mode === 'replace') {
        newModifications = [...mappingsToCopy]
      } else {
        // Merge mode
        const existingMods = profile.simple_modifications || []
        const fromKeysMap = new Map<string, SimpleModification>()

        existingMods.forEach(mod => {
          const key =
            mod.from.key_code || mod.from.consumer_key_code || mod.from.pointing_button || 'any'
          fromKeysMap.set(key, mod)
        })

        mappingsToCopy.forEach(mod => {
          const key =
            mod.from.key_code || mod.from.consumer_key_code || mod.from.pointing_button || 'any'
          fromKeysMap.set(key, mod)
        })

        newModifications = Array.from(fromKeysMap.values())
      }

      const newProfiles = config.profiles.map((p, i) =>
        i === selectedProfileIndex ? { ...p, simple_modifications: newModifications } : p
      )

      updateConfig({ ...config, profiles: newProfiles })
    }
  }

  const handleSaveMapping = (from: FromKeyCode, to: ToKeyCode[]) => {
    const modification: SimpleModification = { from, to }

    if (isDeviceMode && selectedDeviceIndex !== null) {
      // Save to device
      const device = devices[selectedDeviceIndex]
      const currentMods = device.simple_modifications || []

      let newModifications: SimpleModification[]
      if (editingIndex !== null) {
        newModifications = [...currentMods]
        newModifications[editingIndex] = modification
      } else {
        newModifications = [...currentMods, modification]
      }

      const newDevices = [...devices]
      newDevices[selectedDeviceIndex] = {
        ...device,
        simple_modifications: newModifications
      }

      const newProfiles = config.profiles.map((p, i) =>
        i === selectedProfileIndex ? { ...p, devices: newDevices } : p
      )

      updateConfig({ ...config, profiles: newProfiles })
    }
    // If not in device mode, the KeyMappingEditor will handle saving to profile

    setIsEditorOpen(false)
    setEditingModification(null)
    setEditingIndex(null)
  }

  return (
    <div className="space-y-4">
      {/* Visual Keyboard Display */}
      <div className="flex justify-center mb-6">
        <VisualKeyboard
          layout={keyboardLayout}
          simpleModifications={modifications}
          mode="view"
          onKeyClick={handleKeyClick}
          searchTerm={searchTerm}
          keyPadding={1}
        />
      </div>

      {/* Legend */}
      {modifications.length > 0 && (
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-12 h-8 rounded mapped-key shadow-md" />
              <span>Mapped key</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-8 rounded border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800" />
              <span>Normal key</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Box */}
      <div className="flex justify-end">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search mappings..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Add Modification and Copy Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsCopyDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy from...
        </button>
        <button
          type="button"
          onClick={() => {
            setEditingModification(null)
            setEditingIndex(null)
            setIsEditorOpen(true)
          }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Modification
        </button>
      </div>

      {/* Modifications List */}
      {modifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No modifications defined for {isDeviceMode ? 'this device' : 'this profile'}</p>
          <p className="text-sm mt-2">Click "Add Modification" to create your first key mapping</p>
        </div>
      ) : (
        <div className="space-y-2">
          {modifications.map((mod, index) => {
            const modKey = `${mod.from.key_code || mod.from.consumer_key_code || mod.from.pointing_button || 'any'}_${index}`
            return (
              <div
                key={modKey}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md font-mono text-sm">
                    {mod.from.modifiers?.mandatory?.join('+') && (
                      <span className="text-gray-600 dark:text-gray-400 mr-1">
                        {mod.from.modifiers.mandatory.join('+')}+
                      </span>
                    )}
                    {mod.from.key_code ||
                      mod.from.consumer_key_code ||
                      mod.from.pointing_button ||
                      'any'}
                  </code>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <code className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-md font-mono text-sm text-blue-700 dark:text-blue-300">
                    {mod.to[0]?.modifiers?.join('+') && (
                      <span className="text-blue-600 dark:text-blue-400 mr-1">
                        {mod.to[0].modifiers.join('+')}+
                      </span>
                    )}
                    {mod.to[0]?.key_code ||
                      mod.to[0]?.consumer_key_code ||
                      mod.to[0]?.pointing_button ||
                      'unknown'}
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
                    onClick={() => handleDelete(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Delete modification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
        onSave={isDeviceMode ? handleSaveMapping : undefined}
        isDeviceSpecific={isDeviceMode}
      />

      {/* Copy Mappings Dialog */}
      <CopyMappingsDialog
        isOpen={isCopyDialogOpen}
        onClose={() => setIsCopyDialogOpen(false)}
        currentDevice={
          isDeviceMode && selectedDeviceIndex !== null ? devices[selectedDeviceIndex] : null
        }
        currentProfileMappings={profile.simple_modifications || []}
        devices={devices}
        onCopy={handleCopyMappings}
        isDeviceMode={isDeviceMode}
        selectedDeviceIndex={selectedDeviceIndex}
      />
    </div>
  )
}
