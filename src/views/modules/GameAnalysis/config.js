/**
 * Dota2 数据分析模块配置文件
 */

// OpenDota API 配置
export const API_CONFIG = {
  BASE_URL: 'https://api.opendota.com/api',
  TIMEOUT: 10000, // 请求超时时间（毫秒）
  RETRY_ATTEMPTS: 3, // 重试次数
  RETRY_DELAY: 1000, // 重试延迟（毫秒）
};

// 玩家配置
// 请将下面的 Account ID 替换为实际的 Dota2 账户 ID
// 如何获取 Account ID：
// 1. 访问 https://www.opendota.com/
// 2. 搜索玩家的 Steam 用户名
// 3. 在玩家页面的 URL 中找到 Account ID
// 例如：https://www.opendota.com/players/123456789 中的 123456789
export const PLAYER_CONFIG = [
  {
    label: '🐟 YYY',
    value: '871701464', // 请替换为实际的 Account ID
    description: '玩家 YYY 的 Dota2 数据',
  },
  {
    label: '🐷 ZJJ',
    value: '899817047', // 请替换为实际的 Account ID
    description: '玩家 ZJJ 的 Dota2 数据',
  },
  // 可以添加更多玩家
  // {
  //   label: '新玩家',
  //   value: '111111111',
  //   description: '新玩家的描述'
  // }
];

// 数据处理配置
export const DATA_CONFIG = {
  // 最大数据范围（天数）
  MAX_DAYS: 365 * 5, // 5年

  // 颜色配置
  COLORS: {
    COUNT: {
      NONE: '#0CFFFFFF',
      LOW: '#4C92A525', // 1-3 局
      MEDIUM: '#7F92A525', // 4-6 局
      HIGH: '#CC92A525', // 7+ 局
    },
    WIN_RATE: {
      VERY_LOW: '#C23C2A', // 0%
      LOW: '#F37A40', // < 30%
      BELOW_AVERAGE: '#F29731', // 30-40%
      POOR: '#F1B224', // 40-50%
      AVERAGE: '#EFCC16', // 50-60%
      GOOD: '#C0C21E', // 60-70%
      VERY_GOOD: '#92A525', // 70-80%
      EXCELLENT: '#8FB725', // 80-90%
      PERFECT: '#60AD2C', // 90%+
    },
  },

  // 胜率阈值
  WIN_RATE_THRESHOLDS: {
    VERY_LOW: 0,
    LOW: 30,
    BELOW_AVERAGE: 40,
    POOR: 50,
    AVERAGE: 60,
    GOOD: 70,
    VERY_GOOD: 80,
    EXCELLENT: 90,
  },
};

// UI 配置
export const UI_CONFIG = {
  // 图表高度
  CHART_HEIGHT: 400,

  // 动画配置
  ANIMATION: {
    DURATION: 300,
    EASING: 'ease-in-out',
  },

  // 加载状态配置
  LOADING: {
    MIN_DISPLAY_TIME: 500, // 最小显示时间（毫秒）
    SPINNER_SIZE: '3rem',
  },
};

// 错误消息配置
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  API_ERROR: 'OpenDota API 请求失败',
  DATA_FORMAT_ERROR: '数据格式错误',
  NO_DATA: '未找到该玩家的比赛数据',
  TIMEOUT: '请求超时，请重试',
  UNKNOWN: '未知错误，请重试',
};

// 开发模式配置
export const DEV_CONFIG = {
  // 是否启用调试日志
  DEBUG: process.env.NODE_ENV === 'development',

  // 是否使用模拟数据
  USE_MOCK_DATA: false,

  // API 请求日志
  LOG_API_REQUESTS: process.env.NODE_ENV === 'development',
};
