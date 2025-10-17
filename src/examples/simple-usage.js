// Simple JavaScript Usage Example
import { useForm, createSchema } from 'vue-form-manager'

// 1. Define your form schema
const schemaConfig = {
  name: {
    type: 'string',
    required: 'Name is required',
    min: 2,
    minError: 'Name must be at least 2 characters',
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
}

// 2. Create schema and initialize form
const { schema, initialValues } = createSchema(schemaConfig)
const {
  form,
  formError,
  isSubmitting,
  formHasErrors,
  formHasChanges,
  handleInput,
  handleBlur,
  validateForm,
  getFormData,
  resetForm,
} = useForm({ schema, initialValues })

// 3. Use in your Vue component
export default {
  setup() {
    // Handle form submission
    const handleSubmit = () => {
      if (validateForm()) {
        const data = getFormData()
        console.log('Form data:', data)
        // Submit to API...
      }
    }

    return {
      form,
      formError,
      isSubmitting,
      formHasErrors,
      formHasChanges,
      handleInput,
      handleBlur,
      handleSubmit,
      resetForm,
    }
  },
}

// 4. Template usage:
/*
<template>
  <form @submit.prevent="handleSubmit">
    <input 
      v-model="form.name.value"
      @input="handleInput('name')"
      @blur="handleBlur('name')"
      placeholder="Name"
    />
    <span v-if="form.name.error">{{ form.name.error }}</span>
    
    <input 
      v-model="form.email.value"
      @input="handleInput('email')"
      @blur="handleBlur('email')"
      placeholder="Email"
      type="email"
    />
    <span v-if="form.email.error">{{ form.email.error }}</span>
    
    <button type="submit" :disabled="formHasErrors">
      Submit
    </button>
  </form>
</template>
*/
