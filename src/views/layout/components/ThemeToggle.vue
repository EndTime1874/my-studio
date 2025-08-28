<template>
  <div class="theme-toggle" :class="{ 'theme-toggle--collapsed': isCollapsed }">
    <!-- 折叠状态：只显示图标 -->
    <div v-if="isCollapsed" class="theme-toggle__collapsed" @click="toggleTheme">
      <Icon
        :icon="isDark ? 'material-symbols:wb-sunny' : 'material-symbols:dark-mode'"
        class="theme-icon"
      />
    </div>

    <!-- 展开状态：完整开关 -->
    <div v-else class="theme-toggle__expanded">
      <div class="theme-toggle__switch" @click="toggleTheme">
        <!-- 左侧 Light Mode -->
        <div
          class="theme-toggle__option theme-toggle__option--light"
          :class="{ 'theme-toggle__option--active': !isDark }"
        >
          <Icon icon="material-symbols:wb-sunny" class="option-icon" />
          <span class="option-text">Light</span>
        </div>

        <!-- 滑块 -->
        <div class="theme-toggle__slider" :class="{ 'theme-toggle__slider--dark': isDark }"></div>

        <!-- 右侧 Dark Mode -->
        <div
          class="theme-toggle__option theme-toggle__option--dark"
          :class="{ 'theme-toggle__option--active': isDark }"
        >
          <Icon icon="material-symbols:dark-mode" class="option-icon" />
          <span class="option-text">Dark</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { useTheme } from '@/composables/useTheme';

// Props
defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
});

// 使用主题组合函数
const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
  user-select: none;
}

/* 折叠状态样式 */
.theme-toggle__collapsed {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition);
}

.theme-toggle__collapsed:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.theme-toggle__collapsed .theme-icon {
  font-size: 1.25rem;
  color: var(--text-color);
  transition: var(--transition);
}

.theme-toggle__collapsed:hover .theme-icon {
  color: white;
}

/* 展开状态样式 */
.theme-toggle__expanded {
  width: 100%;
}

.theme-toggle__switch {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-color-secondary);
  border: 2px solid var(--border-color);
  border-radius: 32px;
  padding: 4px;
  cursor: pointer;
  transition: var(--transition);
  height: 56px;
  overflow: hidden;
}

.theme-toggle__switch:hover {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(100 108 255 / 0.1);
}

/* 选项样式 */
.theme-toggle__option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing);
  border-radius: 24px;
  transition: var(--transition);
  z-index: 2;
  position: relative;
}

.theme-toggle__option--light {
  color: var(--text-color-secondary);
}

.theme-toggle__option--dark {
  color: var(--text-color-secondary);
}

.theme-toggle__option--active {
  color: white;
  font-weight: 600;
}

.option-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.option-text {
  font-size: var(--text-sm);
  font-weight: 500;
  white-space: nowrap;
}

/* 滑块样式 */
.theme-toggle__slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, var(--primary-color) 0%, #8b5cf6 100%);
  border-radius: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  box-shadow: var(--shadow-md);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.theme-toggle__slider--dark {
  transform: translateX(100%);
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-color: rgba(255, 255, 255, 0.2);
}

/* 暗色主题适配 */
[data-theme='dark'] .theme-toggle__switch {
  background: var(--bg-color-tertiary);
  border-color: var(--border-color-hover);
}

[data-theme='dark'] .theme-toggle__slider--dark {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-color: rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] .theme-toggle__collapsed {
  background: var(--bg-color-tertiary);
  border-color: var(--border-color-hover);
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.theme-toggle__switch {
  animation: slideIn 0.2s ease-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-toggle__switch {
    height: 48px;
  }

  .option-text {
    font-size: var(--text-xs);
  }

  .option-icon {
    font-size: 1rem;
  }
}

/* 无障碍支持 */
.theme-toggle__switch:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .theme-toggle__switch {
    border-width: 3px;
  }

  .theme-toggle__slider {
    box-shadow: 0 0 0 2px var(--bg-color);
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  .theme-toggle__slider {
    transition: transform 0.1s ease;
  }

  .theme-toggle__switch {
    animation: none;
  }
}
</style>
