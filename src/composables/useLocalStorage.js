import { ref, watch } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'

/**
 * 本地存储组合函数
 * @param {string} key 存储键名
 * @param {any} defaultValue 默认值
 */
export function useLocalStorage(key, defaultValue = null) {
  const storedValue = getStorage(key, defaultValue)
  const value = ref(storedValue)

  // 监听值的变化，自动保存到本地存储
  watch(
    value,
    (newValue) => {
      setStorage(key, newValue)
    },
    { deep: true }
  )

  return value
}
