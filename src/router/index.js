import { createRouter, createWebHistory } from 'vue-router'
import nProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
import routes from './routes'
import { useUserStore } from '@/stores/user.js'
import pinia from '@/stores'

const userStore = useUserStore(pinia)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  nProgress.start()
  if (userStore.isLogin) {
    if (to.path === '/login') {
      next('/')
    } else if (!userStore.username) {
      // 这里获取用户信息
      try {
        await userStore.userInfo()
        // next({...to, replace: true})
        next()
      } catch (e) {
        userStore.logout()
        next({
          path: '/login',
          query: {
            redirect: to.path
          }
        })
      }
    } else {
      next()
    }
  } else {
    if (to.name !== 'Login') {
      next({
        path: '/login',
        query: {
          redirect: to.path
        }
      })
    } else {
      next()
    }
  }
})

router.afterEach((from, next) => {
  nProgress.done()
})

export default router
