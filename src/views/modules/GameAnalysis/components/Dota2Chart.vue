<template>
  <div class="dota2-chart">
    <!-- 年份标题和统计信息 -->
    <div class="chart-header">
      <div class="year-title">
        <h2>{{ year }}年 游戏数据</h2>
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-value">{{ stats.totalGames }}</span>
            <span class="stat-label">总局数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.activeDays }}</span>
            <span class="stat-label">活跃天数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.averageGamesPerDay }}</span>
            <span class="stat-label">日均局数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.maxGamesInDay }}</span>
            <span class="stat-label">单日最高</span>
          </div>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="chart-toolbar">
        <div class="view-toggle">
          <button
            v-for="view in viewOptions"
            :key="view.value"
            :class="['view-btn', { active: currentView === view.value }]"
            @click="currentView = view.value"
          >
            <Icon :icon="view.icon" />
            {{ view.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 图表容器 -->
    <div class="chart-container">
      <div ref="chartRef" class="chart-canvas" :style="{ height: chartHeight + 'px' }"></div>
    </div>

    <!-- 游戏数据分析 -->
    <div class="analysis-section">
      <GameAnalysis :data="props.data" :year="props.year" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import * as echarts from 'echarts';
import { calculateGameStats, getChartColor, formatNumber } from '../utils/tools';
import GameAnalysis from './GameAnalysis.vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
});

// 响应式数据
const chartRef = ref(null);
const chartInstance = ref(null);
const currentView = ref('bar');
const chartHeight = ref(400);

// 视图选项
const viewOptions = [
  { value: 'bar', label: '柱状图', icon: 'material-symbols:bar-chart' },
  { value: 'line', label: '折线图', icon: 'material-symbols:show-chart' },
  { value: 'calendar', label: '日历图', icon: 'material-symbols:calendar-month' },
];

// 计算属性
const stats = computed(() => calculateGameStats(props.data));

const chartData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) {
    return [];
  }

  return props.data.map(item => ({
    date: item.date,
    value: item.count || 0,
    dateDay: item.dateDay,
    dateCN: item.dateCN,
    winCount: item.win_count || 0,
    winRate: item.win_rate || '0%',
  }));
});

// 图表配置
const getBarChartOption = () => ({
  title: {
    text: `${props.year}年 Dota2 游戏频率`,
    textStyle: {
      color: 'var(--text-color)',
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
  tooltip: {
    trigger: 'axis',
    formatter: params => {
      const data = params[0];
      const item = props.data[data.dataIndex];
      return `
        <div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${item.dateCN}</div>
          <div style="color: ${getChartColor(0)};">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${getChartColor(
              0
            )}; border-radius: 50%; margin-right: 6px;"></span>
            游戏局数: ${data.value}
          </div>
        </div>
      `;
    },
  },
  xAxis: {
    type: 'category',
    data: chartData.value.map(item => item.dateDay),
    axisLabel: {
      color: 'var(--text-color-secondary)',
      rotate: 45,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: 'var(--text-color-secondary)',
    },
  },
  series: [
    {
      data: chartData.value.map(item => item.value),
      type: 'bar',
      itemStyle: {
        color: getChartColor(0),
      },
      emphasis: {
        itemStyle: {
          color: getChartColor(1),
        },
      },
    },
  ],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true,
  },
});

const getLineChartOption = () => ({
  title: {
    text: `${props.year}年 Dota2 游戏趋势`,
    textStyle: {
      color: 'var(--text-color)',
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
  tooltip: {
    trigger: 'axis',
    formatter: params => {
      const data = params[0];
      const item = props.data[data.dataIndex];
      return `
        <div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${item.dateCN}</div>
          <div style="color: ${getChartColor(2)};">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${getChartColor(
              2
            )}; border-radius: 50%; margin-right: 6px;"></span>
            游戏局数: ${data.value}
          </div>
        </div>
      `;
    },
  },
  xAxis: {
    type: 'category',
    data: chartData.value.map(item => item.dateDay),
    axisLabel: {
      color: 'var(--text-color-secondary)',
      rotate: 45,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: 'var(--text-color-secondary)',
    },
  },
  series: [
    {
      data: chartData.value.map(item => item.value),
      type: 'line',
      smooth: true,
      itemStyle: {
        color: getChartColor(2),
      },
      lineStyle: {
        color: getChartColor(2),
        width: 3,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: getChartColor(2) + '40',
            },
            {
              offset: 1,
              color: getChartColor(2) + '10',
            },
          ],
        },
      },
    },
  ],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    containLabel: true,
  },
});

