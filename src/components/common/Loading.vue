<template>
  <div class="loading" :class="{ 'loading--overlay': overlay }">
    <div class="loading__content">
      <div class="loading__spinner">
        <Icon icon="mdi:loading" />
      </div>
      <p v-if="text" class="loading__text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  text: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.loading--overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.loading__content {
  text-align: center;
}

.loading__spinner {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing);
  animation: spin 1s linear infinite;
}

.loading__text {
  color: var(--text-color-secondary);
  font-size: var(--text-base);
}

.loading--overlay .loading__text {
  color: white;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
