<template>
  <van-button
    :loading="loading"
    round
    @click="follow"
    size="small"
    type="primary"
    >{{ likeFlag === 1 ? '已关注' : '+ 关注' }}</van-button
  >
</template>

<script setup lang="ts">
import { followOrUnfollow } from '@/api/consult'
import { ref } from 'vue'
import { showSuccessToast } from 'vant'
const props = defineProps<{
  id: string
  likeFlag: string | number
}>()

const loading = ref(false)
const follow = async () => {
  try {
    await followOrUnfollow({ id: props.id, type: 'doc' })
    showSuccessToast('关注成功')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
