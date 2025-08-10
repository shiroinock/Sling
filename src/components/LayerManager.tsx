import { ArrowRight, Layers, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { useState } from 'react'
import { useLayerStore } from '@/store/layers'
import type { LayerMapping, LayerAction } from '@/types/karabiner'
import { COMMON_KEY_CODES, MODIFIER_KEYS } from '@/types/karabiner'
import { LayerActionSelector } from './LayerActionSelector'
import { LayerVisualKeyboard } from './LayerVisualKeyboard'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface LayerManagerProps {
  keyboardLayout?: any
}

export function LayerManager({ keyboardLayout = 'macbook-us' }: LayerManagerProps) {
  const { layerConfiguration, selectedLayerId, addLayer, deleteLayer, selectLayer, addMapping, updateMapping, deleteMapping, getMappingForKey, getLayerDisplayNumber } = useLayerStore()
  const [activeTab, setActiveTab] = useState(layerConfiguration.layers[0]?.id || '')
  const [editingMapping, setEditingMapping] = useState<{ layerId: string; fromKey: string } | null>(null)
  const [isAddingMapping, setIsAddingMapping] = useState<{ layerId: string } | null>(null)
  const [newMappingKey, setNewMappingKey] = useState('')
  const [inlineEditingKey, setInlineEditingKey] = useState<{ layerId: string; fromKey: string } | null>(null)
  const [inlineEditAction, setInlineEditAction] = useState<string>('')

  const handleAddLayer = () => {
    addLayer()
    // Select the newly added layer
    const newLayer = layerConfiguration.layers[layerConfiguration.layers.length - 1]
    if (newLayer) {
      selectLayer(newLayer.id)
      setActiveTab(newLayer.id)
    }
  }

  const handleDeleteLayer = (layerId: string) => {
    const displayNum = getLayerDisplayNumber(layerId)
    // Can't delete Layer 0 (base layer)
    if (displayNum === 0) return
    
    if (confirm(`Delete Layer ${displayNum}?`)) {
      deleteLayer(layerId)
      if (selectedLayerId === layerId) {
        const baseLayer = layerConfiguration.layers[0]
        if (baseLayer) {
          selectLayer(baseLayer.id)
          setActiveTab(baseLayer.id)
        }
      }
    }
  }

  const handleAddMapping = (layerId: string) => {
    setIsAddingMapping({ layerId })
    setNewMappingKey('')
  }

  const handleSaveNewMapping = (action: LayerMapping['action']) => {
    if (!isAddingMapping || !newMappingKey) return

    const newMapping: LayerMapping = {
      from: newMappingKey,
      action
    }

    addMapping(isAddingMapping.layerId, newMapping)
    setIsAddingMapping(null)
    setNewMappingKey('')
  }

  const handleEditMapping = (layerId: string, fromKey: string) => {
    setEditingMapping({ layerId, fromKey })
  }

  const handleInlineEdit = (layerId: string, fromKey: string) => {
    const mapping = getMappingForKey(layerId, fromKey)
    if (mapping) {
      const action = mapping.action
      let actionValue = ''
      if (action.type === 'simple' && action.tap?.key) {
        actionValue = action.tap.key
      } else if (action.type === 'mod-tap' && action.tap?.key) {
        actionValue = `mod_${action.tap.key}`
      } else if (action.type === 'layer-tap' && action.hold?.layer) {
        actionValue = `layer_tap_${action.hold.layer}`
      } else if (action.type === 'layer-momentary' && (action.hold?.layer || action.tap?.layer)) {
        actionValue = `layer_mo_${action.hold?.layer || action.tap?.layer}`
      } else if (action.type === 'layer-toggle' && (action.tap?.layer || action.hold?.layer)) {
        actionValue = `layer_tg_${action.tap?.layer || action.hold?.layer}`
      }
      setInlineEditAction(actionValue)
      setInlineEditingKey({ layerId, fromKey })
    }
  }

  const handleInlineSave = () => {
    if (!inlineEditingKey || !inlineEditAction) return

    let action: LayerAction
    if (inlineEditAction.startsWith('mod_')) {
      // Mod-tap with default modifiers
      const key = inlineEditAction.replace('mod_', '')
      action = {
        type: 'mod-tap',
        tap: { type: 'key', key },
        hold: { type: 'modifier', modifiers: ['left_control'] }
      }
    } else if (inlineEditAction.startsWith('layer_tap_')) {
      const layerId = inlineEditAction.replace('layer_tap_', '')
      action = {
        type: 'layer-tap',
        tap: { type: 'key', key: 'space_bar' }, // Default tap key
        hold: { type: 'layer', layer: layerId }
      }
    } else if (inlineEditAction.startsWith('layer_mo_')) {
      const layerId = inlineEditAction.replace('layer_mo_', '')
      action = {
        type: 'layer-momentary',
        hold: { type: 'layer', layer: layerId }
      }
    } else if (inlineEditAction.startsWith('layer_tg_')) {
      const layerId = inlineEditAction.replace('layer_tg_', '')
      action = {
        type: 'layer-toggle',
        tap: { type: 'layer', layer: layerId }
      }
    } else {
      // Simple key mapping
      action = {
        type: 'simple',
        tap: { type: 'key', key: inlineEditAction }
      }
    }

    updateMapping(inlineEditingKey.layerId, inlineEditingKey.fromKey, {
      from: inlineEditingKey.fromKey,
      action
    })
    setInlineEditingKey(null)
    setInlineEditAction('')
  }

  const handleInlineCancel = () => {
    setInlineEditingKey(null)
    setInlineEditAction('')
  }

  const handleSaveEditMapping = (action: LayerMapping['action']) => {
    if (!editingMapping) return

    const updatedMapping: LayerMapping = {
      from: editingMapping.fromKey,
      action
    }

    updateMapping(editingMapping.layerId, editingMapping.fromKey, updatedMapping)
    setEditingMapping(null)
  }

  const handleDeleteMapping = (layerId: string, fromKey: string) => {
    if (confirm(`Delete mapping for ${fromKey}?`)) {
      deleteMapping(layerId, fromKey)
    }
  }

  const getActionDescription = (action: LayerMapping['action']): string => {
    switch (action.type) {
      case 'simple':
        return action.tap?.key || '(none)'
      case 'mod-tap':
        return `${action.tap?.key || '?'} / ${action.hold?.modifiers?.join('+') || '?'}`
      case 'layer-tap': {
        const layerNum = action.hold?.layer ? getLayerDisplayNumber(action.hold.layer) : '?'
        return `${action.tap?.key || '?'} / Layer ${layerNum}`
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Keyboard Layers</h2>
        <Button size="sm" className="gap-2" onClick={handleAddLayer}>
          <Plus className="h-4 w-4" />
          Add Layer
        </Button>
      </div>

      {layerConfiguration.layers.length > 0 && (
        <Tabs
          value={activeTab}
          onValueChange={value => {
            setActiveTab(value)
            selectLayer(value)
          }}
        >
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            {layerConfiguration.layers.map((layer, index) => (
              <TabsTrigger
                key={layer.id}
                value={layer.id}
                className="relative pr-8 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950"
              >
                <span className="flex items-center gap-2">
                  Layer {index}
                  {layer.mappings.length > 0 && (
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      ({layer.mappings.length})
                    </span>
                  )}
                </span>
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteLayer(layer.id)
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {layerConfiguration.layers.map((layer, index) => (
            <TabsContent key={layer.id} value={layer.id} className="space-y-6">
              {/* Visual Keyboard */}
              <div className="flex justify-center">
                <LayerVisualKeyboard 
                  layerId={layer.id} 
                  layout={keyboardLayout}
                />
              </div>

              {/* Mapping List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-gray-500" />
                      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                        Layer {index} Mappings
                      </h3>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddMapping(layer.id)}
                      className="gap-2"
                    >
                      <Plus className="h-3 w-3" />
                      Add Mapping
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {layer.mappings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No mappings configured. Click a key on the keyboard or "Add Mapping" to create one.
                    </div>
                  ) : (
                    layer.mappings.map(mapping => {
                      const isEditing = inlineEditingKey?.layerId === layer.id && inlineEditingKey?.fromKey === mapping.from
                      return (
                        <div
                          key={mapping.from}
                          className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
                                {mapping.from.toUpperCase()}
                              </span>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                              {isEditing ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Select
                                    value={inlineEditAction}
                                    onValueChange={setInlineEditAction}
                                  >
                                    <SelectTrigger className="w-[300px]">
                                      <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                      {/* Common Keys */}
                                      <div className="px-2 py-1 text-xs font-semibold text-gray-500">Keys</div>
                                      {COMMON_KEY_CODES.slice(0, 10).map(key => (
                                        <SelectItem key={key} value={key}>
                                          {key.replace(/_/g, ' ').toUpperCase()}
                                        </SelectItem>
                                      ))}
                                      {/* Layer Actions */}
                                      <div className="px-2 py-1 text-xs font-semibold text-gray-500">Layer Actions</div>
                                      {layerConfiguration.layers.map((l, idx) => (
                                        <div key={l.id}>
                                          {idx !== 0 && (
                                            <>
                                              <SelectItem value={`layer_mo_${l.id}`}>
                                                MO({idx}) - Momentary Layer {idx}
                                              </SelectItem>
                                              <SelectItem value={`layer_tg_${l.id}`}>
                                                TG({idx}) - Toggle Layer {idx}
                                              </SelectItem>
                                            </>
                                          )}
                                        </div>
                                      ))}
                                      {/* Mod-Tap */}
                                      <div className="px-2 py-1 text-xs font-semibold text-gray-500">Mod-Tap</div>
                                      {['a', 's', 'd', 'f'].map(key => (
                                        <SelectItem key={`mod_${key}`} value={`mod_${key}`}>
                                          MT({key.toUpperCase()}) - Tap {key.toUpperCase()} / Hold Ctrl
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleInlineSave}
                                    className="p-1"
                                  >
                                    <Check className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleInlineCancel}
                                    className="p-1"
                                  >
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              ) : (
                                <span 
                                  className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                  onClick={() => handleInlineEdit(layer.id, mapping.from)}
                                >
                                  {getActionDescription(mapping.action)}
                                </span>
                              )}
                            </div>
                          </div>
                          {!isEditing && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditMapping(layer.id, mapping.from)}
                                className="p-1"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 p-1"
                                onClick={() => handleDeleteMapping(layer.id, mapping.from)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Add Mapping Dialog */}
      {isAddingMapping && (
        <Dialog open={!!isAddingMapping} onOpenChange={() => setIsAddingMapping(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Mapping</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  From Key
                </label>
                <input
                  type="text"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  placeholder="Enter key code (e.g., caps_lock, a, f1)"
                  value={newMappingKey}
                  onChange={e => setNewMappingKey(e.target.value)}
                />
              </div>
              {newMappingKey && (
                <LayerActionSelector
                  fromKey={newMappingKey}
                  onSave={handleSaveNewMapping}
                  onCancel={() => setIsAddingMapping(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Mapping Dialog */}
      {editingMapping && (
        <Dialog open={!!editingMapping} onOpenChange={() => setEditingMapping(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Mapping</DialogTitle>
            </DialogHeader>
            <LayerActionSelector
              fromKey={editingMapping.fromKey}
              currentAction={getMappingForKey(editingMapping.layerId, editingMapping.fromKey)?.action}
              onSave={handleSaveEditMapping}
              onCancel={() => setEditingMapping(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}