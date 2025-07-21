import { Settings } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { useKarabinerStore } from '../store/karabiner'
import { ProfileManager } from './ProfileManager'

export function ProfileTabs() {
  const { config, selectedProfileIndex, selectProfile } = useKarabinerStore()
  const [showProfileManager, setShowProfileManager] = useState(false)

  if (!config) return null

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <nav className="-mb-px flex space-x-8" aria-label="Profiles">
            {config.profiles.map((profile, index) => (
              <button
                key={`profile-${profile.name}-${index}`}
                type="button"
                onClick={() => selectProfile(index)}
                className={cn(
                  'py-2 px-1 border-b-2 font-medium text-sm',
                  selectedProfileIndex === index
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                )}
              >
                {profile.name}
                {profile.selected && <span className="ml-2 text-xs text-gray-400">(default)</span>}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setShowProfileManager(true)}
            className="mb-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Manage profiles"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ProfileManager isOpen={showProfileManager} onClose={() => setShowProfileManager(false)} />
    </>
  )
}
