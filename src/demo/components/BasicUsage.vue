<template>
  <div class="form-container">
    <h2>User Registration Form</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Name Field -->
      <div class="field-group">
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="form.name.value"
          @input="handleInput('name')"
          @blur="handleBlur('name')"
          type="text"
          :class="{ error: form.name.error }" />
        <span
          v-if="form.name.error"
          class="error-message">
          {{ form.name.error }}
        </span>
      </div>

      <!-- Email Field -->
      <div class="field-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="form.email.value"
          @input="handleInput('email')"
          @blur="handleBlur('email')"
          type="email"
          :class="{ error: form.email.error }" />
        <span
          v-if="form.email.error"
          class="error-message">
          {{ form.email.error }}
        </span>
      </div>

      <!-- Age Field -->
      <div class="field-group">
        <label for="age">Age:</label>
        <input
          id="age"
          v-model.number="form.age.value"
          @input="handleInput('age')"
          @blur="handleBlur('age')"
          type="number"
          :class="{ error: form.age.error }" />
        <span
          v-if="form.age.error"
          class="error-message">
          {{ form.age.error }}
        </span>
      </div>

      <!-- Role Field -->
      <div class="field-group">
        <label for="role">Role:</label>
        <select
          id="role"
          v-model="form.role.value"
          @change="handleInput('role')"
          @blur="handleBlur('role')"
          :class="{ error: form.role.error }">
          <option value="">Select a role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
        </select>
        <span
          v-if="form.role.error"
          class="error-message">
          {{ form.role.error }}
        </span>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button
          type="submit"
          :disabled="formHasErrors || isSubmitting"
          class="submit-btn">
          {{ isSubmitting ? 'Submitting...' : 'Register' }}
        </button>

        <button
          type="button"
          @click="resetForm"
          class="reset-btn">
          Reset
        </button>
      </div>

      <!-- Form Status -->
      <div class="form-status">
        <p
          v-if="formHasChanges"
          class="info">
          Form has changes
        </p>
        <p
          v-if="formHasErrors"
          class="warning">
          Form has errors
        </p>
        <p
          v-if="formError"
          class="error">
          {{ formError }}
        </p>
      </div>
    </form>

    <!-- Debug Info -->
    <div class="debug-info">
      <h3>Debug Information:</h3>
      <pre>{{ JSON.stringify(getFormData(), null, 2) }}</pre>
      <p><strong>Has Changes:</strong> {{ hasChanges() }}</p>
      <p><strong>Has Errors:</strong> {{ hasErrors() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm, createSchema, type FieldConfig } from '../../index'

// Define form schema
const schemaConfig: Record<string, FieldConfig> = {
  name: {
    type: 'string',
    required: 'Name is required',
    min: 2,
    minError: 'Name must be at least 2 characters',
    initialValue: 'John Doe', // Pre-fill with initial value
  },
  email: {
    type: 'email',
    required: 'Email is required',
    emailError: 'Please enter a valid email address',
  },
  age: {
    type: 'number',
    required: 'Age is required',
    initialValue: 25,
  },
  role: {
    type: 'enum',
    values: ['admin', 'user', 'moderator'],
    required: 'Please select a role',
  },
}

// Create schema and get form composable
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
  hasErrors,
  hasChanges,
  resetForm,
  getFormErrors,
} = useForm({ schema, initialValues })

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    console.log('Form validation failed:', getFormErrors())
    return
  }

  isSubmitting.value = true

  try {
    const formData = getFormData()
    console.log('Submitting:', formData)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert('Registration successful!')
    resetForm()
  } catch (error) {
    formError.value = 'Registration failed. Please try again.'
    console.error('Submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.field-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
  color: #333;
}

input,
select {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #007bff;
}

input.error,
select.error {
  border-color: #dc3545;
}

.error-message {
  display: block;
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.submit-btn,
.reset-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn {
  background-color: #007bff;
  color: white;
}

.submit-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.reset-btn {
  background-color: #6c757d;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.reset-btn:hover {
  background-color: #545b62;
}

.form-status {
  margin: 16px 0;
}

.info {
  color: #17a2b8;
}

.warning {
  color: #ffc107;
}

.error {
  color: #dc3545;
}

.debug-info {
  margin-top: 30px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.debug-info h3 {
  margin-top: 0;
}

.debug-info pre {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
