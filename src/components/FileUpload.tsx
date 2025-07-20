import { FileJson, Upload } from 'lucide-react'
import type React from 'react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import type { KarabinerConfig } from '@/types/karabiner'
import { validateKarabinerConfig } from '@/types/karabiner-schema'

interface FileUploadProps {
  onFileLoad: (config: KarabinerConfig) => void
  onError: (error: string) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad, onError }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]

      if (!file) {
        return
      }

      const reader = new FileReader()

      reader.onload = e => {
        try {
          const content = e.target?.result as string
          const json = JSON.parse(content)

          const result = validateKarabinerConfig(json)

          if (result.success) {
            onFileLoad(result.data)
          } else {
            const errors = result.error.issues
              .map(err => `${err.path.join('.')}: ${err.message}`)
              .join(', ')
            onError(`Invalid Karabiner configuration: ${errors}`)
          }
        } catch (err) {
          if (err instanceof SyntaxError) {
            onError('Invalid JSON file')
          } else {
            onError('Failed to read file')
          }
        }
      }

      reader.onerror = () => {
        onError('Failed to read file')
      }

      reader.readAsText(file)
    },
    [onFileLoad, onError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-8
        transition-colors cursor-pointer
        ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <FileJson className="w-16 h-16 text-gray-400 dark:text-gray-600" />
          <Upload className="w-8 h-8 text-blue-500 absolute -bottom-2 -right-2" />
        </div>

        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isDragActive ? 'Drop the file here' : 'Drop your karabiner.json here'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">or click to select a file</p>
        </div>

        <div className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-sm">
          <p>Supports karabiner.json configuration files</p>
          <p className="mt-1">Usually found at ~/.config/karabiner/karabiner.json</p>
        </div>
      </div>
    </div>
  )
}
