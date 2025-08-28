import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置 dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化日期
 * @param {Date|string|number} date 日期
 * @param {string} format 格式
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format)
}

/**
 * 获取相对时间
 * @param {Date|string|number} date 日期
 */
export function getRelativeTime(date) {
  return dayjs(date).fromNow()
}

/**
 * 获取今天的开始时间
 */
export function getStartOfToday() {
  return dayjs().startOf('day').toDate()
}

/**
 * 获取今天的结束时间
 */
export function getEndOfToday() {
  return dayjs().endOf('day').toDate()
}

/**
 * 检查是否是今天
 * @param {Date|string|number} date 日期
 */
export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * 检查是否是本周
 * @param {Date|string|number} date 日期
 */
export function isThisWeek(date) {
  return dayjs(date).isSame(dayjs(), 'week')
}

/**
 * 获取日期范围
 * @param {Date|string|number} start 开始日期
 * @param {Date|string|number} end 结束日期
 */
export function getDateRange(start, end) {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  const dates = []
  
  let current = startDate
  while (current.isBefore(endDate) || current.isSame(endDate)) {
    dates.push(current.toDate())
    current = current.add(1, 'day')
  }
  
  return dates
}
