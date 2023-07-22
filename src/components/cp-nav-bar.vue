<template>
  <div>
    <van-nav-bar
      :title="props.title"
      :right-text="props.rightText"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {} from '@/api/user'
const props = defineProps<{
  title: string
  rightText?: string
  back?: () => void
  add?: () => void
}>()

const router = useRouter()

const onClickLeft = () => {
  if (props.back) {
    return props.back()
  }
  if (history.state.back) {
    return router.back()
  }
  router.push('/')
}
const onClickRight = () => {
  if (props.add) {
    return props.add()
  }
  router.push('/register')
}
</script>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar__content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }
}
</style>
