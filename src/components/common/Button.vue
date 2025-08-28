<template>
  <button 
    class="btn" 
    :class="[
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--loading': loading },
      { 'btn--block': block }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <Icon v-if="loading" icon="mdi:loading" class="btn__loading-icon" />
    <Icon v-else-if="icon" :icon="icon" class="btn__icon" />
    <span v-if="$slots.default" class="btn__text">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'success', 'warning', 'error'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 尺寸 */
.btn--small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-sm);
}

.btn--medium {
  padding: var(--spacing-sm) var(--spacing);
  font-size: var(--text-base);
}

.btn--large {
  padding: var(--spacing) var(--spacing-lg);
  font-size: var(--text-lg);
}

/* 变体 */
.btn--default {
  background: var(--bg-color);
  color: var(--text-color);
  border-color: var(--border-color);
}

.btn--default:hover:not(:disabled) {
  background: var(--bg-color-secondary);
  border-color: var(--border-color-hover);
}

.btn--primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.btn--primary:hover:not(:disabled) {
  background: var(--primary-color-hover);
  border-color: var(--primary-color-hover);
}

.btn--secondary {
  background: var(--secondary-color);
  color: white;
  border-color: var(--secondary-color);
}

.btn--success {
  background: var(--success-color);
  color: white;
  border-color: var(--success-color);
}

.btn--warning {
  background: var(--warning-color);
  color: white;
  border-color: var(--warning-color);
}

.btn--error {
  background: var(--error-color);
  color: white;
  border-color: var(--error-color);
}

/* 块级按钮 */
.btn--block {
  width: 100%;
}

/* 加载状态 */
.btn--loading .btn__loading-icon {
  animation: spin 1s linear infinite;
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
