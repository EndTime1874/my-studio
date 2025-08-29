<template>
  <div class="modal-overlay" v-if="visible" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <Icon icon="mingcute:yinyang-fill" width="24" height="24" />
        <h3>五行分析推荐</h3>
        <button @click="$emit('close')">
          <Icon class="close-btn" icon="material-symbols:close" />
        </button>
      </div>

      <div class="modal-body">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <Icon icon="material-symbols:hourglass-empty" class="loading-icon" />
          <p>正在分析五行数据...</p>
        </div>

        <!-- 分析结果 -->
        <div v-else-if="analysisResult" class="analysis-content">
          <!-- 五行胜率统计 -->
          <div class="section">
            <h4>
              <Icon icon="material-symbols:analytics" />
              五行胜率统计
            </h4>

            <!-- 基于净胜场前十天的统计 -->
            <div class="stats-group">
              <h5 class="stats-group-title">
                <Icon icon="material-symbols:trending-up" />
                基于净胜场前十天
                <span class="stats-subtitle">（用于推荐好日子）</span>
              </h5>
              <div class="wuxing-stats">
                <div
                  v-for="(wuxing, name) in analysisResult.bestDaysWuxingStats"
                  :key="'best-' + name"
                  class="wuxing-item good"
                  :style="{ borderColor: getWuxingColor(name) }"
                >
                  <div class="wuxing-header">
                    <span class="wuxing-name" :style="{ color: getWuxingColor(name) }">
                      {{ name }}
                    </span>
                    <span class="wuxing-rate">{{ wuxing.winRate }}%</span>
                  </div>
                  <div class="wuxing-details">
                    <span>{{ wuxing.wins }}胜 / {{ wuxing.total }}场</span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{
                        width: wuxing.winRate + '%',
                        backgroundColor: getWuxingColor(name),
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 基于净败场前十天的统计 -->
            <div class="stats-group">
              <h5 class="stats-group-title">
                <Icon icon="material-symbols:trending-down" />
                基于净败场前十天
                <span class="stats-subtitle">（用于识别坏日子）</span>
              </h5>
              <div class="wuxing-stats">
                <div
                  v-for="(wuxing, name) in analysisResult.worstDaysWuxingStats"
                  :key="'worst-' + name"
                  class="wuxing-item bad"
                  :style="{ borderColor: getWuxingColor(name) }"
                >
                  <div class="wuxing-header">
                    <span class="wuxing-name" :style="{ color: getWuxingColor(name) }">
                      {{ name }}
                    </span>
                    <span class="wuxing-rate">{{ wuxing.winRate }}%</span>
                  </div>
                  <div class="wuxing-details">
                    <span>{{ wuxing.wins }}胜 / {{ wuxing.total }}场</span>
                  </div>
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{
                        width: wuxing.winRate + '%',
                        backgroundColor: getWuxingColor(name),
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 月份选择器 -->
          <div class="section">
            <h4>
              <Icon icon="material-symbols:calendar-month" />
              选择月份
            </h4>
            <div class="month-selector">
              <select v-model="selectedMonth" @change="updateRecommendations" class="month-select">
                <option v-for="month in 12" :key="month" :value="month">{{ month }}月</option>
              </select>
            </div>
          </div>

          <!-- 推荐日期 -->
          <div class="section">
            <h4>
              <Icon icon="material-symbols:recommend" />
              {{ selectedMonth }}月推荐日期
            </h4>

            <div class="recommendations">
              <!-- 推荐的日子 -->
              <div class="recommendation-group good">
                <h5>
                  <Icon icon="material-symbols:trending-up" />
                  推荐 ({{ recommendations.goodDates.length }}天)
                </h5>
                <div class="date-list">
                  <div
                    v-for="date in recommendations.goodDates"
                    :key="date.date"
                    class="date-item good"
                  >
                    <div class="date-info">
                      <span class="date-number">{{ date.day }}</span>
                      <span class="date-weekday">{{ getWeekdayName(date.weekday) }}</span>
                    </div>
                    <div class="date-details">
                      <div class="sixtyword-mini" v-if="parseSixtyWord(date.sixtyWord)">
                        <div class="sixtyword-column">
                          <span
                            class="sixtyword-char"
                            :style="{ color: parseSixtyWord(date.sixtyWord).day.tianganColor }"
                          >
                            {{ parseSixtyWord(date.sixtyWord).day.tiangan }}
                          </span>
                          <span
                            class="sixtyword-char"
                            :style="{ color: parseSixtyWord(date.sixtyWord).day.dizhiColor }"
                          >
                            {{ parseSixtyWord(date.sixtyWord).day.dizhi }}
                          </span>
                        </div>
                      </div>
                      <span
                        class="wuxing-tag"
                        :style="{
                          color: getWuxingColor(date.mainWuxing),
                          borderColor: getWuxingColor(date.mainWuxing),
                        }"
                      >
                        {{ date.mainWuxing }}
                      </span>
                      <span class="win-rate">{{ date.winRate }}%</span>
                      <span class="confidence" :class="date.confidence">
                        {{ getConfidenceText(date.confidence) }}
                      </span>
                      <span class="source-tag" v-if="date.source">
                        {{ date.source }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 不推荐的日子 -->
              <div class="recommendation-group bad">
                <h5>
                  <Icon icon="material-symbols:trending-down" />
                  不推荐 ({{ recommendations.badDates.length }}天)
                </h5>
                <div class="date-list">
                  <div
                    v-for="date in recommendations.badDates"
                    :key="date.date"
                    class="date-item bad"
                  >
                    <div class="date-info">
                      <span class="date-number">{{ date.day }}</span>
                      <span class="date-weekday">{{ getWeekdayName(date.weekday) }}</span>
                    </div>
                    <div class="date-details">
                      <div class="sixtyword-mini" v-if="parseSixtyWord(date.sixtyWord)">
                        <div class="sixtyword-column">
                          <span
                            class="sixtyword-char"
                            :style="{ color: parseSixtyWord(date.sixtyWord).day.tianganColor }"
                          >
                            {{ parseSixtyWord(date.sixtyWord).day.tiangan }}
                          </span>
                          <span
                            class="sixtyword-char"
                            :style="{ color: parseSixtyWord(date.sixtyWord).day.dizhiColor }"
                          >
                            {{ parseSixtyWord(date.sixtyWord).day.dizhi }}
                          </span>
                        </div>
                      </div>
                      <span
                        class="wuxing-tag"
                        :style="{
                          color: getWuxingColor(date.mainWuxing),
                          borderColor: getWuxingColor(date.mainWuxing),
                        }"
                      >
                        {{ date.mainWuxing }}
                      </span>
                      <span class="win-rate">{{ date.winRate }}%</span>
                      <span class="confidence" :class="date.confidence">
                        {{ getConfidenceText(date.confidence) }}
                      </span>
                      <span class="source-tag" v-if="date.source">
                        {{ date.source }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无数据状态 -->
        <div v-else class="no-data-state">
          <Icon icon="material-symbols:sentiment-neutral" />
          <p>暂无足够数据进行五行分析</p>
          <p class="hint">需要至少有最佳和最差游戏日的数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import {
  getBestDays,
  getWorstDays,
  analyzeFiveElementWinRate,
  getMonthDates,
  recommendDatesByBestWorstWuxing,
  WUXING_COLORS,
  parseSixtyWord,
} from '../utils/tools';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

// 响应式数据
const loading = ref(false);
const analysisResult = ref(null);
const selectedMonth = ref(new Date().getMonth() + 1);
const recommendations = ref({ goodDates: [], badDates: [] });

// 计算属性
const currentYear = computed(() => parseInt(props.year));

// 方法
const handleOverlayClick = () => {
  emit('close');
};

const getWuxingColor = wuxing => {
  return WUXING_COLORS[wuxing] || '#64748b';
};

const getWeekdayName = weekday => {
  const names = ['日', '一', '二', '三', '四', '五', '六'];
  return names[weekday];
};

const getConfidenceText = confidence => {
  const texts = {
    high: '高可信度',
    medium: '中等可信度',
    low: '低可信度',
  };
  return texts[confidence] || '';
};

const performAnalysis = async () => {
  console.log('五行分析开始，输入数据:', props.data);

  if (!props.data || props.data.length === 0) {
    console.log('五行分析：数据为空');
    analysisResult.value = null;
    return;
  }

  loading.value = true;

  try {
    // 获取净胜场前十天的数据
    console.log('正在获取最佳游戏日...');
    const topTenDays = getBestDays(props.data, 10);
    console.log('获取到的最佳游戏日:', topTenDays);

    // 获取净败场前十天的数据
    console.log('正在获取最差游戏日...');
    const worstTenDays = getWorstDays(props.data, 10);
    console.log('获取到的最差游戏日:', worstTenDays);

    if (topTenDays.length === 0 && worstTenDays.length === 0) {
      console.log('五行分析：没有找到足够的游戏日数据');
      analysisResult.value = null;
      return;
    }

    // 分析五行胜率（基于净胜场前十天）
    console.log('正在分析最佳日子的五行胜率...');
    const bestDaysWuxingStats =
      topTenDays.length > 0 ? analyzeFiveElementWinRate(props.data, topTenDays, 10) : {};
    console.log('最佳日子五行胜率分析结果:', bestDaysWuxingStats);

    // 分析五行胜率（基于净败场前十天）
    console.log('正在分析最差日子的五行胜率...');
    const worstDaysWuxingStats =
      worstTenDays.length > 0 ? analyzeFiveElementWinRate(props.data, worstTenDays, 10) : {};
    console.log('最差日子五行胜率分析结果:', worstDaysWuxingStats);

    analysisResult.value = {
      bestDaysWuxingStats,
      worstDaysWuxingStats,
      topTenDays,
      worstTenDays,
    };

    // 更新推荐
    await nextTick();
    updateRecommendations();
  } catch (error) {
    console.error('五行分析失败:', error);
    analysisResult.value = null;
  } finally {
    loading.value = false;
  }
};

const updateRecommendations = () => {
  if (!analysisResult.value) {
    console.log('updateRecommendations: 没有分析结果');
    recommendations.value = { goodDates: [], badDates: [] };
    return;
  }

  const monthDates = getMonthDates(currentYear.value, selectedMonth.value);

  // 使用综合推荐函数，同时考虑最佳和最差日子的数据
  const result = recommendDatesByBestWorstWuxing(
    analysisResult.value.bestDaysWuxingStats || {},
    analysisResult.value.worstDaysWuxingStats || {},
    monthDates,
    0.6, // 好日子阈值
    0.4 // 坏日子阈值
  );

  console.log('最佳日子五行胜率统计:', analysisResult.value.bestDaysWuxingStats);
  console.log('最差日子五行胜率统计:', analysisResult.value.worstDaysWuxingStats);
  console.log('综合推荐结果:', result);
  console.log('推荐的好日子数量:', result.goodDates.length);
  console.log('推荐的坏日子数量:', result.badDates.length);

  recommendations.value = result;

  console.log('更新后的 recommendations.value:', recommendations.value);
};

// 监听器
watch(
  () => props.visible,
  newVisible => {
    if (newVisible) {
      performAnalysis();
    }
  }
);

watch(
  () => props.data,
  () => {
    if (props.visible) {
      performAnalysis();
    }
  },
  { deep: true }
);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing);
}

