import { z } from 'zod'

// Simple type definitions
export interface FieldConfig {
  type: string
  required?: string
  min?: number
  minError?: string
  max?: number
  maxError?: string
  emailError?: string
  urlError?: string
  values?: string[]
  initialValue?: any
  schema?: FieldConfig | { [key: string]: FieldConfig }
}

const typeMap: Record<string, (options: FieldConfig) => z.ZodType> = {
  string: (options) => {
    let schema = z.string({ message: options.required })
    if (options.min) {
      schema = schema.min(options.min, { message: options.minError })
    }
    if (options.max) {
      schema = schema.max(options.max, { message: options.maxError })
    }
    return schema
  },
  email: (options) =>
    z
      .string({ message: options.required })
      .email({ message: options.emailError }),
  number: (options) =>
    z.number({ message: options.required || 'Please enter a valid number' }),
  boolean: () => z.boolean(),
  array: (options) => {
    if (options.schema) {
      // Recursively build schema for array items
      const itemSchema = buildZodSchema(options.schema)
      return z.array(itemSchema, { message: options.required })
    }
    return z.array(z.any(), { message: options.required })
  },
  object: (options) => {
    if (
      options.schema &&
      typeof options.schema === 'object' &&
      !Array.isArray(options.schema)
    ) {
      // Recursively build schema for object properties
      const shape: Record<string, z.ZodType> = {}
      for (const key in options.schema) {
        shape[key] = buildZodSchema(options.schema[key])
      }
      return z.object(shape, { message: options.required })
    }
    return z.object({}, { message: options.required })
  },
  date: (options) =>
    z
      .string({ message: options.required || 'Please enter a valid date' })
      .min(1, { message: options.required || 'Please enter a valid date' })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Please enter a valid date',
      }),
  url: (options) =>
    z.string({ message: options.required }).url({ message: options.urlError }),
  enum: (options) => {
    if (!options.values || options.values.length === 0) {
      throw new Error('Enum type requires values array')
    }
    return z.enum(options.values as [string, ...string[]], {
      message: options.required,
    })
  },
}

export const buildZodSchema = (fieldConfig) => {
  const { type, ...options } = fieldConfig
  const builder = typeMap[type]

  if (!builder) {
    throw new Error(`Unsupported field type: ${type}`)
  }

  return builder(options)
}

export const getInitialValue = (fieldConfig) => {
  if (fieldConfig.initialValue !== undefined) {
    return fieldConfig.initialValue
  }
  switch (fieldConfig.type) {
    case 'string':
    case 'email':
      return ''
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'array':
      return []
    case 'object':
      return {}
    case 'date':
      return '' // Use empty string for date inputs
    case 'url':
    case 'enum':
      return ''
    default:
      return undefined
  }
}
