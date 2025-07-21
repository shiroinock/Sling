import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { KarabinerConfig, Profile, Rule, SimpleModification } from '@/types/karabiner'

interface ImportExportHistory {
  id: string
  type: 'import' | 'export'
  fileName: string
  timestamp: number
  profileCount?: number
  ruleCount?: number
}

interface KarabinerState {
  config: KarabinerConfig | null
  selectedProfileIndex: number
  selectedRuleIndex: number | null
  error: string | null
  isDirty: boolean
  importExportHistory: ImportExportHistory[]

  setConfig: (config: KarabinerConfig) => void
  updateConfig: (config: KarabinerConfig) => void
  selectProfile: (index: number) => void
  selectRule: (index: number | null) => void
  setError: (error: string | null) => void

  addProfile: (profile: Profile) => void
  updateProfile: (index: number, profile: Profile) => void
  deleteProfile: (index: number) => void

  addRule: (rule: Rule) => void
  updateRule: (ruleIndex: number, rule: Rule) => void
  deleteRule: (ruleIndex: number) => void

  addSimpleModification: (modification: SimpleModification) => void
  updateSimpleModification: (index: number, modification: SimpleModification) => void
  deleteSimpleModification: (index: number) => void

  addHistoryEntry: (entry: Omit<ImportExportHistory, 'id' | 'timestamp'>) => void
  clearHistory: () => void

  reset: () => void
}

const initialState = {
  config: null,
  selectedProfileIndex: 0,
  selectedRuleIndex: null,
  error: null,
  isDirty: false,
  importExportHistory: []
}

