function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Sling
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Karabiner-Elements Key Mapping GUI
        </p>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-gray-700 dark:text-gray-300">
            設定ファイルをドラッグ&ドロップまたは選択してください
          </p>
        </div>
      </div>
    </div>
  )
}

export default App