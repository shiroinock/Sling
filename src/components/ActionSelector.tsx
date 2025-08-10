import { Keyboard, Layers, MousePointer, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useLayerStore } from '@/store/layers'
import type { KeyAction, LayerAction } from '@/types/karabiner'
import { COMMON_KEY_CODES, MODIFIER_KEYS, TAP_HOLD_PRESETS } from '@/types/karabiner'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface ActionSelectorProps {
  currentAction?: LayerAction
  fromKey: string
  onSave: (action: LayerAction) => void
  onCancel: () => void
}

export function ActionSelector({ currentAction, fromKey, onSave, onCancel }: ActionSelectorProps) {
  // Initialize state from current action or defaults
  const [actionType, setActionType] = useState<LayerAction['type']>(currentAction?.type || 'simple')
  const [tapAction, setTapAction] = useState<KeyAction>(
    currentAction?.tap || { type: 'key', key: '' }
  )
  const [holdAction, setHoldAction] = useState<KeyAction>(
    currentAction?.hold || { type: 'key', key: '' }
  )
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const handlePresetSelect = (presetId: string) => {
    const preset = TAP_HOLD_PRESETS.find(p => p.id === presetId)
    if (preset) {
      setActionType(preset.action.type)
      setTapAction(preset.action.tap || { type: 'key', key: '' })
      setHoldAction(preset.action.hold || { type: 'none' })
      setSelectedPreset(presetId)
    }
  }

  const handleSave = () => {
    const action: LayerAction = {
      type: actionType,
      tap: actionType !== 'layer-momentary' ? tapAction : undefined,
      hold: actionType !== 'simple' ? holdAction : undefined
    }
    onSave(action)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Configure Action for {fromKey.toUpperCase()} Key
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Choose what happens when you tap or hold this key
        </p>
      </div>

      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presets">
            <Sparkles className="h-4 w-4 mr-2" />
            Popular Presets
          </TabsTrigger>
          <TabsTrigger value="custom">
            <MousePointer className="h-4 w-4 mr-2" />
            Custom Action
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-3 mt-4">
          <RadioGroup value={selectedPreset || ''} onValueChange={handlePresetSelect}>
            {TAP_HOLD_PRESETS.map(preset => (
              <Card
                key={preset.id}
                className={cn(
                  'cursor-pointer transition-colors',
                  selectedPreset === preset.id && 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                )}
                onClick={() => handlePresetSelect(preset.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value={preset.id} id={preset.id} />
                    <div className="flex-1">
                      <CardTitle className="text-base">{preset.name}</CardTitle>
                      <CardDescription className="mt-1">{preset.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {preset.examples && preset.examples.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {preset.examples.map(example => (
                        <Badge
                          key={`${preset.id}-${example}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </RadioGroup>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 mt-4">
          <div>
            <Label>Action Type</Label>
            <Select value={actionType} onValueChange={v => setActionType(v as LayerAction['type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    Simple Key Mapping
                  </div>
                </SelectItem>
                <SelectItem value="mod-tap">
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-4 w-4" />
                    Mod-Tap (Tap for key, Hold for modifier)
                  </div>
                </SelectItem>
                <SelectItem value="layer-tap">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Layer-Tap (Tap for key, Hold for layer)
                  </div>
                </SelectItem>
                <SelectItem value="layer-momentary">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Momentary Layer (Hold to activate)
                  </div>
                </SelectItem>
                <SelectItem value="layer-toggle">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Toggle Layer (Press to toggle on/off)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tap Action Configuration */}
          {actionType !== 'layer-momentary' && (
            <div className="space-y-3">
              <Label>When Tapped</Label>
              <ActionConfig
                action={tapAction}
                onChange={setTapAction}
                showLayerOptions={actionType === 'layer-toggle'}
              />
            </div>
          )}

          {/* Hold Action Configuration */}
          {(actionType === 'mod-tap' ||
            actionType === 'layer-tap' ||
            actionType === 'layer-momentary') && (
            <div className="space-y-3">
              <Label>When Held</Label>
              <ActionConfig
                action={holdAction}
                onChange={setHoldAction}
                showLayerOptions={actionType === 'layer-tap' || actionType === 'layer-momentary'}
                showModifierOptions={actionType === 'mod-tap'}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Preview */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Preview</h4>
        <div className="space-y-1 text-sm">
          {actionType === 'simple' && tapAction.type === 'key' && (
            <p className="text-gray-600 dark:text-gray-400">
              Press → Send "{tapAction.key || '(not set)'}"
            </p>
          )}
          {actionType === 'mod-tap' && (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                Tap → Send "{tapAction.key || '(not set)'}"
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Hold → Act as {holdAction.modifiers?.join(' + ') || '(not set)'}
              </p>
            </>
          )}
          {actionType === 'layer-tap' && (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                Tap → Send "{tapAction.key || '(not set)'}"
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Hold → Activate Layer {holdAction.layer ?? '(not set)'}
              </p>
            </>
          )}
          {actionType === 'layer-momentary' && (
            <p className="text-gray-600 dark:text-gray-400">
              Hold → Activate Layer {holdAction.layer ?? '(not set)'} (while held)
            </p>
          )}
          {actionType === 'layer-toggle' && (
            <p className="text-gray-600 dark:text-gray-400">
              Press → Toggle Layer {tapAction.layer ?? '(not set)'}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Action</Button>
      </div>
    </div>
  )
}

interface ActionConfigProps {
  action: KeyAction
  onChange: (action: KeyAction) => void
  showLayerOptions?: boolean
  showModifierOptions?: boolean
}

function ActionConfig({
  action,
  onChange,
  showLayerOptions,
  showModifierOptions
}: ActionConfigProps) {
  const { layerConfiguration } = useLayerStore()

  if (showLayerOptions) {
    return (
      <Select
        value={action.layer?.toString() || '0'}
        onValueChange={v => onChange({ ...action, type: 'layer', layer: v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select layer" />
        </SelectTrigger>
        <SelectContent>
          {layerConfiguration?.layers?.map(layer => (
            <SelectItem key={layer.id} value={layer.id.toString()}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                {layer.name} (Layer {layer.id})
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (showModifierOptions) {
    return (
      <div className="space-y-2">
        <Label className="text-xs">Select Modifiers</Label>
        <div className="flex flex-wrap gap-2">
          {MODIFIER_KEYS.map(mod => (
            <Badge
              key={mod}
              variant={action.modifiers?.includes(mod) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                const current = action.modifiers || []
                const updated = current.includes(mod)
                  ? current.filter(m => m !== mod)
                  : [...current, mod]
                onChange({ ...action, type: 'modifier', modifiers: updated })
              }}
            >
              {mod.replace('left_', '').replace('right_', '').toUpperCase()}
            </Badge>
          ))}
        </div>
      </div>
    )
  }

  // Default: Key selection
  return (
    <Select
      value={action.key || 'none'}
      onValueChange={v => onChange({ ...action, type: 'key', key: v })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select key" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <X className="h-4 w-4 mr-2 inline" />
          None (Do nothing)
        </SelectItem>
        {COMMON_KEY_CODES.map(key => (
          <SelectItem key={key} value={key}>
            {key.replace(/_/g, ' ').toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
