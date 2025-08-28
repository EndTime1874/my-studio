<template>
  <div class="home">
    <header class="home__header">
      <div class="home__header-content">
        <h1 class="home__title">
          <Icon icon="mdi:tools" class="home__title-icon" />
          My Studio
        </h1>
        <p class="home__subtitle">个人功能集合应用 - 创意与实用的完美结合</p>
      </div>
    </header>

    <main class="home__main">
      <div class="home__container">
        <section class="modules-section">
          <h2 class="section-title">功能模块</h2>
          <div class="modules-grid">
            <ModuleCard v-for="module in enabledModules" :key="module.id" :module="module" />
          </div>
        </section>

        <section class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-card__icon">
                <Icon icon="mdi:puzzle" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__number">常用网址</div>
                <div class="stat-card__label">更多</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon">
                <Icon icon="mdi:rocket-launch" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__number">Vue 3</div>
                <div class="stat-card__label">技术栈</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon">
                <Icon icon="mdi:heart" />
              </div>
              <div class="stat-card__content">
                <div class="stat-card__number">开源</div>
                <div class="stat-card__label">项目性质</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="home__footer">
      <p>
        &copy; 2025 My Studio. 用 🤖 Claude Sonnet 4 和
        <SvgIcon name="vue-logo" :size="14" style="position: relative; top: 2px" />
        Vue 3 构建
      </p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import ModuleCard from '@/components/business/ModuleCard.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { getEnabledModules } from '@/config/modules';

const enabledModules = computed(() => getEnabledModules());
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home__header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.home__header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing);
}

.home__title {
  font-size: var(--text-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing);
}

.home__title-icon {
  font-size: 2rem;
}

.home__subtitle {
  font-size: var(--text-lg);
  opacity: 0.9;
  margin-bottom: var(--spacing-lg);
}

.home__main {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.home__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing);
}

.section-title {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.modules-section {
  margin-bottom: var(--spacing-xl);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.stats-section {
  margin-bottom: var(--spacing-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--bg-color-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.stat-card__icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius);
  margin-right: var(--spacing);
  font-size: 24px;
}

.stat-card__content {
  flex: 1;
}

.stat-card__number {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.stat-card__label {
  font-size: var(--text-sm);
  color: var(--text-color-secondary);
}

.home__footer {
  background: var(--bg-color-secondary);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-lg) 0;
  text-align: center;
  color: var(--text-color-secondary);
}

@media (max-width: 768px) {
  .home__title {
    font-size: var(--text-2xl);
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