export const useKarabinerStore = create<KarabinerState>()(
  devtools(
    persist(
      set => ({
        ...initialState,

        setConfig: config =>
          set(state => {
            // Add import history entry
            if (config) {
              // Find the default profile (the one with selected: true)
              const defaultProfileIndex = config.profiles.findIndex(profile => profile.selected === true)
              const selectedProfileIndex = defaultProfileIndex >= 0 ? defaultProfileIndex : 0

              const newHistory: ImportExportHistory = {
                id: crypto.randomUUID(),
                type: 'import',
                fileName: 'karabiner.json',
                timestamp: Date.now(),
                profileCount: config.profiles.length,
                ruleCount: config.profiles.reduce(
                  (acc, profile) => acc + (profile.complex_modifications?.rules?.length || 0),
                  0
                )
              }
              return {
                config,
                selectedProfileIndex,
                selectedRuleIndex: null,
                error: null,
                isDirty: false,
                importExportHistory: [newHistory, ...state.importExportHistory].slice(0, 20)
              }
            }
            return {
              config,
              selectedProfileIndex: 0,
              selectedRuleIndex: null,
              error: null,
              isDirty: false
            }
          }),

        updateConfig: config =>
          set({
            config,
            isDirty: true
          }),

        selectProfile: index =>
          set({
            selectedProfileIndex: index,
            selectedRuleIndex: null
          }),

        selectRule: index =>
          set({
            selectedRuleIndex: index
          }),

        setError: error => set({ error }),

        addProfile: profile =>
          set(state => {
            if (!state.config) return state

            const newConfig = {
              ...state.config,
              profiles: [...state.config.profiles, profile]
            }

            return {
              config: newConfig,
              selectedProfileIndex: newConfig.profiles.length - 1,
              isDirty: true
            }
          }),

        updateProfile: (index, profile) =>
          set(state => {
            if (!state.config) return state

            const profiles = [...state.config.profiles]
            profiles[index] = profile

            return {
              config: {
                ...state.config,
                profiles
              },
              isDirty: true
            }
          }),

        deleteProfile: index =>
          set(state => {
            if (!state.config || state.config.profiles.length <= 1) return state

            const profiles = state.config.profiles.filter((_, i) => i !== index)
            const newSelectedIndex = Math.min(state.selectedProfileIndex, profiles.length - 1)

            return {
              config: {
                ...state.config,
                profiles
              },
              selectedProfileIndex: newSelectedIndex,
              selectedRuleIndex: null,
              isDirty: true
            }
          }),

        addRule: rule =>
          set(state => {
            if (!state.config) return state

            const profile = state.config.profiles[state.selectedProfileIndex]
            if (!profile.complex_modifications) {
              profile.complex_modifications = { rules: [] }
            }

            const rules = [...(profile.complex_modifications.rules || []), rule]
            const profiles = [...state.config.profiles]

            profiles[state.selectedProfileIndex] = {
              ...profile,
              complex_modifications: {
                ...profile.complex_modifications,
                rules
              }
            }

            return {
              config: {
                ...state.config,
                profiles
              },
              selectedRuleIndex: rules.length - 1,
              isDirty: true
            }
          }),

        updateRule: (ruleIndex, rule) =>
          set(state => {
            if (!state.config) return state

            const profile = state.config.profiles[state.selectedProfileIndex]
            if (!profile.complex_modifications?.rules) return state

            const rules = [...profile.complex_modifications.rules]
            rules[ruleIndex] = rule

            const profiles = [...state.config.profiles]
            profiles[state.selectedProfileIndex] = {
              ...profile,
              complex_modifications: {
                ...profile.complex_modifications,
                rules
              }
            }

            return {
              config: {
                ...state.config,
                profiles
              },
              isDirty: true
            }
          }),

        deleteRule: ruleIndex =>
          set(state => {
            if (!state.config) return state

            const profile = state.config.profiles[state.selectedProfileIndex]
            if (!profile.complex_modifications?.rules) return state

            const rules = profile.complex_modifications.rules.filter((_, i) => i !== ruleIndex)
            const profiles = [...state.config.profiles]

            profiles[state.selectedProfileIndex] = {
              ...profile,
              complex_modifications: {
                ...profile.complex_modifications,
                rules
              }
            }

            const newSelectedRuleIndex =
              state.selectedRuleIndex === ruleIndex
                ? null
                : state.selectedRuleIndex !== null && state.selectedRuleIndex > ruleIndex
                  ? state.selectedRuleIndex - 1
                  : state.selectedRuleIndex

            return {
              config: {
                ...state.config,
                profiles
              },
              selectedRuleIndex: newSelectedRuleIndex,
              isDirty: true
            }
          }),

        addSimpleModification: modification =>
          set(state => {
            if (!state.config) return state

            const profile = state.config.profiles[state.selectedProfileIndex]
            const modifications = [...(profile.simple_modifications || []), modification]

            const profiles = [...state.config.profiles]
            profiles[state.selectedProfileIndex] = {
              ...profile,
              simple_modifications: modifications
            }

            return {
              config: {
                ...state.config,
                profiles
              },
              isDirty: true
            }
          }),

        updateSimpleModification: (index, modification) =>
          set(state => {
            if (!state.config) return state

            const profile = state.config.profiles[state.selectedProfileIndex]
            if (!profile.simple_modifications) return state

            const modifications = [...profile.simple_modifications]
            modifications[index] = modification

            const profiles = [...state.config.profiles]
            profiles[state.selectedProfileIndex] = {
              ...profile,
              simple_modifications: modifications
            }

            return {
              config: {
                ...state.config,
                profiles
              },
              isDirty: true
            }
          }),

        deleteSimpleModification: index =>
          set(state => {
            if (!state.config) return state

            const profile = state.config.profiles[state.selectedProfileIndex]
            if (!profile.simple_modifications) return state

            const modifications = profile.simple_modifications.filter((_, i) => i !== index)
            const profiles = [...state.config.profiles]

            profiles[state.selectedProfileIndex] = {
              ...profile,
              simple_modifications: modifications
            }

            return {
              config: {
                ...state.config,
                profiles
              },
              isDirty: true
            }
          }),

        addHistoryEntry: entry =>
          set(state => ({
            importExportHistory: [
              {
                ...entry,
                id: crypto.randomUUID(),
                timestamp: Date.now()
              },
              ...state.importExportHistory
            ].slice(0, 20) // Keep only last 20 entries
          })),

        clearHistory: () => set({ importExportHistory: [] }),

        reset: () => set(initialState)
      }),
      {
        name: 'karabiner-storage',
        partialize: state => ({
          config: state.config,
          selectedProfileIndex: state.selectedProfileIndex,
          importExportHistory: state.importExportHistory
        })
      }
    )
  )
)