.modal-content {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
}

.modal-header h3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--text-color-secondary);
  cursor: pointer;
  border-radius: var(--radius);
  transition: var(--transition);
}

.close-btn:hover {
  background: var(--bg-color-tertiary);
  color: var(--text-color);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.loading-state,
.no-data-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--text-color-secondary);
  text-align: center;
}

.loading-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing);
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section {
  background: var(--bg-color-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
}

.section h4 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 var(--spacing) 0;
}

.stats-subtitle {
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--text-color-secondary);
  margin-left: var(--spacing-xs);
}

.stats-group {
  margin-bottom: var(--spacing-lg);
}

.stats-group-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 var(--spacing) 0;
}

.stats-group-title .stats-subtitle {
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--text-color-secondary);
  margin-left: var(--spacing-xs);
}

.wuxing-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing);
}

.wuxing-item {
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  padding: var(--spacing);
  transition: var(--transition);
}

.wuxing-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.wuxing-item.good {
  border-left: 4px solid var(--success-color);
  background: linear-gradient(135deg, var(--bg-color) 0%, rgba(34, 197, 94, 0.05) 100%);
}

.wuxing-item.bad {
  border-left: 4px solid var(--error-color);
  background: linear-gradient(135deg, var(--bg-color) 0%, rgba(239, 68, 68, 0.05) 100%);
}

