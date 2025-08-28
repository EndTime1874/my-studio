# ThemeToggle Component 主题切换组件文档

## 📋 概述

ThemeToggle 是一个精美的主题切换组件，采用滑动开关的形式，支持明暗主题的无缝切换。组件设计现代化，具有丰富的交互效果和完善的无障碍支持。

## ✨ 特性

### 🎨 视觉设计
- **滑动开关形态**: 采用现代化的 toggle switch 设计
- **双侧标识**: 左侧 Light mode + 太阳图标，右侧 Dark mode + 月亮图标
- **动态滑块**: 带有图标的圆形滑块，指示当前激活主题
- **渐变效果**: 滑块使用渐变色彩，增强视觉效果

### 🔧 功能特性
- **两种显示模式**: 完整模式和折叠模式
- **平滑动画**: 滑块滑动和颜色过渡动画
- **主题适配**: 自动适配当前主题的颜色方案
- **响应式设计**: 适配不同屏幕尺寸

### ♿ 无障碍支持
- **键盘导航**: 支持 Tab 键聚焦和空格键切换
- **高对比度**: 支持高对比度模式
- **减少动画**: 支持用户的动画偏好设置
- **语义化**: 正确的 ARIA 属性和语义结构

## 🏗 组件结构

```
ThemeToggle.vue
├── 折叠状态 (isCollapsed=true)
│   └── 圆形图标按钮
└── 展开状态 (isCollapsed=false)
    ├── Light Mode 选项
    ├── 滑动滑块
    └── Dark Mode 选项
```

## 🎯 使用方法

### 基础使用

```vue
<template>
  <div>
    <!-- 完整模式 -->
    <ThemeToggle />
    
    <!-- 折叠模式 -->
    <ThemeToggle :is-collapsed="true" />
  </div>
</template>

<script setup>
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>
```

### Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isCollapsed` | Boolean | `false` | 是否为折叠状态 |

### 在导航栏中使用

```vue
<template>
  <nav class="navigation">
    <!-- 其他导航内容 -->
    <div class="navigation__footer">
      <ThemeToggle :is-collapsed="isNavigationCollapsed" />
    </div>
  </nav>
</template>
```

## 🎨 样式系统

### CSS 变量依赖
组件使用项目的 CSS 变量系统：

```css
/* 颜色变量 */
--primary-color: #646cff;
--bg-color: #ffffff;
--bg-color-secondary: #f8fafc;
--text-color: #213547;
--text-color-secondary: #64748b;
--border-color: #e2e8f0;

/* 间距变量 */
--spacing: 1rem;
--spacing-sm: 0.5rem;
--spacing-lg: 2rem;

/* 圆角变量 */
--radius-lg: 0.75rem;

/* 过渡变量 */
--transition: all 0.2s ease-in-out;

/* 阴影变量 */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

### 主题适配
- **浅色主题**: 白色背景，深色文字，蓝色滑块
- **深色主题**: 深色背景，浅色文字，黄色滑块

## 🎭 交互效果

### 悬停效果
- **完整模式**: 边框颜色变化，阴影效果
- **折叠模式**: 背景色变为主题色，图标变白

### 激活状态
- **滑块移动**: 平滑滑动到对应位置
- **颜色变化**: 滑块颜色根据主题变化
- **文字高亮**: 当前激活选项文字变白

### 动画效果
- **滑块过渡**: 使用 cubic-bezier 缓动函数
- **颜色过渡**: 所有颜色变化都有平滑过渡
- **缩放动画**: 组件出现时的轻微缩放效果

## 📱 响应式设计

### 桌面端 (>768px)
- 完整开关: 宽度自适应，高度 56px
- 折叠按钮: 48x48px 圆形按钮

### 移动端 (≤768px)
- 开关高度: 48px（减小以适应小屏幕）
- 文字大小: 使用更小的字体
- 图标大小: 适当缩小图标尺寸

## 🔧 技术实现

### 核心技术
- **Vue 3 Composition API**: 现代化的组件开发方式
- **Iconify Vue**: 丰富的图标库支持
- **CSS3 动画**: 原生 CSS 动画，性能优异
- **CSS 变量**: 动态主题切换支持

### 动画实现
```css
/* 滑块滑动动画 */
.theme-toggle__slider {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 颜色过渡动画 */
.theme-toggle__option {
  transition: var(--transition);
}
```

### 状态管理
组件通过 `useTheme` 组合函数与全局主题状态同步：

```javascript
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
```

## 🚀 最佳实践

### 1. 布局集成
建议将组件放置在导航栏底部或设置面板中，保持界面整洁。

### 2. 状态同步
组件自动与全局主题状态同步，无需手动管理状态。

### 3. 样式定制
如需定制样式，建议通过 CSS 变量修改，保持主题一致性。

### 4. 无障碍优化
组件已内置无障碍支持，建议保持默认行为。

## 🐛 常见问题

### Q: 主题切换不生效？
A: 检查 `useTheme` 组合函数是否正常工作，确保全局主题状态管理正确。

### Q: 样式显示异常？
A: 确保项目中已正确定义所需的 CSS 变量。

### Q: 动画效果卡顿？
A: 检查是否启用了硬件加速，或者用户是否设置了减少动画偏好。

### Q: 在折叠状态下图标不显示？
A: 确保传递了正确的 `isCollapsed` prop 值。

---

*最后更新: 2024-08-28*
