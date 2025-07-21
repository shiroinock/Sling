import { ChevronRight, Edit, Folder, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { useKarabinerStore } from '../store/karabiner'

interface ComplexModificationsListProps {
  onEditRule?: (index: number) => void
  searchTerm?: string
}

export function ComplexModificationsList({
  onEditRule,
  searchTerm = ''
}: ComplexModificationsListProps) {
  const { config, selectedProfileIndex, selectedRuleIndex, selectRule, deleteRule, updateRule } =
    useKarabinerStore()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  if (!config) return null

  const profile = config.profiles[selectedProfileIndex]
  const rules = profile.complex_modifications?.rules || []

  // Filter rules based on search term
  const filteredRules = rules
    .map((rule, index) => ({ rule, index }))
    .filter(({ rule }) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        rule.description?.toLowerCase().includes(searchLower) ||
        rule.group?.toLowerCase().includes(searchLower) ||
        rule.manipulators.some(manipulator => {
          const fromKey = manipulator.from?.key_code?.toLowerCase() || ''
          const toKeys = manipulator.to?.map(t => t.key_code?.toLowerCase() || '').join(' ') || ''
          return fromKey.includes(searchLower) || toKeys.includes(searchLower)
        })
      )
    })

  // Group rules by their group property
  const groupedRules = filteredRules.reduce(
    (acc, { rule, index }) => {
      const group = rule.group || 'Ungrouped'
      if (!acc[group]) acc[group] = []
      acc[group].push({ rule, index })
      return acc
    },
    {} as Record<string, typeof filteredRules>
  )

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(group)) {
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }

  const toggleRuleEnabled = (index: number) => {
    const rule = rules[index]
    updateRule(index, { ...rule, enabled: rule.enabled !== false })
  }

  if (rules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No complex modifications defined</p>
        <p className="text-sm mt-2">Add your first rule</p>
      </div>
    )
  }

  if (filteredRules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No rules match your search</p>
        <p className="text-sm mt-2">Try a different search term</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedRules).map(([group, groupRules]) => {
        const isExpanded = expandedGroups.has(group) || group === 'Ungrouped'
        const enabledCount = groupRules.filter(({ rule }) => rule.enabled !== false).length

        return (
          <div key={group} className="space-y-2">
            {group !== 'Ungrouped' && (
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <ChevronRight
                    className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')}
                  />
                  <Folder className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{group}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({enabledCount}/{groupRules.length})
                  </span>
                </div>
              </button>
            )}

            {isExpanded && (
              <div className={cn('space-y-2', group !== 'Ungrouped' && 'ml-6')}>
                {groupRules.map(({ rule, index }) => (
                  <button
                    key={`rule-${rule.description?.replace(/\s+/g, '-').toLowerCase() || 'unnamed'}-${index}`}
                    type="button"
                    className={cn(
                      'w-full p-4 rounded-lg cursor-pointer transition-colors text-left',
                      selectedRuleIndex === index
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600',
                      searchTerm && 'ring-2 ring-yellow-400 dark:ring-yellow-500 ring-offset-2',
                      rule.enabled === false && 'opacity-50'
                    )}
                    onClick={() => selectRule(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation()
                              toggleRuleEnabled(index)
                            }}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label={rule.enabled === false ? 'Enable rule' : 'Disable rule'}
                          >
                            {rule.enabled === false ? (
                              <ToggleLeft className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ToggleRight className="w-4 h-4 text-green-500" />
                            )}
                          </button>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {rule.description}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                          {rule.manipulators.length} manipulator
                          {rule.manipulators.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation()
                            onEditRule?.(index)
                          }}
                          className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          aria-label="Edit rule"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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
            )}
          </div>
        )
      })}
    </div>
  )
}
