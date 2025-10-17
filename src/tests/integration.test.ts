import { describe, it, expect } from 'vitest'
import { useForm } from '../core/useForm'
import { createSchema } from '../schema'
import type { FieldConfig } from '../types'

describe('Integration Tests', () => {
  it('should work end-to-end for a complete form workflow', () => {
    // 1. Create schema
    const config: Record<string, FieldConfig> = {
      username: {
        type: 'string',
        required: 'Username is required',
        min: 3,
        minError: 'Username must be at least 3 characters',
      },
      email: {
        type: 'email',
        required: 'Email is required',
        emailError: 'Please enter a valid email',
      },
      age: {
        type: 'number',
        required: 'Age is required',
        initialValue: 18,
      },
      role: {
        type: 'enum',
        values: ['user', 'admin', 'moderator'],
        required: 'Please select a role',
      },
      terms: {
        type: 'boolean',
        initialValue: false,
      },
    }

    const { schema, initialValues } = createSchema(config)

    // 2. Initialize form
    const {
      form,
      formHasErrors,
      formHasChanges,
      handleInput,
      handleBlur,
      setFieldValue,
      validateForm,
      getFormData,
      resetForm,
    } = useForm({ schema, initialValues })

    // 3. Verify initial state
    expect(form.username.value).toBe('')
    expect(form.email.value).toBe('')
    expect(form.age.value).toBe(18)
    expect(form.role.value).toBe('')
    expect(form.terms.value).toBe(false)
    expect(formHasErrors.value).toBe(false)
    expect(formHasChanges.value).toBe(false)

    // 4. Fill out form with valid data
    setFieldValue('username', 'john_doe')
    setFieldValue('email', 'john@example.com')
    setFieldValue('age', 25)
    setFieldValue('role', 'user')
    setFieldValue('terms', true)

    // 5. Verify form has changes
    expect(formHasChanges.value).toBe(true)

    // 6. Validate form
    const isValid = validateForm()
    expect(isValid).toBe(true)
    expect(formHasErrors.value).toBe(false)

    // 7. Get form data for submission
    const formData = getFormData()
    expect(formData).toEqual({
      username: 'john_doe',
      email: 'john@example.com',
      age: 25,
      role: 'user',
      terms: true,
    })

    // 8. Test form reset
    resetForm()
    expect(form.username.value).toBe('')
    expect(form.email.value).toBe('')
    expect(form.age.value).toBe(18) // Back to initial
    expect(form.terms.value).toBe(false)
    expect(formHasChanges.value).toBe(false)
  })

  it('should handle form with validation errors', () => {
    const config: Record<string, FieldConfig> = {
      name: {
        type: 'string',
        required: 'Name is required',
        min: 2,
        minError: 'Name too short',
      },
      email: {
        type: 'email',
        required: 'Email is required',
        emailError: 'Invalid email format',
      },
    }

    const { schema, initialValues } = createSchema(config)
    const {
      form,
      formHasErrors,
      setFieldValue,
      handleBlur,
      validateForm,
      getFormErrors,
    } = useForm({ schema, initialValues })

    // Fill with invalid data
    setFieldValue('name', 'J') // Too short
    setFieldValue('email', 'invalid-email')

    // Trigger validation on blur
    handleBlur('name')
    handleBlur('email')

    // Check errors are set
    expect(form.name.error).toBe('Name too short')
    expect(form.email.error).toBe('Invalid email format')
    expect(formHasErrors.value).toBe(true)

    // Validate entire form
    const isValid = validateForm()
    expect(isValid).toBe(false)

    // Get all errors
    const errors = getFormErrors()
    expect(errors.name).toBeTruthy()
    expect(errors.email).toBeTruthy()
  })

  it('should work with nested object validation', () => {
    const config: Record<string, FieldConfig> = {
      user: {
        type: 'object',
        schema: {
          name: { type: 'string', required: 'Name required' },
          email: { type: 'email', required: 'Email required' },
        },
      },
    }

    const { schema, initialValues } = createSchema(config)
    expect((initialValues as any).user).toEqual({})

    // Test schema validation
    const validData = {
      user: {
        name: 'John',
        email: 'john@example.com',
      },
    }

    const result = schema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should work with array validation', () => {
    const config: Record<string, FieldConfig> = {
      tags: {
        type: 'array',
        schema: { type: 'string', required: 'Tag required' },
      },
    }

    const { schema, initialValues } = createSchema(config)
    expect((initialValues as any).tags).toEqual([])

    // Test schema validation
    const validData = { tags: ['tag1', 'tag2', 'tag3'] }
    const result = schema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should handle real-world registration form scenario', () => {
    const registrationSchema: Record<string, FieldConfig> = {
      firstName: {
        type: 'string',
        required: 'First name is required',
        min: 2,
        minError: 'First name must be at least 2 characters',
      },
      lastName: {
        type: 'string',
        required: 'Last name is required',
        min: 2,
        minError: 'Last name must be at least 2 characters',
      },
      email: {
        type: 'email',
        required: 'Email is required',
        emailError: 'Please enter a valid email address',
      },
      password: {
        type: 'string',
        required: 'Password is required',
        min: 8,
        minError: 'Password must be at least 8 characters',
      },
      age: {
        type: 'number',
        required: 'Age is required',
      },
      country: {
        type: 'enum',
        values: ['US', 'CA', 'UK', 'DE', 'FR'],
        required: 'Please select your country',
      },
      newsletter: {
        type: 'boolean',
        initialValue: false,
      },
      website: {
        type: 'url',
        urlError: 'Please enter a valid website URL',
      },
    }

    const { schema, initialValues } = createSchema(registrationSchema)
    const form = useForm({ schema, initialValues })

    // Simulate user filling out the form
    form.setFieldValue('firstName', 'John')
    form.setFieldValue('lastName', 'Doe')
    form.setFieldValue('email', 'john.doe@example.com')
    form.setFieldValue('password', 'securepassword123')
    form.setFieldValue('age', 30)
    form.setFieldValue('country', 'US')
    form.setFieldValue('newsletter', true)
    form.setFieldValue('website', 'https://johndoe.com')

    // Validate the form
    const isValid = form.validateForm()
    expect(isValid).toBe(true)

    // Get the final data
    const submissionData = form.getFormData()
    expect(submissionData).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'securepassword123',
      age: 30,
      country: 'US',
      newsletter: true,
      website: 'https://johndoe.com',
    })
  })
})
