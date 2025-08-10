import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Layer, LayerConfiguration, LayerMapping } from '@/types/karabiner'

interface LayerStore {
  layerConfiguration: LayerConfiguration
  selectedLayerId: string

  // Layer management
  addLayer: (layer?: Partial<Layer>) => void
  updateLayer: (layerId: string, layer: Layer) => void
  deleteLayer: (layerId: string) => void
  selectLayer: (layerId: string) => void

  // Mapping management
  addMapping: (layerId: string, mapping: LayerMapping) => void
  updateMapping: (layerId: string, fromKey: string, mapping: LayerMapping) => void
  deleteMapping: (layerId: string, fromKey: string) => void

  // Utility functions
  getLayerById: (layerId: string) => Layer | undefined
  getMappingForKey: (layerId: string, key: string) => LayerMapping | undefined
  getLayerDisplayNumber: (layerId: string) => number

  // Reset
  resetLayers: () => void
}

const baseLayerId = uuidv4()

const defaultLayer: Layer = {
  id: baseLayerId,
  name: 'Layer 0',
  color: '#6B7280', // gray-500
  description: '',
  mappings: []
}

const initialState: LayerConfiguration = {
  layers: [defaultLayer],
  activeLayer: baseLayerId,
  baseLayer: baseLayerId
}

export const useLayerStore = create<LayerStore>()(
  persist(
    (set, get) => ({
      layerConfiguration: initialState,
      selectedLayerId: baseLayerId,

      addLayer: (partialLayer?: Partial<Layer>) => {
        const newLayerId = uuidv4()
        const state = get()
        const displayNumber = state.layerConfiguration.layers.length
        
        const newLayer: Layer = {
          id: newLayerId,
          name: `Layer ${displayNumber}`,
          color: partialLayer?.color || '#' + Math.floor(Math.random() * 16777215).toString(16),
          description: partialLayer?.description || '',
          mappings: partialLayer?.mappings || []
        }
        
        set(state => ({
          layerConfiguration: {
            ...state.layerConfiguration,
            layers: [...state.layerConfiguration.layers, newLayer]
          }
        }))
      },

      updateLayer: (layerId: string, layer: Layer) => {
        set(state => ({
          layerConfiguration: {
            ...state.layerConfiguration,
            layers: state.layerConfiguration.layers.map(l => (l.id === layerId ? layer : l))
          }
        }))
      },

      deleteLayer: (layerId: string) => {
        set(state => {
          // Cannot delete base layer
          if (layerId === state.layerConfiguration.baseLayer) {
            return state
          }

          const newLayers = state.layerConfiguration.layers.filter(l => l.id !== layerId)
          
          // Renumber remaining layers
          const renumberedLayers = newLayers.map((layer, index) => ({
            ...layer,
            name: `Layer ${index}`
          }))

          const newSelectedId = state.selectedLayerId === layerId 
            ? state.layerConfiguration.baseLayer! 
            : state.selectedLayerId

          return {
            layerConfiguration: {
              ...state.layerConfiguration,
              layers: renumberedLayers,
              activeLayer:
                state.layerConfiguration.activeLayer === layerId
                  ? state.layerConfiguration.baseLayer
                  : state.layerConfiguration.activeLayer
            },
            selectedLayerId: newSelectedId
          }
        })
      },

      selectLayer: (layerId: string) => {
        set({ selectedLayerId: layerId })
      },

      addMapping: (layerId: string, mapping: LayerMapping) => {
        set(state => ({
          layerConfiguration: {
            ...state.layerConfiguration,
            layers: state.layerConfiguration.layers.map(layer => {
              if (layer.id === layerId) {
                // Remove existing mapping for the same key if exists
                const filteredMappings = layer.mappings.filter(m => m.from !== mapping.from)
                return {
                  ...layer,
                  mappings: [...filteredMappings, mapping]
                }
              }
              return layer
            })
          }
        }))
      },

      updateMapping: (layerId: string, fromKey: string, mapping: LayerMapping) => {
        set(state => ({
          layerConfiguration: {
            ...state.layerConfiguration,
            layers: state.layerConfiguration.layers.map(layer => {
              if (layer.id === layerId) {
                return {
                  ...layer,
                  mappings: layer.mappings.map(m => (m.from === fromKey ? mapping : m))
                }
              }
              return layer
            })
          }
        }))
      },

      deleteMapping: (layerId: string, fromKey: string) => {
        set(state => ({
          layerConfiguration: {
            ...state.layerConfiguration,
            layers: state.layerConfiguration.layers.map(layer => {
              if (layer.id === layerId) {
                return {
                  ...layer,
                  mappings: layer.mappings.filter(m => m.from !== fromKey)
                }
              }
              return layer
            })
          }
        }))
      },

      getLayerById: (layerId: string) => {
        const state = get()
        return state.layerConfiguration.layers.find(l => l.id === layerId)
      },

      getMappingForKey: (layerId: string, key: string) => {
        const layer = get().getLayerById(layerId)
        return layer?.mappings.find(m => m.from === key)
      },

      getLayerDisplayNumber: (layerId: string) => {
        const state = get()
        const index = state.layerConfiguration.layers.findIndex(l => l.id === layerId)
        return index >= 0 ? index : 0
      },

      resetLayers: () => {
        set({
          layerConfiguration: initialState,
          selectedLayerId: baseLayerId
        })
      }
    }),
    {
      name: 'sling-layers',
      version: 2 // Increment version to force migration
    }
  )
)