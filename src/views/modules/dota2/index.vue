<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { regroupArr, dateFormat, compareDates } from './components/utils/tools';
import yyyDataOfDota2 from './components/utils/yyy.json';
import zjjDataOfDota2 from './components/utils/zjj.json';
import dota2Bar from './components/dota2Bar.vue';

const result = ref();
const userData = ref('yyy');

function onChange({ target }) {
  if (target.value === 'yyy') onInit(yyyDataOfDota2);
  else if (target.value === 'zjj') onInit(zjjDataOfDota2);
}

function onInit(data: any = yyyDataOfDota2) {
  const arr = getData(data.calendar);
  const reduceYear = regroupArr(arr, 'dateYear').map(yearData => yearData.sort(compareDates));
  result.value = reduceYear.reverse();

  // console.log("年份: ", reduceYear);
  // console.log("月份: ", regroupArr(arr, "dateMount"));
  // console.log("天: ", regroupArr(arr, "dateDay"));
  console.log('%c [ 处理后的数据 ] >>>', 'color:#2656c9', result);
}

function getData(list) {
  return list
    .map(item1 => {
      const d = item1.data;
      return d
        .map(item2 => {
          if (item2.count) {
            return {
              ...item2,
              dateCN: dateFormat(item2.date, 'YYYY年 MM月DD日'),
              dateYear: dateFormat(item2.date, 'YYYY'),
              dateMount: dateFormat(item2.date, 'YYYY-MM'),
              dateDay: dateFormat(item2.date, 'MM-DD'),
            };
          }
        })
        .filter(Boolean);
    })
    .flat();
}

onBeforeMount(() => {
  onInit();
});
onMounted(() => {});
</script>

<template>
  <div>
    <h2 class="mb-2">2018年 ~ 2023年 数据汇总</h2>
    <a-radio-group v-model:value="userData" @change="onChange">
      <a-radio-button value="yyy">yyy</a-radio-button>
      <a-radio-button value="zjj">zjj</a-radio-button>
    </a-radio-group>

    <div class="mt-4 mb-4" v-for="d of result" :key="d[0].dateYear">
      <dota2Bar :resultData="d" :year="d[0].dateYear" />
    </div>
  </div>
</template>
