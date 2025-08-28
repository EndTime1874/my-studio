/**
 * 本地存储工具函数
 */

/**
 * 设置 localStorage
 * @param {string} key 键名
 * @param {any} value 值
 */
export function setStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}

/**
 * 获取 localStorage
 * @param {string} key 键名
 * @param {any} defaultValue 默认值
 */
export function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error getting localStorage:', error)
    return defaultValue
  }
}

/**
 * 删除 localStorage
 * @param {string} key 键名
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing localStorage:', error)
  }
}

/**
 * 清空 localStorage
 */
export function clearStorage() {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * 设置 sessionStorage
 * @param {string} key 键名
 * @param {any} value 值
 */
export function setSessionStorage(key, value) {
  try {
    const serializedValue = JSON.stringify(value)
    sessionStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error('Error setting sessionStorage:', error)
  }
}

/**
 * 获取 sessionStorage
 * @param {string} key 键名
 * @param {any} defaultValue 默认值
 */
export function getSessionStorage(key, defaultValue = null) {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error getting sessionStorage:', error)
    return defaultValue
  }
}
