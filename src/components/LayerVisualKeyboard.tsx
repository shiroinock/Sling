import { Hash, Layers, MousePointer } from 'lucide-react'
import { useState } from 'react'
import type { LayoutType } from '@/data/keyboardLayouts'
import { getLayout } from '@/data/keyboardLayouts'
import { cn } from '@/lib/utils'
import { useLayerStore } from '@/store/layers'
import type { LayerMapping } from '@/types/karabiner'
import { Key } from './keyboard/Key'
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
  const keyboardLayout = getLayout(layout)
  const { layerConfiguration, addMapping, updateMapping, getMappingForKey, getLayerDisplayNumber } =
    useLayerStore()

  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)

  const layer = layerConfiguration.layers.find(l => l.id === layerId)
  if (!layer) return null

  // Create a map of mappings for quick lookup
  const mappingsMap = new Map<string, LayerMapping>()
  layer.mappings.forEach(mapping => {
    mappingsMap.set(mapping.from, mapping)
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

  const getKeyLabel = (mapping: LayerMapping): string => {
    const action = mapping.action

    switch (action.type) {
      case 'simple':
        return action.tap?.key || '?'
      case 'mod-tap':
        return `${action.tap?.key || '?'}/${action.hold?.modifiers?.join('+') || '?'}`
      case 'layer-tap': {
        const layerNum = action.hold?.layer ? getLayerDisplayNumber(action.hold.layer) : '?'
        return `${action.tap?.key || '?'}/L${layerNum}`
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
        return '?'
    }
  }

  const getKeyBadgeType = (mapping: LayerMapping) => {
    switch (mapping.action.type) {
      case 'mod-tap':
        return { icon: MousePointer, color: 'bg-blue-500' }
      case 'layer-tap':
      case 'layer-momentary':
      case 'layer-toggle':
        return { icon: Layers, color: 'bg-green-500' }
      default:
        return { icon: Hash, color: 'bg-gray-500' }
    }
  }

  // Calculate keyboard dimensions
  const keyboardWidth = keyboardLayout.width * 60
  const keyboardHeight = keyboardLayout.height * 60 + 40

  return (
    <>
      <div
        className={cn(
          'relative bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-inner',
          className
        )}
        style={{
          width: `${keyboardWidth + 32}px`,
          minHeight: `${keyboardHeight + 32}px`
        }}
      >
        {/* Layer indicator */}
        <div className="absolute top-2 left-2">
          <Badge
            variant="outline"
            className="gap-1"
            style={{ borderColor: layer.color, color: layer.color }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
            Layer {getLayerDisplayNumber(layerId)}
          </Badge>
        </div>

        {/* Layout name */}
        <div className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400">
          {keyboardLayout.name}
        </div>

        {/* Keyboard rows */}
        <div className="relative">
          {keyboardLayout.rows.map((row, rowIndex) => {
            const rowY = (row.y || rowIndex) * 60 // 60px per unit

            return (
              <div
                key={`row-${row.y || rowIndex}-${row.keys[0]?.keyCode || row.keys[0]?.label || rowIndex}`}
                className="absolute flex gap-1"
                style={{
                  top: `${rowY}px`,
                  left: 0
                }}
              >
                {row.keys.map((keyData, keyIndex) => {
                  const keyX =
                    keyData.x !== undefined
                      ? keyData.x * 60
                      : row.keys
                          .slice(0, keyIndex)
                          .reduce((acc, k) => acc + (k.width || 1) * 60 + 1, 0) // +1 for gap

                  const keyCode =
                    keyData.keyCode || keyData.label.toLowerCase().replace(/\s+/g, '_')
                  const mapping = mappingsMap.get(keyCode)
                  const badgeInfo = mapping ? getKeyBadgeType(mapping) : null

                  return (
                    <div
                      key={`key-${keyCode}`}
                      className="absolute"
                      style={{
                        left: `${keyX}px`,
                        top: keyData.y ? `${keyData.y * 60}px` : 0
                      }}
                    >
                      <Key
                        keyData={keyData}
                        isSelected={selectedKey === keyCode}
                        isMapped={!!mapping}
                        mappedTo={mapping ? getKeyLabel(mapping) : undefined}
                        onClick={() => handleKeyClick(keyCode)}
                        highlighted={!!mapping}
                      />

                      {/* Badge indicator for special keys */}
                      {badgeInfo && (
                        <div className="absolute -top-1 -right-1 z-10 pointer-events-none">
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full flex items-center justify-center',
                              badgeInfo.color
                            )}
                          >
                            <badgeInfo.icon className="h-2.5 w-2.5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Mapping count */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400">
          {layer.mappings.length} mapping{layer.mappings.length !== 1 ? 's' : ''} configured
        </div>
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
