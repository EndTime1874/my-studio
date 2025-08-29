<template>
  <div class="game-analysis">
    <div class="analysis-header">
      <h3>{{ year }}年 游戏数据分析</h3>
      <div class="analysis-controls">
        <div class="control-group">
          <label>显示数量:</label>
          <select v-model="displayCount" class="count-select">
            <option value="3">前3名</option>
            <option value="5">前5名</option>
            <option value="10">前10名</option>
          </select>
        </div>
        <div class="control-group">
          <label>排序方式:</label>
          <select v-model="sortType" class="sort-select">
            <option value="best">净胜最多</option>
            <option value="worst">净败最多</option>
            <option value="mostPlayed">游戏最多</option>
            <option value="highestWinRate">胜率最高</option>
            <option value="lowestWinRate">胜率最低</option>
            <option value="mostWins">胜场最多</option>
          </select>
        </div>
      </div>

      <div class="analysis-footer">
        <div class="footer-controls">
          <label class="fortune-toggle">
            <input type="checkbox" v-model="showFortune" />
            <span>显示天干地支</span>
          </label>

          <button class="analysis-btn" @click="showFiveElementAnalysis = true">
            <Icon icon="mingcute:yinyang-fill" width="24" height="24" />
            五行分析推荐
          </button>
        </div>
      </div>
    </div>

    <div class="analysis-content">
      <div class="days-list" v-if="sortedDays.length">
        <div
          v-for="(day, index) in sortedDays"
          :key="day.date"
          class="day-item"
          :class="{
            'best-day':
              ['best', 'mostPlayed', 'highestWinRate', 'mostWins'].includes(sortType) &&
              index === 0,
            'worst-day': ['worst', 'lowestWinRate'].includes(sortType) && index === 0,
          }"
        >
          <div class="day-rank">
            <span class="rank-number">{{ index + 1 }}</span>
            <Icon
              :icon="getRankIcon(sortType, index)"
              :class="['rank-icon', getRankIconClass(sortType, index)]"
            />
          </div>

          <div class="day-info">
            <div class="day-date">
              <h4>{{ day.dateCN }}</h4>
              <span class="day-weekday">{{ getWeekday(day.timestamp) }}</span>
            </div>

            <div class="day-stats">
              <div class="stat-item win">
                <Icon icon="material-symbols:arrow-upward" />
                <span>胜 {{ day.win_count }}场</span>
              </div>
              <div class="stat-item lose">
                <Icon icon="material-symbols:arrow-downward" />
                <span>败 {{ day.loseCount }}场</span>
              </div>
              <div
                class="stat-item net"
                :class="{ positive: day.netWin > 0, negative: day.netWin < 0 }"
              >
                <Icon :icon="day.netWin > 0 ? 'material-symbols:add' : 'material-symbols:remove'" />
                <span>净{{ day.netWin > 0 ? '胜' : '败' }} {{ Math.abs(day.netWin) }}场</span>
              </div>
              <div class="stat-item rate" v-if="day.winRate !== undefined">
                <Icon icon="material-symbols:percent" />
                <span>胜率 {{ day.winRate }}%</span>
              </div>
            </div>
          </div>

          <div class="day-fortune" v-if="showFortune">
            <div class="fortune-title">
              <Icon icon="material-symbols:calendar-today" />
              <span>天干地支</span>
            </div>
            <div class="fortune-grid" v-if="getSixtyWordData(day.timestamp)">
              <div class="fortune-column">
                <div class="column-label">年</div>
                <div class="tiangan-dizhi">
                  <div
                    class="char tiangan"
                    :style="{
                      color: getSixtyWordData(day.timestamp).year.tianganColor,
                    }"
                  >
                    {{ getSixtyWordData(day.timestamp).year.tiangan }}
                  </div>
                  <div
                    class="char dizhi"
                    :style="{
                      color: getSixtyWordData(day.timestamp).year.dizhiColor,
                    }"
                  >
                    {{ getSixtyWordData(day.timestamp).year.dizhi }}
                  </div>
                </div>
              </div>
              <div class="fortune-column">
                <div class="column-label">月</div>
                <div class="tiangan-dizhi">
                  <div
                    class="char tiangan"
                    :style="{
                      color: getSixtyWordData(day.timestamp).month.tianganColor,
                    }"
                  >
                    {{ getSixtyWordData(day.timestamp).month.tiangan }}
                  </div>
                  <div
                    class="char dizhi"
                    :style="{
                      color: getSixtyWordData(day.timestamp).month.dizhiColor,
                    }"
                  >
                    {{ getSixtyWordData(day.timestamp).month.dizhi }}
                  </div>
                </div>
              </div>
              <div class="fortune-column">
                <div class="column-label">日</div>
                <div class="tiangan-dizhi">
                  <div
                    class="char tiangan"
                    :style="{
                      color: getSixtyWordData(day.timestamp).day.tianganColor,
                    }"
                  >
                    {{ getSixtyWordData(day.timestamp).day.tiangan }}
                  </div>
                  <div
                    class="char dizhi"
                    :style="{
                      color: getSixtyWordData(day.timestamp).day.dizhiColor,
                    }"
                  >
                    {{ getSixtyWordData(day.timestamp).day.dizhi }}
                  </div>
                </div>
              </div>
            </div>
            <div class="fortune-text" v-else>{{ getSixtyWord(day.timestamp) }}</div>
          </div>
        </div>
      </div>

      <div v-else class="no-data">
        <Icon icon="material-symbols:sentiment-neutral" />
        <p>暂无数据</p>
      </div>
    </div>

    <!-- 五行分析弹窗 -->
    <FiveElementAnalysis
      :visible="showFiveElementAnalysis"
      :data="props.data"
      :year="props.year"
      @close="showFiveElementAnalysis = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import FiveElementAnalysis from './FiveElementAnalysis.vue';
