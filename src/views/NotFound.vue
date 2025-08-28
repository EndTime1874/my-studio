<template>
  <div class="not-found">
    <div class="not-found__container">
      <div class="not-found__icon">
        <Icon icon="mdi:emoticon-sad-outline" />
      </div>
      <h1 class="not-found__title">404</h1>
      <p class="not-found__message">抱歉，您访问的页面不存在</p>
      <div class="not-found__actions">
        <button @click="goHome" class="btn-primary">
          <Icon icon="mdi:home" />
          返回首页
        </button>
        <button @click="goBack" class="btn-secondary">
          <Icon icon="mdi:arrow-left" />
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: var(--spacing);
}

.not-found__container {
  text-align: center;
  max-width: 500px;
}

.not-found__icon {
  font-size: 6rem;
  color: var(--text-color-tertiary);
  margin-bottom: var(--spacing-lg);
}

.not-found__title {
  font-size: 4rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: var(--spacing);
}

.not-found__message {
  font-size: var(--text-lg);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.not-found__actions {
  display: flex;
  gap: var(--spacing);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing) var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-weight: 500;
  transition: var(--transition);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: 1px solid var(--primary-color);
}

.btn-primary:hover {
  background: var(--primary-color-hover);
  border-color: var(--primary-color-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-color-secondary);
  border-color: var(--border-color-hover);
}
</style>
