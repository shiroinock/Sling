import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useKarabinerStore } from '../store/karabiner'
import type { Condition, FromEvent, Manipulator, Rule, ToEvent } from '../types/karabiner'
import { COMMON_KEY_CODES, CONSUMER_KEY_CODES, MODIFIER_KEYS } from '../types/karabiner'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface ComplexModificationEditorProps {
  isOpen: boolean
  onClose: () => void
  ruleIndex?: number
}

export function ComplexModificationEditor({
  isOpen,
  onClose,
  ruleIndex
}: ComplexModificationEditorProps) {
  const { config, selectedProfileIndex, addRule, updateRule } = useKarabinerStore()
  const existingRule =
    ruleIndex !== undefined && config
      ? config.profiles[selectedProfileIndex].complex_modifications?.rules?.[ruleIndex]
      : undefined

  const [rule, setRule] = useState<Rule>(
    existingRule || {
      description: '',
      manipulators: []
    }
  )
  const [expandedManipulator, setExpandedManipulator] = useState<number | null>(0)

  const handleSave = () => {
    if (!rule.description?.trim()) {
      alert('Please provide a description for the rule')
      return
    }
    if (rule.manipulators.length === 0) {
      alert('Please add at least one manipulator')
      return
    }

    if (ruleIndex !== undefined) {
      updateRule(ruleIndex, rule)
    } else {
      addRule(rule)
    }
    onClose()
  }

  const addManipulator = () => {
    const newManipulator: Manipulator = {
      type: 'basic',
      from: {},
      to: []
    }
    setRule({
      ...rule,
      manipulators: [...rule.manipulators, newManipulator]
    })
    setExpandedManipulator(rule.manipulators.length)
  }

  const updateManipulator = (index: number, manipulator: Manipulator) => {
    const manipulators = [...rule.manipulators]
    manipulators[index] = manipulator
    setRule({ ...rule, manipulators })
  }

  const deleteManipulator = (index: number) => {
    const manipulators = rule.manipulators.filter((_, i) => i !== index)
    setRule({ ...rule, manipulators })
    if (expandedManipulator === index) {
      setExpandedManipulator(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {ruleIndex !== undefined ? 'Edit' : 'Add'} Complex Modification Rule
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-200">
              Rule Description
            </Label>
            <Input
              id="description"
              value={rule.description || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRule({ ...rule, description: e.target.value })
              }
              placeholder="e.g., Change Caps Lock to Escape when tapped, Control when held"
              className="mt-1 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Manipulators</h3>
              <Button size="sm" variant="ghost" onClick={addManipulator}>
                <Plus className="w-4 h-4 mr-1" />
                Add Manipulator
              </Button>
            </div>

            {rule.manipulators.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <p className="text-gray-600 dark:text-gray-400">No manipulators added yet</p>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-500">
                  Click "Add Manipulator" to create your first key mapping
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {rule.manipulators.map((manipulator, index) => (
                  <ManipulatorEditor
                    key={`manipulator-${index}-${manipulator.type}-${manipulator.from.key_code || manipulator.from.consumer_key_code || index}`}
                    manipulator={manipulator}
                    index={index}
                    isExpanded={expandedManipulator === index}
                    onToggle={() =>
                      setExpandedManipulator(expandedManipulator === index ? null : index)
                    }
                    onChange={m => updateManipulator(index, m)}
                    onDelete={() => deleteManipulator(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{ruleIndex !== undefined ? 'Update' : 'Add'} Rule</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ManipulatorEditorProps {
  manipulator: Manipulator
  index: number
  isExpanded: boolean
  onToggle: () => void
  onChange: (manipulator: Manipulator) => void
  onDelete: () => void
}

function ManipulatorEditor({
  manipulator,
  index,
  isExpanded,
  onToggle,
  onChange,
  onDelete
}: ManipulatorEditorProps) {
  const getSummary = () => {
    const from = manipulator.from as FromEvent
    const fromKey = from.key_code || from.consumer_key_code || from.pointing_button || 'Not set'
    const to = manipulator.to?.[0] as ToEvent | undefined
    const toKey = to?.key_code || to?.consumer_key_code || to?.shell_command || 'Not set'
    return `${fromKey} → ${toKey}`
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <button
        type="button"
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Manipulator {index + 1}
          </span>
          <Badge variant="outline">{getSummary()}</Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <Tabs defaultValue="from" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="from">From</TabsTrigger>
              <TabsTrigger value="to">To</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>

            <TabsContent value="from" className="mt-4">
              <FromEventEditor
                from={manipulator.from}
                onChange={from => onChange({ ...manipulator, from })}
              />
            </TabsContent>

            <TabsContent value="to" className="mt-4">
              <ToEventEditor
                to={manipulator.to || []}
                onChange={to => onChange({ ...manipulator, to })}
              />
            </TabsContent>

            <TabsContent value="conditions" className="mt-4">
              <ConditionsEditor
                conditions={manipulator.conditions || []}
                onChange={conditions => onChange({ ...manipulator, conditions })}
              />
            </TabsContent>

            <TabsContent value="options" className="mt-4">
              <ManipulatorOptionsEditor manipulator={manipulator} onChange={onChange} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

interface FromEventEditorProps {
  from: FromEvent
  onChange: (from: FromEvent) => void
}

function FromEventEditor({ from, onChange }: FromEventEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-700 dark:text-gray-300">Key Type</Label>
        <Select
          value={
            from.key_code
              ? 'key_code'
              : from.consumer_key_code
                ? 'consumer_key_code'
                : from.pointing_button
                  ? 'pointing_button'
                  : from.any || 'key_code'
          }
          onValueChange={type => {
            const newFrom: FromEvent = {}
            if (type === 'key_code') newFrom.key_code = ''
            else if (type === 'consumer_key_code') newFrom.consumer_key_code = ''
            else if (type === 'pointing_button') newFrom.pointing_button = ''
            else if (type === 'any') newFrom.any = 'key_code'
            onChange(newFrom)
          }}
        >
          <SelectTrigger className="mt-1 text-gray-900 dark:text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="key_code">Key Code</SelectItem>
            <SelectItem value="consumer_key_code">Consumer Key</SelectItem>
            <SelectItem value="pointing_button">Pointing Button</SelectItem>
            <SelectItem value="any">Any</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {from.key_code !== undefined && (
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Key Code</Label>
          <Select value={from.key_code} onValueChange={key_code => onChange({ ...from, key_code })}>
            <SelectTrigger className="mt-1 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select a key" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_KEY_CODES.map(key => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {from.consumer_key_code !== undefined && (
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Consumer Key Code</Label>
          <Select
            value={from.consumer_key_code}
            onValueChange={consumer_key_code => onChange({ ...from, consumer_key_code })}
          >
            <SelectTrigger className="mt-1 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="Select a consumer key" />
            </SelectTrigger>
            <SelectContent>
              {CONSUMER_KEY_CODES.map(key => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Modifiers</Label>
        <div className="mt-2 space-y-2">
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400">Mandatory</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {MODIFIER_KEYS.filter(m => !['any'].includes(m)).map(modifier => (
                <label key={modifier} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={from.modifiers?.mandatory?.includes(modifier) || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const mandatory = from.modifiers?.mandatory || []
                      const newMandatory = e.target.checked
                        ? [...mandatory, modifier]
                        : mandatory.filter(m => m !== modifier)
                      onChange({
                        ...from,
                        modifiers: {
                          ...from.modifiers,
                          mandatory: newMandatory.length > 0 ? newMandatory : undefined
                        }
                      })
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{modifier}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ToEventEditorProps {
  to: ToEvent[]
  onChange: (to: ToEvent[]) => void
}

function ToEventEditor({ to, onChange }: ToEventEditorProps) {
  const addToEvent = () => {
    onChange([...to, { key_code: '' }])
  }

  const updateToEvent = (index: number, event: ToEvent) => {
    const newTo = [...to]
    newTo[index] = event
    onChange(newTo)
  }

  const deleteToEvent = (index: number) => {
    onChange(to.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-gray-700 dark:text-gray-300">To Events</Label>
        <Button size="sm" variant="ghost" onClick={addToEvent}>
          <Plus className="w-4 h-4 mr-1" />
          Add Event
        </Button>
      </div>

      {to.length === 0 ? (
        <div className="text-center py-4 border-2 border-dashed rounded text-gray-500">
          <p className="text-sm">No events added</p>
        </div>
      ) : (
        <div className="space-y-2">
          {to.map((event, index) => (
            <div
              key={`to-event-${index}-${event.key_code || event.consumer_key_code || event.shell_command || index}`}
              className="flex items-start space-x-2 p-3 border rounded"
            >
              <div className="flex-1 space-y-2">
                <Select
                  value={
                    event.key_code
                      ? 'key_code'
                      : event.consumer_key_code
                        ? 'consumer_key_code'
                        : event.shell_command
                          ? 'shell_command'
                          : 'key_code'
                  }
                  onValueChange={type => {
                    const newEvent: ToEvent = {}
                    if (type === 'key_code') newEvent.key_code = ''
                    else if (type === 'consumer_key_code') newEvent.consumer_key_code = ''
                    else if (type === 'shell_command') newEvent.shell_command = ''
                    updateToEvent(index, newEvent)
                  }}
                >
                  <SelectTrigger className="text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="key_code">Key Code</SelectItem>
                    <SelectItem value="consumer_key_code">Consumer Key</SelectItem>
                    <SelectItem value="shell_command">Shell Command</SelectItem>
                  </SelectContent>
                </Select>

                {event.key_code !== undefined && (
                  <Select
                    value={event.key_code}
                    onValueChange={key_code => updateToEvent(index, { ...event, key_code })}
                  >
                    <SelectTrigger className="text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Select a key" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_KEY_CODES.map(key => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {event.shell_command !== undefined && (
                  <Input
                    value={event.shell_command}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateToEvent(index, { ...event, shell_command: e.target.value })
                    }
                    placeholder="e.g., open -a Safari"
                    className="text-gray-900 dark:text-gray-100"
                  />
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteToEvent(index)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ConditionsEditorProps {
  conditions: Condition[]
  onChange: (conditions: Condition[]) => void
}

function ConditionsEditor({ conditions, onChange }: ConditionsEditorProps) {
  const addCondition = () => {
    onChange([...conditions, { type: 'frontmost_application_if', bundle_identifiers: [] }])
  }

  const updateCondition = (index: number, condition: Condition) => {
    const newConditions = [...conditions]
    newConditions[index] = condition
    onChange(newConditions)
  }

  const deleteCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-gray-700 dark:text-gray-300">Conditions</Label>
        <Button size="sm" variant="ghost" onClick={addCondition}>
          <Plus className="w-4 h-4 mr-1" />
          Add Condition
        </Button>
      </div>

      {conditions.length === 0 ? (
        <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">No conditions added</p>
          <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">Conditions are optional</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conditions.map((condition, index) => (
            <div
              key={`condition-${index}-${condition.type}-${condition.bundle_identifiers?.[0] || index}`}
              className="flex items-start space-x-2 p-3 border rounded"
            >
              <div className="flex-1 space-y-2">
                <Select
                  value={condition.type}
                  onValueChange={type => updateCondition(index, { ...condition, type })}
                >
                  <SelectTrigger className="text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontmost_application_if">
                      Frontmost Application If
                    </SelectItem>
                    <SelectItem value="frontmost_application_unless">
                      Frontmost Application Unless
                    </SelectItem>
                    <SelectItem value="device_if">Device If</SelectItem>
                    <SelectItem value="keyboard_type_if">Keyboard Type If</SelectItem>
                  </SelectContent>
                </Select>

                {(condition.type === 'frontmost_application_if' ||
                  condition.type === 'frontmost_application_unless') && (
                  <Input
                    value={condition.bundle_identifiers?.join(', ') || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCondition(index, {
                        ...condition,
                        bundle_identifiers: e.target.value
                          .split(',')
                          .map((s: string) => s.trim())
                          .filter(Boolean)
                      })
                    }
                    placeholder="com.apple.Safari, com.google.Chrome"
                    className="text-gray-900 dark:text-gray-100"
                  />
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteCondition(index)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ManipulatorOptionsEditorProps {
  manipulator: Manipulator
  onChange: (manipulator: Manipulator) => void
}

function ManipulatorOptionsEditor({ manipulator, onChange }: ManipulatorOptionsEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type" className="text-gray-700 dark:text-gray-300">
          Manipulator Type
        </Label>
        <Select
          value={manipulator.type}
          onValueChange={type =>
            onChange({ ...manipulator, type: type as 'basic' | 'mouse_motion_to_scroll' })
          }
        >
          <SelectTrigger id="type" className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="mouse_motion_to_scroll">Mouse Motion to Scroll</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300">Additional Actions</Label>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>• to_if_alone: Execute when key is pressed and released quickly</p>
          <p>• to_if_held_down: Execute when key is held down</p>
          <p>• to_after_key_up: Execute after key is released</p>
          <p>• to_delayed_action: Execute after a delay</p>
        </div>
      </div>
    </div>
  )
}
