import { z } from 'zod'

const GlobalConfigurationSchema = z
  .object({
    check_for_updates_on_startup: z.boolean().optional(),
    show_in_menu_bar: z.boolean().optional(),
    show_profile_name_in_menu_bar: z.boolean().optional(),
    unsafe_ui: z.boolean().optional()
  })
  .optional()

const MouseMotionToScrollSchema = z.object({
  speed: z.number().optional()
})

const BasicParametersSchema = z.object({
  to_if_alone_timeout_milliseconds: z.number().optional(),
  to_if_held_down_threshold_milliseconds: z.number().optional(),
  to_delayed_action_delay_milliseconds: z.number().optional(),
  simultaneous_threshold_milliseconds: z.number().optional(),
  mouse_motion_to_scroll: MouseMotionToScrollSchema.optional()
})

const ParametersSchema = z.object({
  delay_milliseconds_before_open_device: z.number().optional(),
  basic: BasicParametersSchema.optional()
})

const ModifiersSchema = z.object({
  mandatory: z.array(z.string()).optional(),
  optional: z.array(z.string()).optional()
})

const FromKeyCodeSchema = z.object({
  key_code: z.string().optional(),
  consumer_key_code: z.string().optional(),
  pointing_button: z.string().optional(),
  any: z.enum(['key_code', 'consumer_key_code', 'pointing_button']).optional(),
  modifiers: ModifiersSchema.optional()
})

const SelectInputSourceSchema = z.object({
  language: z.string().optional(),
  input_source_id: z.string().optional(),
  input_mode_id: z.string().optional()
})

const SetVariableSchema = z.object({
  name: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()])
})

const SetNotificationMessageSchema = z.object({
  id: z.string(),
  text: z.string()
})

const MouseKeySchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  vertical_wheel: z.number().optional(),
  horizontal_wheel: z.number().optional(),
  speed_multiplier: z.number().optional()
})

const StickyModifierSchema = z.record(z.string(), z.enum(['on', 'off', 'toggle']))

const SoftwareFunctionSchema = z.object({
  iokit_power_management: z
    .object({
      system_sleep: z.boolean().optional()
    })
    .optional(),
  set_mouse_cursor_position: z
    .object({
      x: z.number(),
      y: z.number(),
      screen: z.number().optional()
    })
    .optional(),
  cg_event_double_click: z
    .object({
      button: z.number().optional()
    })
    .optional(),
  open_application: z
    .object({
      bundle_identifier: z.string().optional(),
      file_path: z.string().optional()
    })
    .optional()
})

const ToKeyCodeSchema = z.object({
  key_code: z.string().optional(),
  consumer_key_code: z.string().optional(),
  pointing_button: z.string().optional(),
  shell_command: z.string().optional(),
  select_input_source: SelectInputSourceSchema.optional(),
  set_variable: SetVariableSchema.optional(),
  set_notification_message: SetNotificationMessageSchema.optional(),
  mouse_key: MouseKeySchema.optional(),
  sticky_modifier: StickyModifierSchema.optional(),
  software_function: SoftwareFunctionSchema.optional(),
  modifiers: z.array(z.string()).optional(),
  lazy: z.boolean().optional(),
  repeat: z.boolean().optional(),
  halt: z.boolean().optional(),
  hold_down_milliseconds: z.number().optional()
})

const SimpleModificationSchema = z.object({
  from: FromKeyCodeSchema,
  to: z.array(ToKeyCodeSchema)
})

const FnFunctionKeySchema = z.object({
  from: FromKeyCodeSchema,
  to: z.array(ToKeyCodeSchema)
})

const SimultaneousEventSchema = z.object({
  key_code: z.string().optional(),
  consumer_key_code: z.string().optional(),
  pointing_button: z.string().optional(),
  any: z.enum(['key_code', 'consumer_key_code', 'pointing_button']).optional()
})

const SimultaneousOptionsSchema = z.object({
  detect_key_down_uninterruptedly: z.boolean().optional(),
  key_down_order: z.enum(['insensitive', 'strict', 'strict_inverse']).optional(),
  key_up_order: z.enum(['insensitive', 'strict', 'strict_inverse']).optional(),
  key_up_when: z.enum(['any', 'all']).optional(),
  to_after_key_up: z.lazy(() => z.array(ToEventSchema)).optional()
})

const FromEventSchema = FromKeyCodeSchema.extend({
  simultaneous: z.array(SimultaneousEventSchema).optional(),
  simultaneous_options: SimultaneousOptionsSchema.optional()
})

const ToEventSchema = ToKeyCodeSchema

const DelayedActionSchema = z.object({
  to_if_invoked: z.array(ToEventSchema).optional(),
  to_if_canceled: z.array(ToEventSchema).optional()
})

