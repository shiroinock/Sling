import { ChevronRight, ToggleLeft, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { useKarabinerStore } from '../store/karabiner'

export function ComplexModificationsList() {
  const { config, selectedProfileIndex, selectedRuleIndex, selectRule, deleteRule } =
    useKarabinerStore()

  if (!config) return null

  const profile = config.profiles[selectedProfileIndex]
  const rules = profile.complex_modifications?.rules || []

  if (rules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No complex modifications defined</p>
        <p className="text-sm mt-2">Add your first rule</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {rules.map((rule, index) => (
        <button
          key={`rule-${rule.description?.replace(/\s+/g, '-').toLowerCase() || 'unnamed'}-${index}`}
          type="button"
          className={cn(
            'w-full p-4 rounded-lg cursor-pointer transition-colors text-left',
            selectedRuleIndex === index
              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
          )}
          onClick={() => selectRule(index)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <ToggleLeft className={cn('w-4 h-4', 'text-gray-400')} />
                <h3 className="font-medium text-gray-900 dark:text-white">{rule.description}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {rule.manipulators.length} manipulator{rule.manipulators.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  deleteRule(index)
                }}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                aria-label="Delete rule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
