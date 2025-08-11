import type {
  Condition,
  FromEvent,
  KeyAction,
  Layer,
  LayerAction,
  LayerConfiguration,
  LayerMapping,
  Manipulator,
  Rule,
  ToEvent
} from '@/types/karabiner'

// Helper function to get layer variable name
function getLayerVariableName(layerId: string): string {
  return `layer_${layerId}`
}

/**
 * Generate Karabiner Complex Modifications rules from layer configuration
 */
export function generateLayerRules(layerConfig: LayerConfiguration): Rule[] {
  const rules: Rule[] = []

  // Generate rules for each layer
  for (const layer of layerConfig.layers) {
    if (layer.id === '0') {
      // Base layer doesn't need conditions, but still process mod-tap and layer-tap
      rules.push(...generateBaseLayerRules(layer))
    } else {
      // Higher layers need variable conditions
      rules.push(...generateHigherLayerRules(layer))
    }
  }

  return rules
}

/**
 * Generate rules for base layer (no conditions needed)
 */
function generateBaseLayerRules(layer: Layer): Rule[] {
  const rules: Rule[] = []

  for (const mapping of layer.mappings) {
    const manipulators = generateManipulatorsForMapping(mapping)
    if (manipulators.length > 0) {
      rules.push({
        description: `Layer ${layer.id}: ${mapping.from} mapping`,
        manipulators,
        enabled: true,
        group: `Sling Layer ${layer.id} - ${layer.name}`
      })
    }
  }

  return rules
}

/**
 * Generate rules for higher layers (with conditions)
 */
function generateHigherLayerRules(layer: Layer): Rule[] {
  const rules: Rule[] = []
  const layerVariable = getLayerVariableName(layer.id)

  for (const mapping of layer.mappings) {
    const manipulators = generateManipulatorsForMapping(mapping)

    // Add layer condition to each manipulator
    manipulators.forEach(m => {
      m.conditions = [
        ...(m.conditions || []),
        {
          type: 'variable_if',
          name: layerVariable,
          value: 1
        } as Condition
      ]
    })

    if (manipulators.length > 0) {
      rules.push({
        description: `Layer ${layer.id}: ${mapping.from} mapping`,
        manipulators,
        enabled: true,
        group: `Sling Layer ${layer.id} - ${layer.name}`
      })
    }
  }

  return rules
}

/**
 * Generate manipulators for a single mapping
 */
function generateManipulatorsForMapping(mapping: LayerMapping): Manipulator[] {
  const manipulators: Manipulator[] = []
  const action = mapping.action

  switch (action.type) {
    case 'simple':
      // Simple key remapping - skip if no valid key
      if (action.tap?.key) {
        manipulators.push(generateSimpleManipulator(mapping.from, action.tap))
      }
      break

    case 'mod-tap':
      // Tap for key, hold for modifier - skip if no valid tap key
      if (action.tap?.key && action.hold?.modifiers?.length) {
        manipulators.push(generateModTapManipulator(mapping.from, action))
      }
      break

    case 'layer-tap':
      // Tap for key, hold for layer - skip if no valid tap key or layer
      if (action.tap?.key && action.hold?.layer) {
        manipulators.push(generateLayerTapManipulator(mapping.from, action))
      }
      break

    case 'layer-momentary':
      // Hold to activate layer temporarily - skip if no valid layer
      if (action.hold?.layer || action.tap?.layer) {
        manipulators.push(generateLayerMomentaryManipulator(mapping.from, action))
      }
      break

    case 'layer-toggle':
      // Toggle layer on/off - skip if no valid layer
      if (action.tap?.layer || action.hold?.layer) {
        manipulators.push(generateLayerToggleManipulator(mapping.from, action))
      }
      break
  }

  return manipulators
}

/**
 * Generate simple key remapping manipulator
 */
function generateSimpleManipulator(from: string, action: KeyAction): Manipulator {
  const fromEvent: FromEvent = {
    key_code: from
  }

  const toEvents: ToEvent[] = []

  if (action.type === 'key' && action.key) {
    toEvents.push({
      key_code: action.key,
      modifiers: action.modifiers
    })
  }

  return {
    type: 'basic',
    from: fromEvent,
    to: toEvents
  }
}

