import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { KarabinerConfig } from '@/types/karabiner'

export interface ConfigBackup {
  id: string
  name: string
  config: KarabinerConfig
  timestamp: Date
  profileCount: number
  ruleCount: number
  description?: string
}

interface BackupStore {
  backups: ConfigBackup[]
  maxBackups: number
  createBackup: (config: KarabinerConfig, name?: string, description?: string) => string
  deleteBackup: (id: string) => void
  restoreBackup: (id: string) => KarabinerConfig | null
  clearAllBackups: () => void
  renameBackup: (id: string, newName: string) => void
  updateDescription: (id: string, description: string) => void
}

export const useBackupStore = create<BackupStore>()(
  persist(
    (set, get) => ({
      backups: [],
      maxBackups: 10, // 最大10個のバックアップを保持

      createBackup: (config: KarabinerConfig, name?: string, description?: string) => {
        const id = `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const timestamp = new Date()
        
        const profileCount = config.profiles.length
        const ruleCount = config.profiles.reduce(
          (acc, profile) => acc + (profile.complex_modifications?.rules?.length || 0),
          0
        )

        const backup: ConfigBackup = {
          id,
          name: name || `Backup ${timestamp.toLocaleString()}`,
          config,
          timestamp,
          profileCount,
          ruleCount,
          description
        }

        set((state) => {
          let newBackups = [backup, ...state.backups]
          
          // 最大数を超えたら古いものから削除
          if (newBackups.length > state.maxBackups) {
            newBackups = newBackups.slice(0, state.maxBackups)
          }

          return { backups: newBackups }
        })

        return id
      },

      deleteBackup: (id: string) => {
        set((state) => ({
          backups: state.backups.filter((b) => b.id !== id)
        }))
      },

      restoreBackup: (id: string) => {
        const backup = get().backups.find((b) => b.id === id)
        return backup?.config || null
      },

      clearAllBackups: () => {
        set({ backups: [] })
      },

      renameBackup: (id: string, newName: string) => {
        set((state) => ({
          backups: state.backups.map((b) =>
            b.id === id ? { ...b, name: newName } : b
          )
        }))
      },

      updateDescription: (id: string, description: string) => {
        set((state) => ({
          backups: state.backups.map((b) =>
            b.id === id ? { ...b, description } : b
          )
        }))
      }
    }),
    {
      name: 'sling-backups',
      version: 1
    }
  )
)