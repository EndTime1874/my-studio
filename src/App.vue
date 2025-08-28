<script setup>
import { onMounted } from 'vue';
import { useAppStore } from './store/modules/app';
import AppLayout from './views/layout/AppLayout.vue';

const appStore = useAppStore();

onMounted(() => {
  // 确保主题正确应用
  appStore.initTheme();
});
</script>

<template>
  <div id="app">
    <AppLayout />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
