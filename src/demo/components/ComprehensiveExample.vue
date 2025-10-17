<!-- 
  Complete Real-World Example: User Registration Form
  
  This example demonstrates all field types and features of vue-form-manager:
  - String validation with min/max length
  - Email validation with custom error messages
  - Number validation with initial values
  - URL validation for optional fields
  - Date validation for birth dates
  - Boolean fields for checkboxes and agreements
  - Enum fields for dropdowns/selects
  - Array fields for tags/skills
  - Nested object validation for addresses
  - Form state management and error handling
  - Dynamic field manipulation
  - Real-time validation feedback
-->

<template>
  <div class="registration-form">
    <div class="form-header">
      <h1>🚀 Vue Form Manager</h1>
      <h2>Complete Registration Example</h2>
      <p class="subtitle">Showcasing all field types and validation features</p>
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="form">
      <!-- PERSONAL INFORMATION SECTION -->
      <section class="form-section">
        <h3>👤 Personal Information</h3>

        <!-- String Field with Min/Max Validation -->
        <div class="field-group">
          <label for="fullName">Full Name *</label>
          <input
            id="fullName"
            v-model="form.fullName.value"
            @input="handleInput('fullName')"
            @blur="handleBlur('fullName')"
            :class="{
              error: form.fullName.error,
              success: form.fullName.touched && !form.fullName.error,
            }"
            placeholder="Enter your full name" />
          <div class="field-feedback">
            <span
              v-if="form.fullName.error"
              class="error-text">
              ❌ {{ form.fullName.error }}
            </span>
            <span
              v-else-if="form.fullName.touched"
              class="success-text">
              ✅ Looks good!
            </span>
            <small class="help-text">Between 2-50 characters</small>
          </div>
        </div>

        <!-- Email Field -->
        <div class="field-group">
          <label for="email">Email Address *</label>
          <input
            id="email"
            v-model="form.email.value"
            @input="handleInput('email')"
            @blur="handleBlur('email')"
            type="email"
            :class="{
              error: form.email.error,
              success: form.email.touched && !form.email.error,
            }"
            placeholder="your.email@example.com" />
          <div class="field-feedback">
            <span
              v-if="form.email.error"
              class="error-text">
              ❌ {{ form.email.error }}
            </span>
            <span
              v-else-if="form.email.touched && form.email.value"
              class="success-text">
              ✅ Valid email format
            </span>
          </div>
        </div>

        <div class="field-row">
          <!-- Number Field -->
          <div class="field-group">
            <label for="age">Age *</label>
            <input
              id="age"
              v-model.number="form.age.value"
              @input="handleInput('age')"
              @blur="handleBlur('age')"
              type="number"
              :class="{
                error: form.age.error,
                success: form.age.touched && !form.age.error,
              }"
              min="13"
              max="120" />
            <div class="field-feedback">
              <span
                v-if="form.age.error"
                class="error-text">
                ❌ {{ form.age.error }}
              </span>
              <span
                v-else-if="form.age.touched"
                class="success-text">
                ✅ Valid age
              </span>
            </div>
          </div>

          <!-- Date Field -->
          <div class="field-group">
            <label for="birthDate">Birth Date *</label>
            <input
              id="birthDate"
              v-model="form.birthDate.value"
              @input="handleInput('birthDate')"
              @blur="handleBlur('birthDate')"
              type="date"
              :class="{
                error: form.birthDate.error,
                success: form.birthDate.touched && !form.birthDate.error,
              }" />
            <div class="field-feedback">
              <span
                v-if="form.birthDate.error"
                class="error-text">
                ❌ {{ form.birthDate.error }}
              </span>
              <span
                v-else-if="form.birthDate.touched"
                class="success-text">
                ✅ Date selected
              </span>
            </div>
          </div>
        </div>

        <!-- Enum Field (Dropdown) -->
        <div class="field-group">
          <label for="role">Professional Role *</label>
          <select
            id="role"
            v-model="form.role.value"
            @change="handleInput('role')"
            @blur="handleBlur('role')"
            :class="{
              error: form.role.error,
              success: form.role.touched && !form.role.error,
            }">
            <option value="">Select your role</option>
            <option value="frontend-developer">Frontend Developer</option>
            <option value="backend-developer">Backend Developer</option>
            <option value="fullstack-developer">Fullstack Developer</option>
            <option value="designer">UI/UX Designer</option>
            <option value="product-manager">Product Manager</option>
            <option value="data-scientist">Data Scientist</option>
            <option value="devops-engineer">DevOps Engineer</option>
            <option value="other">Other</option>
          </select>
          <div class="field-feedback">
            <span
              v-if="form.role.error"
              class="error-text">
              ❌ {{ form.role.error }}
            </span>
            <span
              v-else-if="form.role.touched && form.role.value"
              class="success-text">
              ✅ Role selected
            </span>
          </div>
        </div>

        <!-- URL Field (Optional) -->
        <div class="field-group">
          <label for="portfolio">Portfolio Website</label>
          <input
            id="portfolio"
            v-model="form.portfolio.value"
            @input="handleInput('portfolio')"
            @blur="handleBlur('portfolio')"
            :class="{
              error: form.portfolio.error,
              success:
                form.portfolio.touched &&
                form.portfolio.value &&
                !form.portfolio.error,
            }"
            placeholder="https://your-portfolio.com" />
          <div class="field-feedback">
            <span
              v-if="form.portfolio.error"
              class="error-text">
              ❌ {{ form.portfolio.error }}
            </span>
            <span
              v-else-if="form.portfolio.touched && form.portfolio.value"
              class="success-text">
              ✅ Valid URL
            </span>
            <small class="help-text">Optional - showcase your work</small>
          </div>
        </div>
      </section>

      <!-- ADDRESS SECTION (Nested Object) -->
      <section class="form-section">
        <h3>📍 Address Information</h3>

        <div class="field-group">
          <label for="street">Street Address *</label>
          <input
            id="street"
            v-model="form.address.value.street"
            @input="handleAddressInput('street', $event)"
            @blur="validateAddressField('street')"
            placeholder="123 Main Street, Apt 4B" />
        </div>

        <div class="field-row">
          <div class="field-group">
            <label for="city">City *</label>
            <input
              id="city"
              v-model="form.address.value.city"
              @input="handleAddressInput('city', $event)"
              @blur="validateAddressField('city')"
              placeholder="New York" />
          </div>

          <div class="field-group">
            <label for="zipCode">ZIP Code *</label>
            <input
              id="zipCode"
              v-model="form.address.value.zipCode"
              @input="handleAddressInput('zipCode', $event)"
              @blur="validateAddressField('zipCode')"
              placeholder="10001" />
          </div>

          <div class="field-group">
            <label for="country">Country *</label>
            <select
              id="country"
              v-model="form.address.value.country"
              @change="handleAddressInput('country', $event)">
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </div>
        </div>

        <div
          class="address-validation"
          v-if="addressErrors.length > 0">
          <div class="error-summary">
            <h4>❌ Address Validation Errors:</h4>
            <ul>
              <li
                v-for="error in addressErrors"
                :key="error">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- SKILLS SECTION (Array Management) -->
      <section class="form-section">
        <h3>💻 Skills & Technologies</h3>

        <div class="field-group">
          <label>Technical Skills</label>
          <div class="skills-container">
            <div class="skills-display">
              <div
                v-for="(skill, index) in form.skills.value"
                :key="index"
                class="skill-tag">
                {{ skill }}
                <button
                  type="button"
                  @click="removeSkill(index)"
                  class="remove-skill">
                  ×
                </button>
              </div>
            </div>

            <div class="skill-input-area">
              <input
                v-model="newSkill"
                @keyup.enter="addSkill"
                @keyup.escape="newSkill = ''"
                placeholder="Type a skill and press Enter"
                class="skill-input" />
              <button
                type="button"
                @click="addSkill"
                :disabled="!newSkill.trim()"
                class="add-skill-btn">
                Add Skill
              </button>
            </div>
          </div>

          <div class="predefined-skills">
            <small>Quick add:</small>
            <button
              v-for="skill in suggestedSkills"
              :key="skill"
              type="button"
              @click="addPredefinedSkill(skill)"
              :disabled="form.skills.value.includes(skill)"
              class="suggested-skill">
              {{ skill }}
            </button>
          </div>
        </div>
      </section>

      <!-- PREFERENCES SECTION (Boolean Fields) -->
      <section class="form-section">
        <h3>⚙️ Account Preferences</h3>

        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="form.notifications.value"
              @change="handleInput('notifications')"
              type="checkbox" />
            <span class="checkmark"></span>
            Email notifications for updates and news
          </label>

          <label class="checkbox-label">
            <input
              v-model="form.marketing.value"
              @change="handleInput('marketing')"
              type="checkbox" />
            <span class="checkmark"></span>
            Marketing emails and special offers
          </label>

          <label class="checkbox-label">
            <input
              v-model="form.publicProfile.value"
              @change="handleInput('publicProfile')"
              type="checkbox" />
            <span class="checkmark"></span>
            Make my profile public to other developers
          </label>

          <label class="checkbox-label required">
            <input
              v-model="form.agreeToTerms.value"
              @change="handleInput('agreeToTerms')"
              type="checkbox" />
            <span class="checkmark"></span>
            I agree to the Terms of Service and Privacy Policy *
          </label>
          <div
            v-if="form.agreeToTerms.error"
            class="field-feedback">
            <span class="error-text">❌ {{ form.agreeToTerms.error }}</span>
          </div>
        </div>
      </section>

      <!-- FORM ACTIONS -->
      <div class="form-actions">
        <button
          type="submit"
          :disabled="formHasErrors || isSubmitting || !form.agreeToTerms.value"
          class="submit-btn"
          :class="{ loading: isSubmitting }">
          <span
            v-if="isSubmitting"
            class="loading-spinner"></span>
          {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
        </button>

        <button
          type="button"
          @click="resetForm"
          class="reset-btn"
          :disabled="isSubmitting">
          Reset Form
        </button>

        <button
          type="button"
          @click="fillSampleData"
          class="sample-btn"
          :disabled="isSubmitting">
          Fill Sample Data
        </button>
      </div>

      <!-- FORM STATUS -->
      <div class="form-status">
        <div class="status-indicators">
          <div
            class="status-item"
            :class="{ active: formHasChanges }">
            <span class="indicator"></span>
            {{ formHasChanges ? 'Form has changes' : 'No changes' }}
          </div>

          <div
            class="status-item"
            :class="{ active: !formHasErrors, error: formHasErrors }">
            <span class="indicator"></span>
            {{ formHasErrors ? 'Form has errors' : 'Form is valid' }}
          </div>

          <div
            class="status-item"
            :class="{ active: isSubmitting }">
            <span class="indicator"></span>
            {{ isSubmitting ? 'Submitting...' : 'Ready to submit' }}
          </div>
        </div>

        <div
          v-if="formError"
          class="general-error">
          ❌ {{ formError }}
        </div>
      </div>
    </form>

    <!-- DEBUG PANEL -->
    <div class="debug-panel">
      <div class="debug-header">
        <h3>🔧 Developer Debug Panel</h3>
        <button
          @click="showDebug = !showDebug"
          class="toggle-debug">
          {{ showDebug ? 'Hide' : 'Show' }} Debug Info
        </button>
      </div>

      <div
        v-if="showDebug"
        class="debug-content">
        <div class="debug-grid">
          <div class="debug-section">
            <h4>📊 Form State</h4>
            <ul class="debug-list">
              <li><strong>Has Changes:</strong> {{ hasChanges() }}</li>
              <li><strong>Has Errors:</strong> {{ hasErrors() }}</li>
              <li><strong>Is Submitting:</strong> {{ isSubmitting }}</li>
              <li><strong>Form Valid:</strong> {{ !formHasErrors }}</li>
            </ul>
          </div>

          <div class="debug-section">
            <h4>📝 Current Data</h4>
            <pre class="debug-data">{{
              JSON.stringify(getFormData(), null, 2)
            }}</pre>
          </div>

          <div class="debug-section">
            <h4>❌ Current Errors</h4>
            <pre class="debug-errors">{{
              JSON.stringify(getFormErrors(), null, 2)
            }}</pre>
          </div>

          <div class="debug-section">
            <h4>🎯 Field Status</h4>
            <div class="field-status">
              <div
                v-for="(field, name) in form"
                :key="name"
                class="field-status-item">
                <strong>{{ name }}:</strong>
                <span
                  :class="{
                    'status-touched': field.touched,
                    'status-error': field.error,
                    'status-valid': field.touched && !field.error,
                  }">
                  {{ field.touched ? 'Touched' : 'Untouched' }}
                  {{ field.error ? '(Error)' : field.touched ? '(Valid)' : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm, createSchema, type FieldConfig } from '../../index'

// Form schema configuration showcasing all field types
const schemaConfig: Record<string, FieldConfig> = {
  // String validation with min/max
  fullName: {
    type: 'string',
    required: 'Full name is required',
    min: 2,
    minError: 'Name must be at least 2 characters',
    max: 50,
    maxError: 'Name cannot exceed 50 characters',
  },

  // Email validation
  email: {
    type: 'email',
    required: 'Email address is required',
    emailError: 'Please enter a valid email address',
  },

  // Number validation
  age: {
    type: 'number',
    required: 'Age is required',
    initialValue: 25,
  },

  // Date validation
  birthDate: {
    type: 'date',
    required: 'Birth date is required',
  },

  // Enum (dropdown) validation
  role: {
    type: 'enum',
    values: [
      'frontend-developer',
      'backend-developer',
      'fullstack-developer',
      'designer',
      'product-manager',
      'data-scientist',
      'devops-engineer',
      'other',
    ],
    required: 'Please select your professional role',
  },

  // URL validation (optional)
  portfolio: {
    type: 'url',
    urlError: 'Please enter a valid URL (e.g., https://example.com)',
  },

  // Nested object validation
  address: {
    type: 'object',
    schema: {
      street: {
        type: 'string',
        required: 'Street address is required',
        min: 5,
        minError: 'Please provide a complete street address',
      },
      city: {
        type: 'string',
        required: 'City is required',
        min: 2,
        minError: 'Please enter a valid city name',
      },
      zipCode: {
        type: 'string',
        required: 'ZIP code is required',
        min: 5,
        minError: 'ZIP code must be at least 5 characters',
        max: 10,
        maxError: 'ZIP code cannot exceed 10 characters',
      },
      country: {
        type: 'enum',
        values: ['US', 'CA', 'UK', 'AU', 'DE', 'FR'],
        required: 'Please select your country',
      },
    },
  },

  // Array field for skills
  skills: {
    type: 'array',
    initialValue: [],
  },

  // Boolean fields for preferences
  notifications: {
    type: 'boolean',
    initialValue: true,
  },

  marketing: {
    type: 'boolean',
    initialValue: false,
  },

  publicProfile: {
    type: 'boolean',
    initialValue: false,
  },

  agreeToTerms: {
    type: 'boolean',
    required: 'You must agree to the terms and conditions',
    initialValue: false,
  },
}

// Initialize form
const { schema, initialValues } = createSchema(schemaConfig)
const {
  form,
  formError,
  isSubmitting,
  formHasErrors,
  formHasChanges,
  handleInput,
  handleBlur,
  setFieldValue,
  setFieldError,
  validateForm,
  validateField,
  getFormData,
  hasErrors,
  hasChanges,
  resetForm,
  getFormErrors,
  getFormErrorsWithValidation,
} = useForm({ schema, initialValues })

// Additional reactive state
const newSkill = ref('')
const showDebug = ref(false)

// Suggested skills for quick adding
const suggestedSkills = [
  'JavaScript',
  'TypeScript',
  'Vue.js',
  'React',
  'Node.js',
  'Python',
  'CSS',
  'HTML',
  'Git',
  'Docker',
]

// Address error handling
const addressErrors = computed(() => {
  const errors = getFormErrors()
  return Object.entries(errors)
    .filter(([key]) => key.startsWith('address.'))
    .map(([, error]) => error)
})

// Skills management
const addSkill = () => {
  const skill = newSkill.value.trim()
  if (skill && !form.skills.value.includes(skill)) {
    const updatedSkills = [...form.skills.value, skill]
    setFieldValue('skills', updatedSkills)
    newSkill.value = ''
  }
}

const addPredefinedSkill = (skill: string) => {
  if (!form.skills.value.includes(skill)) {
    const updatedSkills = [...form.skills.value, skill]
    setFieldValue('skills', updatedSkills)
  }
}

const removeSkill = (index: number) => {
  const updatedSkills = form.skills.value.filter(
    (_: string, i: number) => i !== index
  )
  setFieldValue('skills', updatedSkills)
}

// Address field management
const handleAddressInput = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  updateAddressField(field, target.value)
}

