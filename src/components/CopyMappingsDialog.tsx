import { AlertCircle, Copy, Laptop, Monitor } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Device, SimpleModification } from '@/types/karabiner'

interface CopyMappingsDialogProps {
  isOpen: boolean
  onClose: () => void
  currentDevice: Device | null
  currentProfileMappings: SimpleModification[]
  devices: Device[]
  onCopy: (mappings: SimpleModification[], mode: 'replace' | 'merge') => void
  isDeviceMode: boolean
  selectedDeviceIndex: number | null
}

export function CopyMappingsDialog({
  isOpen,
  onClose,
  currentDevice,
  currentProfileMappings,
  devices,
  onCopy,
  isDeviceMode,
  selectedDeviceIndex
}: CopyMappingsDialogProps) {
  const [selectedSource, setSelectedSource] = useState<string>('profile')
  const [copyMode, setCopyMode] = useState<'replace' | 'merge'>('replace')

  const getDeviceName = (device: Device): string => {
    const id = device.identifiers
    if (id.is_built_in_keyboard) return 'Built-in Keyboard'

    // Handle minimal identifiers (e.g., { "is_keyboard": true })
    if (!id.vendor_id && !id.product_id) {
      if (id.is_keyboard) return 'Generic Keyboard'
      if (id.is_pointing_device) return 'Generic Mouse'
      return 'Generic Device'
    }

    const vendorNames: Record<number, string> = {
      1452: 'Apple',
      1133: 'Logitech',
      1118: 'Microsoft',
      18003: 'foostan',
      2131: 'PFU',
      1241: 'HHKB'
      // Add more as needed
    }

    const vendor = vendorNames[id.vendor_id || 0] || `Vendor ${id.vendor_id}`
    const type = id.is_keyboard ? 'Keyboard' : id.is_pointing_device ? 'Mouse' : 'Device'

    return `${vendor} ${type}`
  }

  const handleCopy = () => {
    let mappingsToCopy: SimpleModification[] = []

    if (selectedSource === 'profile') {
      mappingsToCopy = currentProfileMappings
    } else {
      const deviceIndex = parseInt(selectedSource.replace('device-', ''))
      if (devices[deviceIndex]) {
        mappingsToCopy = devices[deviceIndex].simple_modifications || []
      }
    }

    onCopy(mappingsToCopy, copyMode)
    onClose()
  }

  // Get available sources (exclude current device if in device mode)
  const availableSources = [{ id: 'profile', mappings: currentProfileMappings }]

  devices.forEach((device, index) => {
    // Skip the current device when in device mode
    if (isDeviceMode && index === selectedDeviceIndex) return

    availableSources.push({
      id: `device-${index}`,
      mappings: device.simple_modifications || []
    })
  })

  // Filter out sources with no mappings
  const sourcesWithMappings = availableSources.filter(source => source.mappings.length > 0)

  if (sourcesWithMappings.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy Mappings</DialogTitle>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No other devices or profile mappings available to copy from.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const currentMappings =
    isDeviceMode && currentDevice
      ? currentDevice.simple_modifications || []
      : currentProfileMappings

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Copy Mappings</DialogTitle>
          <DialogDescription>Select a source to copy mappings from</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Source Selection */}
          <div className="space-y-3">
            <Label>Copy from:</Label>
            <RadioGroup value={selectedSource} onValueChange={setSelectedSource}>
              {sourcesWithMappings.map(source => {
                const isProfile = source.id === 'profile'
                const deviceIndex = isProfile ? -1 : parseInt(source.id.replace('device-', ''))
                const device = isProfile ? null : devices[deviceIndex]

                return (
                  <div key={source.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={source.id} id={source.id} />
                    <Label
                      htmlFor={source.id}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      {isProfile ? (
                        <>
                          <Monitor className="w-4 h-4" />
                          <span>All Devices (Profile Default)</span>
                        </>
                      ) : (
                        <>
                          <Laptop className="w-4 h-4" />
                          <span>{device && getDeviceName(device)}</span>
                        </>
                      )}
                      <Badge variant="secondary" className="ml-auto">
                        {source.mappings.length} mappings
                      </Badge>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {/* Copy Mode Selection */}
          <div className="space-y-3">
            <Label>Copy mode:</Label>
            <RadioGroup
              value={copyMode}
              onValueChange={(value: string) => setCopyMode(value as 'replace' | 'merge')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="replace" id="replace" />
                <Label htmlFor="replace" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Replace all</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Remove existing mappings and replace with copied ones
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="merge" id="merge" />
                <Label htmlFor="merge" className="cursor-pointer">
                  <div>
                    <div className="font-medium">Merge</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Add to existing mappings (duplicates will be overwritten)
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Warning if current has mappings */}
          {currentMappings.length > 0 && copyMode === 'replace' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will replace all {currentMappings.length} existing mapping
                {currentMappings.length !== 1 ? 's' : ''}.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Mappings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
