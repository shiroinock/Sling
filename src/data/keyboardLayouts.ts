export interface KeyData {
  keyCode: string
  label: string
  shiftLabel?: string
  width?: number // 1 = 1u (standard key width)
  height?: number // 1 = 1u (standard key height)
  x?: number // X offset in units
  y?: number // Y offset in units
}

export interface KeyboardRow {
  keys: KeyData[]
  y?: number // Row Y position
}

export interface KeyboardLayout {
  name: string
  rows: KeyboardRow[]
  width: number // Total width in units
  height: number // Total height in units
}

// US ANSI 60% keyboard layout
export const usAnsiLayout: KeyboardLayout = {
  name: 'US ANSI',
  width: 15,
  height: 5,
  rows: [
    // Row 1 - Numbers and symbols
    {
      keys: [
        { keyCode: 'grave_accent_and_tilde', label: '`', shiftLabel: '~' },
        { keyCode: '1', label: '1', shiftLabel: '!' },
        { keyCode: '2', label: '2', shiftLabel: '@' },
        { keyCode: '3', label: '3', shiftLabel: '#' },
        { keyCode: '4', label: '4', shiftLabel: '$' },
        { keyCode: '5', label: '5', shiftLabel: '%' },
        { keyCode: '6', label: '6', shiftLabel: '^' },
        { keyCode: '7', label: '7', shiftLabel: '&' },
        { keyCode: '8', label: '8', shiftLabel: '*' },
        { keyCode: '9', label: '9', shiftLabel: '(' },
        { keyCode: '0', label: '0', shiftLabel: ')' },
        { keyCode: 'hyphen', label: '-', shiftLabel: '_' },
        { keyCode: 'equal_sign', label: '=', shiftLabel: '+' },
        { keyCode: 'delete_or_backspace', label: 'Backspace', width: 2 }
      ]
    },
    // Row 2 - Tab and QWERTY
    {
      keys: [
        { keyCode: 'tab', label: 'Tab', width: 1.5 },
        { keyCode: 'q', label: 'Q' },
        { keyCode: 'w', label: 'W' },
        { keyCode: 'e', label: 'E' },
        { keyCode: 'r', label: 'R' },
        { keyCode: 't', label: 'T' },
        { keyCode: 'y', label: 'Y' },
        { keyCode: 'u', label: 'U' },
        { keyCode: 'i', label: 'I' },
        { keyCode: 'o', label: 'O' },
        { keyCode: 'p', label: 'P' },
        { keyCode: 'open_bracket', label: '[', shiftLabel: '{' },
        { keyCode: 'close_bracket', label: ']', shiftLabel: '}' },
        { keyCode: 'backslash', label: '\\', shiftLabel: '|', width: 1.5 }
      ]
    },
    // Row 3 - Caps Lock and ASDFGH
    {
      keys: [
        { keyCode: 'caps_lock', label: 'Caps Lock', width: 1.75 },
        { keyCode: 'a', label: 'A' },
        { keyCode: 's', label: 'S' },
        { keyCode: 'd', label: 'D' },
        { keyCode: 'f', label: 'F' },
        { keyCode: 'g', label: 'G' },
        { keyCode: 'h', label: 'H' },
        { keyCode: 'j', label: 'J' },
        { keyCode: 'k', label: 'K' },
        { keyCode: 'l', label: 'L' },
        { keyCode: 'semicolon', label: ';', shiftLabel: ':' },
        { keyCode: 'quote', label: "'", shiftLabel: '"' },
        { keyCode: 'return_or_enter', label: 'Enter', width: 2.25 }
      ]
    },
    // Row 4 - Shift and ZXCVB
    {
      keys: [
        { keyCode: 'left_shift', label: 'Shift', width: 2.25 },
        { keyCode: 'z', label: 'Z' },
        { keyCode: 'x', label: 'X' },
        { keyCode: 'c', label: 'C' },
        { keyCode: 'v', label: 'V' },
        { keyCode: 'b', label: 'B' },
        { keyCode: 'n', label: 'N' },
        { keyCode: 'm', label: 'M' },
        { keyCode: 'comma', label: ',', shiftLabel: '<' },
        { keyCode: 'period', label: '.', shiftLabel: '>' },
        { keyCode: 'slash', label: '/', shiftLabel: '?' },
        { keyCode: 'right_shift', label: 'Shift', width: 2.75 }
      ]
    },
    // Row 5 - Bottom row with modifiers
    {
      keys: [
        { keyCode: 'left_control', label: 'Ctrl', width: 1.25 },
        { keyCode: 'left_option', label: 'Option', width: 1.25 },
        { keyCode: 'left_command', label: 'Cmd', width: 1.25 },
        { keyCode: 'spacebar', label: 'Space', width: 6.25 },
        { keyCode: 'right_command', label: 'Cmd', width: 1.25 },
        { keyCode: 'right_option', label: 'Option', width: 1.25 },
        { keyCode: 'right_control', label: 'Ctrl', width: 1.25 },
        { keyCode: 'fn', label: 'Fn', width: 1.25 }
      ]
    }
  ]
}

