import { describe, it, expect } from 'vitest'
import { createSchema } from '../schema/index'
import type { FieldConfig } from '../types/index'

describe('createSchema', () => {
  it('should create schema with basic string field', () => {
    const config: Record<string, FieldConfig> = {
      name: { type: 'string', required: 'Name is required' },
    }

    const { schema, initialValues } = createSchema(config)

    expect(schema).toBeDefined()
    expect(initialValues).toEqual({ name: '' })
  })

  it('should create schema with custom initial values', () => {
    const config: Record<string, FieldConfig> = {
      name: { type: 'string', required: 'Name required', initialValue: 'John' },
      age: { type: 'number', initialValue: 25 },
    }

    const { schema, initialValues } = createSchema(config)

    expect(initialValues).toEqual({
      name: 'John',
      age: 25,
    })
  })

  it('should create schema with email field', () => {
    const config: Record<string, FieldConfig> = {
      email: {
        type: 'email',
        required: 'Email required',
        emailError: 'Invalid email',
      },
    }

    const { schema, initialValues } = createSchema(config)

    expect(initialValues).toEqual({ email: '' })

    // Test validation
    const result = schema.safeParse({ email: 'invalid-email' })
    expect(result.success).toBe(false)

    const validResult = schema.safeParse({ email: 'test@example.com' })
    expect(validResult.success).toBe(true)
  })

  it('should create schema with number field', () => {
    const config: Record<string, FieldConfig> = {
      age: { type: 'number', required: 'Age required' },
    }

    const { schema, initialValues } = createSchema(config)

    expect(initialValues).toEqual({ age: 0 })

    // Test validation
    const result = schema.safeParse({ age: 25 })
    expect(result.success).toBe(true)
  })

  it('should create schema with enum field', () => {
    const config: Record<string, FieldConfig> = {
      role: {
        type: 'enum',
        values: ['admin', 'user', 'moderator'],
        required: 'Role required',
      },
    }

    const { schema, initialValues } = createSchema(config)

    expect(initialValues).toEqual({ role: '' })

    // Test validation
    const validResult = schema.safeParse({ role: 'admin' })
    expect(validResult.success).toBe(true)

    const invalidResult = schema.safeParse({ role: 'invalid' })
    expect(invalidResult.success).toBe(false)
  })

  it('should create schema with boolean field', () => {
    const config: Record<string, FieldConfig> = {
      accepted: { type: 'boolean' },
    }

    const { schema, initialValues } = createSchema(config)

    expect(initialValues).toEqual({ accepted: false })
  })

  it('should create schema with array field', () => {
    const config: Record<string, FieldConfig> = {
      tags: { type: 'array' },
    }

    const { schema, initialValues } = createSchema(config)

    expect(initialValues).toEqual({ tags: [] })
  })

  it('should create schema with object field', () => {
    const config: Record<string, FieldConfig> = {
      profile: { type: 'object' },
    }

    const { schema, initialValues } = createSchema(config)

    expect(initialValues).toEqual({ profile: {} })
  })

  it('should create schema with string validation rules', () => {
    const config: Record<string, FieldConfig> = {
      username: {
        type: 'string',
        required: 'Username required',
        min: 3,
        minError: 'Too short',
        max: 10,
        maxError: 'Too long',
      },
    }

    const { schema } = createSchema(config)

    // Test min length
    const shortResult = schema.safeParse({ username: 'ab' })
    expect(shortResult.success).toBe(false)

    // Test max length
    const longResult = schema.safeParse({ username: 'verylongusername' })
    expect(longResult.success).toBe(false)

    // Test valid length
    const validResult = schema.safeParse({ username: 'john' })
    expect(validResult.success).toBe(true)
  })

  it('should handle multiple fields with different types', () => {
    const config: Record<string, FieldConfig> = {
      name: { type: 'string', required: 'Name required' },
      email: { type: 'email', required: 'Email required' },
      age: { type: 'number', initialValue: 18 },
      role: {
        type: 'enum',
        values: ['user', 'admin'],
        required: 'Role required',
      },
      active: { type: 'boolean', initialValue: true },
    }

    const { schema, initialValues } = createSchema(config)

    expect(initialValues).toEqual({
      name: '',
      email: '',
      age: 18,
      role: '',
      active: true,
    })

    // Test valid data
    const validData = {
      name: 'John',
      email: 'john@example.com',
      age: 25,
      role: 'user',
      active: true,
    }

    const result = schema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})