const updateAddressField = (field: string, value: string) => {
  const currentAddress = { ...form.address.value }
  currentAddress[field] = value
  setFieldValue('address', currentAddress)
  handleInput('address')
}

const validateAddressField = (field: string) => {
  // This would trigger validation of the nested field
  // For demo purposes, we'll just mark as touched
  handleInput('address')
}

// Sample data for testing
const fillSampleData = () => {
  // Fill all the form fields with sample data
  setFieldValue('fullName', 'Jane Developer')
  setFieldValue('email', 'jane.developer@example.com')
  setFieldValue('age', 28)
  setFieldValue('birthDate', '1995-06-15')
  setFieldValue('role', 'fullstack-developer')
  setFieldValue('portfolio', 'https://jane-dev.portfolio.com')

  setFieldValue('address', {
    street: '123 Tech Street, Suite 100',
    city: 'San Francisco',
    zipCode: '94105',
    country: 'US',
  })

  setFieldValue('skills', [
    'JavaScript',
    'TypeScript',
    'Vue.js',
    'Node.js',
    'Docker',
  ])
  setFieldValue('notifications', true)
  setFieldValue('marketing', false)
  setFieldValue('publicProfile', true)
  setFieldValue('agreeToTerms', true)

  // Clear any existing form errors
  formError.value = ''

  // Validate the form to clear field errors and show success states
  validateForm()
}

