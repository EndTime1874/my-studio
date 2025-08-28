/**
 * 游戏数据分析工具函数
 */

/**
 * 按指定字段对数组进行分组
 * @param {Array} arr 要分组的数组
 * @param {string} key 分组字段
 * @returns {Array} 分组后的数组
 */
export function regroupArr(arr, key) {
  const grouped = {};

  arr.forEach(item => {
    const groupKey = item[key];
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(item);
  });

  return Object.values(grouped);
}

/**
 * 日期格式化函数
 * @param {string|Date|number} date 日期（可以是时间戳）
 * @param {string} format 格式字符串
 * @returns {string} 格式化后的日期字符串
 */
export function dateFormat(date, format) {
  // 如果是时间戳字符串，转换为数字
  let timestamp = date;
  if (typeof date === 'string' && /^\d+$/.test(date)) {
    timestamp = parseInt(date) * 1000; // 转换为毫秒
  } else if (typeof date === 'number' && date < 10000000000) {
    timestamp = date * 1000; // 如果是秒级时间戳，转换为毫秒
  }

  const d = new Date(timestamp);

  // 检查日期是否有效
  if (isNaN(d.getTime())) {
    console.warn('Invalid date:', date);
    return 'Invalid Date';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
}

/**
 * 日期比较函数
 * @param {Object} a 包含日期的对象
 * @param {Object} b 包含日期的对象
 * @returns {number} 比较结果
 */
export function compareDates(a, b) {
  // 使用时间戳进行比较
  const timestampA = a.timestamp || parseInt(a.date);
  const timestampB = b.timestamp || parseInt(b.date);
  return timestampA - timestampB;
}

/**
 * 计算游戏数据统计
 * @param {Array} data 游戏数据数组
 * @returns {Object} 统计结果
 */
export function calculateGameStats(data) {
  if (!data || !data.length) {
    return {
      totalGames: 0,
      totalHours: 0,
      averageGamesPerDay: 0,
      maxGamesInDay: 0,
      activeDays: 0,
    };
  }

  const totalGames = data.reduce((sum, item) => sum + (item.count || 0), 0);
  const activeDays = data.length;
  const maxGamesInDay = Math.max(...data.map(item => item.count || 0));
  const averageGamesPerDay = totalGames / activeDays;

  return {
    totalGames,
    totalHours: Math.round(totalGames * 0.5), // 假设每局游戏30分钟
    averageGamesPerDay: Math.round(averageGamesPerDay * 100) / 100,
    maxGamesInDay,
    activeDays,
  };
}

/**
 * 生成图表颜色
 * @param {number} index 索引
 * @returns {string} 颜色值
 */
export function getChartColor(index) {
  const colors = [
    '#646cff',
    '#42b883',
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#feca57',
    '#ff9ff3',
    '#54a0ff',
    '#5f27cd',
  ];
  return colors[index % colors.length];
}

/**
 * 格式化数字显示
 * @param {number} num 数字
 * @returns {string} 格式化后的字符串
 */
export function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * 获取月份名称
 * @param {number} month 月份数字 (1-12)
 * @returns {string} 月份名称
 */
export function getMonthName(month) {
  const months = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];
  return months[month - 1] || '';
}

/**
 * 计算日期范围内的天数
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @returns {number} 天数
 */
export function getDaysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 获取最佳游戏日（净胜最多的天）
 * @param {Array} data 游戏数据数组
 * @param {number} count 返回数量，默认3
 * @returns {Array} 排序后的最佳游戏日数组
 */
export function getBestDays(data, count = 3) {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter(item => item.win_count !== undefined && item.count) // 只要有游戏记录的天
    .map(item => ({
      ...item,
      loseCount: (item.count || 0) - (item.win_count || 0), // 败场数
      netWin: (item.win_count || 0) - ((item.count || 0) - (item.win_count || 0)), // 净胜场数
    }))
    .sort((a, b) => b.netWin - a.netWin) // 按净胜场数降序排列
    .slice(0, count);
}

/**
 * 获取最差游戏日（净败最多的天）
 * @param {Array} data 游戏数据数组
 * @param {number} count 返回数量，默认3
 * @returns {Array} 排序后的最差游戏日数组
 */
