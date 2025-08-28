<template>
  <div class="drawing-module">
    <div class="module-header">
      <h1>简易画板</h1>
      <p>在线绘图工具，支持多种画笔和图形</p>
    </div>
    <div class="module-content">
      <div class="coming-soon">
        <Icon icon="mdi:brush" class="coming-soon__icon" />
        <h2>功能开发中...</h2>
        <p>画板功能正在开发中，敬请期待！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>

<style scoped>
.drawing-module {
  min-height: 100vh;
  background: var(--bg-color);
}

.module-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: white;
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.module-header h1 {
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing);
}

.module-header p {
  font-size: var(--text-lg);
  opacity: 0.9;
}

.module-content {
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.coming-soon {
  text-align: center;
  max-width: 400px;
}

.coming-soon__icon {
  font-size: 4rem;
  color: #ff6b6b;
  margin-bottom: var(--spacing-lg);
}

.coming-soon h2 {
  font-size: var(--text-2xl);
  color: var(--text-color);
  margin-bottom: var(--spacing);
}

.coming-soon p {
  font-size: var(--text-base);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xl);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--primary-color);
  color: white;
  border: 1px solid var(--primary-color);
  padding: var(--spacing) var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-weight: 500;
  transition: var(--transition);
}

.btn-primary:hover {
  background: var(--primary-color-hover);
  border-color: var(--primary-color-hover);
}
</style>
