import { defineStore } from 'pinia'
import { ref } from 'vue'
// type 指明导入的是ts的类型
import type { User } from '@/types/user'

/* 
用户store：存储登录用户相关数据
*/
export const useUserStore = defineStore(
  'cp-user',
  () => {
    const user = ref({} as User)

    const setUser = (u: User) => {
      user.value = u
    }

    const delUser = () => {
      user.value = {} as User
    }

    return { user, setUser, delUser }
  },
  {
    persist: true
  }
)
