# SvgIcon Component SVG图标组件文档

## 📋 概述

SvgIcon 是一个功能强大的 SVG 图标组件，支持本地 SVG 图标和在线图标加载，提供丰富的自定义选项和交互效果。

## ✨ 特性

### 🎨 多种图标来源
- **本地 SVG**: 支持 SVG Sprite 方式的本地图标
- **在线图标**: 支持从 URL 动态加载 SVG 图标
- **加载状态**: 提供加载中和错误状态的视觉反馈

### 🔧 丰富的自定义选项
- **尺寸控制**: 支持数字、字符串和预设尺寸
- **颜色定制**: 支持自定义颜色和预设颜色变体
- **旋转效果**: 支持静态旋转和动画旋转
- **交互支持**: 支持点击事件和悬停效果

### ♿ 无障碍支持
- **语义化**: 正确的 ARIA 属性
- **减少动画**: 支持用户的动画偏好设置
- **高对比度**: 支持高对比度模式
- **键盘导航**: 支持键盘操作

## 🎯 使用方法

### 基础使用

```vue
<template>
  <div>
    <!-- 基础用法 -->
    <SvgIcon name="home" />
    
    <!-- 自定义尺寸和颜色 -->
    <SvgIcon name="user" :size="24" color="#646cff" />
    
    <!-- 可点击图标 -->
    <SvgIcon 
      name="settings" 
      :clickable="true" 
      @click="handleClick" 
    />
  </div>
</template>

<script setup>
import SvgIcon from '@/components/common/SvgIcon.vue'

const handleClick = () => {
  console.log('Icon clicked!')
}
</script>
```

### 高级用法

```vue
<template>
  <div>
    <!-- 旋转动画 -->
    <SvgIcon name="loading" :spin="true" />
    
    <!-- 静态旋转 -->
    <SvgIcon name="arrow" :rotate="90" />
    
    <!-- 在线图标 -->
    <SvgIcon 
      name="custom" 
      :online="true" 
      url="https://example.com/icon.svg" 
    />
    
    <!-- 预设样式 -->
    <SvgIcon name="success" className="svg-icon--large svg-icon--success" />
  </div>
</template>
```

## 📝 Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | String | - | 图标名称（必填） |
| `prefix` | String | `'icon'` | 图标前缀 |
| `className` | String | `''` | 自定义类名 |
| `size` | String/Number | `18` | 图标大小 |
| `color` | String | `'currentColor'` | 图标颜色 |
| `online` | Boolean | `false` | 是否为在线图标 |
| `url` | String | `''` | 在线图标URL |
| `clickable` | Boolean | `false` | 是否可点击 |
| `rotate` | String/Number | `0` | 旋转角度 |
| `spin` | Boolean | `false` | 是否旋转动画 |

## 🎭 Events 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `click` | 点击事件（需要设置 `clickable` 为 `true`） | `event` |

## 🎨 预设样式类

### 尺寸变体
```vue
<!-- 小尺寸 14px -->
<SvgIcon name="icon" className="svg-icon--small" />

<!-- 中等尺寸 20px -->
<SvgIcon name="icon" className="svg-icon--medium" />

<!-- 大尺寸 24px -->
<SvgIcon name="icon" className="svg-icon--large" />

<!-- 超大尺寸 32px -->
<SvgIcon name="icon" className="svg-icon--xlarge" />
```

### 颜色变体
```vue
<!-- 主色 -->
<SvgIcon name="icon" className="svg-icon--primary" />

<!-- 成功色 -->
<SvgIcon name="icon" className="svg-icon--success" />

<!-- 警告色 -->
<SvgIcon name="icon" className="svg-icon--warning" />

<!-- 错误色 -->
<SvgIcon name="icon" className="svg-icon--error" />

<!-- 次要色 -->
<SvgIcon name="icon" className="svg-icon--secondary" />
```

## 🏗 SVG Sprite 设置

### 1. 准备 SVG 图标
将 SVG 图标文件放置在 `src/assets/icons/` 目录下。

### 2. 生成 SVG Sprite
使用构建工具生成 SVG Sprite 文件：

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    })
  ]
})
```

### 3. 在 main.js 中引入
```javascript
// main.js
import 'virtual:svg-icons-register'
```

## 🌐 在线图标使用

```vue
<template>
  <!-- 从 URL 加载图标 -->
  <SvgIcon 
    name="custom-icon"
    :online="true"
    url="https://api.iconify.design/mdi/home.svg"
    :size="24"
  />
</template>
```

## 🎯 最佳实践

### 1. 图标命名规范
- 使用小写字母和连字符：`user-profile`
- 按功能分组：`nav-home`, `nav-settings`
- 保持语义化：`edit`, `delete`, `save`

### 2. 尺寸使用建议
- **14px**: 小图标，如表格中的操作图标
- **18px**: 默认尺寸，适合大多数场景
- **24px**: 导航图标、按钮图标
- **32px**: 大图标，如空状态图标

### 3. 颜色使用建议
- 优先使用 `currentColor` 继承父元素颜色
- 使用预设颜色变体保持一致性
- 避免硬编码颜色值

### 4. 性能优化
- 优先使用本地 SVG Sprite
- 在线图标适合动态内容
- 避免频繁切换在线图标

## 🔧 自定义样式

```scss
// 自定义图标样式
.my-custom-icon {
  .svg-icon {
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
      transform: scale(1.2);
    }
  }
}
```

## 🐛 常见问题

### Q: 本地图标不显示？
A: 检查 SVG Sprite 是否正确生成，图标名称是否匹配。

### Q: 在线图标加载失败？
A: 检查网络连接和 URL 是否正确，组件会显示错误状态。

### Q: 图标颜色不正确？
A: 确保 SVG 文件使用 `fill="currentColor"` 或移除 `fill` 属性。

### Q: 动画在某些设备上不显示？
A: 组件已支持 `prefers-reduced-motion`，用户可能设置了减少动画。

---

*最后更新: 2024-08-28*
