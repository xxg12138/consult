import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const wihteList = ['/login', 'register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  const store = useUserStore()

  if (!store.user?.token) {
    if (wihteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  } else {
    if (wihteList.includes(to.path)) {
      next('/')
    } else {
      next()
    }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title}-优医问诊`
  NProgress.done()
})

export default router