.wuxing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
}

.wuxing-name {
  font-weight: 600;
  font-size: var(--text-base);
}

.wuxing-rate {
  font-weight: 700;
  color: var(--text-color);
}

.wuxing-details {
  font-size: var(--text-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xs);
}

.progress-bar {
  height: 4px;
  background: var(--bg-color-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.month-selector {
  display: flex;
  gap: var(--spacing);
  align-items: center;
}

.month-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: var(--radius);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition);
}

.month-select:hover {
  border-color: var(--primary-color);
}

.month-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(100 108 255 / 0.1);
}

.recommendations {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.recommendation-group h5 {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  margin: 0 0 var(--spacing) 0;
}

.recommendation-group.good h5 {
  color: var(--success-color);
}

.recommendation-group.bad h5 {
  color: var(--error-color);
}

.date-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.date-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  transition: var(--transition);
  min-height: 48px;
}

.date-item:hover {
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.date-item.good {
  border-left: 3px solid var(--success-color);
}

.date-item.bad {
  border-left: 3px solid var(--error-color);
}

.date-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.date-number {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--text-color);
  min-width: 24px;
}

.date-weekday {
  font-size: var(--text-xs);
  color: var(--text-color-secondary);
  background: var(--bg-color-tertiary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.date-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.sixtyword-mini {
  display: flex;
  align-items: center;
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 2px 4px;
  margin-right: var(--spacing-xs);
}

.sixtyword-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.sixtyword-char {
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.wuxing-tag {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 6px;
  border: 1px solid;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.1);
}

.win-rate {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-color);
}

.confidence {
  font-size: var(--text-xs);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
}

.confidence.high {
  background: var(--success-color);
  color: white;
}

.confidence.medium {
  background: var(--warning-color);
  color: white;
}

.confidence.low {
  background: var(--text-color-tertiary);
  color: var(--text-color);
}

.source-tag {
  font-size: var(--text-xs);
  font-weight: 500;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  background: var(--error-color);
  color: #fff;
  border: 1px solid var(--border-color);
}

.hint {
  font-size: var(--text-sm);
  margin-top: var(--spacing-xs);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }

  .modal-content {
    max-height: 95vh;
  }

  .wuxing-stats {
    grid-template-columns: 1fr;
  }

  .recommendations {
    grid-template-columns: 1fr;
  }

  .date-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .date-details {
    align-self: flex-end;
  }
}

/* 暗色主题适配 */
[data-theme='dark'] .modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}
</style>
