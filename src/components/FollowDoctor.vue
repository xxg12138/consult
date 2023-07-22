<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import DoctorCard from './DoctorCard.vue'
import { getDoctorPage } from '@/api/consult'
import type { DoctorList, PageParams } from '@/types/consult'
import { ref } from 'vue'
import { onMounted } from 'vue'
const list = ref([] as DoctorList)

const { width } = useWindowSize()

const page = ref<PageParams>({
  /** 当前页码 */
  current: 1,
  /** 每页条数 */
  pageSize: 5
})

onMounted(async () => {
  const { data } = await getDoctorPage(page.value)
  list.value.push(...data.rows)
})
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <van-swipe
        :loop="false"
        :width="(150 / 375) * width"
        :show-indicators="false"
      >
        <van-swipe-item v-for="item in list" :key="item.id"
          ><DoctorCard :doctor="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
