/**
 * 模块配置文件
 * 统一管理所有功能模块的信息
 */

export const modules = [
  {
    id: 'drawing',
    name: '简易画板',
    description: '在线绘图工具，支持多种画笔和图形',
    icon: 'mdi:brush',
    color: '#FF6B6B',
    route: '/drawing',
    component: () => import('@/views/modules/Drawing/index.vue'),
    enabled: true,
  },
  {
    id: 'game-analysis',
    name: 'Dota2 数据分析',
    description: '2018-2023年 Dota2 游戏数据统计与可视化分析',
    icon: 'mdi:chart-line',
    color: '#4ECDC4',
    route: '/game-analysis',
    component: () => import('@/views/modules/GameAnalysis/index.vue'),
    enabled: true,
  },
  {
    id: 'todo',
    name: '待办事项',
    description: '任务管理和进度跟踪工具',
    icon: 'mdi:check-circle',
    color: '#45B7D1',
    route: '/todo',
    component: () => import('@/views/modules/Todo/index.vue'),
    enabled: true,
  },
];

/**
 * 获取启用的模块列表
 */
export const getEnabledModules = () => {
  return modules.filter(module => module.enabled);
};

/**
 * 根据ID获取模块信息
 */
export const getModuleById = id => {
  return modules.find(module => module.id === id);
};
