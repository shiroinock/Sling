import type React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { KeyData } from '@/data/keyboardLayouts'
import { Key } from './keyboard/Key'

interface SpecialKeySelectorProps {
  onKeySelect: (keyCode: string) => void
}

// キーの説明情報
const keyDescriptions: Record<string, string> = {
  // メディアキー
  play_or_pause: 'メディアの再生と一時停止を切り替えます',
  fastforward: 'メディアを早送りします',
  rewind: 'メディアを巻き戻します',
  volume_up: 'システムの音量を上げます',
  volume_down: 'システムの音量を下げます',
  mute: 'システムの音声をミュート/ミュート解除します',
  eject: 'ディスクをイジェクトします',
  
  // ディスプレイキー
  display_brightness_up: 'ディスプレイの明るさを上げます',
  display_brightness_down: 'ディスプレイの明るさを下げます',
  apple_display_brightness_up: 'Apple製ディスプレイの明るさを上げます',
  apple_display_brightness_down: 'Apple製ディスプレイの明るさを下げます',
  apple_top_case_display_brightness_up: 'Touch Barの明るさを上げます',
  apple_top_case_display_brightness_down: 'Touch Barの明るさを下げます',
  
  // システムキー
  power: 'システムの電源ボタン',
  mission_control: 'Mission Controlを開きます',
  launchpad: 'Launchpadを開きます',
  dashboard: 'Dashboardを開きます',
  illumination_up: 'キーボードバックライトを明るくします',
  illumination_down: 'キーボードバックライトを暗くします',
  
  // ナビゲーションキー
  page_up: '1ページ上にスクロールします',
  page_down: '1ページ下にスクロールします',
  home: 'ドキュメントの先頭に移動します',
  end: 'ドキュメントの末尾に移動します',
  insert: '挿入モードを切り替えます',
  print_screen: 'スクリーンショットを撮影します',
  scroll_lock: 'スクロールロックを切り替えます',
  pause: 'システムを一時停止します',
  
  // テンキー
  keypad_num_lock: 'テンキーのNum Lockを切り替えます',
  keypad_enter: 'テンキーのEnterキー',
  keypad_equal_sign: 'テンキーの=キー（電卓用）'
}

// キーのカテゴリ分け
const keyCategories = {
  functionKeys: {
    label: 'ファンクションキー',
    keys: Array.from({ length: 24 }, (_, i) => ({
      code: `f${i + 1}`,
      label: `F${i + 1}`,
      width: 1,
      description: i >= 12 ? `拡張ファンクションキー F${i + 1}` : undefined
    }))
  },
  mediaKeys: {
    label: 'メディアキー',
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
    label: 'ディスプレイ',
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
    label: 'システム',
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
    label: 'ナビゲーション',
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
    label: 'テンキー',
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

  const createKeyData = (key: any): KeyData => ({
    keyCode: key.code,
    label: key.label,
    width: key.width || 1,
    height: key.height || 1
  })

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
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[0])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[0].code)}
                   tooltip={keyDescriptions[keyCategories.numpadKeys.keys[0].code]}
                   showTooltip={!!keyDescriptions[keyCategories.numpadKeys.keys[0].code]}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[1])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[1].code)}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[2])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[2].code)}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[3])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[3].code)}
                   padding={1} />
              
              {/* Row 2 - 7,8,9,+ */}
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[4])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[4].code)}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[5])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[5].code)}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[6])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[6].code)}
                   padding={1} />
              <div className="row-span-2">
                <Key keyData={createKeyData(keyCategories.numpadKeys.keys[7])} 
                     onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[7].code)}
                     padding={1} />
              </div>
              
              {/* Row 3 - 4,5,6 */}
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[8])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[8].code)}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[9])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[9].code)}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[10])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[10].code)}
                   padding={1} />
              
              {/* Row 4 - 1,2,3,Enter */}
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[11])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[11].code)}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[12])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[12].code)}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[13])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[13].code)}
                   padding={1} />
              <div className="row-span-2">
                <Key keyData={createKeyData(keyCategories.numpadKeys.keys[14])} 
                     onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[14].code)}
                     tooltip={keyDescriptions[keyCategories.numpadKeys.keys[14].code]}
                     showTooltip={!!keyDescriptions[keyCategories.numpadKeys.keys[14].code]}
                     padding={1} />
              </div>
              
              {/* Row 5 - 0(double width), ., = */}
              <div className="col-span-2">
                <Key keyData={createKeyData(keyCategories.numpadKeys.keys[15])} 
                     onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[15].code)}
                     padding={1} />
              </div>
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[16])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[16].code)}
                   padding={1} />
              
              {/* Additional keys */}
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[17])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[17].code)}
                   tooltip={keyDescriptions[keyCategories.numpadKeys.keys[17].code]}
                   showTooltip={!!keyDescriptions[keyCategories.numpadKeys.keys[17].code]}
                   padding={1} />
              <Key keyData={createKeyData(keyCategories.numpadKeys.keys[18])} 
                   onClick={() => handleKeyClick(keyCategories.numpadKeys.keys[18].code)}
                   padding={1} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}