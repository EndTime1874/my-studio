<template>
  <div class="game-analysis-module">
    <div class="module-header">
      <h1>Dota2 数据分析</h1>
      <p>基于 OpenDota API 的实时游戏数据统计与可视化分析</p>
    </div>

    <div class="module-content">
      <!-- 用户选择器 -->
      <div class="user-selector">
        <h3>选择玩家数据</h3>

        <!-- 输入模式切换 -->
        <div class="mode-toggle">
          <button
            :class="['mode-btn', { active: inputMode === 'preset' }]"
            @click="switchInputMode('preset')"
            :disabled="loading"
          >
            <Icon icon="material-symbols:list" />
            预设玩家
          </button>
          <button
            :class="['mode-btn', { active: inputMode === 'custom' }]"
            @click="switchInputMode('custom')"
            :disabled="loading"
          >
            <Icon icon="material-symbols:edit" />
            手动输入
          </button>
        </div>

        <!-- 预设玩家选择 -->
        <div v-if="inputMode === 'preset'" class="preset-selection">
          <div class="radio-group">
            <label
              v-for="user in users"
              :key="user.value"
              class="radio-option"
              :class="{ active: selectedUser === user.value, disabled: loading }"
            >
              <input
                type="radio"
                :value="user.value"
                v-model="selectedUser"
                @change="handleUserChange"
                :disabled="loading"
              />
              <span class="radio-label">{{ user.label }}</span>
            </label>
          </div>
        </div>

        <!-- 自定义输入 -->
        <div v-else class="custom-input">
          <div class="input-group">
            <div class="input-field">
              <label for="accountId">Dota2 ID</label>
              <input
                id="accountId"
                type="text"
                v-model="customAccountId"
                placeholder="请输入ID"
                :disabled="loading"
                @keyup.enter="handleCustomQuery"
                class="account-input"
              />
            </div>
            <div class="input-actions">
              <button
                @click="handleCustomQuery"
                :disabled="loading || !customAccountId.trim()"
                class="query-btn"
              >
                <Icon icon="material-symbols:search" />
                查询
              </button>
              <button @click="handleReset" :disabled="loading" class="reset-btn">
                <Icon icon="material-symbols:refresh" />
                重置
              </button>
            </div>
          </div>
          <div class="input-hint">
            <Icon icon="material-symbols:info" class="hint-icon" />
            请输入有效的 Dota2 游戏ID，且确保公开 Steam 资料数据!
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          <Icon icon="material-symbols:error" class="error-icon" />
          <span>{{ error }}</span>
          <button @click="handleRetry" class="retry-btn" :disabled="loading">重试</button>
        </div>
      </div>

      <!-- 年份选择器 -->
      <div class="year-selector" v-if="availableYears.length">
        <h3>选择年份</h3>
        <div class="year-tabs">
          <button
            v-for="year in availableYears"
            :key="year"
            :class="['year-tab', { active: selectedYear === year }]"
            @click="selectedYear = year"
          >
            {{ year }}年
          </button>
        </div>
      </div>

      <!-- 数据展示区域 -->
      <div class="data-container" v-if="currentYearData">
        <Dota2Chart :data="currentYearData.data" :year="currentYearData.year" />
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-state">
        <Icon icon="material-symbols:hourglass-empty" class="loading-icon" />
        <p>正在从 OpenDota API 获取数据...</p>
      </div>

      <!-- 无数据状态 -->
      <div v-else-if="!selectedUser" class="empty-state">
        <Icon icon="material-symbols:person-search" class="empty-icon" />
        <p>请选择一个玩家查看数据</p>
      </div>

      <!-- 数据为空状态 -->
      <div v-else class="empty-state">
        <Icon icon="material-symbols:data-usage" class="empty-icon" />
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import Dota2Chart from './components/Dota2Chart.vue';
import { regroupArr, dateFormat, compareDates } from './utils/tools';
import { API_CONFIG, PLAYER_CONFIG, DATA_CONFIG, ERROR_MESSAGES } from './config.js';

// 响应式数据
const selectedUser = ref('');
const selectedYear = ref('');
const processedData = ref([]);
const loading = ref(false);
const error = ref('');
const customAccountId = ref('');
const inputMode = ref('preset'); // 'preset' 或 'custom'

