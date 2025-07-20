export interface KarabinerConfig {
  global?: GlobalConfiguration
  profiles: Profile[]
}

export interface GlobalConfiguration {
  check_for_updates_on_startup?: boolean
  show_in_menu_bar?: boolean
  show_profile_name_in_menu_bar?: boolean
  unsafe_ui?: boolean
}

export interface Profile {
  name: string
  selected?: boolean
  parameters?: Parameters
  simple_modifications?: SimpleModification[]
  fn_function_keys?: FnFunctionKey[]
  complex_modifications?: ComplexModifications
  virtual_hid_keyboard?: VirtualHidKeyboard
  devices?: Device[]
}

export interface Parameters {
  delay_milliseconds_before_open_device?: number
  basic?: BasicParameters
}

export interface BasicParameters {
  to_if_alone_timeout_milliseconds?: number
  to_if_held_down_threshold_milliseconds?: number
  to_delayed_action_delay_milliseconds?: number
  simultaneous_threshold_milliseconds?: number
  mouse_motion_to_scroll?: MouseMotionToScroll
}

export interface MouseMotionToScroll {
  speed?: number
}

export interface SimpleModification {
  from: FromKeyCode
  to: ToKeyCode[]
}

export interface FnFunctionKey {
  from: FromKeyCode
  to: ToKeyCode[]
}

export interface FromKeyCode {
  key_code?: string
  consumer_key_code?: string
  pointing_button?: string
  any?: 'key_code' | 'consumer_key_code' | 'pointing_button'
  modifiers?: Modifiers
}

export interface ToKeyCode {
  key_code?: string
  consumer_key_code?: string
  pointing_button?: string
  shell_command?: string
  select_input_source?: SelectInputSource
  set_variable?: SetVariable
  set_notification_message?: SetNotificationMessage
  mouse_key?: MouseKey
  sticky_modifier?: StickyModifier
  software_function?: SoftwareFunction
  modifiers?: string[]
  lazy?: boolean
  repeat?: boolean
  halt?: boolean
  hold_down_milliseconds?: number
}

export interface Modifiers {
  mandatory?: string[]
  optional?: string[]
}

export interface SelectInputSource {
  language?: string
  input_source_id?: string
  input_mode_id?: string
}

export interface SetVariable {
  name: string
  value: string | number | boolean
}

export interface SetNotificationMessage {
  id: string
  text: string
}

export interface MouseKey {
  x?: number
  y?: number
  vertical_wheel?: number
  horizontal_wheel?: number
  speed_multiplier?: number
}

export interface StickyModifier {
  [key: string]: 'on' | 'off' | 'toggle'
}

export interface SoftwareFunction {
  iokit_power_management?: {
    system_sleep?: boolean
  }
  set_mouse_cursor_position?: {
    x: number
    y: number
    screen?: number
  }
  cg_event_double_click?: {
    button?: number
  }
  open_application?: {
    bundle_identifier?: string
    file_path?: string
  }
}

export interface ComplexModifications {
  parameters?: ComplexModificationParameters
  rules?: Rule[]
}

export interface ComplexModificationParameters {
  'basic.to_if_alone_timeout_milliseconds'?: number
  'basic.to_if_held_down_threshold_milliseconds'?: number
  'basic.to_delayed_action_delay_milliseconds'?: number
  'basic.simultaneous_threshold_milliseconds'?: number
  'mouse_motion_to_scroll.speed'?: number
}

export interface Rule {
  description?: string
  manipulators: Manipulator[]
}

export interface Manipulator {
  type: 'basic' | 'mouse_motion_to_scroll'
  from: FromEvent
  to?: ToEvent[]
  to_if_alone?: ToEvent[]
  to_if_held_down?: ToEvent[]
  to_after_key_up?: ToEvent[]
  to_delayed_action?: DelayedAction
  conditions?: Condition[]
  parameters?: ManipulatorParameters
}

export interface FromEvent extends FromKeyCode {
  simultaneous?: SimultaneousEvent[]
  simultaneous_options?: SimultaneousOptions
}

export interface SimultaneousEvent {
  key_code?: string
  consumer_key_code?: string
  pointing_button?: string
  any?: 'key_code' | 'consumer_key_code' | 'pointing_button'
}

export interface SimultaneousOptions {
  detect_key_down_uninterruptedly?: boolean
  key_down_order?: 'insensitive' | 'strict' | 'strict_inverse'
  key_up_order?: 'insensitive' | 'strict' | 'strict_inverse'
  key_up_when?: 'any' | 'all'
  to_after_key_up?: ToEvent[]
}

export interface ToEvent extends ToKeyCode {}

export interface DelayedAction {
  to_if_invoked?: ToEvent[]
  to_if_canceled?: ToEvent[]
}

export interface Condition {
  type: string
  bundle_identifiers?: string[]
  file_paths?: string[]
  identifiers?: DeviceIdentifier[]
  description?: string
  input_sources?: InputSource[]
  variable_if?: VariableCondition
  variable_unless?: VariableCondition
  keyboard_types?: string[]
}

export interface DeviceIdentifier {
  vendor_id?: number
  product_id?: number
  location_id?: number
  is_keyboard?: boolean
  is_pointing_device?: boolean
  is_touch_bar?: boolean
  is_built_in_keyboard?: boolean
}

