import { createRouter, createWebHistory } from 'vue-router'
import { getEnabledModules } from '@/config/modules'

// 基础路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '功能中心'
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

// 动态添加模块路由
const modules = getEnabledModules()
modules.forEach(module => {
  routes.push({
    path: module.route,
    name: module.id,
    component: module.component,
    meta: {
      title: module.name,
      moduleId: module.id
    }
  })
})

// 404 重定向
routes.push({
  path: '/:pathMatch(.*)*',
  redirect: '/404'
})

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - My Studio`
  }
  next()
})

export default router
