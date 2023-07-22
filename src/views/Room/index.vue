<script setup lang="ts">
import RoomStatus from '@/components/RoomStatus.vue'
import RoomAction from '@/components/RoomAction.vue'
import RoomMessage from '@/components/RoomMessage.vue'
import io from 'socket.io-client'
import { useUserStore } from '@/stores/index'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { baseURL } from '@/utils/request'
import { onUnmounted } from 'vue'
import { MsgType, OrderType } from '@/enums'
import { ref } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/api/consult'
import { nextTick } from 'vue'
import dayjs from 'dayjs'
import { showToast } from 'vant'
import { provide } from 'vue'

const store = useUserStore()
const route = useRoute()
const list = ref<Message[]>([])

const consult = ref<ConsultOrderItem>()
const loadConsult = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
}

// let socket: Socket
loadConsult()

const socket = io(baseURL, {
  auth: {
    token: `Bearer ${store.user.token}`
  },
  query: {
    orderId: route.query.orderId
  }
})

onMounted(async () => {
  // const res = await getConsultOrderDetail(route.query.orderId as string)
  // consult.value = res.data
  // console.log(res)

  socket.on('connect', () => {
    // 建立连接成功
    console.log('连接成功')
    list.value = []
  })
  // 聊天记录
  socket.on('chatMsgList', async ({ data }: { data: TimeMessages[] }) => {
    const arr: Message[] = []
    data.forEach((item, i) => {
      if (i === 0) time.value = item.createTime
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    list.value.unshift(...arr)
    loading.value = false
    if (!data.length) {
      return showToast({
        message: '没有聊天记录了',
        className: 'particulars-detail-popup'
      })
    }

    await nextTick(() => {
      if (initialMsg.value) {
        socket.emit('updateMsgStatus', arr[arr.length - 1].id)
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      }
    })
    // window.scrollTo(0, document.body.scrollHeight)
  })
  // 订单状态 在onMounted注册
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
  })
  //连接错误提示
  socket.on('error', (event) => {
    console.log('错误：', event)
  })
  // 断开连接提示
  socket.on('disconnect', () => {
    // 已经断开连接
  })
  // 接收消息 在onMounted注册
  socket.on('receiveChatMsg', async (event) => {
    list.value.push(event)
    await nextTick()
    socket.emit('updateMsgStatus', event.id)
    window.scrollTo(0, document.body.scrollHeight)
  })
})
onUnmounted(() => {
  list.value = []
  socket.close()
})
const sendText = (text: string) => {
  socket.emit('sendChatMsg', {
    // from: consult.value?.id,
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: text
    }
  })
}
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

const id = ref<string | number>('')
const order = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  id.value = res.data.id
}
order()
const initialMsg = ref(true)
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const loading = ref(false)
const onRefresh = () => {
  // 触发下拉
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
}
provide('consult', consult)

const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status
      :status="consult?.status"
      :countdown="consult?.countdown"
    ></room-status>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message :list="list" :id="id"></room-message>
    </van-pull-refresh>

    <room-action
      @send-text="sendText"
      @send-image="sendImage"
      :disabled="consult?.status !== OrderType.ConsultChat"
    ></room-action>
  </div>
</template>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