// Form submission
const handleSubmit = async () => {
  console.log('🚀 Starting form validation...')

  if (!validateForm()) {
    const errors = getFormErrorsWithValidation()
    console.log('❌ Form validation failed:', errors)
    formError.value = 'Please fix the errors above and try again.'
    return
  }

  console.log('✅ Form validation passed!')
  isSubmitting.value = true
  formError.value = ''

  try {
    const formData = getFormData()
    console.log('📤 Submitting registration data:', formData)

    // Simulate API call with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate occasional server errors for demo
    if (Math.random() > 0.8) {
      throw new Error('Server temporarily unavailable')
    }

    console.log('🎉 Registration successful!')
    alert('🎉 Account created successfully!\n\nWelcome to Vue Form Manager!')

    // Reset form after successful submission
    resetForm()
  } catch (error) {
    console.error('❌ Registration failed:', error)
    formError.value = `Registration failed: ${
      error instanceof Error ? error.message : 'Unknown error'
    }. Please try again.`
  } finally {
    isSubmitting.value = false
  }
}

// Log form state changes for demonstration
const logFormState = () => {
  console.log('📊 Current form state:', {
    hasChanges: hasChanges(),
    hasErrors: hasErrors(),
    isSubmitting: isSubmitting.value,
    formData: getFormData(),
  })
}