const getCalendarChartOption = () => ({
  title: {
    text: `${props.year}年 Dota2 游戏日历`,
    textStyle: {
      color: 'var(--text-color)',
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
  tooltip: {
    formatter: params => {
      const item = props.data.find(d => d.date === params.data[0]);
      return `
        <div style="padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${
            item?.dateCN || params.data[0]
          }</div>
          <div style="color: ${getChartColor(3)};">
            游戏局数: ${params.data[1] || 0}
          </div>
        </div>
      `;
    },
  },
  calendar: {
    range: props.year,
    cellSize: ['auto', 20],
    itemStyle: {
      borderWidth: 1,
      borderColor: 'var(--border-color)',
    },
    yearLabel: {
      show: false,
    },
    monthLabel: {
      color: 'var(--text-color-secondary)',
    },
    dayLabel: {
      color: 'var(--text-color-secondary)',
    },
  },
  series: [
    {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: chartData.value.map(item => {
        // 将时间戳转换为日期字符串格式 YYYY-MM-DD
        const timestamp = parseInt(item.date) * 1000;
        const date = new Date(timestamp);
        const dateStr =
          date.getFullYear() +
          '-' +
          String(date.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(date.getDate()).padStart(2, '0');
        return [dateStr, item.value];
      }),
      itemStyle: {
        color: params => {
          const value = params.data[1];
          if (value === 0) return 'var(--bg-color-secondary)';
          const intensity = Math.min(value / 10, 1);
          return (
            getChartColor(3) +
            Math.floor(intensity * 255)
              .toString(16)
              .padStart(2, '0')
          );
        },
      },
    },
  ],
});

// 方法
const initChart = () => {
  if (!chartRef.value) return;

  chartInstance.value = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  if (!chartInstance.value) return;

  let option;
  switch (currentView.value) {
    case 'line':
      option = getLineChartOption();
      break;
    case 'calendar':
      option = getCalendarChartOption();
      chartHeight.value = 300;
      break;
    default:
      option = getBarChartOption();
      chartHeight.value = 400;
  }

  chartInstance.value.setOption(option, true);
};

const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};

// 监听器
watch(currentView, () => {
  nextTick(() => {
    updateChart();
    resizeChart();
  });
});

watch(
  () => props.data,
  () => {
    updateChart();
  },
  { deep: true }
);

// 生命周期
onMounted(() => {
  nextTick(() => {
    initChart();
    window.addEventListener('resize', resizeChart);
  });
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  window.removeEventListener('resize', resizeChart);
});
</script>

<style scoped>
.dota2-chart {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* 图表头部 */
.chart-header {
  padding: var(--spacing-lg);
  background: var(--bg-color-secondary);
  border-bottom: 1px solid var(--border-color);
}

.year-title h2 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: var(--spacing);
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing);
  margin-bottom: var(--spacing-lg);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  transition: var(--transition);
}

.stat-item:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.stat-value {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-color-secondary);
  text-align: center;
}

/* 工具栏 */
.chart-toolbar {
  display: flex;
  justify-content: center;
}

.view-toggle {
  display: flex;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  overflow: hidden;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing);
  background: transparent;
  border: none;
  color: var(--text-color-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition);
  border-right: 1px solid var(--border-color);
}

.view-btn:last-child {
  border-right: none;
}

.view-btn:hover {
  background: var(--bg-color-secondary);
  color: var(--text-color);
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
}

/* 图表容器 */
.chart-container {
  padding: var(--spacing-lg);
}

.chart-canvas {
  width: 100%;
  transition: height 0.3s ease;
}

/* 分析区域 */
.analysis-section {
  border-top: 1px solid var(--border-color);
  margin-top: var(--spacing-lg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-header {
    padding: var(--spacing);
  }

  .stats-summary {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }

  .stat-item {
    padding: var(--spacing-sm);
  }

  .view-toggle {
    flex-direction: column;
  }

  .view-btn {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    justify-content: center;
  }

  .view-btn:last-child {
    border-bottom: none;
  }

  .chart-container {
    padding: var(--spacing);
  }
}

@media (max-width: 480px) {
  .stats-summary {
    grid-template-columns: 1fr;
  }

  .year-title h2 {
    font-size: var(--text-lg);
    text-align: center;
  }
}
</style>
