<template>
  <div>
    <cp-nav-bar
      @click-right="clickRitht"
      :title="'登录'"
      :rightText="'注册'"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>

    <!-- 表单 -->
    <van-form autocomplete="off" @Submit="submit" ref="form">
      <van-field
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="mobileRules"
        name="mobile"
        type="tel"
      ></van-field>
      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        v-model="user.password"
        :rules="passwordRules"
        :type="flag === 'login-eye-off' ? 'password' : 'text'"
      >
        <template #button>
          <CpIcon :name="flag" @click="changeFn"></CpIcon>
        </template>
      </van-field>
      <van-field
        v-else
        placeholder="短信验证码"
        v-model="user.code"
        :rules="codeRules"
      >
        <template #button>
          <span
            class="btn-send"
            :class="{ active: time > 0 }"
            @click="send_code"
          >
            {{ time <= 0 ? '发送验证码' : `${time}s后再次发送` }}</span
          >
        </template>
      </van-field>
      <div class="cp-cell" @click="checked = !checked">
        <van-checkbox v-model="checked" @click="checked = !checked">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button
          block
          round
          type="primary"
          native-type="submit"
          :loading="send_flag"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { login, sendMobileCode, loginByMobile } from '@/api/user'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import CpIcon from '@/components/CpIcon.vue'
import { ref } from 'vue'
import { showToast, showSuccessToast, type FormInstance } from 'vant'
import { useUserStore } from '@/stores/index'
import { useRoute, useRouter } from 'vue-router'

const isPass = ref(true)

const clickRitht = () => {
  console.log(123)
}

const user = ref<{ mobile: string; password: string; code: string }>({
  mobile: '13230000088',
  // mobile: '',
  password: 'abc12345',
  code: ''
})

const flag = ref<string>('login-eye-off')

const changeFn = () => {
  console.log(flag.value)
  flag.value = flag.value === 'login-eye-off' ? 'login-eye-on' : 'login-eye-off'
}

let checked = ref(false)

const store = useUserStore()

const send_flag = ref(false)
const router = useRouter()

const route = useRoute()

const get_password_Data = async () => {
  try {
    const { data } = await login(user.value.mobile, user.value.password)
    store.setUser(data)
    showSuccessToast('登录成功')
    router.push((route.query.returnuRL as string) || '/user')
  } catch (err) {
    console.log(err)
  } finally {
    send_flag.value = false
  }
}

const get_code_Data = async () => {
  try {
    const { data } = await loginByMobile(user.value.mobile, user.value.code)
    store.setUser(data)
    showSuccessToast('登录成功')
    router.push((route.query.returnuRL as string) || '/user')
  } catch (err) {
    console.log(err)
  } finally {
    send_flag.value = false
  }
}

const submit = (value: any) => {
  if (!checked.value) return showToast('请勾选协议')
  send_flag.value = true
  isPass.value ? get_password_Data() : get_code_Data()
}
const time = ref(0)
const form = ref<FormInstance>()
const send_code = async () => {
  await form.value?.validate('mobile')
  const { data } = await sendMobileCode(user.value.mobile, 'login')
  time.value = 60
  send_time()
  console.log(data.code)
}

const send_time = () => {
  const timer = setInterval(() => {
    time.value--
    if (time.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
      pointer-events: none;
    }
  }
}
</style>
