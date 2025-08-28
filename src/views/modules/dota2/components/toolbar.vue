<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { RadioGroupProps } from 'ant-design-vue';

/* -----------------------------------------------------------------------------
 * 场数
 * -----------------------------------------------------------------------------*/

const showCount = ref(3);

/* -----------------------------------------------------------------------------
 * 单选组件
 * -----------------------------------------------------------------------------*/

const soloValue = ref<string>('winSort');
const soloOptions: RadioGroupProps['options'] = [
  { label: '胜场排序', value: 'winSort' },
  { label: '败场排序', value: 'loseSort' },
];

/* -----------------------------------------------------------------------------
 * 多选组件
 * -----------------------------------------------------------------------------*/

const plainOptions = [{ label: '天干地支', value: '1' }];
const state = reactive({
  indeterminate: true,
  checkAll: false,
  checkedList: [{ label: '天干地支', value: '1' }],
});

const onCheckAllChange = (e: any) => {
  Object.assign(state, {
    checkedList: e.target.checked ? plainOptions : [],
    indeterminate: false,
  });
};
watch(
  () => state.checkedList,
  val => {
    state.indeterminate = !!val.length && val.length < plainOptions.length;
    state.checkAll = val.length === plainOptions.length;
  }
);

defineExpose({
  showCount,
  showType: soloValue,
});
</script>

<template>
  <div class="tool-bar-wrap mb-4">
    <section class="mb-4 flex-c justify-start">
      <div class="flex-c mr-4">
        展示场数：
        <a-input-number
          v-model:value="showCount"
          :min="3"
          :max="31"
          addonAfter="场"
          style="width: 100px"
        />
      </div>

      <div>排序：<a-radio-group v-model:value="soloValue" :options="soloOptions" /></div>
    </section>

    <section>
      <a-checkbox
        v-model:checked="state.checkAll"
        :indeterminate="state.indeterminate"
        @change="onCheckAllChange"
      >
        全选
      </a-checkbox>
      <a-divider type="vertical" />
      <a-checkbox-group v-model:value="state.checkedList" :options="plainOptions" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.tool-bar-wrap {
}
</style>