import {
  getBestDays,
  getWorstDays,
  getMostPlayedDays,
  getHighestWinRateDays,
  getLowestWinRateDays,
  getMostWinsDays,
  getSixtyWord,
  parseSixtyWord,
} from '../utils/tools';

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
const displayCount = ref(3);
const sortType = ref('best'); // 'best' 或 'worst'
const showFortune = ref(true);
const showFiveElementAnalysis = ref(false);

// 计算属性
const sortedDays = computed(() => {
  if (!props.data || !props.data.length) return [];

  let days = [];
  let sortLabel = '';

  switch (sortType.value) {
    case 'best':
      days = getBestDays(props.data, displayCount.value);
      sortLabel = '净胜最多';
      break;
    case 'worst':
      days = getWorstDays(props.data, displayCount.value);
      sortLabel = '净败最多';
      break;
    case 'mostPlayed':
      days = getMostPlayedDays(props.data, displayCount.value);
      sortLabel = '游戏最多';
      break;
    case 'highestWinRate':
      days = getHighestWinRateDays(props.data, displayCount.value);
      sortLabel = '胜率最高';
      break;
    case 'lowestWinRate':
      days = getLowestWinRateDays(props.data, displayCount.value);
      sortLabel = '胜率最低';
      break;
    case 'mostWins':
      days = getMostWinsDays(props.data, displayCount.value);
      sortLabel = '胜场最多';
      break;
    default:
      days = getBestDays(props.data, displayCount.value);
      sortLabel = '净胜最多';
  }

  console.log(`${props.year}年 ${sortLabel}游戏日:`, days);
  return days;
});

// 获取天干地支解析数据的方法
const getSixtyWordData = timestamp => {
  const sixtyWordStr = getSixtyWord(timestamp);
  return parseSixtyWord(sixtyWordStr);
};

// 方法
const getWeekday = timestamp => {
  const date = new Date(timestamp * 1000);
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekdays[date.getDay()];
};

// 获取排名图标
const getRankIcon = (sortType, index) => {
  if (index === 0) {
    switch (sortType) {
      case 'best':
        return 'material-symbols:trophy';
      case 'worst':
        return 'material-symbols:sentiment-dissatisfied';
      case 'mostPlayed':
        return 'material-symbols:videogame-asset';
      case 'highestWinRate':
        return 'material-symbols:trending-up';
      case 'lowestWinRate':
        return 'material-symbols:trending-down';
      case 'mostWins':
        return 'material-symbols:military-tech';
      default:
        return 'material-symbols:trophy';
    }
  }
  return 'material-symbols:circle';
};