// 用户选项 - 从配置文件读取
const users = PLAYER_CONFIG;

/**
 * 调用 OpenDota API 获取玩家比赛数据
 * @param {string} accountId 玩家账户ID
 * @returns {Promise<Array>} 比赛数据数组
 */
const fetchPlayerMatches = async accountId => {
  try {
    loading.value = true;
    error.value = '';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(`${API_CONFIG.BASE_URL}/players/${accountId}/matches`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(ERROR_MESSAGES.NO_DATA);
      }
      throw new Error(`${ERROR_MESSAGES.API_ERROR}: ${response.status} ${response.statusText}`);
    }

    const matches = await response.json();

    if (!Array.isArray(matches)) {
      throw new Error(ERROR_MESSAGES.DATA_FORMAT_ERROR);
    }

    return matches;
  } catch (err) {
    if (err.name === 'AbortError') {
      error.value = ERROR_MESSAGES.TIMEOUT;
    } else {
      error.value = err.message || ERROR_MESSAGES.UNKNOWN;
    }
    console.error('获取 OpenDota 数据失败:', err);
    return [];
  } finally {
    loading.value = false;
  }
};

/**
 * 将 OpenDota API 数据转换为项目使用的数据格式
 * @param {Array} matches OpenDota API 返回的比赛数据
 * @returns {Object} 转换后的数据格式
 */
const transformApiDataToLocalFormat = matches => {
  if (!matches || !Array.isArray(matches)) {
    return { calendar: [] };
  }

  // 按日期分组统计
  const dailyStats = {};

  matches.forEach(match => {
    const startTime = match.start_time;
    const dateKey = Math.floor(startTime / 86400) * 86400; // 转换为当天0点的时间戳

    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = {
        date: dateKey.toString(),
        count: 0,
        win_count: 0,
        lose_count: 0,
        matches: [],
      };
    }

    dailyStats[dateKey].count++;
    dailyStats[dateKey].matches.push(match);

    // 判断胜负：根据 radiant_win 和 player_slot 判断
    const isRadiant = match.player_slot < 128;
    const isWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);

    if (isWin) {
      dailyStats[dateKey].win_count++;
    } else {
      dailyStats[dateKey].lose_count++;
    }
  });

  // 转换为项目期望的格式
  const calendarData = Object.values(dailyStats).map(dayData => {
    const winRate =
      dayData.count > 0 ? ((dayData.win_count / dayData.count) * 100).toFixed(1) : '0.0';

    return {
      date: dayData.date,
      count: dayData.count.toString(),
      win_count: dayData.win_count.toString(),
      lose_count: dayData.lose_count.toString(),
      win_rate: `${winRate}%`,
      // 生成颜色（可以根据需要调整颜色逻辑）
      count_color: getCountColor(dayData.count),
      win_color: getWinColor(parseFloat(winRate)),
    };
  });

  return {
    calendar: [
      {
        data: calendarData,
      },
    ],
  };
};

/**
 * 根据游戏局数生成颜色
 * @param {number} count 游戏局数
 * @returns {string} 颜色值
 */
const getCountColor = count => {
  if (count === 0) return DATA_CONFIG.COLORS.COUNT.NONE;
  if (count <= 3) return DATA_CONFIG.COLORS.COUNT.LOW;
  if (count <= 6) return DATA_CONFIG.COLORS.COUNT.MEDIUM;
  return DATA_CONFIG.COLORS.COUNT.HIGH;
};

/**
 * 根据胜率生成颜色
 * @param {number} winRate 胜率百分比
 * @returns {string} 颜色值
 */
const getWinColor = winRate => {
  const thresholds = DATA_CONFIG.WIN_RATE_THRESHOLDS;
  const colors = DATA_CONFIG.COLORS.WIN_RATE;

  if (winRate === 0) return colors.VERY_LOW;
  if (winRate < thresholds.LOW) return colors.LOW;
  if (winRate < thresholds.BELOW_AVERAGE) return colors.BELOW_AVERAGE;
  if (winRate < thresholds.POOR) return colors.POOR;
  if (winRate < thresholds.AVERAGE) return colors.AVERAGE;
  if (winRate < thresholds.GOOD) return colors.GOOD;
  if (winRate < thresholds.VERY_GOOD) return colors.VERY_GOOD;
  if (winRate < thresholds.EXCELLENT) return colors.EXCELLENT;
  return colors.PERFECT;
};

