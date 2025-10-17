<template>
  <div class="container">
    <div class="header">
      <h1>🚀 Vue Form Manager Examples</h1>
      <p>Interactive examples showing all the features of Vue Form Manager</p>
    </div>

    <div class="examples-grid">
      <!-- Basic Usage Example -->
      <div class="example-card">
        <h2 class="example-title">📝 Basic Usage</h2>
        <BasicUsage />
      </div>

      <!-- Comprehensive Example -->
      <div class="example-card">
        <h2 class="example-title">🎯 Comprehensive Example</h2>
        <ComprehensiveExample />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BasicUsage from '../examples/BasicUsage.vue'
import ComprehensiveExample from '../examples/ComprehensiveExample.vue'
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 2.5rem;
}

.header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.examples-grid {
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
}

.example-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.example-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.example-title {
  font-size: 1.5rem;
  margin: 0 0 20px 0;
  color: #2c3e50;
  border-bottom: 3px solid #3498db;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
