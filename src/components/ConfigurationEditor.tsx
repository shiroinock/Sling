import { saveAs } from 'file-saver'
import { Download, FileUp, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { LayoutType } from '@/data/keyboardLayouts'
import type { SimpleModification } from '@/types/karabiner'
import { cn } from '../lib/utils'
import { useKarabinerStore } from '../store/karabiner'
import { ComplexModificationEditor } from './ComplexModificationEditor'
import { ComplexModificationsList } from './ComplexModificationsList'
import { ImportExportHistory } from './ImportExportHistory'
import { KeyMappingEditor } from './KeyMappingEditor'
import { VisualKeyboard } from './keyboard/VisualKeyboard'
import { ProfileTabs } from './ProfileTabs'

type TabType = 'simple' | 'complex' | 'function_keys' | 'devices' | 'history'

const KEYBOARD_LAYOUT_STORAGE_KEY = 'sling-keyboard-layout'

export function ConfigurationEditor() {
  const { config, reset, selectedProfileIndex, selectedRuleIndex, selectRule, addHistoryEntry } =
    useKarabinerStore()
  const [activeTab, setActiveTab] = useState<TabType>('simple')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isComplexEditorOpen, setIsComplexEditorOpen] = useState(false)
  const [keyboardLayout, setKeyboardLayout] = useState<LayoutType>(() => {
    // ローカルストレージから初期値を取得
    const savedLayout = localStorage.getItem(KEYBOARD_LAYOUT_STORAGE_KEY)
    return (savedLayout as LayoutType) || 'us-ansi'
  })
  const [editingModification, setEditingModification] = useState<SimpleModification | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // キーボードレイアウトが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(KEYBOARD_LAYOUT_STORAGE_KEY, keyboardLayout)
  }, [keyboardLayout])

  if (!config) return null

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json'
    })
    const fileName = `karabiner-${new Date().toISOString().split('T')[0]}.json`
    saveAs(blob, fileName)

    // Add export history entry
    addHistoryEntry({
      type: 'export',
      fileName,
      profileCount: config?.profiles.length,
      ruleCount: config?.profiles.reduce(
        (acc, profile) => acc + (profile.complex_modifications?.rules?.length || 0),
        0
      )
    })
  }

  const handleKeyClick = (keyCode: string) => {
    const simpleModifications = config.profiles[selectedProfileIndex].simple_modifications || []
    const existingModIndex = simpleModifications.findIndex(mod => mod.from.key_code === keyCode)

    if (existingModIndex !== -1) {
      // Edit existing mapping
      setEditingModification(simpleModifications[existingModIndex])
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

  const handleEditorClose = () => {
    setIsEditorOpen(false)
    setEditingModification(null)
    setEditingIndex(null)
  }

  const handleEditComplexRule = (index: number) => {
    selectRule(index)
    setIsComplexEditorOpen(true)
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'simple', label: 'Simple Modifications' },
    { id: 'complex', label: 'Complex Modifications' },
    { id: 'function_keys', label: 'Function Keys' },
    { id: 'devices', label: 'Devices' },
    { id: 'history', label: 'History' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Configuration Editor
            </h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors"
              >
                <FileUp className="w-4 h-4 mr-2" />
                Load New
              </button>
            </div>
          </div>
        </div>

        <ProfileTabs />

        <div className="p-6">
          <div className="mb-6">
            <nav className="flex space-x-4" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    activeTab === tab.id
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'simple' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Simple Modifications
                  </h3>
                  <div className="flex items-center gap-4">
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
                    <select
                      value={keyboardLayout}
                      onChange={e => setKeyboardLayout(e.target.value as LayoutType)}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="us-ansi">US ANSI</option>
                      <option value="jis">JIS</option>
                      <option value="macbook-us">MacBook US</option>
                      <option value="macbook-jis">MacBook JIS</option>
                      <option value="jis-enter-test">JIS Enter Test</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsEditorOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Modification
                    </button>
                  </div>
                </div>

                {/* Visual Keyboard Display */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <VisualKeyboard
                      layout={keyboardLayout}
                      simpleModifications={
                        config.profiles[selectedProfileIndex].simple_modifications || []
                      }
                      mode="view"
                      onKeyClick={handleKeyClick}
                      searchTerm={searchTerm}
                      keyPadding={1}
                    />
                  </div>

                  {/* Legend or Empty State Message */}
                  {(config.profiles[selectedProfileIndex].simple_modifications?.length ?? 0) > 0 ? (
                    <div className="flex justify-center">
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
                  ) : (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      No key mappings configured. Click "Add Modification" to create your first
                      mapping.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'complex' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Complex Modifications
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search rules..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsComplexEditorOpen(true)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Rule
                    </button>
                  </div>
                </div>
                <ComplexModificationsList
                  onEditRule={handleEditComplexRule}
                  searchTerm={searchTerm}
                />
              </div>
            )}

            {activeTab === 'function_keys' && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>Function Keys editor coming soon...</p>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>Device-specific settings coming soon...</p>
              </div>
            )}

            {activeTab === 'history' && <ImportExportHistory />}
          </div>
        </div>
      </div>

      {/* Key Mapping Editor Modal */}
      <KeyMappingEditor
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        editingModification={editingModification}
        editingIndex={editingIndex}
      />

      {/* Complex Modification Editor Modal */}
      <ComplexModificationEditor
        isOpen={isComplexEditorOpen}
        onClose={() => setIsComplexEditorOpen(false)}
        ruleIndex={selectedRuleIndex ?? undefined}
      />
    </div>
  )
}