// 获取排名图标样式类
const getRankIconClass = (sortType, index) => {
  if (index === 0) {
    switch (sortType) {
      case 'best':
      case 'mostPlayed':
      case 'highestWinRate':
      case 'mostWins':
        return 'trophy';
      case 'worst':
      case 'lowestWinRate':
        return 'sad';
      default:
        return 'trophy';
    }
  }
  return 'normal';
};

// 监听数据变化，重新计算天干地支
watch(
  () => props.data,
  () => {
    // 数据变化时可以做一些处理
  },
  { deep: true }
);
</script>

<style scoped>
.game-analysis {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.analysis-header {
  background: var(--bg-color-secondary);
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.analysis-header h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing);
}

.analysis-controls {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: var(--spacing);
}

.control-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.control-group label {
  font-size: var(--text-sm);
  color: var(--text-color-secondary);
  white-space: nowrap;
}

.count-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: var(--text-sm);
}

.sort-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-color);
  border-radius: var(--radius);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition);
  min-width: 120px;
}

.sort-select:hover {
  border-color: var(--primary-color);
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(100 108 255 / 0.1);
}

.analysis-content {
  padding: var(--spacing-lg);
}

.days-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing);
}

.day-item {
  display: flex;
  align-items: center;
  gap: var(--spacing);
  padding: var(--spacing);
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  transition: var(--transition);
}

.day-item:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.day-item.best-day {
  border-color: #10b981;
  background: linear-gradient(135deg, #10b98110, #10b98105);
}

.day-item.worst-day {
  border-color: #ef4444;
  background: linear-gradient(135deg, #ef444410, #ef444405);
}

.day-rank {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 60px;
}

.rank-number {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--primary-color);
}

.rank-icon.trophy {
  color: #f59e0b;
}

.rank-icon.sad {
  color: #ef4444;
}

.rank-icon.normal {
  color: var(--text-color-secondary);
}

.day-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.day-date h4 {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.day-weekday {
  font-size: var(--text-sm);
  color: var(--text-color-secondary);
}

.day-stats {
  display: flex;
  gap: var(--spacing);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  font-weight: 500;
}

.stat-item.win {
  color: #10b981;
}

.stat-item.lose {
  color: #ef4444;
}

.stat-item.net.positive {
  color: #10b981;
}

.stat-item.net.negative {
  color: #ef4444;
}

.stat-item.rate {
  color: var(--info-color);
}

.day-fortune {
  min-width: 200px;
  padding: var(--spacing-sm);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.fortune-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xs);
}

.fortune-grid {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: space-between;
}

.fortune-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  flex: 1;
}

.column-label {
  font-size: var(--text-xs);
  color: var(--text-color-secondary);
  font-weight: 500;
}

.tiangan-dizhi {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.char {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: 700;
  border-radius: var(--radius-sm);
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.char.tiangan {
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
}

.char.dizhi {
  border-bottom-left-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
}

.char:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-sm);
  background: var(--bg-color);
}

.fortune-text {
  font-size: var(--text-sm);
  color: var(--text-color);
  font-weight: 500;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .day-fortune {
    min-width: 160px;
  }

  .fortune-grid {
    gap: var(--spacing-xs);
  }

  .char {
    width: 20px;
    height: 20px;
    font-size: var(--text-xs);
  }

  .column-label {
    font-size: 10px;
  }

  .footer-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .analysis-btn {
    justify-content: center;
  }
}

/* 暗色主题适配 */
[data-theme='dark'] .char {
  background: var(--bg-color-tertiary);
  border: 1px solid var(--border-color);
}

[data-theme='dark'] .char:hover {
  background: var(--bg-color-secondary);
}

/* 添加一些动画效果 */
.fortune-grid {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--text-color-secondary);
}

.no-data svg {
  font-size: 2rem;
  margin-bottom: var(--spacing);
}

.analysis-footer {
  padding-top: var(--spacing);
  border-top: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
}

.footer-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing);
}

.fortune-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-color);
}

.fortune-toggle input[type='checkbox'] {
  margin: 0;
}

.analysis-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-hover));
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.analysis-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.analysis-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analysis-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .day-item {
    flex-direction: column;
    align-items: stretch;
  }

  .day-rank {
    flex-direction: row;
    justify-content: center;
    min-width: auto;
  }

  .day-fortune {
    min-width: auto;
  }

  .day-stats {
    justify-content: center;
  }
}
</style>
