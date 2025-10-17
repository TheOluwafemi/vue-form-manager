import { z } from 'zod'
import { buildZodSchema, getInitialValue, type FieldConfig } from '../types'

export const createSchema = (schemaConfig: Record<string, FieldConfig>) => {
  const shape = {}
  const initialValues = {}

  for (const fieldName in schemaConfig) {
    const fieldConfig = schemaConfig[fieldName]
    shape[fieldName] = buildZodSchema(fieldConfig)
    initialValues[fieldName] = getInitialValue(fieldConfig)
  }

  return { schema: z.object(shape), initialValues }
}
