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

  // Create SimpleModifications for ALL mappings with appropriate display labels
  const simpleModifications: SimpleModification[] = layer.mappings.map(mapping => {
    const action = mapping.action
    let toKeyCode = ''

    // Determine what to display as the mapped key
    switch (action.type) {
      case 'simple':
        toKeyCode = action.tap?.key || mapping.from
        break
      case 'mod-tap': {
        const tapKey = action.tap?.key || '?'
        const modifiers =
          action.hold?.modifiers
            ?.map(m => m.replace('left_', '').replace('right_', '').charAt(0).toUpperCase())
            .join('') || '?'
        toKeyCode = `${tapKey}/${modifiers}`
        break
      }
      case 'layer-tap': {
        const tapKey = action.tap?.key || '?'
        const layerNum = action.hold?.layer ? getLayerDisplayNumber(action.hold.layer) : '?'
        toKeyCode = `${tapKey}/L${layerNum}`
        break
      }
      case 'layer-momentary': {
        const layerId = action.hold?.layer ?? action.tap?.layer
        const layerNum = layerId ? getLayerDisplayNumber(layerId) : '?'
        toKeyCode = `MO(${layerNum})`
        break
      }
      case 'layer-toggle': {
        const layerId = action.tap?.layer ?? action.hold?.layer
        const layerNum = layerId ? getLayerDisplayNumber(layerId) : '?'
        toKeyCode = `TG(${layerNum})`
        break
      }
      default:
        toKeyCode = mapping.from
    }

    return {
      from: { key_code: mapping.from },
      to: [{ key_code: toKeyCode }]
    }
  })

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
