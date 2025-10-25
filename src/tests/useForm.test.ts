import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useForm } from '../core/useForm'
import { createSchema } from '../schema/index'
import type { FieldConfig } from '../types/index'

describe('useForm', () => {
  let schema: any
  let initialValues: any
  let form: any

  beforeEach(() => {
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
      age: {
        type: 'number',
        required: 'Age is required',
        initialValue: 25,
      },
    }

    const schemaResult = createSchema(config)
    schema = schemaResult.schema
    initialValues = schemaResult.initialValues
  })

  describe('Form Initialization', () => {
    it('should initialize form with correct structure', () => {
      const formHook = useForm({ schema, initialValues })

      expect(formHook.form.name).toEqual({
        value: '',
        error: '',
        touched: false,
      })

      expect(formHook.form.email).toEqual({
        value: '',
        error: '',
        touched: false,
      })

      expect(formHook.form.age).toEqual({
        value: 25,
        error: '',
        touched: false,
      })
    })

    it('should initialize with custom initial values', () => {
      const customInitialValues = {
        name: 'John Doe',
        email: 'john@test.local',
        age: 30,
      }

      const formHook = useForm({ schema, initialValues: customInitialValues })

      expect(formHook.form.name.value).toBe('John Doe')
      expect(formHook.form.email.value).toBe('john@test.local')
      expect(formHook.form.age.value).toBe(30)
    })
  })

  describe('Field Manipulation', () => {
    beforeEach(() => {
      form = useForm({ schema, initialValues })
    })

    it('should set field value correctly', () => {
      form.setFieldValue('name', 'John')

      expect(form.form.name.value).toBe('John')
      expect(form.form.name.touched).toBe(true)
    })

    it('should handle non-existent field gracefully', () => {
      expect(() => {
        form.setFieldValue('nonexistent', 'value')
      }).not.toThrow()
    })

    it('should set field error correctly', () => {
      form.setFieldError('name', 'Custom error')

      expect(form.form.name.error).toBe('Custom error')
    })

    it('should handle input changes', () => {
      form.form.name.value = 'John'
      form.handleInput('name')

      expect(form.form.name.touched).toBe(true)
      expect(form.form.name.error).toBe('')
    })

    it('should handle blur events with validation', () => {
      form.form.name.value = 'J' // Too short
      form.handleBlur('name')

      expect(form.form.name.touched).toBe(true)
      expect(form.form.name.error).toBe('Name too short')
    })
  })

  describe('Form Validation', () => {
    beforeEach(() => {
      form = useForm({ schema, initialValues })
    })

    it('should validate individual fields correctly', () => {
      // Valid field
      form.form.name.value = 'John Doe'
      const validResult = form.validateField('name')
      expect(validResult).toBe(true)
      expect(form.form.name.error).toBe('')

      // Invalid field
      form.form.name.value = 'J'
      const invalidResult = form.validateField('name')
      expect(invalidResult).toBe(false)
      expect(form.form.name.error).toBe('Name too short')
    })

    it('should validate email field correctly', () => {
      // Invalid email
      form.form.email.value = 'invalid-email'
      const invalidResult = form.validateField('email')
      expect(invalidResult).toBe(false)
      expect(form.form.email.error).toBe('Invalid email format')

      // Valid email
      form.form.email.value = 'john@example.com'
      const validResult = form.validateField('email')
      expect(validResult).toBe(true)
      expect(form.form.email.error).toBe('')
    })

    it('should validate entire form correctly', () => {
      // Set valid values
      form.form.name.value = 'John Doe'
      form.form.email.value = 'john@example.com'
      form.form.age.value = 30

      const result = form.validateForm()
      expect(result).toBe(true)

      // Check all fields are touched
      expect(form.form.name.touched).toBe(true)
      expect(form.form.email.touched).toBe(true)
      expect(form.form.age.touched).toBe(true)
    })

    it('should return false and set errors for invalid form', () => {
      // Set invalid values
      form.form.name.value = 'J' // Too short
      form.form.email.value = 'invalid-email'

      const result = form.validateForm()
      expect(result).toBe(false)
      expect(form.form.name.error).toBeTruthy()
      expect(form.form.email.error).toBeTruthy()
    })

    it('should handle validation of non-existent field gracefully', () => {
      const result = form.validateField('nonexistent')
      expect(result).toBe(false)
    })
  })

  describe('Form State Management', () => {
    beforeEach(() => {
      form = useForm({ schema, initialValues })
    })

    it('should track form changes correctly', async () => {
      expect(form.formHasChanges.value).toBe(false)
      expect(form.hasChanges()).toBe(false)

      // Mark field as touched
      form.handleInput('name')
      await nextTick()

      expect(form.formHasChanges.value).toBe(true)
      expect(form.hasChanges()).toBe(true)
    })

    it('should detect value changes from initial', async () => {
      // Change value from initial
      form.form.age.value = 30 // Initial was 25
      await nextTick()

      expect(form.formHasChanges.value).toBe(true)
    })

    it('should track form errors correctly', async () => {
      expect(form.formHasErrors.value).toBe(false) // No explicit errors initially
      // Note: hasErrors() may return true due to empty required fields initially

      // Set an error
      form.setFieldError('name', 'Some error')
      await nextTick()

      expect(form.formHasErrors.value).toBe(true)

      // hasErrors should return true when there are validation issues
      form.form.name.value = 'J' // Invalid
      expect(form.hasErrors()).toBe(true)
    })
  })

  describe('Data Retrieval', () => {
    beforeEach(() => {
      form = useForm({ schema, initialValues })
    })

    it('should get clean form data', () => {
      form.form.name.value = 'John Doe'
      form.form.email.value = 'john@example.com'
      form.form.age.value = 30

      const data = form.getFormData()

      expect(data).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      })
    })

    it('should get form errors after validation', () => {
      form.form.name.value = 'J' // Too short
      form.form.email.value = 'invalid'

      const errors = form.getFormErrorsWithValidation()

      expect(errors.name).toBeTruthy()
      expect(errors.email).toBeTruthy()
    })

    it('should include general form error in getFormErrors', () => {
      form.formError.value = 'General error'
      form.setFieldError('name', 'Field error')

      const errors = form.getFormErrors()

      expect(errors._form).toBe('General error')
      expect(errors.name).toBe('Field error')
    })
  })

  describe('Form Reset', () => {
    beforeEach(() => {
      form = useForm({ schema, initialValues })
    })

    it('should reset form to initial state', () => {
      // Make changes
      form.form.name.value = 'Changed'
      form.form.name.error = 'Some error'
      form.form.name.touched = true
      form.formError.value = 'General error'

      // Reset
      form.resetForm()

      expect(form.form.name.value).toBe('') // Back to initial
      expect(form.form.name.error).toBe('')
      expect(form.form.name.touched).toBe(false)
      expect(form.formError.value).toBe('')
    })

    it('should reset to custom initial values', () => {
      const customInitialValues = {
        name: 'John',
        email: 'john@example.com',
        age: 30,
      }

      const customForm = useForm({ schema, initialValues: customInitialValues })

      // Make changes
      customForm.form.name.value = 'Changed'

      // Reset
      customForm.resetForm()

      expect(customForm.form.name.value).toBe('John') // Back to custom initial
    })
  })

  describe('Edge Cases', () => {
    beforeEach(() => {
      form = useForm({ schema, initialValues })
    })

    it('should handle missing initial values gracefully', () => {
      const incompleteInitialValues = { name: 'John' } // Missing email and age

      expect(() => {
        useForm({ schema, initialValues: incompleteInitialValues })
      }).not.toThrow()
    })

    it('should handle validation errors without crashing', () => {
      // Test with malformed validation result
      form.form.name.value = null

      expect(() => {
        form.validateField('name')
      }).not.toThrow()
    })
  })
})