export interface InputSource {
  language?: string
  input_source_id?: string
  input_mode_id?: string
}

export interface VariableCondition {
  name: string
  value: string | number | boolean
}

export interface ManipulatorParameters {
  'basic.to_if_alone_timeout_milliseconds'?: number
  'basic.to_if_held_down_threshold_milliseconds'?: number
  'basic.to_delayed_action_delay_milliseconds'?: number
  'basic.simultaneous_threshold_milliseconds'?: number
  'mouse_motion_to_scroll.speed'?: number
}

export interface VirtualHidKeyboard {
  keyboard_type?: string
  keyboard_type_v2?: string
  caps_lock_delay_milliseconds?: number
  country_code?: number
  mouse_key_xy_scale?: number
  indicate_sticky_modifier_keys_state?: boolean
}

export interface Device {
  identifiers: DeviceIdentifier
  disable_built_in_keyboard_if_exists?: boolean
  fn_function_keys?: FnFunctionKey[]
  ignore?: boolean
  manipulate_caps_lock_led?: boolean
  simple_modifications?: SimpleModification[]
  treat_as_built_in_keyboard?: boolean
}

export const COMMON_KEY_CODES = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'return_or_enter',
  'escape',
  'delete_or_backspace',
  'tab',
  'spacebar',
  'hyphen',
  'equal_sign',
  'open_bracket',
  'close_bracket',
  'backslash',
  'non_us_pound',
  'semicolon',
  'quote',
  'grave_accent_and_tilde',
  'comma',
  'period',
  'slash',
  'caps_lock',
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
  'f6',
  'f7',
  'f8',
  'f9',
  'f10',
  'f11',
  'f12',
  'print_screen',
  'scroll_lock',
  'pause',
  'insert',
  'home',
  'page_up',
  'delete_forward',
  'end',
  'page_down',
  'right_arrow',
  'left_arrow',
  'down_arrow',
  'up_arrow',
  'keypad_num_lock',
  'keypad_slash',
  'keypad_asterisk',
  'keypad_hyphen',
  'keypad_plus',
  'keypad_enter',
  'keypad_1',
  'keypad_2',
  'keypad_3',
  'keypad_4',
  'keypad_5',
  'keypad_6',
  'keypad_7',
  'keypad_8',
  'keypad_9',
  'keypad_0',
  'keypad_period',
  'non_us_backslash',
  'application',
  'power',
  'keypad_equal_sign',
  'f13',
  'f14',
  'f15',
  'f16',
  'f17',
  'f18',
  'f19',
  'f20',
  'f21',
  'f22',
  'f23',
  'f24',
  'execute',
  'help',
  'menu',
  'select',
  'stop',
  'again',
  'undo',
  'cut',
  'copy',
  'paste',
  'find',
  'mute',
  'volume_up',
  'volume_down',
  'locking_caps_lock',
  'locking_num_lock',
  'locking_scroll_lock',
  'keypad_comma',
  'keypad_equal_sign_as400',
  'international1',
  'international2',
  'international3',
  'international4',
  'international5',
  'international6',
  'international7',
  'international8',
  'international9',
  'lang1',
  'lang2',
  'lang3',
  'lang4',
  'lang5',
  'lang6',
  'lang7',
  'lang8',
  'lang9',
  'left_control',
  'left_shift',
  'left_option',
  'left_command',
  'right_control',
  'right_shift',
  'right_option',
  'right_command',
  'fn',
  'display_brightness_down',
  'display_brightness_up',
  'mission_control',
  'launchpad',
  'dashboard',
  'illumination_down',
  'illumination_up',
  'rewind',
  'play_or_pause',
  'fastforward',
  'eject',
  'apple_display_brightness_down',
  'apple_display_brightness_up',
  'apple_top_case_display_brightness_down',
  'apple_top_case_display_brightness_up'
] as const

export const MODIFIER_KEYS = [
  'left_control',
  'left_shift',
  'left_option',
  'left_command',
  'right_control',
  'right_shift',
  'right_option',
  'right_command',
  'caps_lock',
  'fn',
  'command',
  'control',
  'option',
  'shift',
  'any'
] as const

export const CONSUMER_KEY_CODES = [
  'power',
  'display_brightness_increment',
  'display_brightness_decrement',
  'keyboard_illumination_increment',
  'keyboard_illumination_decrement',
  'rewind',
  'play_or_pause',
  'fastforward',
  'mute',
  'volume_increment',
  'volume_decrement',
  'eject',
  'apple_display_brightness_increment',
  'apple_display_brightness_decrement',
  'apple_top_case_display_brightness_increment',
  'apple_top_case_display_brightness_decrement'
] as const

export const POINTING_BUTTONS = [
  'button1',
  'button2',
  'button3',
  'button4',
  'button5',
  'button6',
  'button7',
  'button8',
  'button9',
  'button10',
  'button11',
  'button12',
  'button13',
  'button14',
  'button15',
  'button16',
  'button17',
  'button18',
  'button19',
  'button20',
  'button21',
  'button22',
  'button23',
  'button24',
  'button25',
  'button26',
  'button27',
  'button28',
  'button29',
  'button30',
  'button31',
  'button32'
] as const