export function getWorstDays(data, count = 3) {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter(item => item.win_count !== undefined && item.count) // 只要有游戏记录的天
    .map(item => ({
      ...item,
      loseCount: (item.count || 0) - (item.win_count || 0), // 败场数
      netWin: (item.win_count || 0) - ((item.count || 0) - (item.win_count || 0)), // 净胜场数
    }))
    .sort((a, b) => a.netWin - b.netWin) // 按净胜场数升序排列
    .slice(0, count);
}

/**
 * 获取游戏最多的日子
 * @param {Array} data 游戏数据数组
 * @param {number} count 返回数量，默认3
 * @returns {Array} 排序后的游戏最多日数组
 */
export function getMostPlayedDays(data, count = 3) {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter(item => item.count && item.count > 0) // 只要有游戏记录的天
    .map(item => ({
      ...item,
      loseCount: (item.count || 0) - (item.win_count || 0), // 败场数
      netWin: (item.win_count || 0) - ((item.count || 0) - (item.win_count || 0)), // 净胜场数
      winRate: item.count > 0 ? (((item.win_count || 0) / item.count) * 100).toFixed(1) : '0.0', // 胜率
    }))
    .sort((a, b) => b.count - a.count) // 按游戏局数降序排列
    .slice(0, count);
}

/**
 * 获取胜率最高的日子
 * @param {Array} data 游戏数据数组
 * @param {number} count 返回数量，默认3
 * @param {number} minGames 最少游戏局数，默认3局
 * @returns {Array} 排序后的胜率最高日数组
 */
export function getHighestWinRateDays(data, count = 3, minGames = 3) {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter(item => item.count && item.count >= minGames) // 至少要有指定局数的游戏
    .map(item => ({
      ...item,
      loseCount: (item.count || 0) - (item.win_count || 0), // 败场数
      netWin: (item.win_count || 0) - ((item.count || 0) - (item.win_count || 0)), // 净胜场数
      winRate: item.count > 0 ? (((item.win_count || 0) / item.count) * 100).toFixed(1) : '0.0', // 胜率
      winRateNum: item.count > 0 ? (item.win_count || 0) / item.count : 0, // 胜率数值用于排序
    }))
    .sort((a, b) => b.winRateNum - a.winRateNum || b.count - a.count) // 按胜率降序，胜率相同按局数降序
    .slice(0, count);
}

/**
 * 获取胜率最低的日子
 * @param {Array} data 游戏数据数组
 * @param {number} count 返回数量，默认3
 * @param {number} minGames 最少游戏局数，默认3局
 * @returns {Array} 排序后的胜率最低日数组
 */
export function getLowestWinRateDays(data, count = 3, minGames = 3) {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter(item => item.count && item.count >= minGames) // 至少要有指定局数的游戏
    .map(item => ({
      ...item,
      loseCount: (item.count || 0) - (item.win_count || 0), // 败场数
      netWin: (item.win_count || 0) - ((item.count || 0) - (item.win_count || 0)), // 净胜场数
      winRate: item.count > 0 ? (((item.win_count || 0) / item.count) * 100).toFixed(1) : '0.0', // 胜率
      winRateNum: item.count > 0 ? (item.win_count || 0) / item.count : 0, // 胜率数值用于排序
    }))
    .sort((a, b) => a.winRateNum - b.winRateNum || b.count - a.count) // 按胜率升序，胜率相同按局数降序
    .slice(0, count);
}

/**
 * 获取连胜最多的日子
 * @param {Array} data 游戏数据数组
 * @param {number} count 返回数量，默认3
 * @returns {Array} 排序后的连胜最多日数组
 */
export function getMostWinsDays(data, count = 3) {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter(item => item.win_count && item.win_count > 0) // 只要有胜场的天
    .map(item => ({
      ...item,
      loseCount: (item.count || 0) - (item.win_count || 0), // 败场数
      netWin: (item.win_count || 0) - ((item.count || 0) - (item.win_count || 0)), // 净胜场数
      winRate: item.count > 0 ? (((item.win_count || 0) / item.count) * 100).toFixed(1) : '0.0', // 胜率
    }))
    .sort((a, b) => b.win_count - a.win_count) // 按胜场数降序排列
    .slice(0, count);
}