// 计算属性
const availableYears = computed(() => {
  return processedData.value.map(yearData => yearData.year).sort((a, b) => b - a);
});

const currentYearData = computed(() => {
  return processedData.value.find(yearData => yearData.year === selectedYear.value);
});

// 处理数据的方法
const processGameData = data => {
  const rawData = getData(data.calendar);
  const groupedByYear = regroupArr(rawData, 'dateYear');

  return groupedByYear
    .map(yearData => ({
      year: yearData[0].dateYear,
      data: yearData.sort(compareDates),
    }))
    .reverse(); // 最新年份在前
};

const getData = list => {
  return list
    .map(item1 => {
      const d = item1.data;
      return d
        .map(item2 => {
          // 检查是否有count字段且不为空
          if (item2.count && item2.count !== '0') {
            const count = parseInt(item2.count) || 0;
            const winCount = parseInt(item2.win_count) || 0;

            return {
              ...item2,
              count: count,
              win_count: winCount,
              win_rate: item2.win_rate || '0%',
              dateCN: dateFormat(item2.date, 'YYYY年 MM月DD日'),
              dateYear: dateFormat(item2.date, 'YYYY'),
              dateMount: dateFormat(item2.date, 'YYYY-MM'),
              dateDay: dateFormat(item2.date, 'MM-DD'),
              // 保存原始时间戳用于排序
              timestamp: parseInt(item2.date),
            };
          }
        })
        .filter(Boolean);
    })
    .flat();
};

// 输入模式切换
const switchInputMode = mode => {
  inputMode.value = mode;
  // 切换模式时清空之前的选择和数据
  selectedUser.value = '';
  customAccountId.value = '';
  processedData.value = [];
  selectedYear.value = '';
  error.value = '';
};

// 自定义查询处理
const handleCustomQuery = async () => {
  const accountId = customAccountId.value.trim();
  if (!accountId) {
    error.value = '请输入有效的 Dota2 ID';
    return;
  }

  // 验证 Dota2 ID 格式（应该是数字）
  if (!/^\d+$/.test(accountId)) {
    error.value = 'Dota2 ID 应该是纯数字格式';
    return;
  }

  await fetchAndProcessData(accountId);
};

// 重置处理
const handleReset = () => {
  customAccountId.value = '';
  selectedUser.value = '';
  processedData.value = [];
  selectedYear.value = '';
  error.value = '';
};

// 重试处理
const handleRetry = () => {
  if (inputMode.value === 'preset') {
    handleUserChange();
  } else {
    handleCustomQuery();
  }
};

// 统一的数据获取和处理函数
const fetchAndProcessData = async accountId => {
  if (!accountId) {
    processedData.value = [];
    selectedYear.value = '';
    return;
  }

  try {
    // 调用 API 获取数据
    const matches = await fetchPlayerMatches(accountId);

    if (matches.length === 0) {
      console.warn('未获取到比赛数据');
      processedData.value = [];
      selectedYear.value = '';
      return;
    }

    // 转换数据格式
    const transformedData = transformApiDataToLocalFormat(matches);

    // 处理数据
    processedData.value = processGameData(transformedData);
    console.log('处理后的数据:', processedData.value);

    // 自动选择最新年份
    if (processedData.value.length > 0) {
      selectedYear.value = processedData.value[0].year;
      console.log('选择的年份:', selectedYear.value);
    }
  } catch (err) {
    console.error('处理用户数据失败:', err);
    error.value = '处理数据失败，请重试';
  }
};

// 用户切换处理（预设玩家）
const handleUserChange = async () => {
  await fetchAndProcessData(selectedUser.value);
};

// 初始化
onMounted(() => {
  // 默认选择第一个用户
  if (users.length > 0) {
    selectedUser.value = users[0].value;
    handleUserChange();
  }
});
</script>

<style scoped>
.game-analysis-module {
  min-height: 100vh;
  background: var(--bg-color);
}

