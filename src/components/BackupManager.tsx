import { saveAs } from 'file-saver'
import { Archive, Check, Clock, Download, Edit2, RotateCcw, Save, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { type ConfigBackup, useBackupStore } from '@/store/backup'
import { useKarabinerStore } from '@/store/karabiner'

export function BackupManager() {
  const { config, setConfig } = useKarabinerStore()
  const {
    backups,
    createBackup,
    deleteBackup,
    restoreBackup,
    clearAllBackups,
    renameBackup,
    updateDescription
  } = useBackupStore()

  const [backupName, setBackupName] = useState('')
  const [backupDescription, setBackupDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingDesc, setEditingDesc] = useState('')

  const handleCreateBackup = () => {
    if (!config) return

    const name = backupName.trim() || undefined
    const description = backupDescription.trim() || undefined

    createBackup(config, name, description)
    setBackupName('')
    setBackupDescription('')
  }

  const handleRestore = (id: string) => {
    const restoredConfig = restoreBackup(id)
    if (restoredConfig) {
      setConfig(restoredConfig)
    }
  }

  const handleExportBackup = (backup: ConfigBackup) => {
    const blob = new Blob([JSON.stringify(backup.config, null, 2)], {
      type: 'application/json'
    })
    const fileName = `karabiner-backup-${new Date(backup.timestamp).toISOString().split('T')[0]}.json`
    saveAs(blob, fileName)
  }

  const startEditing = (backup: ConfigBackup) => {
    setEditingId(backup.id)
    setEditingName(backup.name)
    setEditingDesc(backup.description || '')
  }

  const saveEdit = (id: string) => {
    if (editingName.trim()) {
      renameBackup(id, editingName.trim())
    }
    updateDescription(id, editingDesc.trim())
    setEditingId(null)
    setEditingName('')
    setEditingDesc('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
    setEditingDesc('')
  }

  return (
    <div className="space-y-6">
      {/* Create Backup Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Save className="w-5 h-5" />
          Create New Backup
        </h3>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="backup-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Backup Name (Optional)
            </label>
            <input
              id="backup-name"
              type="text"
              value={backupName}
              onChange={e => setBackupName(e.target.value)}
              placeholder="e.g., Stable Configuration"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="backup-desc"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="backup-desc"
              value={backupDescription}
              onChange={e => setBackupDescription(e.target.value)}
              placeholder="e.g., All settings working properly"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <button
            type="button"
            onClick={handleCreateBackup}
            disabled={!config}
            className={cn(
              'w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              config
                ? 'text-white bg-blue-600 hover:bg-blue-700'
                : 'text-gray-400 bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
            )}
          >
            <Archive className="w-4 h-4 inline-block mr-2" />
            Backup Current Configuration
          </button>
        </div>
      </div>

      {/* Backups List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Saved Backups ({backups.length}/{useBackupStore.getState().maxBackups})
          </h3>

          {backups.length > 0 && (
            <button
              type="button"
              onClick={clearAllBackups}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Clear All
            </button>
          )}
        </div>

        {backups.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Archive className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No backups yet</p>
            <p className="text-sm mt-1">Create your first backup using the form above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map(backup => {
              const isEditing = editingId === backup.id
              const backupDate = new Date(backup.timestamp)

              return (
                <div
                  key={backup.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <textarea
                        value={editingDesc}
                        onChange={e => setEditingDesc(e.target.value)}
                        placeholder="Add description..."
                        rows={2}
                        className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveEdit(backup.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            {backup.name}
                            <button
                              type="button"
                              onClick={() => startEditing(backup)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </h4>
                          {backup.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {backup.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {backupDate.toLocaleString()}
                        </span>
                        <span>{backup.profileCount} profiles</span>
                        <span>{backup.ruleCount} rules</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleRestore(backup.id)}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExportBackup(backup)}
                          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Export
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBackup(backup.id)}
                          className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
