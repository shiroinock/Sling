import { Laptop, Monitor } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { Device } from '@/types/karabiner'

interface DeviceTargetSelectorProps {
  devices: Device[]
  value: string
  onChange: (value: string) => void
}

export function DeviceTargetSelector({ devices, value, onChange }: DeviceTargetSelectorProps) {
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

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[240px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="profile">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span>All Devices</span>
            </div>
          </SelectItem>
          {devices.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                Device-Specific
              </div>
              {devices.map((device, index) => {
                const deviceKey = `${device.identifiers.vendor_id || 'generic'}_${device.identifiers.product_id || 'device'}_${index}`
                return (
                  <SelectItem key={deviceKey} value={`device-${index}`}>
                    <div className="flex items-center gap-2">
                      <Laptop className="w-4 h-4" />
                      <span>{getDeviceName(device)}</span>
                      {device.simple_modifications && device.simple_modifications.length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {device.simple_modifications.length}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                )
              })}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