/**
 * 天干地支计算（使用 tyme4ts 库）
 * @param {number} timestamp 时间戳
 * @returns {string} 天干地支字符串
 */
export function getSixtyWord(timestamp) {
  try {
    // 尝试使用 tyme4ts 库进行精确计算
    const { SolarDay } = require('tyme4ts');
    const date = new Date(timestamp * 1000);
    const solarDay = SolarDay.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const lunarDay = solarDay.getLunarDay();

    const yearTianGan = lunarDay.getYearSixtyCycle();
    const monthTianGan = lunarDay.getMonthSixtyCycle();
    const dayTianGan = lunarDay.getSixtyCycle();

    return `${yearTianGan.toString()} ${monthTianGan.toString()} ${dayTianGan.toString()}`;
  } catch (error) {
    // 如果 tyme4ts 不可用，使用简化版计算
    return getSixtyWordSimple(timestamp);
  }
}

/**
 * 五行颜色配置
 */
export const WUXING_COLORS = {
  木: '#22c55e', // 绿色
  火: '#ef4444', // 红色
  土: '#eab308', // 黄色
  金: '#94a3b8', // 银灰色（更好的对比度）
  水: '#3b82f6', // 蓝色
};

/**
 * 天干五行映射
 */
export const TIANGAN_WUXING = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水',
};

/**
 * 地支五行映射
 */
export const DIZHI_WUXING = {
  子: '水',
  丑: '土',
  寅: '木',
  卯: '木',
  辰: '土',
  巳: '火',
  午: '火',
  未: '土',
  申: '金',
  酉: '金',
  戌: '土',
  亥: '水',
};

/**
 * 获取天干地支的五行颜色
 * @param {string} char 天干或地支字符
 * @returns {string} 对应的五行颜色
 */
export function getWuxingColor(char) {
  const wuxing = TIANGAN_WUXING[char] || DIZHI_WUXING[char];
  return WUXING_COLORS[wuxing] || '#64748b';
}

/**
 * 解析天干地支字符串为结构化数据
 * @param {string} sixtyWordStr 天干地支字符串，如 "甲子 乙丑 丙寅"
 * @returns {Object} 结构化的天干地支数据
 */
export function parseSixtyWord(sixtyWordStr) {
  if (!sixtyWordStr) return null;

  const parts = sixtyWordStr.trim().split(' ');
  if (parts.length !== 3) return null;

  const [year, month, day] = parts;

  return {
    year: {
      tiangan: year[0],
      dizhi: year[1],
      tianganColor: getWuxingColor(year[0]),
      dizhiColor: getWuxingColor(year[1]),
    },
    month: {
      tiangan: month[0],
      dizhi: month[1],
      tianganColor: getWuxingColor(month[0]),
      dizhiColor: getWuxingColor(month[1]),
    },
    day: {
      tiangan: day[0],
      dizhi: day[1],
      tianganColor: getWuxingColor(day[0]),
      dizhiColor: getWuxingColor(day[1]),
    },
  };
}

/**
 * 简化版天干地支计算（备用方案）
 * @param {number} timestamp 时间戳
 * @returns {string} 天干地支字符串
 */
export function getSixtyWordSimple(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 天干
  const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  // 地支
  const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 简化计算（基于公历日期的近似计算）
  const yearIndex = (year - 4) % 60;
  const yearTianGan = tianGan[yearIndex % 10];
  const yearDiZhi = diZhi[yearIndex % 12];

  const monthIndex = (year * 12 + month - 1) % 60;
  const monthTianGan = tianGan[monthIndex % 10];
  const monthDiZhi = diZhi[monthIndex % 12];

  const dayIndex =
    Math.floor((new Date(year, month - 1, day) - new Date(1900, 0, 31)) / (1000 * 60 * 60 * 24)) %
    60;
  const dayTianGan = tianGan[dayIndex % 10];
  const dayDiZhi = diZhi[dayIndex % 12];

  return `${yearTianGan}${yearDiZhi}年 ${monthTianGan}${monthDiZhi}月 ${dayTianGan}${dayDiZhi}日`;
}
