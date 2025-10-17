import { reactive, ref, computed, type Ref, type ComputedRef } from 'vue'
import { z } from 'zod'

// Simple type definitions for form
interface FormField {
  value: any
  error: string
  touched: boolean
}

interface FormState {
  [key: string]: FormField
}

interface UseFormParams {
  schema: z.ZodObject<any>
  initialValues: Record<string, any>
}

export type UseFormReturn = {
  form: FormState
  formError: Ref<string>
  isSubmitting: Ref<boolean>
  formHasErrors: ComputedRef<boolean>
  formHasChanges: ComputedRef<boolean>
  setFieldError: (field: string, errorMessage: string) => void
  setFieldValue: (field: string, value: any) => void
  handleInput: (field: string) => void
  handleBlur: (field: string) => void
  validateForm: () => boolean
  validateField: (field: string) => boolean
  getFormData: () => Record<string, any>
  hasErrors: () => boolean
  hasChanges: () => boolean
  resetForm: () => void
  getFormErrors: () => Record<string, string>
  getFormErrorsWithValidation: () => Record<string, string>
}

export function useForm({
  schema,
  initialValues,
}: UseFormParams): UseFormReturn {
  // Initialize form structure
  const initForm = (): FormState => {
    const fields: FormState = {}
    const schemaShape = schema.shape

    for (const key in schemaShape) {
      fields[key] = {
        value: initialValues[key] ?? '', // Use nullish coalescing for safety
        error: '',
        touched: false,
      }
    }

    return fields
  }

  const form: FormState = reactive(initForm())
  const formError: Ref<string> = ref('')
  const isSubmitting: Ref<boolean> = ref(false)

  // Handle input change
  const handleInput = (field: string): void => {
    if (form[field]) {
      form[field].touched = true
      form[field].error = ''
    }
  }

  // Set form field value and clear any existing error
  const setFieldValue = (field: string, value: any): void => {
    if (form[field]) {
      form[field].value = value
      form[field].touched = true
      form[field].error = '' // Clear error when value is set
    }
  }

  // Manually set error for a field
  const setFieldError = (field: string, errorMessage: string): void => {
    if (form[field]) {
      form[field].error = errorMessage
    }
  }

  // Handle field blur
  const handleBlur = (field: string): void => {
    if (form[field]) {
      form[field].touched = true
      validateField(field)
    }
  }

  // Validate a single field
  const validateField = (field: string): boolean => {
    if (!form[field] || !schema.shape[field]) {
      return false
    }

    const fieldSchema = schema.shape[field]
    const result = fieldSchema.safeParse(form[field].value)

    if (!result.success) {
      const errorMessage =
        result.error.issues?.[0]?.message || 'Validation failed'
      form[field].error = errorMessage
      return false
    }

    form[field].error = ''
    return true
  }

  // Validate entire form
  const validateForm = (): boolean => {
    formError.value = ''

    // Mark all fields as touched
    Object.keys(form).forEach((field: string) => {
      form[field].touched = true
    })

    // Validate using schema
    const data: Record<string, any> = Object.keys(form).reduce(
      (obj: Record<string, any>, field: string) => {
        obj[field] = form[field].value
        return obj
      },
      {}
    )

    const result = schema.safeParse(data)

    if (!result.success) {
      const errors = result.error.format()

      // Set field errors
      Object.keys(form).forEach((field: string) => {
        if (errors[field]?._errors?.length) {
          form[field].error = errors[field]._errors[0] || 'Validation failed'
        }
      })
      return false
    }

    return true
  }

  // check if form has been touched or values changed from initial
  const formHasChanges: ComputedRef<boolean> = computed(() => {
    for (const field in form) {
      if (form[field].touched || form[field].value !== initialValues[field]) {
        return true
      }
    }
    return false
  })

  const hasChanges = (): boolean => formHasChanges.value

  // Check if any fields have explicit errors (lightweight check)
  const formHasErrors: ComputedRef<boolean> = computed(() => {
    // Only check if we have any explicit error messages already set
    for (const field in form) {
      if (form[field].error) {
        return true
      }
    }
    return false
  })

  // hasErrors function for one-time checks (includes validation)
  const hasErrors = (): boolean => {
    // First check explicit errors
    if (formHasErrors.value) {
      return true
    }

    // Then check if current data would pass validation
    const data: Record<string, any> = {}
    for (const field in form) {
      data[field] = form[field].value
    }

    const result = schema.safeParse(data)
    return !result.success
  }

  // Get clean data for submission
  const getFormData = (): Record<string, any> => {
    const data: Record<string, any> = {}
    for (const key in form) {
      data[key] = form[key].value
    }
    return data
  }

  // Reset the form
  const resetForm = (): void => {
    Object.keys(form).forEach((field: string) => {
      if (form[field]) {
        form[field].value = initialValues[field] ?? ''
        form[field].error = ''
        form[field].touched = false
      }
    })
    formError.value = ''
  }

  // Get all form errors without triggering validation
  const getFormErrors = (): Record<string, string> => {
    // Collect all existing errors without validating
    const errors: Record<string, string> = {}

    // Add field-specific errors
    Object.keys(form).forEach((field: string) => {
      if (form[field].error) {
        errors[field] = form[field].error
      }
    })

    // Add general form error if it exists
    if (formError.value) {
      errors._form = formError.value
    }

    return errors
  }

  // Get all form errors after validation (for explicit validation calls)
  const getFormErrorsWithValidation = (): Record<string, string> => {
    // Validate first
    validateForm()

    // Then collect all errors
    return getFormErrors()
  }

  return {
    form,
    formError,
    isSubmitting,
    formHasErrors,
    formHasChanges,
    setFieldError,
    setFieldValue,
    handleInput,
    handleBlur,
    validateForm,
    validateField,
    getFormData,
    hasErrors,
    hasChanges,
    resetForm,
    getFormErrors,
    getFormErrorsWithValidation,
  }
}