// JIS (Japanese) keyboard layout
export const jisLayout: KeyboardLayout = {
  name: 'JIS',
  width: 15,
  height: 5,
  rows: [
    // Row 1 - Numbers and symbols (JIS specific)
    {
      keys: [
        { keyCode: 'japanese_eisuu', label: '英数', width: 1 },
        { keyCode: '1', label: '1', shiftLabel: '!' },
        { keyCode: '2', label: '2', shiftLabel: '"' },
        { keyCode: '3', label: '3', shiftLabel: '#' },
        { keyCode: '4', label: '4', shiftLabel: '$' },
        { keyCode: '5', label: '5', shiftLabel: '%' },
        { keyCode: '6', label: '6', shiftLabel: '&' },
        { keyCode: '7', label: '7', shiftLabel: "'" },
        { keyCode: '8', label: '8', shiftLabel: '(' },
        { keyCode: '9', label: '9', shiftLabel: ')' },
        { keyCode: '0', label: '0', shiftLabel: '~' },
        { keyCode: 'hyphen', label: '-', shiftLabel: '=' },
        { keyCode: 'equal_sign', label: '^', shiftLabel: '~' },
        { keyCode: 'international3', label: '¥', shiftLabel: '|' },
        { keyCode: 'delete_or_backspace', label: 'Delete', width: 1 }
      ]
    },
    // Row 2 - Tab and QWERTY
    {
      keys: [
        { keyCode: 'tab', label: 'Tab', width: 1.5 },
        { keyCode: 'q', label: 'Q' },
        { keyCode: 'w', label: 'W' },
        { keyCode: 'e', label: 'E' },
        { keyCode: 'r', label: 'R' },
        { keyCode: 't', label: 'T' },
        { keyCode: 'y', label: 'Y' },
        { keyCode: 'u', label: 'U' },
        { keyCode: 'i', label: 'I' },
        { keyCode: 'o', label: 'O' },
        { keyCode: 'p', label: 'P' },
        { keyCode: 'open_bracket', label: '@', shiftLabel: '`' },
        { keyCode: 'close_bracket', label: '[', shiftLabel: '{' },
        { keyCode: 'return_or_enter', label: 'Enter', width: 1.5, height: 2, x: 13.5, y: 0 }
      ]
    },
    // Row 3 - Caps Lock and ASDFGH
    {
      keys: [
        { keyCode: 'caps_lock', label: 'Caps', width: 1.75 },
        { keyCode: 'a', label: 'A' },
        { keyCode: 's', label: 'S' },
        { keyCode: 'd', label: 'D' },
        { keyCode: 'f', label: 'F' },
        { keyCode: 'g', label: 'G' },
        { keyCode: 'h', label: 'H' },
        { keyCode: 'j', label: 'J' },
        { keyCode: 'k', label: 'K' },
        { keyCode: 'l', label: 'L' },
        { keyCode: 'semicolon', label: ';', shiftLabel: '+' },
        { keyCode: 'quote', label: ':', shiftLabel: '*' },
        { keyCode: 'backslash', label: ']', shiftLabel: '}' }
      ]
    },
    // Row 4 - Shift and ZXCVB
    {
      keys: [
        { keyCode: 'left_shift', label: 'Shift', width: 2.25 },
        { keyCode: 'z', label: 'Z' },
        { keyCode: 'x', label: 'X' },
        { keyCode: 'c', label: 'C' },
        { keyCode: 'v', label: 'V' },
        { keyCode: 'b', label: 'B' },
        { keyCode: 'n', label: 'N' },
        { keyCode: 'm', label: 'M' },
        { keyCode: 'comma', label: ',', shiftLabel: '<' },
        { keyCode: 'period', label: '.', shiftLabel: '>' },
        { keyCode: 'slash', label: '/', shiftLabel: '?' },
        { keyCode: 'international1', label: '_', shiftLabel: '_' },
        { keyCode: 'right_shift', label: 'Shift', width: 1.75 }
      ]
    },
    // Row 5 - Bottom row with modifiers (JIS specific)
    {
      keys: [
        { keyCode: 'left_control', label: 'Ctrl', width: 1.25 },
        { keyCode: 'left_option', label: 'Option', width: 1 },
        { keyCode: 'left_command', label: 'Cmd', width: 1.25 },
        { keyCode: 'japanese_eisuu', label: '英数', width: 1 },
        { keyCode: 'spacebar', label: 'Space', width: 4.5 },
        { keyCode: 'japanese_kana', label: 'かな', width: 1 },
        { keyCode: 'right_command', label: 'Cmd', width: 1.25 },
        { keyCode: 'right_option', label: 'Option', width: 1 },
        { keyCode: 'application', label: 'Menu', width: 1 },
        { keyCode: 'right_control', label: 'Ctrl', width: 1.25 },
        { keyCode: 'fn', label: 'Fn', width: 1 }
      ]
    }
  ]
}