// Call logFormState whenever form changes (for demo purposes)
// In real apps, you might not want this level of logging
if (typeof window !== 'undefined') {
  // Only in browser environment
  setInterval(logFormState, 5000) // Log every 5 seconds
}
</script>

<style scoped>
/* Modern, comprehensive styling for the complete example */

.registration-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    sans-serif;
  line-height: 1.6;
  color: #333;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.form-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
  font-weight: 700;
}

.form-header h2 {
  margin: 0 0 10px 0;
  font-size: 1.5em;
  font-weight: 400;
  opacity: 0.9;
}

.subtitle {
  margin: 0;
  font-size: 1.1em;
  opacity: 0.8;
}

.form-section {
  margin-bottom: 35px;
  padding: 25px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e1e5e9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-section h3 {
  margin: 0 0 25px 0;
  color: #2c3e50;
  font-size: 1.3em;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.field-group {
  margin-bottom: 20px;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

input,
select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: #fff;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  transform: translateY(-1px);
}

input.error,
select.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

input.success,
select.success {
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

.field-feedback {
  margin-top: 8px;
}

.error-text {
  color: #e74c3c;
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.success-text {
  color: #27ae60;
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.help-text {
  color: #7f8c8d;
  font-size: 12px;
  font-style: italic;
}

/* Address validation */
.address-validation {
  margin-top: 20px;
  padding: 16px;
  background-color: #fdf2f2;
  border: 1px solid #f5b7b1;
  border-radius: 8px;
}

.error-summary h4 {
  margin: 0 0 10px 0;
  color: #e74c3c;
  font-size: 16px;
}

.error-summary ul {
  margin: 0;
  padding-left: 20px;
}

.error-summary li {
  color: #e74c3c;
  margin-bottom: 5px;
}

/* Skills management */
.skills-container {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8f9fa;
}

.skills-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  min-height: 40px;
  align-items: flex-start;
}

.skill-tag {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.remove-skill {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.remove-skill:hover {
  background: rgba(255, 255, 255, 0.5);
}

.skill-input-area {
  display: flex;
  gap: 12px;
}

.skill-input {
  flex: 1;
  margin: 0;
}

.add-skill-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-skill-btn:hover:not(:disabled) {
  background-color: #219a52;
  transform: translateY(-1px);
}

.add-skill-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.predefined-skills {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
}

.suggested-skill {
  background-color: #ecf0f1;
  border: 1px solid #bdc3c7;
  padding: 4px 8px;
  margin: 2px 4px 2px 0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.suggested-skill:hover:not(:disabled) {
  background-color: #d5dbdb;
}

.suggested-skill:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Checkbox styling */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
  margin: 0;
}

.checkbox-label:hover {
  background-color: #f8f9fa;
}

.checkbox-label.required {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
}

.checkbox-label input[type='checkbox'] {
  width: auto;
  margin: 0;
  accent-color: #3498db;
}

.checkmark {
  flex-shrink: 0;
}

/* Form actions */
.form-actions {
  display: flex;
  gap: 16px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.submit-btn,
.reset-btn,
.sample-btn {
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 50px;
}

.submit-btn {
  background: linear-gradient(135deg, #27ae60, #229954);
  color: white;
  flex: 2;
  position: relative;
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.submit-btn.loading {
  color: transparent;
}

.loading-spinner {
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  position: absolute;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.reset-btn {
  background-color: #95a5a6;
  color: white;
  flex: 1;
}

.sample-btn {
  background-color: #f39c12;
  color: white;
  flex: 1;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);
}

.reset-btn:hover:not(:disabled) {
  background-color: #7f8c8d;
  transform: translateY(-1px);
}

.sample-btn:hover:not(:disabled) {
  background-color: #e67e22;
  transform: translateY(-1px);
}

/* Form status */
.form-status {
  margin: 30px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.status-indicators {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #e1e5e9;
  font-size: 14px;
}

.status-item.active {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.status-item.error {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #6c757d;
  flex-shrink: 0;
}

.status-item.active .indicator {
  background-color: #28a745;
}

.status-item.error .indicator {
  background-color: #dc3545;
}

.general-error {
  padding: 12px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  color: #721c24;
  font-weight: 500;
}

/* Debug panel */
.debug-panel {
  margin-top: 40px;
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
}

.debug-header h3 {
  margin: 0;
  font-size: 1.2em;
}

.toggle-debug {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-debug:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.debug-content {
  padding: 20px;
}

.debug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.debug-section {
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.debug-section h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 16px;
}

.debug-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.debug-list li {
  padding: 6px 0;
  border-bottom: 1px solid #f1f2f6;
  font-size: 14px;
}

.debug-list li:last-child {
  border-bottom: none;
}

.debug-data,
.debug-errors {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Monaco', 'Consolas', monospace;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
}

.field-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.field-status-item {
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
  border-left: 3px solid #dee2e6;
}

.status-touched {
  color: #856404;
}

.status-error {
  color: #721c24;
}

.status-valid {
  color: #155724;
}

/* Responsive design */
@media (max-width: 768px) {
  .registration-form {
    padding: 15px;
  }

  .form-header {
    padding: 20px 15px;
  }

  .form-header h1 {
    font-size: 2em;
  }

  .form-section {
    padding: 20px 15px;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn,
  .reset-btn,
  .sample-btn {
    flex: 1;
  }

  .status-indicators {
    grid-template-columns: 1fr;
  }

  .debug-grid {
    grid-template-columns: 1fr;
  }

  .skill-input-area {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .form-header h1 {
    font-size: 1.5em;
  }

  .form-header h2 {
    font-size: 1.2em;
  }

  .field-status {
    grid-template-columns: 1fr;
  }
}
</style>