/**
 * Generate mod-tap manipulator (tap for key, hold for modifier)
 */
function generateModTapManipulator(from: string, action: LayerAction): Manipulator {
  const fromEvent: FromEvent = {
    key_code: from
  }

  const toEvents: ToEvent[] = []
  const toIfAlone: ToEvent[] = []

  // Hold behavior (modifier)
  if (action.hold?.type === 'modifier' && action.hold.modifiers) {
    // Send the key with modifiers held
    toEvents.push({
      key_code: from,
      modifiers: action.hold.modifiers
    })
  }

  // Tap behavior (key)
  if (action.tap?.type === 'key' && action.tap.key) {
    toIfAlone.push({
      key_code: action.tap.key,
      modifiers: action.tap.modifiers
    })
  }

  return {
    type: 'basic',
    from: fromEvent,
    to: toEvents,
    to_if_alone: toIfAlone
  }
}

/**
 * Generate layer-tap manipulator (tap for key, hold for layer)
 */
function generateLayerTapManipulator(from: string, action: LayerAction): Manipulator {
  const fromEvent: FromEvent = {
    key_code: from
  }

  const toEvents: ToEvent[] = []
  const toIfAlone: ToEvent[] = []
  const toAfterKeyUp: ToEvent[] = []

  // Hold behavior (activate layer)
  if (action.hold?.type === 'layer' && action.hold.layer !== undefined) {
    const layerVariable = getLayerVariableName(action.hold.layer)

    toEvents.push({
      set_variable: {
        name: layerVariable,
        value: 1
      }
    })

    toAfterKeyUp.push({
      set_variable: {
        name: layerVariable,
        value: 0
      }
    })
  }

  // Tap behavior (key)
  if (action.tap?.type === 'key' && action.tap.key) {
    toIfAlone.push({
      key_code: action.tap.key,
      modifiers: action.tap.modifiers
    })
  }

  return {
    type: 'basic',
    from: fromEvent,
    to: toEvents,
    to_if_alone: toIfAlone,
    to_after_key_up: toAfterKeyUp
  }
}

/**
 * Generate layer momentary manipulator (hold to activate layer)
 */
function generateLayerMomentaryManipulator(from: string, action: LayerAction): Manipulator {
  const fromEvent: FromEvent = {
    key_code: from
  }

  const toEvents: ToEvent[] = []
  const toAfterKeyUp: ToEvent[] = []

  // Get target layer from hold or tap action
  const targetLayer = action.hold?.layer ?? action.tap?.layer

  if (targetLayer !== undefined) {
    const layerVariable = getLayerVariableName(targetLayer)

    toEvents.push({
      set_variable: {
        name: layerVariable,
        value: 1
      }
    })

    toAfterKeyUp.push({
      set_variable: {
        name: layerVariable,
        value: 0
      }
    })
  }

  return {
    type: 'basic',
    from: fromEvent,
    to: toEvents,
    to_after_key_up: toAfterKeyUp
  }
}

/**
 * Generate layer toggle manipulator
 */
function generateLayerToggleManipulator(from: string, action: LayerAction): Manipulator {
  const fromEvent: FromEvent = {
    key_code: from
  }

  const toEvents: ToEvent[] = []

  // Get target layer
  const targetLayer = action.tap?.layer ?? action.hold?.layer

  if (targetLayer !== undefined) {
    const layerVariable = getLayerVariableName(targetLayer)

    // Note: Karabiner doesn't have a native toggle, so we'd need to track state
    // For now, we'll just activate the layer (user would need another key to deactivate)
    toEvents.push({
      set_variable: {
        name: layerVariable,
        value: 1
      }
    })
  }

  return {
    type: 'basic',
    from: fromEvent,
    to: toEvents
  }
}

/**
 * Merge layer rules with existing Complex Modifications
 */
export function mergeLayerRules(existingRules: Rule[], layerRules: Rule[]): Rule[] {
  // Remove old Sling layer rules
  const filteredRules = existingRules.filter(rule => !rule.group?.startsWith('Sling Layer'))

  // Add new layer rules
  return [...filteredRules, ...layerRules]
}
