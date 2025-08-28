import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { THEME_CONFIG, STORAGE_KEYS } from '@/config/constants'

export const useAppStore = defineStore('app', () => {
  // 状态
  const theme = ref(localStorage.getItem(STORAGE_KEYS.THEME) || THEME_CONFIG.default)
  const loading = ref(false)
  const sidebarCollapsed = ref(false)

  // 计算属性
  const isDark = computed(() => theme.value === 'dark')

  // 方法
  const setTheme = (newTheme) => {
    if (THEME_CONFIG.themes.includes(newTheme)) {
      theme.value = newTheme
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
      updateThemeClass()
    }
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const setLoading = (status) => {
    loading.value = status
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const updateThemeClass = () => {
    const html = document.documentElement
    html.setAttribute('data-theme', theme.value)
    if (theme.value === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // 初始化主题
  const initTheme = () => {
    updateThemeClass()
  }

  return {
    // 状态
    theme,
    loading,
    sidebarCollapsed,
    // 计算属性
    isDark,
    // 方法
    setTheme,
    toggleTheme,
    setLoading,
    toggleSidebar,
    initTheme
  }
})
