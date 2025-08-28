<template>
  <div class="app-layout">
    <!-- 导航栏 -->
    <Navigation ref="navigationRef" />

    <!-- 主内容区域 -->
    <main
      class="app-layout__main"
      :class="{ 'app-layout__main--collapsed': isNavigationCollapsed }"
    >
      <!-- 移动端导航遮罩 -->
      <div v-if="isMobileNavOpen" class="mobile-nav-overlay" @click="closeMobileNav"></div>

      <!-- 移动端顶部栏 -->
      <header class="mobile-header">
        <button @click="toggleMobileNav" class="mobile-nav-toggle">
          <Icon icon="mdi:menu" />
        </button>
        <div class="mobile-title">
          <Icon icon="mdi:tools" />
          <span>My Studio</span>
        </div>
        <button @click="toggleTheme" class="mobile-theme-toggle">
          <Icon :icon="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" />
        </button>
      </header>

      <!-- 页面内容 -->
      <div class="app-layout__content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useTheme } from '@/composables/useTheme';
import { useLocalStorage } from '@/composables/useLocalStorage';
import Navigation from './components/Navigation.vue';

const { isDark, toggleTheme } = useTheme();

// 响应式数据
const navigationRef = ref(null);
const isMobileNavOpen = ref(false);
const isNavigationCollapsed = useLocalStorage('navigation-collapsed', false);
const isMobile = ref(false);

// 计算属性
// const shouldShowMobileHeader = computed(() => isMobile.value)

// 方法
const toggleMobileNav = () => {
  if (navigationRef.value) {
    navigationRef.value.toggleMobileNav();
  }
};

const closeMobileNav = () => {
  if (navigationRef.value) {
    navigationRef.value.closeMobileNav();
  }
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    isMobileNavOpen.value = false;
  }
};

// 生命周期
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-color);
}

.app-layout__main {
  flex: 1;
  margin-left: 280px;
  transition: var(--transition);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout__main--collapsed {
  margin-left: 80px;
}

.mobile-nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

.mobile-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing) var(--spacing-lg);
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.mobile-nav-toggle,
.mobile-theme-toggle {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-color);
  transition: var(--transition);
}

.mobile-nav-toggle:hover,
.mobile-theme-toggle:hover {
  background: var(--bg-color-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.mobile-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-color);
}

.mobile-title svg {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.app-layout__content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-x: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-layout__main {
    margin-left: 0;
  }

  .app-layout__main--collapsed {
    margin-left: 0;
  }

  .mobile-header {
    display: flex;
  }

  .mobile-nav-overlay {
    display: block;
  }

  .app-layout__content {
    padding: var(--spacing);
  }
}

/* 平滑过渡 */
.app-layout__main,
.app-layout__content {
  transition: margin-left 0.3s ease, padding 0.3s ease;
}
</style>
