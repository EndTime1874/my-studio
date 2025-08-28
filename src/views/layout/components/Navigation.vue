<template>
  <nav
    class="navigation"
    :class="{
      'navigation--collapsed': isCollapsed && !isMobile,
      'navigation--dark': isDark,
      'navigation--mobile-open': isMobileOpen && isMobile,
    }"
  >
    <!-- 导航头部 -->
    <div class="navigation__header">
      <div class="navigation__logo">
        <Icon icon="material-symbols:account-circle" class="logo-icon" />
        <span v-if="!isCollapsed" class="logo-text">My Studio</span>
      </div>
      <button
        v-if="!isCollapsed"
        @click="toggleCollapse"
        class="collapse-btn"
        :title="isCollapsed ? '展开导航' : '收起导航'"
      >
        <Icon icon="mdi:menu" />
      </button>
    </div>

    <!-- 搜索框 -->
    <div v-if="!isCollapsed" class="navigation__search">
      <div class="search-input">
        <Icon icon="mdi:magnify" class="search-icon" />
        <input type="text" placeholder="搜索功能..." v-model="searchQuery" class="search-field" />
      </div>
    </div>
    <div v-else class="navigation__search-collapsed">
      <button class="search-btn" @click="toggleCollapse" title="搜索">
        <Icon icon="mdi:magnify" />
      </button>
    </div>

    <!-- 导航菜单 -->
    <div class="navigation__menu">
      <!-- 首页 -->
      <router-link to="/" class="menu-item" :class="{ 'menu-item--active': $route.path === '/' }">
        <Icon icon="mdi:view-dashboard" class="menu-icon" />
        <span v-if="!isCollapsed" class="menu-text">功能中心</span>
      </router-link>

      <!-- 功能模块 -->
      <router-link
        v-for="module in enabledModules"
        :key="module.id"
        :to="module.route"
        class="menu-item"
        :class="{ 'menu-item--active': $route.path === module.route }"
        :style="{ '--module-color': module.color }"
      >
        <Icon :icon="module.icon" class="menu-icon" />
        <span v-if="!isCollapsed" class="menu-text">{{ module.name }}</span>
      </router-link>

      <!-- 分隔线 -->
      <div v-if="!isCollapsed" class="menu-divider"></div>

      <!-- 设置 -->
      <div class="menu-item" @click="showSettings = true">
        <Icon icon="mdi:cog" class="menu-icon" />
        <span v-if="!isCollapsed" class="menu-text">设置</span>
      </div>
    </div>

    <!-- 底部操作区 -->
    <div class="navigation__footer">
      <!-- 主题切换 -->
      <ThemeToggle :is-collapsed="isCollapsed" />

      <!-- 折叠按钮（仅在展开状态显示） -->
      <button v-if="!isCollapsed" @click="toggleCollapse" class="collapse-toggle" title="收起导航">
        <Icon icon="mdi:chevron-left" />
      </button>
    </div>

    <!-- 展开按钮（仅在折叠状态显示） -->
    <button v-if="isCollapsed" @click="toggleCollapse" class="expand-btn" title="展开导航">
      <Icon icon="mdi:chevron-right" />
    </button>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useTheme } from '@/composables/useTheme';
import { getEnabledModules } from '@/config/modules';
import { useLocalStorage } from '@/composables/useLocalStorage';
import ThemeToggle from './ThemeToggle.vue';

const { isDark } = useTheme();

// 响应式数据
const searchQuery = ref('');
const showSettings = ref(false);
const isCollapsed = useLocalStorage('navigation-collapsed', false);
const isMobile = ref(false);
const isMobileOpen = ref(false);

// 计算属性
const enabledModules = computed(() => getEnabledModules());

// 方法
const toggleCollapse = () => {
  if (isMobile.value) {
    isMobileOpen.value = !isMobileOpen.value;
  } else {
    isCollapsed.value = !isCollapsed.value;
  }
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    isMobileOpen.value = false;
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

// 暴露给父组件的方法
defineExpose({
  toggleMobileNav: toggleCollapse,
  closeMobileNav: () => {
    isMobileOpen.value = false;
  },
});
</script>

<style scoped>
.navigation {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: var(--bg-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: var(--transition);
  z-index: 1000;
  box-shadow: var(--shadow);
}

.navigation--collapsed {
  width: 80px;
}

.navigation--dark {
  background: var(--bg-color-secondary);
  border-right-color: var(--border-color-hover);
}

/* 头部 */
.navigation__header {
  padding: var(--spacing);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  border-bottom: 1px solid var(--border-color);
}

.navigation__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing);
}

.logo-icon {
  font-size: 2rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.logo-text {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-color);
  white-space: nowrap;
}

.collapse-btn {
  padding: var(--spacing-sm);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-color-secondary);
  transition: var(--transition);
}

.collapse-btn:hover {
  background: var(--bg-color-secondary);
  border-color: var(--border-color-hover);
  color: var(--text-color);
}

/* 搜索 */
.navigation__search {
  padding: var(--spacing) var(--spacing);
}

.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--spacing);
  color: var(--text-color-tertiary);
  z-index: 1;
}

.search-field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) calc(var(--spacing) * 2);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-color-secondary);
  color: var(--text-color);
  font-size: var(--text-sm);
  transition: var(--transition);
}

.search-field:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(100 108 255 / 0.1);
}

.navigation__search-collapsed {
  padding: 0 var(--spacing) var(--spacing);
  display: flex;
  justify-content: center;
}

.search-btn {
  width: 40px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-color-secondary);
  transition: var(--transition);
}

.search-btn:hover {
  background: var(--bg-color-secondary);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* 菜单 */
.navigation__menu {
  flex: 1;
  padding: 0 var(--spacing);
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing);
  margin-bottom: var(--spacing-xs);
  border-radius: var(--radius);
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
  position: relative;
}

.navigation--collapsed .menu-item {
  justify-content: center;
  padding: var(--spacing-sm) 0;
}

.menu-item:hover {
  background: var(--bg-color-secondary);
  color: var(--text-color);
}

.menu-item--active {
  background: linear-gradient(135deg, var(--primary-color) 0%, #8b5cf6 100%);
  color: white;
  box-shadow: var(--shadow);
}

.menu-item--active:hover {
  background: linear-gradient(135deg, var(--primary-color-hover) 0%, #7c3aed 100%);
}

.menu-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.menu-text {
  font-weight: 500;
  white-space: nowrap;
}

.menu-divider {
  height: 1px;
  background: var(--border-color);
  margin: var(--spacing) 0;
}

/* 底部 */
.navigation__footer {
  padding: var(--spacing);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.collapse-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-color-secondary);
  transition: var(--transition);
}

.collapse-toggle:hover {
  background: var(--bg-color-secondary);
  border-color: var(--border-color-hover);
  color: var(--text-color);
}

.expand-btn {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  border: 2px solid var(--bg-color);
  border-radius: 50%;
  color: white;
  box-shadow: var(--shadow-lg);
  transition: var(--transition);
}

.expand-btn:hover {
  background: var(--primary-color-hover);
  transform: translateY(-50%) scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navigation {
    transform: translateX(-100%);
    width: 280px !important;
  }

  .navigation--mobile-open {
    transform: translateX(0) !important;
  }
}

/* 滚动条样式 */
.navigation__menu::-webkit-scrollbar {
  width: 4px;
}

.navigation__menu::-webkit-scrollbar-track {
  background: transparent;
}

.navigation__menu::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: var(--radius);
}

.navigation__menu::-webkit-scrollbar-thumb:hover {
  background: var(--border-color-hover);
}
</style>
