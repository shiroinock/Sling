import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  Keyboard,
  Monitor,
  Mouse,
  Plus,
  Trash2
} from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useKarabinerStore } from '@/store/karabiner'
import type { Device, DeviceIdentifier } from '@/types/karabiner'

export function DeviceManager() {
  const { config, selectedProfileIndex, updateConfig } = useKarabinerStore()
  const [expandedDevices, setExpandedDevices] = useState<Set<string>>(new Set())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const profile = config ? config.profiles[selectedProfileIndex] : null
  const devices = profile?.devices || []

  const getDeviceId = (device: Device): string => {
    const id = device.identifiers

    // For generic devices
    if (!id.vendor_id && !id.product_id) {
      if (id.is_built_in_keyboard) return 'builtin_keyboard'
      if (id.is_keyboard) return 'generic_keyboard'
      if (id.is_pointing_device) return 'generic_mouse'
      return 'generic_device'
    }

    return `${id.vendor_id}_${id.product_id}_${id.location_id || 'unknown'}`
  }

  const getDeviceName = (device: Device): string => {
    const id = device.identifiers
    if (id.is_built_in_keyboard) return 'Built-in Keyboard'

    // Handle minimal identifiers (e.g., { "is_keyboard": true })
    if (!id.vendor_id && !id.product_id) {
      if (id.is_keyboard) return 'Generic Keyboard'
      if (id.is_pointing_device) return 'Generic Mouse'
      return 'Generic Device'
    }

    // Common vendor names
    const vendorNames: Record<number, string> = {
      1452: 'Apple',
      1133: 'Logitech',
      1118: 'Microsoft',
      6940: 'Corsair',
      1241: 'HHKB',
      2131: 'PFU',
      1149: 'Keychron',
      9494: 'ZSA (Moonlander/Ergodox)',
      1204: 'OLKB (Planck/Preonic)',
      1155: 'SteelSeries',
      9610: 'Realforce',
      1008: 'CHERRY',
      2821: 'Varmilo',
      1003: 'iKBC',
      1423: 'Razer',
      3141: 'Ducky',
      65261: 'QMK/VIA',
      12951: 'VIA',
      7119: 'NuPhy',
      16700: 'AKKO'
      // Add more vendor IDs as needed
    }

    const vendor = vendorNames[id.vendor_id || 0] || `Vendor ${id.vendor_id}`
    const type = id.is_keyboard ? 'Keyboard' : id.is_pointing_device ? 'Mouse' : 'Device'

    if (id.product_id) {
      return `${vendor} ${type} (${id.product_id})`
    } else {
      return `${vendor} ${type}`
    }
  }

  const toggleDeviceExpanded = (deviceId: string) => {
    const newExpanded = new Set(expandedDevices)
    if (newExpanded.has(deviceId)) {
      newExpanded.delete(deviceId)
    } else {
      newExpanded.add(deviceId)
    }
    setExpandedDevices(newExpanded)
  }

  const updateDevice = (deviceIndex: number, updates: Partial<Device>) => {
    if (!profile || !config) return

    const newDevices = [...(profile.devices || [])]
    newDevices[deviceIndex] = { ...newDevices[deviceIndex], ...updates }

    const newProfiles = config.profiles.map((p, i) =>
      i === selectedProfileIndex ? { ...p, devices: newDevices } : p
    )

    updateConfig({ ...config, profiles: newProfiles })
  }

  const deleteDevice = (deviceIndex: number) => {
    if (!profile || !config) return

    const newDevices = (profile.devices || []).filter((_, i) => i !== deviceIndex)

    const newProfiles = config.profiles.map((p, i) =>
      i === selectedProfileIndex ? { ...p, devices: newDevices } : p
    )

    updateConfig({ ...config, profiles: newProfiles })
  }

  const addDevice = (identifiers: DeviceIdentifier, closeDialog = true) => {
    if (!profile || !config) return

    // Check if device already exists
    const existingDevice = (profile.devices || []).find(d => {
      // For generic devices (no vendor/product ID)
      if (!identifiers.vendor_id && !identifiers.product_id) {
        return (
          !d.identifiers.vendor_id &&
          !d.identifiers.product_id &&
          d.identifiers.is_keyboard === identifiers.is_keyboard &&
          d.identifiers.is_pointing_device === identifiers.is_pointing_device &&
          d.identifiers.is_built_in_keyboard === identifiers.is_built_in_keyboard
        )
      }
      // For devices with vendor/product IDs
      return (
        d.identifiers.vendor_id === identifiers.vendor_id &&
        d.identifiers.product_id === identifiers.product_id
      )
    })

    if (existingDevice) {
      // Device already exists, skip
      return
    }

    const newDevice: Device = {
      identifiers,
      ignore: false,
      manipulate_caps_lock_led: true,
      simple_modifications: [],
      fn_function_keys: []
    }

    const newDevices = [...(profile.devices || []), newDevice]

    const newProfiles = config.profiles.map((p, i) =>
      i === selectedProfileIndex ? { ...p, devices: newDevices } : p
    )

    updateConfig({ ...config, profiles: newProfiles })
    if (closeDialog) {
      setIsAddDialogOpen(false)
    }
  }

  const addMultipleDevices = (deviceIdentifiers: DeviceIdentifier[]) => {
    if (!profile || !config) return

    const currentDevices = profile.devices || []
    const newDevices: Device[] = []

    // Filter out existing devices and create new device objects
    deviceIdentifiers.forEach(identifiers => {
      const exists = currentDevices.find(d => {
        // For generic devices (no vendor/product ID)
        if (!identifiers.vendor_id && !identifiers.product_id) {
          return (
            !d.identifiers.vendor_id &&
            !d.identifiers.product_id &&
            d.identifiers.is_keyboard === identifiers.is_keyboard &&
            d.identifiers.is_pointing_device === identifiers.is_pointing_device &&
            d.identifiers.is_built_in_keyboard === identifiers.is_built_in_keyboard
          )
        }
        // For devices with vendor/product IDs
        return (
          d.identifiers.vendor_id === identifiers.vendor_id &&
          d.identifiers.product_id === identifiers.product_id
        )
      })

      if (!exists) {
        newDevices.push({
          identifiers,
          ignore: false,
          manipulate_caps_lock_led: true,
          simple_modifications: [],
          fn_function_keys: []
        })
      }
    })

    if (newDevices.length === 0) return

    // Add all new devices at once
    const updatedDevices = [...currentDevices, ...newDevices]

    const newProfiles = config.profiles.map((p, i) =>
      i === selectedProfileIndex ? { ...p, devices: updatedDevices } : p
    )

    updateConfig({ ...config, profiles: newProfiles })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Device Configuration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configure settings for specific keyboards and mice
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                Import from JSON
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Devices from Karabiner-EventViewer</DialogTitle>
                <DialogDescription>
                  1. Open Karabiner-EventViewer → Devices tab
                  <br />
                  2. Copy the JSON output
                  <br />
                  3. Paste it below to import all devices at once
                </DialogDescription>
              </DialogHeader>
              <ImportDevicesForm
                onImport={devices => {
                  addMultipleDevices(devices)
                  setIsImportDialogOpen(false)
                }}
                onCancel={() => setIsImportDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Device Configuration</DialogTitle>
                <DialogDescription>
                  Enter the device identifiers to create a new device configuration
                </DialogDescription>
              </DialogHeader>
              <AddDeviceForm onAdd={addDevice} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {devices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No device configurations</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Add device-specific settings to customize each keyboard or mouse
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {devices.map((device, index) => {
            const deviceId = getDeviceId(device)
            const isExpanded = expandedDevices.has(deviceId)
            const deviceName = getDeviceName(device)

            return (
              <Card key={deviceId} className="transition-colors">
                <Collapsible open={isExpanded} onOpenChange={() => toggleDeviceExpanded(deviceId)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          {device.identifiers.is_keyboard ? (
                            <Keyboard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          ) : device.identifiers.is_pointing_device ? (
                            <Mouse className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          )}
                          <div>
                            <CardTitle className="text-base">{deviceName}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              VID: {device.identifiers.vendor_id} | PID:{' '}
                              {device.identifiers.product_id}
                              {device.identifiers.is_built_in_keyboard && (
                                <Badge variant="secondary" className="ml-2">
                                  Built-in
                                </Badge>
                              )}
                              {((device.simple_modifications?.length || 0) > 0 ||
                                (device.fn_function_keys?.length || 0) > 0) && (
                                <Badge variant="outline" className="ml-2">
                                  {(device.simple_modifications?.length || 0) +
                                    (device.fn_function_keys?.length || 0)}{' '}
                                  mappings
                                </Badge>
                              )}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`device-enabled-${deviceId}`}
                              checked={!device.ignore}
                              onCheckedChange={checked => {
                                updateDevice(index, { ignore: !checked })
                              }}
                              onClick={e => e.stopPropagation()}
                            />
                            <label
                              htmlFor={`device-enabled-${deviceId}`}
                              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                            >
                              {device.ignore ? 'Disabled' : 'Enabled'}
                            </label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation()
                              deleteDevice(index)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Device Settings */}
                        <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Device Settings
                          </h4>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`manipulate-caps-${deviceId}`} className="text-sm">
                                Manipulate Caps Lock LED
                              </Label>
                              <Switch
                                id={`manipulate-caps-${deviceId}`}
                                checked={device.manipulate_caps_lock_led ?? true}
                                onCheckedChange={checked => {
                                  updateDevice(index, { manipulate_caps_lock_led: checked })
                                }}
                              />
                            </div>

                            {device.identifiers.is_keyboard && (
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`treat-builtin-${deviceId}`} className="text-sm">
                                  Treat as Built-in Keyboard
                                </Label>
                                <Switch
                                  id={`treat-builtin-${deviceId}`}
                                  checked={device.treat_as_built_in_keyboard ?? false}
                                  onCheckedChange={checked => {
                                    updateDevice(index, { treat_as_built_in_keyboard: checked })
                                  }}
                                />
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <Label htmlFor={`disable-builtin-${deviceId}`} className="text-sm">
                                Disable Built-in Keyboard When Connected
                              </Label>
                              <Switch
                                id={`disable-builtin-${deviceId}`}
                                checked={device.disable_built_in_keyboard_if_exists ?? false}
                                onCheckedChange={checked => {
                                  updateDevice(index, {
                                    disable_built_in_keyboard_if_exists: checked
                                  })
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )
          })}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">Device Management Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                <li>Import devices from Karabiner-EventViewer JSON</li>
                <li>Configure device-specific mappings in Simple Modifications tab</li>
                <li>Toggle devices on/off with the switch</li>
                <li>Adjust device-specific settings like Caps Lock LED behavior</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface AddDeviceFormProps {
  onAdd: (identifiers: DeviceIdentifier) => void
  onCancel: () => void
}

function AddDeviceForm({ onAdd, onCancel }: AddDeviceFormProps) {
  const [vendorId, setVendorId] = useState('')
  const [productId, setProductId] = useState('')
  const [deviceType, setDeviceType] = useState<'keyboard' | 'mouse'>('keyboard')
  const [isBuiltIn, setIsBuiltIn] = useState(false)
  const [isGeneric, setIsGeneric] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let identifiers: DeviceIdentifier

    if (isGeneric) {
      // Generic device (like built-in keyboard with minimal identifiers)
      identifiers = {
        is_keyboard: deviceType === 'keyboard',
        is_pointing_device: deviceType === 'mouse',
        is_built_in_keyboard: isBuiltIn && deviceType === 'keyboard'
      }
    } else {
      // Device with vendor/product IDs
      identifiers = {
        vendor_id: parseInt(vendorId, 10),
        product_id: parseInt(productId, 10),
        is_keyboard: deviceType === 'keyboard',
        is_pointing_device: deviceType === 'mouse',
        is_built_in_keyboard: isBuiltIn && deviceType === 'keyboard'
      }
    }

    onAdd(identifiers)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch id="is-generic" checked={isGeneric} onCheckedChange={setIsGeneric} />
        <Label htmlFor="is-generic">Generic Device (no vendor/product ID)</Label>
      </div>

      {!isGeneric && (
        <>
          <div>
            <Label htmlFor="vendor-id">Vendor ID</Label>
            <Input
              id="vendor-id"
              type="number"
              placeholder="e.g., 1452"
              value={vendorId}
              onChange={e => setVendorId(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="product-id">Product ID</Label>
            <Input
              id="product-id"
              type="number"
              placeholder="e.g., 832"
              value={productId}
              onChange={e => setProductId(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="device-type">Device Type</Label>
        <Select value={deviceType} onValueChange={v => setDeviceType(v as 'keyboard' | 'mouse')}>
          <SelectTrigger id="device-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="keyboard">Keyboard</SelectItem>
            <SelectItem value="mouse">Mouse/Trackpad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {deviceType === 'keyboard' && (
        <div className="flex items-center gap-2">
          <Switch id="is-builtin" checked={isBuiltIn} onCheckedChange={setIsBuiltIn} />
          <Label htmlFor="is-builtin">Built-in Keyboard</Label>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Device</Button>
      </div>
    </form>
  )
}

interface ImportDevicesFormProps {
  onImport: (devices: DeviceIdentifier[]) => void
  onCancel: () => void
}

function ImportDevicesForm({ onImport, onCancel }: ImportDevicesFormProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)
  const [parsedDevices, setParsedDevices] = useState<DeviceIdentifier[]>([])
  const [deviceNames, setDeviceNames] = useState<Record<string, string>>({}) // Store original device names

  const handleJsonChange = (value: string) => {
    setJsonInput(value)
    setParseError(null)
    setParsedDevices([])

    if (!value.trim()) return

    try {
      const parsed = JSON.parse(value)

      // Handle array of devices (Karabiner-EventViewer format)
      if (Array.isArray(parsed)) {
        const validDevices: DeviceIdentifier[] = []
        const names: Record<string, string> = {}

        for (const device of parsed) {
          const identifiers = device.device_identifiers || {}

          // Skip consumer devices (headsets, etc)
          if (identifiers.is_consumer) continue

          // Skip virtual devices (Karabiner's own virtual keyboard)
          if (identifiers.is_virtual_device) continue

          // Skip devices that are neither keyboard nor pointing device
          if (
            !identifiers.is_keyboard &&
            !identifiers.is_pointing_device &&
            !device.is_built_in_keyboard &&
            !device.is_built_in_pointing_device
          )
            continue

          let deviceIdentifier: DeviceIdentifier

          // Handle built-in Apple devices without vendor/product IDs
          if (device.is_built_in_keyboard && !identifiers.vendor_id) {
            deviceIdentifier = {
              vendor_id: 1452, // Apple vendor ID
              product_id: 635, // Unique ID for built-in keyboard
              location_id: device.location_id,
              is_keyboard: true,
              is_pointing_device: false,
              is_built_in_keyboard: true
            }
            names['1452_635'] = 'Apple Internal Keyboard'
          } else if (device.is_built_in_pointing_device && !identifiers.vendor_id) {
            deviceIdentifier = {
              vendor_id: 1452, // Apple vendor ID
              product_id: 636, // Unique ID for built-in trackpad
              location_id: device.location_id,
              is_keyboard: false,
              is_pointing_device: true,
              is_built_in_keyboard: false
            }
            names['1452_636'] = 'Apple Internal Trackpad'
          }
          // Handle devices with vendor/product IDs
          else if (identifiers.vendor_id && identifiers.product_id) {
            deviceIdentifier = {
              vendor_id: identifiers.vendor_id,
              product_id: identifiers.product_id,
              location_id: device.location_id,
              is_keyboard: identifiers.is_keyboard ?? false,
              is_pointing_device: identifiers.is_pointing_device ?? false,
              is_built_in_keyboard: device.is_built_in_keyboard ?? false,
              is_touch_bar: identifiers.is_touch_bar ?? false
            }

            // Store the device name
            const key = `${identifiers.vendor_id}_${identifiers.product_id}`
            if (device.manufacturer || device.product) {
              names[key] = `${device.manufacturer || ''} ${device.product || ''}`.trim()
            }
          } else {
            // Skip devices without proper identification
            continue
          }

          // Check for duplicates before adding
          const isDuplicate = validDevices.some(
            d =>
              d.vendor_id === deviceIdentifier.vendor_id &&
              d.product_id === deviceIdentifier.product_id
          )

          if (!isDuplicate) {
            validDevices.push(deviceIdentifier)
          }
        }

        setDeviceNames(names)
        setParsedDevices(validDevices)
      } else {
        setParseError(
          'Invalid JSON format. Expected an array of devices from Karabiner-EventViewer.'
        )
      }
    } catch (err) {
      if (value.trim()) {
        setParseError(`Invalid JSON: ${(err as Error).message}`)
      }
    }
  }

  const handleImport = () => {
    if (parsedDevices.length > 0) {
      onImport(parsedDevices)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="json-input">JSON from Karabiner-EventViewer</Label>
        <textarea
          id="json-input"
          className="w-full h-64 p-3 mt-1 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder={`Paste JSON from Karabiner-EventViewer Devices tab, e.g.:
[
  {
    "device_id": 4294986810,
    "device_identifiers": {
      "is_keyboard": true,
      "product_id": 6,
      "vendor_id": 18003
    },
    "manufacturer": "foostan",
    "product": "Cornelius rev2",
    ...
  }
]`}
          value={jsonInput}
          onChange={e => handleJsonChange(e.target.value)}
        />
      </div>

      {parseError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{parseError}</p>
        </div>
      )}

      {parsedDevices.length > 0 && (
        <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-600 dark:text-green-400 mb-2">
            Successfully parsed {parsedDevices.length} device{parsedDevices.length > 1 ? 's' : ''}:
          </p>
          <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
            {parsedDevices.map(device => {
              const key = `${device.vendor_id}_${device.product_id}`
              const deviceName =
                deviceNames[key] ||
                (device.is_built_in_keyboard
                  ? 'Built-in Keyboard'
                  : device.is_pointing_device
                    ? 'Mouse/Trackpad'
                    : 'Device')
              return (
                <li key={key} className="font-mono">
                  • {deviceName} (VID: {device.vendor_id}, PID: {device.product_id})
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleImport} disabled={parsedDevices.length === 0}>
          Import {parsedDevices.length} Device{parsedDevices.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  )
}
