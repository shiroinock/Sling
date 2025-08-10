import type { LayerConfiguration, LayerMapping, Manipulator, Rule } from '@/types/karabiner'

/**
 * Convert layer configuration to Karabiner complex modification rules
 * Implementation pattern:
 * 1. Layer activation keys are separate from layer mappings
 * 2. Each layer has its own rule with conditions
 * 3. Base layer mappings without layer-switch actions go last
 */
export function convertLayersToKarabinerRules(layerConfig: LayerConfiguration): Rule[] {
  const rules: Rule[] = []
  
  // Create a map from layer ID to index for simpler variable names
  const layerIndexMap = new Map<string, number>()
  layerConfig.layers.forEach((layer, index) => {
    layerIndexMap.set(layer.id, index)
  })
  
  // Helper to get simple variable name for layers
  const getSimpleLayerVariableName = (layerId: string): string => {
    const index = layerIndexMap.get(layerId) ?? 0
    return `layer_${index}`
  }
  
  // First, collect all layer activation manipulators (layer-tap, layer-momentary, layer-toggle)
  const activationManipulators: Manipulator[] = []
  
  layerConfig.layers.forEach(sourceLayer => {
    sourceLayer.mappings.forEach(mapping => {
      // Layer-tap implementation
      if (mapping.action.type === 'layer-tap') {
        const targetLayerId = mapping.action.hold?.layer
        if (targetLayerId) {
          activationManipulators.push({
            type: 'basic',
            from: {
              key_code: mapping.from,
              modifiers: {
                optional: ['any']
              }
            },
            to: [
              {
                set_variable: {
                  name: getSimpleLayerVariableName(targetLayerId),
                  value: 1 // Use number, not string
                }
              }
            ],
            to_after_key_up: [
              {
                set_variable: {
                  name: getSimpleLayerVariableName(targetLayerId),
                  value: 0 // Use number, not string
                }
              }
            ],
            to_if_alone: [
              {
                key_code: mapping.action.tap?.key || 'vk_none'
              }
            ],
            parameters: {
              'basic.to_if_alone_timeout_milliseconds': 500
            }
          })
        }
      }
      
      // Layer-momentary implementation
      else if (mapping.action.type === 'layer-momentary') {
        const targetLayerId = mapping.action.hold?.layer || mapping.action.tap?.layer
        if (targetLayerId) {
          activationManipulators.push({
            type: 'basic',
            from: {
              key_code: mapping.from,
              modifiers: {
                optional: ['any']
              }
            },
            to: [
              {
                set_variable: {
                  name: getSimpleLayerVariableName(targetLayerId),
                  value: 1 // Use number, not string
                }
              }
            ],
            to_after_key_up: [
              {
                set_variable: {
                  name: getSimpleLayerVariableName(targetLayerId),
                  value: 0 // Use number, not string
                }
              }
            ]
          })
        }
      }
      
      // Layer-toggle implementation
      else if (mapping.action.type === 'layer-toggle') {
        const targetLayerId = mapping.action.tap?.layer || mapping.action.hold?.layer
        if (targetLayerId) {
          // Toggle ON rule (when layer is off)
          activationManipulators.push({
            type: 'basic',
            from: {
              key_code: mapping.from,
              modifiers: {
                optional: ['any']
              }
            },
            to: [
              {
                set_variable: {
                  name: getSimpleLayerVariableName(targetLayerId),
                  value: 1 // Use number, not string
                }
              }
            ],
            conditions: [
              {
                type: 'variable_unless',
                name: getSimpleLayerVariableName(targetLayerId),
                value: 1
              }
            ]
          })
          
          // Toggle OFF rule (when layer is on)
          activationManipulators.push({
            type: 'basic',
            from: {
              key_code: mapping.from,
              modifiers: {
                optional: ['any']
              }
            },
            to: [
              {
                set_variable: {
                  name: getSimpleLayerVariableName(targetLayerId),
                  value: 0 // Use number, not string
                }
              }
            ],
            conditions: [
              {
                type: 'variable_if',
                variable_if: {
                  name: getSimpleLayerVariableName(targetLayerId),
                  value: 1
                }
              }
            ]
          })
        }
      }
    })
  })
  
  // Add layer activation rule if there are any activators
  if (activationManipulators.length > 0) {
    rules.push({
      description: 'Layer Activations',
      manipulators: activationManipulators
    })
  }
  
  // Then add layer-specific mappings (non-base layers first, in reverse order)
  // Skip layer 0 (base layer) for now
  for (let i = layerConfig.layers.length - 1; i > 0; i--) {
    const layer = layerConfig.layers[i]
    const layerManipulators: Manipulator[] = []
    
    layer.mappings.forEach(mapping => {
      // Skip layer activation mappings - they're handled above
      if (mapping.action.type === 'layer-tap' || 
          mapping.action.type === 'layer-momentary' || 
          mapping.action.type === 'layer-toggle') {
        return
      }
      
      if (mapping.action.type === 'simple' && mapping.action.tap?.key) {
        layerManipulators.push({
          type: 'basic',
          from: {
            key_code: mapping.from,
            modifiers: {
              optional: ['any']
            }
          },
          to: [
            {
              key_code: mapping.action.tap.key
            }
          ],
          conditions: [
            {
              type: 'variable_if',
              name: getSimpleLayerVariableName(layer.id),
              value: 1
            }
          ]
        })
      } else if (mapping.action.type === 'mod-tap' && 
                 mapping.action.tap?.key && 
                 mapping.action.hold?.modifiers?.length) {
        layerManipulators.push({
          type: 'basic',
          from: {
            key_code: mapping.from,
            modifiers: {
              optional: ['any']
            }
          },
          to_if_alone: [
            {
              key_code: mapping.action.tap.key
            }
          ],
          to_if_held_down: mapping.action.hold.modifiers.map(mod => ({
            key_code: mod
          })),
          parameters: {
            'basic.to_if_alone_timeout_milliseconds': 500,
            'basic.to_if_held_down_threshold_milliseconds': 150
          },
          conditions: [
            {
              type: 'variable_if',
              name: getSimpleLayerVariableName(layer.id),
              value: 1
            }
          ]
        })
      }
    })
    
    if (layerManipulators.length > 0) {
      rules.push({
        description: `Layer ${i}`,
        manipulators: layerManipulators
      })
    }
  }
  
  // Finally, add base layer (layer 0) mappings without layer conditions
  // Only include simple and mod-tap mappings, not layer switches
  const baseLayer = layerConfig.layers[0]
  if (baseLayer) {
    const baseManipulators: Manipulator[] = []
    
    baseLayer.mappings.forEach(mapping => {
      // Skip layer activation mappings
      if (mapping.action.type === 'layer-tap' || 
          mapping.action.type === 'layer-momentary' || 
          mapping.action.type === 'layer-toggle') {
        return
      }
      
      if (mapping.action.type === 'simple' && mapping.action.tap?.key) {
        baseManipulators.push({
          type: 'basic',
          from: {
            key_code: mapping.from,
            modifiers: {
              optional: ['any']
            }
          },
          to: [
            {
              key_code: mapping.action.tap.key
            }
          ]
        })
      } else if (mapping.action.type === 'mod-tap' && 
                 mapping.action.tap?.key && 
                 mapping.action.hold?.modifiers?.length) {
        baseManipulators.push({
          type: 'basic',
          from: {
            key_code: mapping.from,
            modifiers: {
              optional: ['any']
            }
          },
          to_if_alone: [
            {
              key_code: mapping.action.tap.key
            }
          ],
          to_if_held_down: mapping.action.hold.modifiers.map(mod => ({
            key_code: mod
          })),
          parameters: {
            'basic.to_if_alone_timeout_milliseconds': 500,
            'basic.to_if_held_down_threshold_milliseconds': 150
          }
        })
      }
    })
    
    if (baseManipulators.length > 0) {
      rules.push({
        description: 'Base Layer',
        manipulators: baseManipulators
      })
    }
  }
  
  return rules
}