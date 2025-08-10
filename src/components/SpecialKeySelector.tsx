import type React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { KeyData } from '@/data/keyboardLayouts'
import { Key } from './keyboard/Key'

interface SpecialKeySelectorProps {
  onKeySelect: (keyCode: string) => void
}

// Key descriptions
const keyDescriptions: Record<string, string> = {
  // Media keys
  play_or_pause: 'Toggle media play/pause',
  fastforward: 'Fast forward media',
  rewind: 'Rewind media',
  volume_up: 'Increase system volume',
  volume_down: 'Decrease system volume',
  mute: 'Toggle system mute',
  eject: 'Eject disk',

  // Display keys
  display_brightness_up: 'Increase display brightness',
  display_brightness_down: 'Decrease display brightness',
  apple_display_brightness_up: 'Increase Apple display brightness',
  apple_display_brightness_down: 'Decrease Apple display brightness',
  apple_top_case_display_brightness_up: 'Increase Touch Bar brightness',
  apple_top_case_display_brightness_down: 'Decrease Touch Bar brightness',

  // System keys
  power: 'System power button',
  mission_control: 'Open Mission Control',
  launchpad: 'Open Launchpad',
  dashboard: 'Open Dashboard',
  illumination_up: 'Increase keyboard backlight',
  illumination_down: 'Decrease keyboard backlight',

  // Navigation keys
  page_up: 'Scroll up one page',
  page_down: 'Scroll down one page',
  home: 'Move to document beginning',
  end: 'Move to document end',
  insert: 'Toggle insert mode',
  print_screen: 'Take screenshot',
  scroll_lock: 'Toggle scroll lock',
  pause: 'Pause system',

  // Numpad keys
  keypad_num_lock: 'Toggle numpad Num Lock',
  keypad_enter: 'Numpad Enter key',
  keypad_equal_sign: 'Numpad = key (for calculator)'
}

// Key categories
const keyCategories = {
  functionKeys: {
    label: 'Function Keys',
    keys: Array.from({ length: 24 }, (_, i) => ({
      code: `f${i + 1}`,
      label: `F${i + 1}`,
      width: 1,
      description: i >= 12 ? `Extended function key F${i + 1}` : undefined
    }))
  },
  mediaKeys: {
    label: 'Media Keys',
    keys: [
      { code: 'play_or_pause', label: '⏯', width: 1, isConsumer: true },
      { code: 'fastforward', label: '⏩', width: 1, isConsumer: true },
      { code: 'rewind', label: '⏪', width: 1, isConsumer: true },
      { code: 'volume_up', label: '🔊', width: 1, isConsumer: true },
      { code: 'volume_down', label: '🔉', width: 1, isConsumer: true },
      { code: 'mute', label: '🔇', width: 1, isConsumer: true },
      { code: 'eject', label: '⏏', width: 1, isConsumer: true }
    ]
  },
  displayKeys: {
    label: 'Display',
    keys: [
      { code: 'display_brightness_up', label: '☀️+', width: 1.5, isConsumer: true },
      { code: 'display_brightness_down', label: '☀️-', width: 1.5, isConsumer: true },
      { code: 'apple_display_brightness_up', label: '🍎☀️+', width: 2, isConsumer: true },
      { code: 'apple_display_brightness_down', label: '🍎☀️-', width: 2, isConsumer: true },
      { code: 'apple_top_case_display_brightness_up', label: 'TB+', width: 1.5, isConsumer: true },
      { code: 'apple_top_case_display_brightness_down', label: 'TB-', width: 1.5, isConsumer: true }
    ]
  },
  systemKeys: {
    label: 'System',
    keys: [
      { code: 'power', label: '⏻', width: 1, isConsumer: true },
      { code: 'mission_control', label: 'MC', width: 1.25 },
      { code: 'launchpad', label: 'LP', width: 1.25 },
      { code: 'dashboard', label: 'DB', width: 1.25 },
      { code: 'illumination_up', label: '⌨️+', width: 1.25 },
      { code: 'illumination_down', label: '⌨️-', width: 1.25 }
    ]
  },
  navigationKeys: {
    label: 'Navigation',
    keys: [
      { code: 'page_up', label: 'PgUp', width: 1.25 },
      { code: 'page_down', label: 'PgDn', width: 1.25 },
      { code: 'home', label: 'Home', width: 1.25 },
      { code: 'end', label: 'End', width: 1.25 },
      { code: 'insert', label: 'Ins', width: 1.25 },
      { code: 'print_screen', label: 'PrtSc', width: 1.25 },
      { code: 'scroll_lock', label: 'ScrLk', width: 1.25 },
      { code: 'pause', label: 'Pause', width: 1.25 }
    ]
  },
  numpadKeys: {
    label: 'Numpad',
    keys: [
      { code: 'keypad_num_lock', label: 'Num', width: 1 },
      { code: 'keypad_slash', label: '/', width: 1 },
      { code: 'keypad_asterisk', label: '*', width: 1 },
      { code: 'keypad_hyphen', label: '-', width: 1 },
      { code: 'keypad_7', label: '7', width: 1 },
      { code: 'keypad_8', label: '8', width: 1 },
      { code: 'keypad_9', label: '9', width: 1 },
      { code: 'keypad_plus', label: '+', width: 1, height: 2 },
      { code: 'keypad_4', label: '4', width: 1 },
      { code: 'keypad_5', label: '5', width: 1 },
      { code: 'keypad_6', label: '6', width: 1 },
      { code: 'keypad_1', label: '1', width: 1 },
      { code: 'keypad_2', label: '2', width: 1 },
      { code: 'keypad_3', label: '3', width: 1 },
      { code: 'keypad_enter', label: 'Enter', width: 1, height: 2 },
      { code: 'keypad_0', label: '0', width: 2 },
      { code: 'keypad_period', label: '.', width: 1 },
      { code: 'keypad_equal_sign', label: '=', width: 1 },
      { code: 'keypad_comma', label: ',', width: 1 }
    ]
  }
}

