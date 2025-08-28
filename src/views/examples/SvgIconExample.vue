<template>
  <div class="svg-icon-example">
    <div class="example-header">
      <h1>SvgIcon 组件示例</h1>
      <p>展示 SvgIcon 组件的各种用法和效果</p>
    </div>

    <div class="example-sections">
      <!-- 基础用法 -->
      <section class="example-section">
        <h2>基础用法</h2>
        <div class="example-grid">
          <div class="example-item">
            <SvgIcon name="home" />
            <span>默认图标</span>
          </div>
          <div class="example-item">
            <SvgIcon name="user" :size="24" />
            <span>自定义尺寸</span>
          </div>
          <div class="example-item">
            <SvgIcon name="settings" color="#646cff" />
            <span>自定义颜色</span>
          </div>
        </div>
      </section>

      <!-- 尺寸变体 -->
      <section class="example-section">
        <h2>尺寸变体</h2>
        <div class="example-grid">
          <div class="example-item">
            <SvgIcon name="star" className="svg-icon--small" />
            <span>小尺寸 (14px)</span>
          </div>
          <div class="example-item">
            <SvgIcon name="star" />
            <span>默认 (18px)</span>
          </div>
          <div class="example-item">
            <SvgIcon name="star" className="svg-icon--medium" />
            <span>中等 (20px)</span>
          </div>
          <div class="example-item">
            <SvgIcon name="star" className="svg-icon--large" />
            <span>大尺寸 (24px)</span>
          </div>
          <div class="example-item">
            <SvgIcon name="star" className="svg-icon--xlarge" />
            <span>超大 (32px)</span>
          </div>
        </div>
      </section>

      <!-- 颜色变体 -->
      <section class="example-section">
        <h2>颜色变体</h2>
        <div class="example-grid">
          <div class="example-item">
            <SvgIcon name="heart" className="svg-icon--primary" />
            <span>主色</span>
          </div>
          <div class="example-item">
            <SvgIcon name="heart" className="svg-icon--success" />
            <span>成功色</span>
          </div>
          <div class="example-item">
            <SvgIcon name="heart" className="svg-icon--warning" />
            <span>警告色</span>
          </div>
          <div class="example-item">
            <SvgIcon name="heart" className="svg-icon--error" />
            <span>错误色</span>
          </div>
          <div class="example-item">
            <SvgIcon name="heart" className="svg-icon--secondary" />
            <span>次要色</span>
          </div>
        </div>
      </section>

      <!-- 交互效果 -->
      <section class="example-section">
        <h2>交互效果</h2>
        <div class="example-grid">
          <div class="example-item">
            <SvgIcon 
              name="thumbs-up" 
              :clickable="true" 
              @click="handleLike"
              :className="liked ? 'svg-icon--success' : ''"
            />
            <span>可点击 ({{ liked ? '已点赞' : '点赞' }})</span>
          </div>
          <div class="example-item">
            <SvgIcon name="loading" :spin="true" />
            <span>旋转动画</span>
          </div>
          <div class="example-item">
            <SvgIcon name="arrow-right" :rotate="rotateAngle" />
            <button @click="rotateIcon" class="rotate-btn">旋转</button>
          </div>
        </div>
      </section>

      <!-- 在线图标 -->
      <section class="example-section">
        <h2>在线图标</h2>
        <div class="example-grid">
          <div class="example-item">
            <SvgIcon 
              name="vue"
              :online="true"
              url="https://api.iconify.design/logos/vue.svg"
              :size="32"
            />
            <span>Vue Logo</span>
          </div>
          <div class="example-item">
            <SvgIcon 
              name="github"
              :online="true"
              url="https://api.iconify.design/mdi/github.svg"
              :size="32"
            />
            <span>GitHub</span>
          </div>
          <div class="example-item">
            <SvgIcon 
              name="invalid"
              :online="true"
              url="https://invalid-url.com/icon.svg"
              :size="32"
            />
            <span>加载失败示例</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SvgIcon from '@/components/common/SvgIcon.vue'

// 响应式数据
const liked = ref(false)
const rotateAngle = ref(0)

// 方法
const handleLike = () => {
  liked.value = !liked.value
}

const rotateIcon = () => {
  rotateAngle.value += 90
  if (rotateAngle.value >= 360) {
    rotateAngle.value = 0
  }
}
</script>

<style scoped>
.svg-icon-example {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.example-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.example-header h1 {
  font-size: var(--text-3xl);
  color: var(--text-color);
  margin-bottom: var(--spacing);
}

.example-header p {
  font-size: var(--text-lg);
  color: var(--text-color-secondary);
}

.example-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.example-section {
  background: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.example-section h2 {
  font-size: var(--text-xl);
  color: var(--text-color);
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: var(--spacing-sm);
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
}

.example-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing);
  padding: var(--spacing-lg);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  transition: var(--transition);
}

.example-item:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.example-item span {
  font-size: var(--text-sm);
  color: var(--text-color-secondary);
  text-align: center;
}

.rotate-btn {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: var(--transition);
}

.rotate-btn:hover {
  background: var(--primary-color-hover);
}

@media (max-width: 768px) {
  .example-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--spacing);
  }
  
  .example-item {
    padding: var(--spacing);
  }
}
</style>
