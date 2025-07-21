import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { ConfigurationEditor } from './components/ConfigurationEditor'
import { DarkModeToggle } from './components/DarkModeToggle'
import { FileUpload } from './components/FileUpload'
import { useKarabinerStore } from './store/karabiner'

function App() {
  const { config, error, setConfig, setError } = useKarabinerStore()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFileLoad = (loadedConfig: typeof config) => {
    if (loadedConfig) {
      setConfig(loadedConfig)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="relative text-center mb-12">
          <div className="absolute right-0 top-0">
            <DarkModeToggle />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Sling</h1>
          <p className="text-gray-600 dark:text-gray-400">Karabiner-Elements Key Mapping GUI</p>
        </header>

        <div className="max-w-6xl mx-auto">
          {!config ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <FileUpload onFileLoad={handleFileLoad} onError={setError} />

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {showSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-6">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Configuration loaded successfully!
                  </p>
                </div>
              )}
              <ConfigurationEditor />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
