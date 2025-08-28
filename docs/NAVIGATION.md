# Navigation Component 导航组件文档

## 📋 概述

Navigation 组件是 My Studio 项目的核心导航组件，基于设计图实现了一个功能完整的侧边栏导航系统。

## ✨ 特性

### 🎨 设计特色
- **三种显示模式**: 完整模式、折叠模式、移动端模式
- **主题切换**: 支持明暗两种主题，实时切换
- **高亮显示**: 当前页面路由自动高亮显示
- **响应式设计**: 完美适配桌面和移动设备

### 🔧 功能特性
- **搜索功能**: 内置搜索框，支持功能搜索
- **模块导航**: 自动读取模块配置，生成导航菜单
- **折叠控制**: 支持手动折叠/展开导航栏
- **移动端适配**: 移动端自动隐藏，支持手势控制

## 🏗 组件结构

```
Navigation.vue
├── 导航头部 (navigation__header)
│   ├── Logo 区域
│   └── 折叠按钮
├── 搜索区域 (navigation__search)
│   ├── 完整搜索框 (展开状态)
│   └── 搜索图标 (折叠状态)
├── 菜单区域 (navigation__menu)
│   ├── 首页链接
│   ├── 功能模块链接
│   ├── 分隔线
│   └── 设置选项
└── 底部区域 (navigation__footer)
    ├── 主题切换按钮
    └── 折叠控制按钮
```

## 🎯 使用方法

### 基础使用

```vue
<template>
  <div class="app-layout">
    <Navigation ref="navigationRef" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navigation from '@/components/business/Navigation.vue'
</script>
```

### 移动端控制

```vue
<script setup>
import { ref } from 'vue'

const navigationRef = ref(null)

// 切换移动端导航
const toggleMobileNav = () => {
  navigationRef.value?.toggleMobileNav()
}

// 关闭移动端导航
const closeMobileNav = () => {
  navigationRef.value?.closeMobileNav()
}
</script>
```

## 🎨 样式系统

### CSS 变量
导航组件使用项目统一的 CSS 变量系统：

```css
/* 主要颜色 */
--primary-color: #646cff;
--bg-color: #ffffff;
--text-color: #213547;
--border-color: #e2e8f0;

/* 间距 */
--spacing: 1rem;
--spacing-lg: 2rem;

/* 圆角 */
--radius: 0.375rem;
--radius-lg: 0.75rem;

/* 过渡 */
--transition: all 0.2s ease-in-out;
```

### 主题适配
- **浅色主题**: 白色背景，深色文字
- **深色主题**: 深色背景，浅色文字
- **高亮效果**: 紫色渐变背景，白色文字

## 📱 响应式设计

### 桌面端 (>768px)
- 默认宽度: 280px
- 折叠宽度: 80px
- 支持手动折叠/展开

### 移动端 (≤768px)
- 默认隐藏在屏幕左侧
- 通过手势或按钮控制显示
- 全宽显示 (280px)

## 🔧 配置选项

### 模块配置
导航组件自动读取 `src/config/modules.js` 中的模块配置：

```javascript
export const modules = [
  {
    id: 'drawing',
    name: '简易画板',
    icon: 'mdi:brush',
    color: '#FF6B6B',
    route: '/drawing',
    enabled: true
  }
]
```

### 本地存储
- `navigation-collapsed`: 导航栏折叠状态
- `my-studio-theme`: 主题设置

## 🎭 交互效果

### 悬停效果
- 菜单项悬停: 背景色变化
- 按钮悬停: 边框和背景色变化
- 主题按钮悬停: 渐变色效果

### 激活状态
- 当前页面: 紫色渐变背景
- 图标和文字: 白色显示
- 阴影效果: 增强视觉层次

### 动画过渡
- 折叠/展开: 0.3s 缓动动画
- 主题切换: 实时颜色过渡
- 移动端滑入: 平滑滑动效果

## 🚀 最佳实践

### 1. 模块添加
添加新功能模块时，只需在 `modules.js` 中配置即可自动出现在导航中。

### 2. 图标选择
建议使用 Material Design Icons (mdi:*) 系列图标，保持视觉一致性。

### 3. 颜色搭配
每个模块建议使用不同的主题色，增强视觉识别度。

### 4. 移动端优化
在移动端页面中，建议添加顶部导航栏来控制侧边栏的显示。

## 🐛 常见问题

### Q: 导航栏在移动端不显示？
A: 检查是否正确设置了 `navigation--mobile-open` 类名。

### Q: 主题切换不生效？
A: 确保 `useTheme` 组合函数正常工作，检查 CSS 变量是否正确定义。

### Q: 路由高亮不正确？
A: 检查路由配置是否与模块配置中的 `route` 字段一致。

---

*最后更新: 2024-08-28*
