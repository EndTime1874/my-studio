import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

/**
 * 主题管理组合函数
 */
export function useTheme() {
  const appStore = useAppStore()

  const theme = computed(() => appStore.theme)
  const isDark = computed(() => appStore.isDark)

  const setTheme = (newTheme) => {
    appStore.setTheme(newTheme)
  }

  const toggleTheme = () => {
    appStore.toggleTheme()
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}
