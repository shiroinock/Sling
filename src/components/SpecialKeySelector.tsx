import {
  MonitorSpeaker,
  Moon,
  Play,
  Power,
  SkipBack,
  SkipForward,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react'
import type React from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SpecialKeySelectorProps {
  onKeySelect: (keyCode: string) => void
}

// アイコンマッピング
const iconMap: Record<string, React.ReactNode> = {
  play_or_pause: <Play className="h-4 w-4" />,
  fastforward: <SkipForward className="h-4 w-4" />,
  rewind: <SkipBack className="h-4 w-4" />,
  volume_up: <Volume2 className="h-4 w-4" />,
  volume_down: <Volume2 className="h-4 w-4" />,
  mute: <VolumeX className="h-4 w-4" />,
  display_brightness_up: <Sun className="h-4 w-4" />,
  display_brightness_down: <Moon className="h-4 w-4" />,
  power: <Power className="h-4 w-4" />,
  eject: <MonitorSpeaker className="h-4 w-4" />
}

// キーのカテゴリ分け
const keyCategories = {
  functionKeys: {
    label: 'ファンクションキー',
    keys: [
      { code: 'f1', label: 'F1' },
      { code: 'f2', label: 'F2' },
      { code: 'f3', label: 'F3' },
      { code: 'f4', label: 'F4' },
      { code: 'f5', label: 'F5' },
      { code: 'f6', label: 'F6' },
      { code: 'f7', label: 'F7' },
      { code: 'f8', label: 'F8' },
      { code: 'f9', label: 'F9' },
      { code: 'f10', label: 'F10' },
      { code: 'f11', label: 'F11' },
      { code: 'f12', label: 'F12' },
      { code: 'f13', label: 'F13' },
      { code: 'f14', label: 'F14' },
      { code: 'f15', label: 'F15' },
      { code: 'f16', label: 'F16' },
      { code: 'f17', label: 'F17' },
      { code: 'f18', label: 'F18' },
      { code: 'f19', label: 'F19' },
      { code: 'f20', label: 'F20' },
      { code: 'f21', label: 'F21' },
      { code: 'f22', label: 'F22' },
      { code: 'f23', label: 'F23' },
      { code: 'f24', label: 'F24' }
    ]
  },
  mediaKeys: {
    label: 'メディアキー',
    keys: [
      { code: 'play_or_pause', label: '再生/一時停止', isConsumer: true },
      { code: 'fastforward', label: '早送り', isConsumer: true },
      { code: 'rewind', label: '巻き戻し', isConsumer: true },
      { code: 'volume_up', label: '音量を上げる', isConsumer: true },
      { code: 'volume_down', label: '音量を下げる', isConsumer: true },
      { code: 'mute', label: 'ミュート', isConsumer: true },
      { code: 'eject', label: 'イジェクト', isConsumer: true }
    ]
  },
  displayKeys: {
    label: 'ディスプレイ',
    keys: [
      { code: 'display_brightness_up', label: '画面の明るさを上げる', isConsumer: true },
      { code: 'display_brightness_down', label: '画面の明るさを下げる', isConsumer: true },
      {
        code: 'apple_display_brightness_up',
        label: 'Apple 画面の明るさを上げる',
        isConsumer: true
      },
      {
        code: 'apple_display_brightness_down',
        label: 'Apple 画面の明るさを下げる',
        isConsumer: true
      },
      {
        code: 'apple_top_case_display_brightness_up',
        label: 'Touch Bar 明るさを上げる',
        isConsumer: true
      },
      {
        code: 'apple_top_case_display_brightness_down',
        label: 'Touch Bar 明るさを下げる',
        isConsumer: true
      }
    ]
  },
  systemKeys: {
    label: 'システム',
    keys: [
      { code: 'power', label: '電源', isConsumer: true },
      { code: 'mission_control', label: 'Mission Control' },
      { code: 'launchpad', label: 'Launchpad' },
      { code: 'dashboard', label: 'Dashboard' },
      { code: 'illumination_up', label: 'キーボード照明を上げる' },
      { code: 'illumination_down', label: 'キーボード照明を下げる' }
    ]
  },
  navigationKeys: {
    label: 'ナビゲーション',
    keys: [
      { code: 'page_up', label: 'Page Up' },
      { code: 'page_down', label: 'Page Down' },
      { code: 'home', label: 'Home' },
      { code: 'end', label: 'End' },
      { code: 'insert', label: 'Insert' },
      { code: 'print_screen', label: 'Print Screen' },
      { code: 'scroll_lock', label: 'Scroll Lock' },
      { code: 'pause', label: 'Pause' }
    ]
  },
  numpadKeys: {
    label: 'テンキー',
    keys: [
      { code: 'keypad_num_lock', label: 'Num Lock' },
      { code: 'keypad_slash', label: 'Keypad /' },
      { code: 'keypad_asterisk', label: 'Keypad *' },
      { code: 'keypad_hyphen', label: 'Keypad -' },
      { code: 'keypad_plus', label: 'Keypad +' },
      { code: 'keypad_enter', label: 'Keypad Enter' },
      { code: 'keypad_1', label: 'Keypad 1' },
      { code: 'keypad_2', label: 'Keypad 2' },
      { code: 'keypad_3', label: 'Keypad 3' },
      { code: 'keypad_4', label: 'Keypad 4' },
      { code: 'keypad_5', label: 'Keypad 5' },
      { code: 'keypad_6', label: 'Keypad 6' },
      { code: 'keypad_7', label: 'Keypad 7' },
      { code: 'keypad_8', label: 'Keypad 8' },
      { code: 'keypad_9', label: 'Keypad 9' },
      { code: 'keypad_0', label: 'Keypad 0' },
      { code: 'keypad_period', label: 'Keypad .' },
      { code: 'keypad_equal_sign', label: 'Keypad =' },
      { code: 'keypad_comma', label: 'Keypad ,' }
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

  return (
    <div className="space-y-4">
      <Tabs defaultValue="function" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="function">ファンクション</TabsTrigger>
          <TabsTrigger value="media">メディア</TabsTrigger>
          <TabsTrigger value="display">ディスプレイ</TabsTrigger>
          <TabsTrigger value="system">システム</TabsTrigger>
          <TabsTrigger value="navigation">ナビ</TabsTrigger>
          <TabsTrigger value="numpad">テンキー</TabsTrigger>
        </TabsList>

        <TabsContent value="function" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-4 gap-2">
              {keyCategories.functionKeys.keys.map(key => (
                <Button
                  key={key.code}
                  variant="outline"
                  size="sm"
                  onClick={() => handleKeyClick(key.code)}
                  className="h-10 text-xs"
                >
                  {key.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-2 gap-2">
              {keyCategories.mediaKeys.keys.map(key => (
                <Button
                  key={key.code}
                  variant="outline"
                  size="sm"
                  onClick={() => handleKeyClick(key.code, key.isConsumer)}
                  className="h-12 justify-start gap-2"
                >
                  {iconMap[key.code]}
                  <span className="text-xs">{key.label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="display" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-1 gap-2">
              {keyCategories.displayKeys.keys.map(key => (
                <Button
                  key={key.code}
                  variant="outline"
                  size="sm"
                  onClick={() => handleKeyClick(key.code, key.isConsumer)}
                  className="h-12 justify-start gap-2"
                >
                  {iconMap[key.code]}
                  <span className="text-xs">{key.label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-2 gap-2">
              {keyCategories.systemKeys.keys.map(key => (
                <Button
                  key={key.code}
                  variant="outline"
                  size="sm"
                  onClick={() => handleKeyClick(key.code, key.isConsumer)}
                  className="h-12 justify-start gap-2"
                >
                  {iconMap[key.code]}
                  <span className="text-xs">{key.label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="navigation" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-2 gap-2">
              {keyCategories.navigationKeys.keys.map(key => (
                <Button
                  key={key.code}
                  variant="outline"
                  size="sm"
                  onClick={() => handleKeyClick(key.code)}
                  className="h-12 justify-start"
                >
                  <span className="text-xs">{key.label}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="numpad" className="mt-4">
          <ScrollArea className="h-[300px] w-full rounded-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-3 gap-2">
              {keyCategories.numpadKeys.keys.map(key => (
                <Button
                  key={key.code}
                  variant="outline"
                  size="sm"
                  onClick={() => handleKeyClick(key.code)}
                  className="h-10 text-xs"
                >
                  {key.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
