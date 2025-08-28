<!--
 * @Description: SVG图标组件 - 支持本地SVG图标和在线图标
 * @Author: 
 * @Date: 2024-08-28
 * @LastEditors:
 * @LastEditTime: 2024-08-28
-->

<script setup>
import { computed, ref, onMounted } from 'vue';

defineOptions({
  name: 'SvgIcon',
});

const props = defineProps({
  // 图标名称
  name: {
    type: String,
    required: true,
  },
  // 图标前缀
  prefix: {
    type: String,
    default: 'icon',
  },
  // 自定义类名
  className: {
    type: String,
    default: '',
  },
  // 图标大小
  size: {
    type: [String, Number],
    default: 18,
  },
  // 图标颜色
  color: {
    type: String,
    default: 'currentColor',
  },
  // 是否为在线图标（如果是，则从URL加载）
  online: {
    type: Boolean,
    default: false,
  },
  // 在线图标URL
  url: {
    type: String,
    default: '',
  },
  // 是否可点击
  clickable: {
    type: Boolean,
    default: false,
  },
  // 旋转角度
  rotate: {
    type: [String, Number],
    default: 0,
  },
  // 是否旋转动画
  spin: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

// 计算属性
const iconName = computed(() => `#${props.prefix}-${props.name}`);

const svgClass = computed(() => {
  const classes = ['svg-icon'];
  if (props.className) classes.push(props.className);
  if (props.clickable) classes.push('svg-icon--clickable');
  if (props.spin) classes.push('svg-icon--spin');
  return classes.join(' ');
});

const svgStyle = computed(() => {
  const styles = {
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
    color: props.color,
  };

  if (props.rotate) {
    styles.transform = `rotate(${props.rotate}deg)`;
  }

  return styles;
});

// 在线图标处理
const svgContent = ref('');
const isLoading = ref(false);
const loadError = ref(false);

const loadOnlineIcon = async () => {
  if (!props.online || !props.url) return;

  isLoading.value = true;
  loadError.value = false;

  try {
    const response = await fetch(props.url);
    if (!response.ok) throw new Error('Failed to load icon');
    svgContent.value = await response.text();
  } catch (error) {
    console.error('Failed to load online icon:', error);
    loadError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// 点击处理
const handleClick = event => {
  if (props.clickable) {
    emit('click', event);
  }
};

// 生命周期
onMounted(() => {
  if (props.online) {
    loadOnlineIcon();
  }
});
</script>

<template>
  <!-- 本地SVG图标 -->
  <svg v-if="!online" :class="svgClass" :style="svgStyle" aria-hidden="true" @click="handleClick">
    <use :xlink:href="iconName" />
  </svg>

  <!-- 在线SVG图标 -->
  <div v-else-if="online" :class="svgClass" :style="svgStyle" @click="handleClick">
    <!-- 加载中 -->
    <div v-if="isLoading" class="svg-icon__loading">
      <svg class="svg-icon__spinner" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-dasharray="31.416"
          stroke-dashoffset="31.416"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="2s"
            values="0 31.416;15.708 15.708;0 31.416"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            dur="2s"
            values="0;-15.708;-31.416"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>

    <!-- 加载错误 -->
    <div v-else-if="loadError" class="svg-icon__error">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        />
      </svg>
    </div>

    <!-- 在线图标内容 -->
    <div v-else v-html="svgContent" class="svg-icon__content"></div>
  </div>
</template>

<style lang="scss" scoped>
.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  fill: currentColor;
  color: currentColor;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  flex-shrink: 0;

  // 可点击状态
  &--clickable {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  // 旋转动画
  &--spin {
    animation: svg-icon-spin 1s linear infinite;
  }

  // 加载状态
  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__spinner {
    width: 100%;
    height: 100%;
    color: currentColor;
  }

  // 错误状态
  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #ef4444;
    opacity: 0.6;
  }

  // 在线图标内容
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    :deep(svg) {
      width: 100%;
      height: 100%;
      fill: currentColor;
      color: currentColor;
    }
  }
}

// 旋转动画
@keyframes svg-icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 尺寸变体
.svg-icon {
  // 小尺寸
  &.svg-icon--small {
    width: 14px;
    height: 14px;
  }

  // 中等尺寸
  &.svg-icon--medium {
    width: 20px;
    height: 20px;
  }

  // 大尺寸
  &.svg-icon--large {
    width: 24px;
    height: 24px;
  }

  // 超大尺寸
  &.svg-icon--xlarge {
    width: 32px;
    height: 32px;
  }
}

// 颜色变体
.svg-icon {
  &.svg-icon--primary {
    color: var(--primary-color, #646cff);
  }

  &.svg-icon--success {
    color: var(--success-color, #10b981);
  }

  &.svg-icon--warning {
    color: var(--warning-color, #fbbf24);
  }

  &.svg-icon--error {
    color: var(--error-color, #ef4444);
  }

  &.svg-icon--secondary {
    color: var(--text-color-secondary, #64748b);
  }
}

// 无障碍支持
@media (prefers-reduced-motion: reduce) {
  .svg-icon {
    &--spin {
      animation: none;
    }

    &--clickable:hover {
      transform: none;
    }
  }
}

// 高对比度模式
@media (prefers-contrast: high) {
  .svg-icon {
    &__error {
      color: #dc2626;
      opacity: 1;
    }
  }
}
</style>
