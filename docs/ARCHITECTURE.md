# My Studio - 项目架构文档

## 📋 项目概述

My Studio 是一个基于 Vue3 + Vite 构建的个人功能集合应用，采用模块化架构设计，便于扩展和维护。

## 🏗 技术架构

### 核心技术栈
- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **图标库**: @iconify/vue
- **工具库**: lodash-es, dayjs

### 架构特点
- 🎯 **模块化设计**: 每个功能模块独立开发，互不干扰
- 🔧 **可扩展性**: 支持动态添加新功能模块
- 🎨 **主题系统**: 支持明暗主题切换
- 📱 **响应式设计**: 适配各种屏幕尺寸
- 💾 **数据持久化**: 基于 localStorage 的数据存储

## 📁 目录结构

```
src/
├── main.js                      # 应用入口
├── App.vue                      # 根组件
├── router/                      # 路由配置
│   └── index.js                 # 主路由文件
├── store/                       # 状态管理
│   ├── index.js                 # Pinia 实例
│   └── modules/                 # 状态模块
│       └── app.js               # 全局应用状态
├── views/                       # 页面组件
│   ├── Home.vue                 # 功能中心主页
│   ├── NotFound.vue             # 404 页面
│   └── modules/                 # 功能模块页面
│       ├── Drawing/             # 画板模块
│       ├── GameAnalysis/        # 游戏分析模块
│       └── Todo/                # 待办事项模块
├── components/                  # 组件库
│   ├── common/                  # 通用组件
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   └── Loading.vue
│   └── business/                # 业务组件
│       └── ModuleCard.vue       # 模块卡片
├── composables/                 # 组合式函数
│   ├── useTheme.js              # 主题管理
│   └── useLocalStorage.js       # 本地存储
├── utils/                       # 工具函数
│   ├── index.js                 # 通用工具
│   ├── storage.js               # 存储工具
│   └── date.js                  # 日期工具
├── assets/                      # 静态资源
│   └── styles/                  # 样式文件
│       └── variables.css        # CSS 变量
└── config/                      # 配置文件
    ├── modules.js               # 模块配置
    └── constants.js             # 常量定义
```

## 🔧 核心功能

### 1. 模块管理系统
- 统一的模块配置文件 (`src/config/modules.js`)
- 动态路由生成
- 模块状态管理
- 模块卡片展示

### 2. 主题系统
- 明暗主题切换
- CSS 变量驱动
- 实时主题应用
- 主题状态持久化

### 3. 数据持久化
- 基于 localStorage 的数据存储
- 响应式数据绑定
- 自动数据同步

### 4. 响应式设计
- 移动端适配
- 弹性布局
- 媒体查询优化

## 🚀 开发指南

### 添加新模块

1. **创建模块目录**
   ```bash
   mkdir src/views/modules/YourModule
   ```

2. **创建模块组件**
   ```vue
   <!-- src/views/modules/YourModule/index.vue -->
   <template>
     <div class="your-module">
       <!-- 模块内容 -->
     </div>
   </template>
   ```

3. **注册模块**
   ```javascript
   // src/config/modules.js
   export const modules = [
     // ... 其他模块
     {
       id: 'your-module',
       name: '你的模块',
       description: '模块描述',
       icon: 'mdi:your-icon',
       color: '#your-color',
       route: '/your-module',
       component: () => import('@/views/modules/YourModule/index.vue'),
       enabled: true
     }
   ]
   ```

### 开发规范

- 使用 Vue 3 Composition API
- 遵循组件化开发原则
- 使用 CSS 变量进行样式管理
- 保持代码简洁和可维护性

## 📊 已实现功能

### ✅ 基础架构
- [x] 项目初始化和配置
- [x] 路由系统搭建
- [x] 状态管理集成
- [x] 主题系统实现
- [x] 通用组件库

### ✅ 功能模块
- [x] 功能中心主页
- [x] 待办事项应用（完整实现）
- [x] 画板模块（占位）
- [x] 游戏分析模块（占位）

## 🔮 后续规划

### 待开发功能
- [ ] 画板功能完整实现
- [ ] 游戏数据分析工具
- [ ] 更多实用工具模块
- [ ] 数据导入导出功能
- [ ] 用户设置面板

### 优化计划
- [ ] 性能优化
- [ ] 单元测试覆盖
- [ ] 国际化支持
- [ ] PWA 支持

## 🎯 设计理念

1. **模块化优先**: 每个功能都是独立的模块，便于开发和维护
2. **用户体验**: 注重界面美观和交互流畅
3. **可扩展性**: 架构设计支持快速添加新功能
4. **代码质量**: 遵循最佳实践，保持代码整洁

---

*最后更新: 2024-08-28*
