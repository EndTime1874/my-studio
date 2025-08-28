# My Studio - 个人功能集合应用

> 基于 Vue3 + Vite 构建的个人功能中心，集成多种实用工具和创意应用

## ✨ 特性

🚀 **现代技术栈** - Vue3 + Vite + Pinia + Vue Router
图标：[iconify](https://icon-sets.iconify.design)：https://iconify.design/docs/icon-components/vue/

🌈 主题风格：简约

🔧 **高度可定制** - 支持主题切换和个性化配置

🖥️ **响应式设计** - 适配各种屏幕尺寸

## 📦 功能模块

- 🎨 **简易画板** - 在线绘图工具，支持多种画笔和图形
- 📊 **游戏数据分析** - 游戏数据统计与可视化分析
- ✅ **待办事项** - 任务管理和进度跟踪
- 🔧 **更多功能** - 持续扩展中...

## 🧩 核心组件

- 🎯 **Navigation** - 功能完整的侧边栏导航组件
- 🌓 **ThemeToggle** - 精美的主题切换开关组件
- 🎨 **SvgIcon** - 强大的 SVG 图标组件，支持本地和在线图标

## 🚀 快速开始

### 环境要求

- Node.js >= 22.18.0
- npm >= 7.0.0

### 安装依赖

```bash
# 切换到指定 Node.js 版本
nvm use 22.18.0

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
my-studio/
├── public/                          # 静态资源
│   ├── favicon.ico
│   └── icons/                       # 各模块图标
├── src/
│   ├── main.js                      # 应用入口
│   ├── App.vue                      # 根组件
│   ├── router/                      # 路由配置
│   │   ├── index.js                 # 主路由
│   │   └── modules/                 # 各模块路由
│   │       ├── drawing.js
│   │       ├── game-analysis.js
│   │       └── todo.js
│   ├── store/                       # 状态管理 (Pinia)
│   │   ├── index.js
│   │   └── modules/
│   │       ├── app.js               # 全局状态
│   │       ├── drawing.js
│   │       └── todo.js
│   ├── views/                       # 页面组件
│   │   ├── Home.vue                 # 功能中心主页
│   │   ├── modules/                 # 各功能模块页面
│   │   │   ├── Drawing/
│   │   │   │   ├── index.vue        # 画板主页
│   │   │   │   └── components/      # 画板专用组件
│   │   │   ├── GameAnalysis/
│   │   │   │   ├── index.vue
│   │   │   │   └── components/
│   │   │   └── Todo/
│   │   │       ├── index.vue
│   │   │       └── components/
│   │   └── layout/                  # 布局组件
│   │       ├── AppLayout.vue
│   │       └── ModuleLayout.vue
│   ├── components/                  # 通用组件
│   │   ├── common/                  # 基础组件
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── Modal.vue
│   │   │   └── Loading.vue
│   │   └── business/                # 业务组件
│   │       ├── ModuleCard.vue       # 功能模块卡片
│   │       └── Navigation.vue
│   ├── composables/                 # 组合式函数
│   │   ├── useTheme.js              # 主题切换
│   │   ├── useLocalStorage.js       # 本地存储
│   │   └── modules/                 # 模块专用组合函数
│   │       ├── useDrawing.js
│   │       └── useTodo.js
│   ├── utils/                       # 工具函数
│   │   ├── index.js
│   │   ├── storage.js
│   │   ├── date.js
│   │   └── canvas.js                # 画板相关工具
│   ├── assets/                      # 资源文件
│   │   ├── styles/                  # 样式文件
│   │   │   ├── main.css
│   │   │   ├── variables.css        # CSS 变量
│   │   │   ├── components.css       # 组件样式
│   │   │   └── modules/             # 模块专用样式
│   │   ├── images/
│   │   └── icons/
│   ├── config/                      # 配置文件
│   │   ├── modules.js               # 模块配置
│   │   └── constants.js             # 常量定义
│   └── types/                       # TypeScript 类型定义 (可选)
├── tests/                           # 测试文件
├── docs/                            # 文档
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 开发指南

### 添加新模块

1. 在 `src/views/modules/` 下创建模块目录
2. 在 `src/config/modules.js` 中注册模块
3. 添加对应的路由配置
4. 创建模块专用的状态管理（如需要）

### 模块开发规范

- 每个模块应该是自包含的
- 使用统一的组件和工具库
- 遵循 Vue 3 Composition API 最佳实践
- 保持代码简洁和可维护性

## 📝 更新日志

### v0.1.0 (开发中)

- ✅ 项目初始化
- ✅ 基础架构搭建
- 🔄 核心功能开发中

## 🤝 贡献

这是一个个人项目，主要用于学习和实验。欢迎提出建议和想法！

## 📄 许可证

MIT License
