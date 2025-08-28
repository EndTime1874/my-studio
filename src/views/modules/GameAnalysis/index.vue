<template>
  <div class="game-analysis-module">
    <div class="module-header">
      <h1>Dota2 数据分析</h1>
      <p>2018年 ~ 2023年 游戏数据统计与可视化分析</p>
    </div>

    <div class="module-content">
      <!-- 用户选择器 -->
      <div class="user-selector">
        <h3>选择玩家数据</h3>
        <div class="radio-group">
          <label
            v-for="user in users"
            :key="user.value"
            class="radio-option"
            :class="{ active: selectedUser === user.value }"
          >
            <input
              type="radio"
              :value="user.value"
              v-model="selectedUser"
              @change="handleUserChange"
            />
            <span class="radio-label">{{ user.label }}</span>
          </label>
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
      <div v-else class="loading-state">
        <Icon icon="material-symbols:hourglass-empty" class="loading-icon" />
        <p>正在加载数据...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import Dota2Chart from './components/Dota2Chart.vue';
import { regroupArr, dateFormat, compareDates } from './utils/tools';
import yyyDataOfDota2 from './data/yyy.json';
import zjjDataOfDota2 from './data/zjj.json';

// 响应式数据
const selectedUser = ref('yyy');
const selectedYear = ref('');
const processedData = ref([]);

// 用户选项
const users = [
  { label: 'YYY', value: 'yyy' },
  { label: 'ZJJ', value: 'zjj' },
];

// 数据映射
const userData = {
  yyy: yyyDataOfDota2,
  zjj: zjjDataOfDota2,
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

// 用户切换处理
const handleUserChange = () => {
  const data = userData[selectedUser.value];
  if (data) {
    processedData.value = processGameData(data);
    console.log('处理后的数据:', processedData.value);
    // 自动选择最新年份
    if (processedData.value.length > 0) {
      selectedYear.value = processedData.value[0].year;
      console.log('选择的年份:', selectedYear.value);
    }
  }
};

// 初始化
onMounted(() => {
  handleUserChange();
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

.radio-option input[type='radio'] {
  display: none;
}

.radio-label {
  font-weight: 500;
  user-select: none;
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
}
</style>
