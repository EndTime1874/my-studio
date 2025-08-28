<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  RiseOutlined,
  HourglassOutlined,
} from '@ant-design/icons-vue';
import { useECharts } from '@pureadmin/utils';
import { dateFormat, addSixtyWord } from '../components/utils/tools';
import Toolbar from './toolbar.vue';

const props = defineProps({
  resultData: {
    type: Array,
    default: () => [],
  },
  year: {
    type: String,
    default: '',
  },
});

// 根据配置项渲染ECharts
const chartRef = ref();
const { setOptions } = useECharts(chartRef);
const inlineData: any = computed(() => props.resultData);
const monthValue = ref();

setOptions({
  backgroundColor: '#fff',
  title: {
    text: `${props.year} 年天梯情况分析`,
    textStyle: {
      rich: {
        a: {
          fontSize: 16,
          fontWeight: 600,
        },
      },
    },
    left: 'center',
    itemGap: 20,
    subtextStyle: {
      color: '#6C7B8A',
      fontSize: 16,
      fontWeight: 600,
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    top: '5%',
    right: '10%',
    icon: 'circle',
  },
  grid: {
    left: 30,
    right: 30,
    top: 50,
    bottom: 50,
  },
  yAxis: {
    type: 'value',
    // interval: 2
  },
  xAxis: {
    type: 'category',
    // data: ['2021-01', '2021-02']
    data: inlineData.value.map(m => m.dateDay),
  },
  color: ['#4474c4', '#ccc'],
  series: [
    {
      name: 'win',
      type: 'bar',
      stack: 'total',
      barWidth: '60%',
      label: {
        show: true,
        formatter: (params: any) => (params.value == 0 ? '' : params.value),
      },
      data: inlineData.value.map(m => m.win_count),
    },
    {
      name: 'lose',
      type: 'bar',
      stack: 'total',
      barWidth: '60%',
      label: {
        show: true,
        formatter: (params: any) => (params.value == 0 ? '' : params.value),
      },
      data: inlineData.value.map(m => m.lose_count),
    },
  ],
});

const dayList = ref([]);

function setDayList(type, num) {
  // console.log("type", type);
  // console.log("num", num);
  if (type === 'winSort') {
    dayList.value = getNiceDays(num);
  } else if (type === 'loseSort') {
    dayList.value = getBadDays(num);
  }

  dayList.value?.forEach(item => {
    if (!item.SixChar) {
      const d = new Date(item.date * 1000);
      item.SixChar = addSixtyWord(
        d.getFullYear(),
        (d.getMonth() + 1).toString(),
        d.getDate().toString()
      );
    }
  });
}
// 上分日子（最佳状态）
function getNiceDays(showCount = 3) {
  return inlineData.value
    .filter(f => (monthValue.value ? f.dateMount == monthValue.value : f))
    .sort(
      (a, b) =>
        Number(a.lose_count) - Number(a.win_count) - (Number(b.lose_count) - Number(b.win_count))
    )
    .slice(0, showCount);
  // .sort((a, b) => a.date - b.date);
}

// 掉分日子（最差状态）
function getBadDays(showCount = 3) {
  return inlineData.value
    .sort(
      (a, b) =>
        Number(a.win_count) - Number(a.lose_count) - (Number(b.win_count) - Number(b.lose_count))
    )
    .slice(0, showCount);
  // .sort((a, b) => a.date - b.date);
}

const allCount = computed(() => {
  return inlineData.value.reduce(
    (acc, cur) => {
      acc.all += Number(cur.count);
      acc.win += Number(cur.win_count);
      acc.lose += Number(cur.lose_count);
      return acc;
    },
    { all: 0, win: 0, lose: 0 }
  );
});

/* -----------------------------------------------------------------------------
 * 工具栏
 * -----------------------------------------------------------------------------*/

const toolbarRef = ref(null);

// 监听场数变化
watch(
  () => toolbarRef.value?.showCount,
  value => {
    setDayList(toolbarRef.value?.showType, value);
  }
);
// 监听排序变化
watch(
  () => toolbarRef.value?.showType,
  value => {
    console.log('value', value);
    setDayList(value, toolbarRef.value?.showCount);
  }
);
// 监听月份变化
watch(
  () => monthValue.value,
  () => {
    setDayList(toolbarRef.value?.showType, toolbarRef.value?.showCount);
  }
);
watchEffect(() => {
  // console.log(`%c ${props.year}[ 触发了几次 ] >>>`, "color:#2656c9", dayList.value);
});
</script>

<template>
  <a-card :bordered="false" style="margin: 0">
    <template #title>
      <div class="flex flex-start items-center">
        <p class="mr-4">{{ year }}年</p>
        <!-- <a-date-picker
          v-model:value="monthValue"
          valueFormat="YYYY-MM"
          picker="month"
          placeholder="月份"
        /> -->
      </div>
    </template>

    <Toolbar ref="toolbarRef" />

    <a-descriptions bordered class="pb-6" :column="4">
      <a-descriptions-item label="详情数据" :span="4">
        <a-empty v-if="!dayList.length" description="当月并无数据！" />

        <ul>
          <li class="flex-c justify-start" v-for="(day, index) of dayList" :key="index">
            <p class="label">
              <span>{{ index + 1 }}、{{ day.dateCN }}</span>
              <span>{{ dateFormat(day.date, 'dddd') }}</span>
            </p>

            <a-divider type="vertical" />
            <span class="label-tag">
              <a-tag color="green" :bordered="false">
                <template #icon> <ArrowUpOutlined /> </template>
                胜 {{ day.win_count }} 场
              </a-tag>
              <a-tag color="red" :bordered="false">
                <template #icon> <ArrowDownOutlined /> </template>
                输 {{ day.lose_count }} 场
              </a-tag>
              <a-tag color="blue" :bordered="false">
                <template #icon> <RiseOutlined /> </template>
                净胜 {{ day.win_count - day.lose_count }} 场
              </a-tag>

              <a-tag color="" :bordered="false">
                <template #icon> <HourglassOutlined /> </template>
                {{ day.SixChar }}
              </a-tag>
            </span>
          </li>
        </ul>
      </a-descriptions-item>

      <a-descriptions-item label="净胜场总数">
        {{ allCount.win - allCount.lose }}
      </a-descriptions-item>

      <a-descriptions-item label="胜场总数">
        {{ allCount.win }}
      </a-descriptions-item>
      <a-descriptions-item label="败场总数">
        {{ allCount.lose }}
      </a-descriptions-item>
      <a-descriptions-item label="总场数">
        {{ allCount.all }}
      </a-descriptions-item>
    </a-descriptions>

    <div ref="chartRef" style="width: 100%; height: 50vh" />
  </a-card>
</template>

<style lang="scss" scoped>
.ant-card {
  margin: 24px;
}
:deep(.ant-tag) {
  display: inline-block;
  text-align: center;
  padding: 2px 7px;
  span {
    margin-inline-start: 1px;
  }
}

:deep(.ant-descriptions-item-label) {
  width: 120px;
  text-align: center;
}

ul {
  li {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0px;
    }

    .label {
      width: 220px;
      display: flex;
      justify-content: space-around;
      letter-spacing: 0.25px;
      &:first-child span {
        letter-spacing: 1px;
      }
    }
    .label-tag {
      flex: 1;
      display: grid;
      grid-template-columns: 90px 90px 100px 150px;
    }
  }
}
</style>
