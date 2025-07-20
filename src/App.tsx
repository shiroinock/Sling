import React, { useState } from 'react'
import { FileUpload } from './components/FileUpload'
import { useKarabinerStore } from './store/karabiner'
import { Download, AlertCircle } from 'lucide-react'
import { saveAs } from 'file-saver'

function App() {
  const { config, error, setConfig, setError, reset } = useKarabinerStore()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleExport = () => {
    if (!config) return
    
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json'
    })
    saveAs(blob, 'karabiner.json')
  }

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
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Sling
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Karabiner-Elements Key Mapping GUI
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          {!config ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <FileUpload 
                onFileLoad={handleFileLoad}
                onError={setError}
              />
              
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
            <div className="space-y-6">
              {showSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Configuration loaded successfully!
                  </p>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Configuration Editor
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleExport}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                    <button
                      onClick={reset}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      New
                    </button>
                  </div>
                </div>
                
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>Configuration editor coming soon...</p>
                  <p className="text-sm mt-2">Currently loaded: {config.profiles.length} profile(s)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App