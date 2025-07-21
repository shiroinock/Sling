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
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <header className="relative text-center mb-12">
          <div className="absolute right-0 top-0">
            <DarkModeToggle />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-primary">Sling</h1>
          <p className="text-muted">Karabiner-Elements Key Mapping GUI</p>
        </header>

        <div className="max-w-6xl mx-auto">
          {!config ? (
            <div className="bg-primary rounded-lg shadow-lg p-8">
              <FileUpload onFileLoad={handleFileLoad} onError={setError} />

              {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-600 dark:border-red-800 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">{error}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {showSuccess && (
                <div className="p-4 mapped-key border-2 rounded-lg mb-6">
                  <p className="text-sm font-medium mapped-text">
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
