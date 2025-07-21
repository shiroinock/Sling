import { Clock, Download, FileUp, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useKarabinerStore } from '@/store/karabiner'

export function ImportExportHistory() {
  const { importExportHistory, clearHistory } = useKarabinerStore()

  if (importExportHistory.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No import/export history</p>
        <p className="text-sm mt-2">Your file operations will appear here</p>
      </div>
    )
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Import/Export History</h3>
        <button
          type="button"
          onClick={clearHistory}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear History
        </button>
      </div>

      <div className="space-y-2">
        {importExportHistory.map(entry => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'p-2 rounded-lg',
                  entry.type === 'import'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                )}
              >
                {entry.type === 'import' ? (
                  <FileUp className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {entry.type === 'import' ? 'Imported' : 'Exported'} {entry.fileName}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(entry.timestamp)}
                  </span>
                  {entry.profileCount !== undefined && <span>{entry.profileCount} profiles</span>}
                  {entry.ruleCount !== undefined && <span>{entry.ruleCount} rules</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
