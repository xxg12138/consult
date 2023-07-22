<script setup lang="ts">
import { ref } from 'vue'
import { uploadImage } from '@/views/Consult/services/consult'
import type { Image } from '@/types/consult'
import { showLoadingToast } from 'vant'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'

defineProps<{
  disabled: boolean
}>()

const text = ref<string>('')
const emit = defineEmits<{
  (e: 'send-text', text: string): void
  (e: 'send-image', img: Image): void
}>()
const sendText = () => {
  emit('send-text', text.value)
  text.value = ''
}
const sendImage: UploaderAfterRead = async (data) => {
  if (Array.isArray(data)) return
  if (!data.file) return
  const t = showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '正在上传'
  })
  const res = await uploadImage(data.file)
  console.log('ok')
  t.close()

  emit('send-image', res.data)
}
</script>

<template>
  <div class="room-action">
    <van-field
      type="text"
      class="input"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      :disabled="disabled"
      @keyup.enter="sendText"
      v-model="text"
    ></van-field>
    <van-uploader
      :after-read="sendImage"
      :preview-image="false"
      :disabled="disabled"
    >
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
