<template>
  <div 
    class="module-card" 
    :style="{ '--module-color': module.color }"
    @click="handleClick"
  >
    <div class="module-card__icon">
      <Icon :icon="module.icon" />
    </div>
    <div class="module-card__content">
      <h3 class="module-card__title">{{ module.name }}</h3>
      <p class="module-card__description">{{ module.description }}</p>
    </div>
    <div class="module-card__arrow">
      <Icon icon="mdi:chevron-right" />
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  module: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const handleClick = () => {
  router.push(props.module.route)
}
</script>

<style scoped>
.module-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--module-color);
  transition: var(--transition);
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--module-color);
}

.module-card:hover::before {
  width: 8px;
}

.module-card__icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--module-color);
  color: white;
  border-radius: var(--radius-lg);
  margin-right: var(--spacing-lg);
  font-size: 24px;
}

.module-card__content {
  flex: 1;
  min-width: 0;
}

.module-card__title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.module-card__description {
  font-size: var(--text-sm);
  color: var(--text-color-secondary);
  line-height: 1.5;
}

.module-card__arrow {
  flex-shrink: 0;
  color: var(--text-color-tertiary);
  font-size: 20px;
  transition: var(--transition);
}

.module-card:hover .module-card__arrow {
  color: var(--module-color);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .module-card {
    padding: var(--spacing);
  }
  
  .module-card__icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
    margin-right: var(--spacing);
  }
  
  .module-card__title {
    font-size: var(--text-base);
  }
}
</style>