// MacBook US keyboard layout with arrow keys
export const macbookUsLayout: KeyboardLayout = {
  name: 'MacBook US',
  width: 15,
  height: 6.5,
  rows: [
    // Row 1 - Function keys and special keys
    {
      keys: [
        { keyCode: 'escape', label: 'esc' },
        { keyCode: 'f1', label: 'F1' },
        { keyCode: 'f2', label: 'F2' },
        { keyCode: 'f3', label: 'F3' },
        { keyCode: 'f4', label: 'F4' },
        { keyCode: 'f5', label: 'F5' },
        { keyCode: 'f6', label: 'F6' },
        { keyCode: 'f7', label: 'F7' },
        { keyCode: 'f8', label: 'F8' },
        { keyCode: 'f9', label: 'F9' },
        { keyCode: 'f10', label: 'F10' },
        { keyCode: 'f11', label: 'F11' },
        { keyCode: 'f12', label: 'F12' },
        { keyCode: 'power', label: '⏻', x: 14 }
      ]
    },
    // Row 2 - Numbers and symbols
    {
      y: 1.25,
      keys: [
        { keyCode: 'grave_accent_and_tilde', label: '`', shiftLabel: '~' },
        { keyCode: '1', label: '1', shiftLabel: '!' },
        { keyCode: '2', label: '2', shiftLabel: '@' },
        { keyCode: '3', label: '3', shiftLabel: '#' },
        { keyCode: '4', label: '4', shiftLabel: '$' },
        { keyCode: '5', label: '5', shiftLabel: '%' },
        { keyCode: '6', label: '6', shiftLabel: '^' },
        { keyCode: '7', label: '7', shiftLabel: '&' },
        { keyCode: '8', label: '8', shiftLabel: '*' },
        { keyCode: '9', label: '9', shiftLabel: '(' },
        { keyCode: '0', label: '0', shiftLabel: ')' },
        { keyCode: 'hyphen', label: '-', shiftLabel: '_' },
        { keyCode: 'equal_sign', label: '=', shiftLabel: '+' },
        { keyCode: 'delete_or_backspace', label: 'delete', width: 2 }
      ]
    },
    // Row 3 - Tab and QWERTY
    {
      y: 2.25,
      keys: [
        { keyCode: 'tab', label: 'tab', width: 1.5 },
        { keyCode: 'q', label: 'Q' },
        { keyCode: 'w', label: 'W' },
        { keyCode: 'e', label: 'E' },
        { keyCode: 'r', label: 'R' },
        { keyCode: 't', label: 'T' },
        { keyCode: 'y', label: 'Y' },
        { keyCode: 'u', label: 'U' },
        { keyCode: 'i', label: 'I' },
        { keyCode: 'o', label: 'O' },
        { keyCode: 'p', label: 'P' },
        { keyCode: 'open_bracket', label: '[', shiftLabel: '{' },
        { keyCode: 'close_bracket', label: ']', shiftLabel: '}' },
        { keyCode: 'backslash', label: '\\', shiftLabel: '|', width: 1.5 }
      ]
    },
    // Row 4 - Caps Lock and ASDFGH
    {
      y: 3.25,
      keys: [
        { keyCode: 'caps_lock', label: 'caps lock', width: 1.75 },
        { keyCode: 'a', label: 'A' },
        { keyCode: 's', label: 'S' },
        { keyCode: 'd', label: 'D' },
        { keyCode: 'f', label: 'F' },
        { keyCode: 'g', label: 'G' },
        { keyCode: 'h', label: 'H' },
        { keyCode: 'j', label: 'J' },
        { keyCode: 'k', label: 'K' },
        { keyCode: 'l', label: 'L' },
        { keyCode: 'semicolon', label: ';', shiftLabel: ':' },
        { keyCode: 'quote', label: "'", shiftLabel: '"' },
        { keyCode: 'return_or_enter', label: 'return', width: 2.25 }
      ]
    },
    // Row 5 - Shift and ZXCVB
    {
      y: 4.25,
      keys: [
        { keyCode: 'left_shift', label: 'shift', width: 2.25 },
        { keyCode: 'z', label: 'Z' },
        { keyCode: 'x', label: 'X' },
        { keyCode: 'c', label: 'C' },
        { keyCode: 'v', label: 'V' },
        { keyCode: 'b', label: 'B' },
        { keyCode: 'n', label: 'N' },
        { keyCode: 'm', label: 'M' },
        { keyCode: 'comma', label: ',', shiftLabel: '<' },
        { keyCode: 'period', label: '.', shiftLabel: '>' },
        { keyCode: 'slash', label: '/', shiftLabel: '?' },
        { keyCode: 'right_shift', label: 'shift', width: 2.75 }
      ]
    },
    // Row 6 - Bottom row with modifiers and arrow keys
    {
      y: 5.25,
      keys: [
        { keyCode: 'fn', label: 'fn' },
        { keyCode: 'left_control', label: 'control' },
        { keyCode: 'left_option', label: 'option' },
        { keyCode: 'left_command', label: '⌘', width: 1.25 },
        { keyCode: 'spacebar', label: '', width: 5 },
        { keyCode: 'right_command', label: '⌘', width: 1.25 },
        { keyCode: 'right_option', label: 'option' },
        // Arrow keys
        { keyCode: 'left_arrow', label: '←', x: 11 },
        { keyCode: 'up_arrow', label: '↑', x: 12, y: 4.25, height: 0.5 },
        { keyCode: 'down_arrow', label: '↓', x: 12, y: 5.25 },
        { keyCode: 'right_arrow', label: '→', x: 13 }
      ]
    }
  ]
}