const DeviceIdentifierSchema = z.object({
  vendor_id: z.number().optional(),
  product_id: z.number().optional(),
  location_id: z.number().optional(),
  is_keyboard: z.boolean().optional(),
  is_pointing_device: z.boolean().optional(),
  is_touch_bar: z.boolean().optional(),
  is_built_in_keyboard: z.boolean().optional()
})

const InputSourceSchema = z.object({
  language: z.string().optional(),
  input_source_id: z.string().optional(),
  input_mode_id: z.string().optional()
})

const VariableConditionSchema = z.object({
  name: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()])
})

const ConditionSchema = z.object({
  type: z.string(),
  bundle_identifiers: z.array(z.string()).optional(),
  file_paths: z.array(z.string()).optional(),
  identifiers: z.array(DeviceIdentifierSchema).optional(),
  description: z.string().optional(),
  input_sources: z.array(InputSourceSchema).optional(),
  variable_if: VariableConditionSchema.optional(),
  variable_unless: VariableConditionSchema.optional(),
  keyboard_types: z.array(z.string()).optional()
})

const ManipulatorParametersSchema = z.object({
  'basic.to_if_alone_timeout_milliseconds': z.number().optional(),
  'basic.to_if_held_down_threshold_milliseconds': z.number().optional(),
  'basic.to_delayed_action_delay_milliseconds': z.number().optional(),
  'basic.simultaneous_threshold_milliseconds': z.number().optional(),
  'mouse_motion_to_scroll.speed': z.number().optional()
})

const ManipulatorSchema = z.object({
  type: z.enum(['basic', 'mouse_motion_to_scroll']),
  from: FromEventSchema,
  to: z.array(ToEventSchema).optional(),
  to_if_alone: z.array(ToEventSchema).optional(),
  to_if_held_down: z.array(ToEventSchema).optional(),
  to_after_key_up: z.array(ToEventSchema).optional(),
  to_delayed_action: DelayedActionSchema.optional(),
  conditions: z.array(ConditionSchema).optional(),
  parameters: ManipulatorParametersSchema.optional()
})

const RuleSchema = z.object({
  description: z.string().optional(),
  manipulators: z.array(ManipulatorSchema)
})

const ComplexModificationParametersSchema = z.object({
  'basic.to_if_alone_timeout_milliseconds': z.number().optional(),
  'basic.to_if_held_down_threshold_milliseconds': z.number().optional(),
  'basic.to_delayed_action_delay_milliseconds': z.number().optional(),
  'basic.simultaneous_threshold_milliseconds': z.number().optional(),
  'mouse_motion_to_scroll.speed': z.number().optional()
})

const ComplexModificationsSchema = z.object({
  parameters: ComplexModificationParametersSchema.optional(),
  rules: z.array(RuleSchema).optional()
})

const VirtualHidKeyboardSchema = z.object({
  keyboard_type: z.string().optional(),
  keyboard_type_v2: z.string().optional(),
  caps_lock_delay_milliseconds: z.number().optional(),
  country_code: z.number().optional(),
  mouse_key_xy_scale: z.number().optional(),
  indicate_sticky_modifier_keys_state: z.boolean().optional()
})

const DeviceSchema = z.object({
  identifiers: DeviceIdentifierSchema,
  disable_built_in_keyboard_if_exists: z.boolean().optional(),
  fn_function_keys: z.array(FnFunctionKeySchema).optional(),
  ignore: z.boolean().optional(),
  manipulate_caps_lock_led: z.boolean().optional(),
  simple_modifications: z.array(SimpleModificationSchema).optional(),
  treat_as_built_in_keyboard: z.boolean().optional()
})

const ProfileSchema = z.object({
  name: z.string(),
  selected: z.boolean().optional(),
  parameters: ParametersSchema.optional(),
  simple_modifications: z.array(SimpleModificationSchema).optional(),
  fn_function_keys: z.array(FnFunctionKeySchema).optional(),
  complex_modifications: ComplexModificationsSchema.optional(),
  virtual_hid_keyboard: VirtualHidKeyboardSchema.optional(),
  devices: z.array(DeviceSchema).optional()
})

export const KarabinerConfigSchema = z.object({
  global: GlobalConfigurationSchema,
  profiles: z.array(ProfileSchema)
})

export const validateKarabinerConfig = (data: unknown) => {
  return KarabinerConfigSchema.safeParse(data)
}

export const validateProfile = (data: unknown) => {
  return ProfileSchema.safeParse(data)
}

export const validateRule = (data: unknown) => {
  return RuleSchema.safeParse(data)
}

export const validateManipulator = (data: unknown) => {
  return ManipulatorSchema.safeParse(data)
}
