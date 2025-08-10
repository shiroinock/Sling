import { Keyboard, Layers, MousePointer, ToggleLeft, X } from 'lucide-react'
import { useState } from 'react'
import { useLayerStore } from '@/store/layers'
import type { LayerAction } from '@/types/karabiner'
import { COMMON_KEY_CODES, MODIFIER_KEYS } from '@/types/karabiner'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

interface LayerActionSelectorProps {
  currentAction?: LayerAction
  fromKey: string
  onSave: (action: LayerAction) => void
  onCancel: () => void
}

export function LayerActionSelector({ currentAction, onSave, onCancel }: LayerActionSelectorProps) {
  const [actionType, setActionType] = useState<LayerAction['type']>(currentAction?.type || 'simple')
  const [tapKey, setTapKey] = useState<string>(currentAction?.tap?.key || 'none')
  const [holdModifiers, setHoldModifiers] = useState<string[]>(currentAction?.hold?.modifiers || [])
  const [holdLayer, setHoldLayer] = useState<string>(currentAction?.hold?.layer || '')
  const [tapLayer, setTapLayer] = useState<string>(currentAction?.tap?.layer || '')

  const { layerConfiguration, getLayerDisplayNumber } = useLayerStore()

  const handleSave = () => {
    const action: LayerAction = {
      type: actionType,
      tap:
        actionType !== 'layer-momentary'
          ? actionType === 'layer-toggle'
            ? { type: 'layer', layer: tapLayer }
            : { type: 'key', key: tapKey === 'none' ? '' : tapKey }
          : undefined,
      hold:
        actionType !== 'simple'
          ? actionType === 'mod-tap'
            ? { type: 'modifier', modifiers: holdModifiers }
            : { type: 'layer', layer: holdLayer || tapLayer }
          : undefined
    }
    onSave(action)
  }

  // Get display number for layer preview
  const getLayerPreviewNumber = (layerId: string): string => {
    if (!layerId) return '(not set)'
    const displayNum = getLayerDisplayNumber(layerId)
    return `Layer ${displayNum}`
  }

  const toggleModifier = (mod: string) => {
    setHoldModifiers(prev => (prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]))
  }

  return (
    <div className="space-y-4">
      {/* Action Type Selection using Tabs */}
      <Tabs value={actionType} onValueChange={v => setActionType(v as LayerAction['type'])}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="simple" className="text-xs">
            <Keyboard className="h-3 w-3 mr-1" />
            Simple
          </TabsTrigger>
          <TabsTrigger value="mod-tap" className="text-xs">
            <MousePointer className="h-3 w-3 mr-1" />
            Mod-Tap
          </TabsTrigger>
          <TabsTrigger value="layer-tap" className="text-xs">
            <Layers className="h-3 w-3 mr-1" />
            Layer-Tap
          </TabsTrigger>
          <TabsTrigger value="layer-momentary" className="text-xs">
            <Layers className="h-3 w-3 mr-1" />
            Momentary
          </TabsTrigger>
          <TabsTrigger value="layer-toggle" className="text-xs">
            <ToggleLeft className="h-3 w-3 mr-1" />
            Toggle
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tap Action */}
      {actionType !== 'layer-momentary' && (
        <div className="space-y-2">
          <Label>{actionType === 'layer-toggle' ? 'Toggle Layer' : 'When Tapped'}</Label>
          {actionType === 'layer-toggle' ? (
            <Select value={tapLayer} onValueChange={setTapLayer}>
              <SelectTrigger>
                <SelectValue placeholder="Select layer" />
              </SelectTrigger>
              <SelectContent>
                {layerConfiguration?.layers?.map((layer, index) => (
                  <SelectItem key={layer.id} value={layer.id}>
                    Layer {index}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select value={tapKey} onValueChange={setTapKey}>
              <SelectTrigger>
                <SelectValue placeholder="Select key" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <X className="h-4 w-4 mr-2 inline" />
                  None
                </SelectItem>
                {COMMON_KEY_CODES.map(key => (
                  <SelectItem key={key} value={key}>
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Hold Action */}
      {(actionType === 'mod-tap' ||
        actionType === 'layer-tap' ||
        actionType === 'layer-momentary') && (
        <div className="space-y-2">
          <Label>When Held</Label>
          {actionType === 'mod-tap' ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {MODIFIER_KEYS.filter(
                  m => !['any', 'command', 'control', 'option', 'shift'].includes(m)
                ).map(mod => (
                  <Badge
                    key={mod}
                    variant="outline"
                    className={`cursor-pointer transition-all ${
                      holdModifiers.includes(mod)
                        ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => toggleModifier(mod)}
                  >
                    {holdModifiers.includes(mod) && '✓ '}
                    {mod.replace('left_', '').replace('right_', '').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <Select value={holdLayer} onValueChange={setHoldLayer}>
              <SelectTrigger>
                <SelectValue placeholder="Select layer" />
              </SelectTrigger>
              <SelectContent>
                {layerConfiguration?.layers?.map((layer, index) => (
                  <SelectItem key={layer.id} value={layer.id}>
                    Layer {index}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Preview */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Preview</h4>
        <div className="space-y-1 text-sm">
          {actionType === 'simple' && (
            <p className="text-gray-600 dark:text-gray-400">
              Press → {tapKey === 'none' ? '(none)' : tapKey.replace(/_/g, ' ').toUpperCase()}
            </p>
          )}
          {actionType === 'mod-tap' && (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                Tap → {tapKey === 'none' ? '(none)' : tapKey.replace(/_/g, ' ').toUpperCase()}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Hold →{' '}
                {holdModifiers.length > 0
                  ? holdModifiers
                      .map(m => m.replace('left_', '').replace('right_', '').toUpperCase())
                      .join(' + ')
                  : '(no modifiers)'}
              </p>
            </>
          )}
          {actionType === 'layer-tap' && (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                Tap → {tapKey === 'none' ? '(none)' : tapKey.replace(/_/g, ' ').toUpperCase()}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Hold → Activate {getLayerPreviewNumber(holdLayer)}
              </p>
            </>
          )}
          {actionType === 'layer-momentary' && (
            <p className="text-gray-600 dark:text-gray-400">
              Hold → Activate {getLayerPreviewNumber(holdLayer)} (while held)
            </p>
          )}
          {actionType === 'layer-toggle' && (
            <p className="text-gray-600 dark:text-gray-400">
              Press → Toggle {getLayerPreviewNumber(tapLayer)}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}