.module-header {
  background: linear-gradient(135deg, #4ecdc4 0%, #6ee7e0 100%);
  color: white;
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.module-header h1 {
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing);
}

.module-header p {
  font-size: var(--text-lg);
  opacity: 0.9;
}

.module-content {
  padding: var(--spacing-lg);
}

/* 用户选择器 */
.user-selector {
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.user-selector h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing);
}

.radio-group {
  display: flex;
  gap: var(--spacing);
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing);
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  background: var(--bg-color);
}

.radio-option:hover {
  border-color: var(--primary-color);
  background: var(--bg-color-secondary);
}

.radio-option.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.radio-option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.radio-option input[type='radio'] {
  display: none;
}

.radio-label {
  font-weight: 500;
  user-select: none;
}

/* 错误提示样式 */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing);
  padding: var(--spacing);
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius);
  color: #dc2626;
}

.error-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.retry-btn {
  margin-left: auto;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: #dc2626;
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-sm);
  transition: var(--transition);
}

.retry-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.retry-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 输入模式切换样式 */
.mode-toggle {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing);
  padding: var(--spacing-xs);
  background: var(--bg-color);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--text-color-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition);
  flex: 1;
  justify-content: center;
}

.mode-btn:hover:not(:disabled) {
  background: var(--bg-color-secondary);
  color: var(--text-color);
}

.mode-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.mode-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 预设选择样式 */
.preset-selection {
  margin-top: var(--spacing);
}

/* 自定义输入样式 */
.custom-input {
  margin-top: var(--spacing);
}

.input-group {
  display: flex;
  align-items: center;
  /* flex-direction: column; */
  gap: var(--spacing);
}

.input-field {
  display: flex;
  align-items: center;
  /* flex-direction: column; */
  gap: var(--spacing-xs);
}

.input-field label {
  font-weight: 500;
  color: var(--text-color);
  font-size: var(--text-lg);
}

.account-input {
  padding: var(--spacing-sm) var(--spacing);
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  font-size: var(--text-base);
  background: var(--bg-color);
  color: var(--text-color);
  transition: var(--transition);
}

.account-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.account-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--bg-color-secondary);
}

.input-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.query-btn,
.reset-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing);
  border: none;
  border-radius: var(--radius);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  flex: 1;
  justify-content: center;
}

.query-btn {
  background: var(--primary-color);
  color: white;
}

.query-btn:hover:not(:disabled) {
  background: #4338ca;
}

.query-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-btn {
  background: var(--bg-color-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.reset-btn:hover:not(:disabled) {
  background: var(--bg-color);
  border-color: var(--text-color-secondary);
}

.reset-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-hint {
  margin-top: 12px;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: var(--radius);
  font-size: var(--text-sm);
  color: #0369a1;
  line-height: 1.4;
}

.hint-icon {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.input-hint a {
  color: #0369a1;
  text-decoration: underline;
}

.input-hint a:hover {
  color: #0284c7;
}

/* 年份选择器 */
.year-selector {
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.year-selector h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing);
}

.year-tabs {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.year-tab {
  padding: var(--spacing-sm) var(--spacing);
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.year-tab:hover {
  border-color: var(--primary-color);
  background: var(--bg-color-secondary);
}

.year-tab.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

/* 数据容器 */
.data-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.year-section {
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
}

.loading-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing);
  animation: pulse 2s infinite;
}

.loading-state p {
  font-size: var(--text-lg);
  color: var(--text-color-secondary);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing);
  opacity: 0.6;
}

.empty-state p {
  font-size: var(--text-lg);
  color: var(--text-color-secondary);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .module-content {
    padding: var(--spacing);
  }

  .user-selector {
    padding: var(--spacing);
  }

  .year-selector {
    padding: var(--spacing);
  }

  .radio-group {
    flex-direction: column;
  }

  .radio-option {
    justify-content: center;
  }

  .year-tabs {
    justify-content: center;
  }

  .year-tab {
    flex: 1;
    text-align: center;
  }

  /* 移动端输入模式样式 */
  .mode-toggle {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .mode-btn {
    flex: none;
  }

  .input-actions {
    flex-direction: column;
  }

  .query-btn,
  .reset-btn {
    flex: none;
  }

  .input-hint {
    font-size: var(--text-xs);
    padding: var(--spacing-xs);
  }
}
</style>