// MacBook JIS keyboard layout with arrow keys
export const macbookJisLayout: KeyboardLayout = {
  name: 'MacBook JIS',
  width: 15,
  height: 6.5,
  rows: [
    // Row 1 - Function keys and special keys
    {
      keys: [
        { keyCode: 'escape', label: 'esc' },
        { keyCode: 'f1', label: 'F1' },
        { keyCode: 'f2', label: 'F2' },
        { keyCode: 'f3', label: 'F3' },
        { keyCode: 'f4', label: 'F4' },
        { keyCode: 'f5', label: 'F5' },
        { keyCode: 'f6', label: 'F6' },
        { keyCode: 'f7', label: 'F7' },
        { keyCode: 'f8', label: 'F8' },
        { keyCode: 'f9', label: 'F9' },
        { keyCode: 'f10', label: 'F10' },
        { keyCode: 'f11', label: 'F11' },
        { keyCode: 'f12', label: 'F12' },
        { keyCode: 'power', label: '⏻', x: 14 }
      ]
    },
    // Row 2 - Numbers and symbols (JIS specific)
    {
      y: 1.25,
      keys: [
        { keyCode: '1', label: '1', shiftLabel: '!' },
        { keyCode: '2', label: '2', shiftLabel: '"' },
        { keyCode: '3', label: '3', shiftLabel: '#' },
        { keyCode: '4', label: '4', shiftLabel: '$' },
        { keyCode: '5', label: '5', shiftLabel: '%' },
        { keyCode: '6', label: '6', shiftLabel: '&' },
        { keyCode: '7', label: '7', shiftLabel: "'" },
        { keyCode: '8', label: '8', shiftLabel: '(' },
        { keyCode: '9', label: '9', shiftLabel: ')' },
        { keyCode: '0', label: '0', shiftLabel: '~' },
        { keyCode: 'hyphen', label: '-', shiftLabel: '=' },
        { keyCode: 'equal_sign', label: '^', shiftLabel: '~' },
        { keyCode: 'international3', label: '¥', shiftLabel: '|' },
        { keyCode: 'delete_or_backspace', label: 'delete', width: 1.5 }
      ]
    },
    // Row 3 - Tab and QWERTY (JIS specific)
    {
      y: 2.25,
      keys: [
        { keyCode: 'tab', label: 'tab', width: 1.5 },
        { keyCode: 'q', label: 'Q' },
        { keyCode: 'w', label: 'W' },
        { keyCode: 'e', label: 'E' },
        { keyCode: 'r', label: 'R' },
        { keyCode: 't', label: 'T' },
        { keyCode: 'y', label: 'Y' },
        { keyCode: 'u', label: 'U' },
        { keyCode: 'i', label: 'I' },
        { keyCode: 'o', label: 'O' },
        { keyCode: 'p', label: 'P' },
        { keyCode: 'open_bracket', label: '@', shiftLabel: '`' },
        { keyCode: 'close_bracket', label: '[', shiftLabel: '{' },
        { keyCode: 'return_or_enter', label: 'return', width: 1.5, height: 2, x: 13.5, y: 0 }
      ]
    },
    // Row 4 - Caps Lock and ASDFGH (JIS specific)
    {
      y: 3.25,
      keys: [
        { keyCode: 'caps_lock', label: 'caps lock', width: 1.75 },
        { keyCode: 'a', label: 'A' },
        { keyCode: 's', label: 'S' },
        { keyCode: 'd', label: 'D' },
        { keyCode: 'f', label: 'F' },
        { keyCode: 'g', label: 'G' },
        { keyCode: 'h', label: 'H' },
        { keyCode: 'j', label: 'J' },
        { keyCode: 'k', label: 'K' },
        { keyCode: 'l', label: 'L' },
        { keyCode: 'semicolon', label: ';', shiftLabel: '+' },
        { keyCode: 'quote', label: ':', shiftLabel: '*' },
        { keyCode: 'backslash', label: ']', shiftLabel: '}' }
      ]
    },
    // Row 5 - Shift and ZXCVB (JIS specific)
    {
      y: 4.25,
      keys: [
        { keyCode: 'left_shift', label: 'shift', width: 2.25 },
        { keyCode: 'z', label: 'Z' },
        { keyCode: 'x', label: 'X' },
        { keyCode: 'c', label: 'C' },
        { keyCode: 'v', label: 'V' },
        { keyCode: 'b', label: 'B' },
        { keyCode: 'n', label: 'N' },
        { keyCode: 'm', label: 'M' },
        { keyCode: 'comma', label: ',', shiftLabel: '<' },
        { keyCode: 'period', label: '.', shiftLabel: '>' },
        { keyCode: 'slash', label: '/', shiftLabel: '?' },
        { keyCode: 'international1', label: '_', shiftLabel: '_' },
        { keyCode: 'right_shift', label: 'shift', width: 1.75 }
      ]
    },
    // Row 6 - Bottom row with modifiers and arrow keys (JIS specific)
    {
      y: 5.25,
      keys: [
        { keyCode: 'fn', label: 'fn' },
        { keyCode: 'left_control', label: 'control' },
        { keyCode: 'left_option', label: 'option' },
        { keyCode: 'left_command', label: '⌘', width: 1.25 },
        { keyCode: 'japanese_eisuu', label: '英数' },
        { keyCode: 'spacebar', label: '', width: 3.5 },
        { keyCode: 'japanese_kana', label: 'かな' },
        { keyCode: 'right_command', label: '⌘', width: 1.25 },
        // Arrow keys
        { keyCode: 'left_arrow', label: '←', x: 11 },
        { keyCode: 'up_arrow', label: '↑', x: 12, y: 4.25, height: 0.5 },
        { keyCode: 'down_arrow', label: '↓', x: 12, y: 5.25 },
        { keyCode: 'right_arrow', label: '→', x: 13 }
      ]
    }
  ]
}

export type LayoutType = 'us-ansi' | 'jis' | 'macbook-us' | 'macbook-jis'

export const layouts: Record<LayoutType, KeyboardLayout> = {
  'us-ansi': usAnsiLayout,
  jis: jisLayout,
  'macbook-us': macbookUsLayout,
  'macbook-jis': macbookJisLayout
}

// Helper function to get layout by type
export function getLayout(type: LayoutType): KeyboardLayout {
  return layouts[type] || usAnsiLayout
}
