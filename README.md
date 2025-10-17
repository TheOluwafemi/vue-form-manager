# Vue Form Manager 🚀

[![npm version](https://badge.fury.io/js/vue-form-manager.svg)](https://badge.fury.io/js/vue-form-manager)
[![npm downloads](https://img.shields.io/npm/dm/vue-form-manager.svg)](https://www.npmjs.com/package/vue-form-manager)
[![GitHub license](https://img.shields.io/github/license/yourusername/vue-form-manager.svg)](https://github.com/yourusername/vue-form-manager/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/vue-form-manager.svg)](https://github.com/yourusername/vue-form-manager/stargazers)

A powerful, declarative form validation library for Vue 3 that abstracts away Zod complexity while providing enterprise-grade validation capabilities.

> **Perfect for**: Vue 3 applications that need robust form validation without the complexity of learning Zod schemas directly.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Field Types Guide](#-complete-field-type-guide)
- [API Reference](#️-api-reference)
- [Best Practices](#-best-practices)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **🎯 Declarative Schema Definition**: Define validation rules using simple configuration objects
- **🔷 TypeScript Support**: Full type safety with excellent IntelliSense
- **⚛️ Vue 3 Native**: Built with Composition API for seamless integration
- **🚫 Zero Zod Knowledge Required**: Abstract away complex Zod syntax
- **🔄 Reactive State Management**: Real-time form state with Vue's reactivity
- **📋 Comprehensive Field Types**: Support for all common form field types
- **✅ Flexible Validation**: Field-level and form-level validation with custom messages
- **🏭 Production Ready**: Robust error handling and edge case management

## 📦 Installation

```bash
# npm
npm install vue-form-manager

# yarn
yarn add vue-form-manager

# pnpm
pnpm add vue-form-manager
```

### Requirements

- Vue 3.x
- Node.js ≥ 16.0.0

## 🚀 Quick Start

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="form.name.value"
      @input="handleInput('name')"
      @blur="handleBlur('name')"
      placeholder="Full Name" />
    <span
      v-if="form.name.error"
      class="error"
      >{{ form.name.error }}</span
    >

    <button
      type="submit"
      :disabled="formHasErrors">
      Submit
    </button>
  </form>
</template>

<script setup>
import { useForm, createSchema } from 'vue-form-manager'

const { schema, initialValues } = createSchema({
  name: {
    type: 'string',
    required: 'Name is required',
    min: 2,
    minError: 'Name must be at least 2 characters',
  },
})

const { form, formHasErrors, handleInput, handleBlur, validateForm } = useForm({
  schema,
  initialValues,
})

const handleSubmit = () => {
  if (validateForm()) {
    console.log('Form is valid!', getFormData())
  }
}
</script>
```

## 📚 Complete Field Type Guide

### 🔤 String Fields

```typescript
const { schema, initialValues } = createSchema({
  username: {
    type: 'string',
    required: 'Username is required',
    min: 3,
    minError: 'Username must be at least 3 characters',
    max: 20,
    maxError: 'Username cannot exceed 20 characters',
  },
})
```

### 📧 Email Fields

```typescript
const { schema, initialValues } = createSchema({
  email: {
    type: 'email',
    required: 'Email address is required',
    emailError: 'Please enter a valid email address',
  },
})
```

### 🔢 Number Fields

```typescript
const { schema, initialValues } = createSchema({
  age: {
    type: 'number',
    required: 'Age is required',
    initialValue: 18,
  },
})
```

### 🌐 URL Fields

```typescript
const { schema, initialValues } = createSchema({
  website: {
    type: 'url',
    required: 'Website URL is required',
    urlError: 'Please enter a valid URL',
  },
})
```

### 📅 Date Fields

```typescript
const { schema, initialValues } = createSchema({
  birthDate: {
    type: 'date',
    required: 'Birth date is required',
    initialValue: null,
  },
})
```

### ✅ Boolean Fields

```typescript
const { schema, initialValues } = createSchema({
  agreeToTerms: {
    type: 'boolean',
    required: 'You must agree to terms',
    initialValue: false,
  },
})
```

### 📋 Enum Fields (Select/Dropdown)

```typescript
const { schema, initialValues } = createSchema({
  role: {
    type: 'enum',
    values: ['admin', 'editor', 'viewer'],
    required: 'Please select a role',
  },
})
```

### 📦 Array Fields

```typescript
const { schema, initialValues } = createSchema({
  tags: {
    type: 'array',
    initialValue: ['javascript', 'vue'],
  },
})

// Usage: Add/remove items dynamically
const addTag = (newTag) => {
  setFieldValue('tags', [...form.tags.value, newTag])
}
```

### 🏗️ Object Fields (Nested)

```typescript
const { schema, initialValues } = createSchema({
  address: {
    type: 'object',
    schema: {
      street: { type: 'string', required: 'Street required' },
      city: { type: 'string', required: 'City required' },
      zipCode: {
        type: 'string',
        required: 'ZIP required',
        min: 5,
        minError: 'ZIP must be at least 5 characters',
      },
    },
  },
})
```

## 🛠️ API Reference

### `createSchema(config)`

Creates validation schema and initial values.

### `useForm({ schema, initialValues })`

Returns form state and management functions:

```typescript
{
  // State
  form: FormState                    // Reactive form fields
  formError: Ref<string>             // General form error
  isSubmitting: Ref<boolean>         // Loading state
  formHasErrors: ComputedRef<boolean> // Has validation errors
  formHasChanges: ComputedRef<boolean> // Form modified

  // Methods
  setFieldValue: (field, value) => void
  setFieldError: (field, error) => void
  handleInput: (field) => void       // Mark touched, clear errors
  handleBlur: (field) => void        // Validate on blur
  validateForm: () => boolean        // Validate entire form
  validateField: (field) => boolean  // Validate single field
  getFormData: () => object          // Get clean values
  getFormErrors: () => object        // Get all errors
  hasErrors: () => boolean           // Check validation state
  hasChanges: () => boolean          // Check if modified
  resetForm: () => void              // Reset to initial
}
```

## 📝 Field Configuration

```typescript
interface FieldConfig {
  type:
    | 'string'
    | 'email'
    | 'number'
    | 'boolean'
    | 'date'
    | 'url'
    | 'enum'
    | 'array'
    | 'object'
  required?: string // Required error message
  min?: number // Min length/value
  minError?: string // Min error message
  max?: number // Max length/value
  maxError?: string // Max error message
  emailError?: string // Email error message
  urlError?: string // URL error message
  values?: string[] // Enum values
  initialValue?: any // Default value
  schema?: FieldConfig // Nested validation
}
```

## 🎯 Best Practices

1. **Consistent Error Messages**: Use clear, user-friendly validation messages
2. **Validation Timing**: Use `@blur` for validation, `@input` for clearing errors
3. **TypeScript**: Type your configurations for better development experience
4. **Form Organization**: Group related fields logically

## 🧪 Testing

This library comes with comprehensive test coverage:

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Maintenance tasks

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Show Your Support

If this project helped you, please consider giving it a ⭐ on [GitHub](https://github.com/yourusername/vue-form-manager)!
