import { describe, it, expect } from 'vitest'
import { buildZodSchema, getInitialValue } from '../types'
import type { FieldConfig } from '../types'

describe('Type System', () => {
  describe('buildZodSchema', () => {
    it('should build string schema with validation rules', () => {
      const config: FieldConfig = {
        type: 'string',
        required: 'Required',
        min: 3,
        minError: 'Too short',
        max: 10,
        maxError: 'Too long',
      }

      const schema = buildZodSchema(config)

      // Test valid string
      expect(schema.safeParse('hello').success).toBe(true)

      // Test too short
      expect(schema.safeParse('hi').success).toBe(false)

      // Test too long
      expect(schema.safeParse('verylongstring').success).toBe(false)
    })

    it('should build email schema', () => {
      const config: FieldConfig = {
        type: 'email',
        required: 'Email required',
        emailError: 'Invalid email',
      }

      const schema = buildZodSchema(config)

      expect(schema.safeParse('test@test.local').success).toBe(true)
      expect(schema.safeParse('invalid-email').success).toBe(false)
    })

    it('should build number schema', () => {
      const config: FieldConfig = {
        type: 'number',
        required: 'Number required',
      }

      const schema = buildZodSchema(config)

      expect(schema.safeParse(42).success).toBe(true)
      expect(schema.safeParse('not-a-number').success).toBe(false)
    })

    it('should build boolean schema', () => {
      const config: FieldConfig = { type: 'boolean' }
      const schema = buildZodSchema(config)

      expect(schema.safeParse(true).success).toBe(true)
      expect(schema.safeParse(false).success).toBe(true)
      expect(schema.safeParse('not-boolean').success).toBe(false)
    })

    it('should build enum schema', () => {
      const config: FieldConfig = {
        type: 'enum',
        values: ['option1', 'option2', 'option3'],
        required: 'Selection required',
      }

      const schema = buildZodSchema(config)

      expect(schema.safeParse('option1').success).toBe(true)
      expect(schema.safeParse('invalid-option').success).toBe(false)
    })

    it('should build array schema', () => {
      const config: FieldConfig = {
        type: 'array',
        required: 'Array required',
      }

      const schema = buildZodSchema(config)

      expect(schema.safeParse([]).success).toBe(true)
      expect(schema.safeParse(['item1', 'item2']).success).toBe(true)
      expect(schema.safeParse('not-an-array').success).toBe(false)
    })

    it('should build object schema', () => {
      const config: FieldConfig = {
        type: 'object',
        required: 'Object required',
      }

      const schema = buildZodSchema(config)

      expect(schema.safeParse({}).success).toBe(true)
      expect(schema.safeParse({ key: 'value' }).success).toBe(true)
      expect(schema.safeParse('not-an-object').success).toBe(false)
    })

    it('should throw error for unsupported field type', () => {
      const config: FieldConfig = {
        type: 'unsupported' as any,
      }

      expect(() => buildZodSchema(config)).toThrow(
        'Unsupported field type: unsupported'
      )
    })

    it('should handle enum with empty values array', () => {
      const config: FieldConfig = {
        type: 'enum',
        values: [],
        required: 'Selection required',
      }

      expect(() => buildZodSchema(config)).toThrow(
        'Enum type requires values array'
      )
    })
  })

  describe('getInitialValue', () => {
    it('should return custom initial value when provided', () => {
      const config: FieldConfig = {
        type: 'string',
        initialValue: 'custom value',
      }

      const initialValue = getInitialValue(config)
      expect(initialValue).toBe('custom value')
    })

    it('should return default values for different types', () => {
      const testCases = [
        { type: 'string', expected: '' },
        { type: 'email', expected: '' },
        { type: 'number', expected: 0 },
        { type: 'boolean', expected: false },
        { type: 'array', expected: [] },
        { type: 'object', expected: {} },
        { type: 'date', expected: '' },
        { type: 'url', expected: '' },
        { type: 'enum', expected: '' },
      ]

      testCases.forEach(({ type, expected }) => {
        const config: FieldConfig = { type: type as any }
        const initialValue = getInitialValue(config)
        expect(initialValue).toEqual(expected)
      })
    })

    it('should return undefined for unknown type', () => {
      const config: FieldConfig = {
        type: 'unknown' as any,
      }

      const initialValue = getInitialValue(config)
      expect(initialValue).toBeUndefined()
    })

    it('should prioritize initialValue over type defaults', () => {
      const config: FieldConfig = {
        type: 'boolean',
        initialValue: true,
      }

      const initialValue = getInitialValue(config)
      expect(initialValue).toBe(true) // Should be true, not false (default)
    })

    it('should handle null and undefined initialValue correctly', () => {
      const configWithNull: FieldConfig = {
        type: 'string',
        initialValue: null,
      }

      const configWithUndefined: FieldConfig = {
        type: 'string',
        initialValue: undefined,
      }

      expect(getInitialValue(configWithNull)).toBe(null)
      expect(getInitialValue(configWithUndefined)).toBe('') // Falls back to default
    })
  })
})
