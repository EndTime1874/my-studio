<template>
  <div 
    class="card" 
    :class="[
      `card--${variant}`,
      { 'card--hoverable': hoverable },
      { 'card--shadow': shadow }
    ]"
  >
    <div v-if="$slots.header" class="card__header">
      <slot name="header" />
    </div>
    <div class="card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  shadow: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
}

.card--shadow {
  box-shadow: var(--shadow);
}

.card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card--primary {
  border-color: var(--primary-color);
}

.card--secondary {
  border-color: var(--secondary-color);
}

.card__header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
}

.card__body {
  padding: var(--spacing-lg);
}

.card__footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
}
</style>
