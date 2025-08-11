import { useState } from 'react'
import type { LayoutType } from '@/data/keyboardLayouts'
import { useLayerStore } from '@/store/layers'
import type { LayerMapping, SimpleModification } from '@/types/karabiner'
import { VisualKeyboard } from './keyboard/VisualKeyboard'
import { LayerActionSelector } from './LayerActionSelector'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

interface LayerVisualKeyboardProps {
  layout?: LayoutType
  layerId: string
  className?: string
  onMappingChange?: () => void
}

export function LayerVisualKeyboard({
  layout = 'macbook-us',
  layerId,
  className,
  onMappingChange
}: LayerVisualKeyboardProps) {
  const { layerConfiguration, addMapping, updateMapping, getMappingForKey, getLayerDisplayNumber } =
    useLayerStore()

  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)

  const layer = layerConfiguration.layers.find(l => l.id === layerId)
  if (!layer) return null

  // Convert layer mappings to simple modifications format for visualization
  const simpleModifications: SimpleModification[] = layer.mappings.map(mapping => {
    const toKeyCode = getKeyCodeFromMapping(mapping)
    return {
      from: { key_code: mapping.from },
      to: [{ key_code: toKeyCode }]
    }
  })

  const handleKeyClick = (keyCode: string) => {
    console.log('Key clicked:', keyCode)
    setSelectedKey(keyCode)
    setIsActionDialogOpen(true)
  }

  const handleActionSave = (action: LayerMapping['action']) => {
    if (!selectedKey) return

    const newMapping: LayerMapping = {
      from: selectedKey,
      action
    }

    const existingMapping = getMappingForKey(layerId, selectedKey)
    if (existingMapping) {
      updateMapping(layerId, selectedKey, newMapping)
    } else {
      addMapping(layerId, newMapping)
    }

    setIsActionDialogOpen(false)
    setSelectedKey(null)
    onMappingChange?.()
  }

  const getKeyCodeFromMapping = (mapping: LayerMapping): string => {
    const action = mapping.action

    switch (action.type) {
      case 'simple':
        return action.tap?.key || '(unmapped)'
      case 'mod-tap': {
        const tapKey = action.tap?.key || '(no key)'
        const modifiers = action.hold?.modifiers?.join('+') || '(no mods)'
        return `${tapKey}/${modifiers}`
      }
      case 'layer-tap': {
        const tapKey = action.tap?.key || '(no key)'
        const layerNum = action.hold?.layer ? getLayerDisplayNumber(action.hold.layer) : '?'
        return `${tapKey}/L${layerNum}`
      }
      case 'layer-momentary': {
        const layerId = action.hold?.layer ?? action.tap?.layer
        const layerNum = layerId ? getLayerDisplayNumber(layerId) : '?'
        return `MO(${layerNum})`
      }
      case 'layer-toggle': {
        const layerId = action.tap?.layer ?? action.hold?.layer
        const layerNum = layerId ? getLayerDisplayNumber(layerId) : '?'
        return `TG(${layerNum})`
      }
      default:
        return '(invalid)'
    }
  }

  return (
    <>
      <div className={className}>
        {/* Layer indicator */}
        <div className="mb-2">
          <Badge
            variant="outline"
            className="gap-1"
            style={{ borderColor: layer.color, color: layer.color }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
            Layer {getLayerDisplayNumber(layerId)}
            <span className="ml-2 text-gray-500">
              ({layer.mappings.length} mapping{layer.mappings.length !== 1 ? 's' : ''})
            </span>
          </Badge>
        </div>

        {/* Visual Keyboard */}
        <VisualKeyboard
          layout={layout}
          simpleModifications={simpleModifications}
          onKeyClick={handleKeyClick}
          mode="view"
        />
      </div>

      {/* Action configuration dialog */}
      {isActionDialogOpen && selectedKey && (
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configure Key Mapping</DialogTitle>
            </DialogHeader>
            <LayerActionSelector
              fromKey={selectedKey}
              currentAction={getMappingForKey(layerId, selectedKey)?.action}
              onSave={handleActionSave}
              onCancel={() => {
                setIsActionDialogOpen(false)
                setSelectedKey(null)
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