export const SpecialKeySelector: React.FC<SpecialKeySelectorProps> = ({ onKeySelect }) => {
  const handleKeyClick = (keyCode: string, isConsumer = false) => {
    // Consumer key codesは別の形式で処理が必要
    if (isConsumer) {
      // KeyMappingEditorで処理するために特別なプレフィックスを付ける
      onKeySelect(`consumer_${keyCode}`)
    } else {
      onKeySelect(keyCode)
    }
  }

  const createKeyData = (key: {
    code: string
    label: string
    width?: number
    height?: number
  }): KeyData => ({
    keyCode: key.code,
    label: key.label,
    width: key.width || 1,
    height: key.height || 1
  })

  return (
    <div className="space-y-4">
      <Tabs defaultValue="function" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="function">Function</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="numpad">Numpad</TabsTrigger>
        </TabsList>

        <TabsContent value="function" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-wrap gap-1">
              {keyCategories.functionKeys.keys.map(key => (
                <div key={key.code} className="relative">
                  <Key
                    keyData={createKeyData(key)}
                    onClick={() => handleKeyClick(key.code)}
                    tooltip={key.description || keyDescriptions[key.code]}
                    showTooltip={!!key.description}
                    padding={1}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-wrap gap-1">
              {keyCategories.mediaKeys.keys.map(key => (
                <div key={key.code} className="relative">
                  <Key
                    keyData={createKeyData(key)}
                    onClick={() => handleKeyClick(key.code, key.isConsumer)}
                    tooltip={keyDescriptions[key.code]}
                    showTooltip={true}
                    padding={1}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="display" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-wrap gap-1">
              {keyCategories.displayKeys.keys.map(key => (
                <div key={key.code} className="relative">
                  <Key
                    keyData={createKeyData(key)}
                    onClick={() => handleKeyClick(key.code, key.isConsumer)}
                    tooltip={keyDescriptions[key.code]}
                    showTooltip={true}
                    padding={1}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-wrap gap-1">
              {keyCategories.systemKeys.keys.map(key => (
                <div key={key.code} className="relative">
                  <Key
                    keyData={createKeyData(key)}
                    onClick={() => handleKeyClick(key.code, key.isConsumer)}
                    tooltip={keyDescriptions[key.code]}
                    showTooltip={true}
                    padding={1}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="navigation" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-wrap gap-1">
              {keyCategories.navigationKeys.keys.map(key => (
                <div key={key.code} className="relative">
                  <Key
                    keyData={createKeyData(key)}
                    onClick={() => handleKeyClick(key.code)}
                    tooltip={keyDescriptions[key.code]}
                    showTooltip={true}
                    padding={1}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="numpad" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-4 gap-1" style={{ width: '240px' }}>
              {/* Row 1 */}
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[0])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[0].code)}
                tooltip={keyDescriptions[keyCategories.numpadKeys.keys[0].code]}
                showTooltip={!!keyDescriptions[keyCategories.numpadKeys.keys[0].code]}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[1])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[1].code)}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[2])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[2].code)}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[3])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[3].code)}
                padding={1}
              />

              {/* Row 2 - 7,8,9,+ */}
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[4])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[4].code)}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[5])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[5].code)}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[6])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[6].code)}
                padding={1}
              />
              <div className="row-span-2">
                <Key
                  keyData={createKeyData(keyCategories.numpadKeys.keys[7])}
                  onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[7].code)}
                  padding={1}
                />
              </div>

              {/* Row 3 - 4,5,6 */}
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[8])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[8].code)}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[9])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[9].code)}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[10])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[10].code)}
                padding={1}
              />

              {/* Row 4 - 1,2,3,Enter */}
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[11])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[11].code)}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[12])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[12].code)}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[13])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[13].code)}
                padding={1}
              />
              <div className="row-span-2">
                <Key
                  keyData={createKeyData(keyCategories.numpadKeys.keys[14])}
                  onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[14].code)}
                  tooltip={keyDescriptions[keyCategories.numpadKeys.keys[14].code]}
                  showTooltip={!!keyDescriptions[keyCategories.numpadKeys.keys[14].code]}
                  padding={1}
                />
              </div>

              {/* Row 5 - 0(double width), ., = */}
              <div className="col-span-2">
                <Key
                  keyData={createKeyData(keyCategories.numpadKeys.keys[15])}
                  onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[15].code)}
                  padding={1}
                />
              </div>
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[16])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[16].code)}
                padding={1}
              />

              {/* Additional keys */}
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[17])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[17].code)}
                tooltip={keyDescriptions[keyCategories.numpadKeys.keys[17].code]}
                showTooltip={!!keyDescriptions[keyCategories.numpadKeys.keys[17].code]}
                padding={1}
              />
              <Key
                keyData={createKeyData(keyCategories.numpadKeys.keys[18])}
                onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[18].code)}
                padding={1}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
