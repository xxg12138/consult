import axios from 'axios'
import { useUserStore } from '../stores'
import { showToast } from 'vant'
import router from '@/router'

const src = import.meta.env.VITE_APP_CALLBACK
console.log(src)

export const baseURL = 'https://consult-api.itheima.net/'
const request = axios.create({
  baseURL: 'https://consult-api.itheima.net/',
  timeout: 10000
})

request.interceptors.request.use(
  (config) => {
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

request.interceptors.response.use(
  (res) => {
    if (res.data?.code !== 10000) {
      showToast(res.data?.message)
      return Promise.reject(res.data)
    }
    return res.data
  },
  (err) => {
    if (err.response.status === 401) {
      const store = useUserStore()
      store.delUser()
      router.push(`/login?returnuRL=${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(err)
  }
)

export default request
