<script setup lang="ts">
import { ref } from 'vue'
import { getKnowledgePage } from '@/api/consult'
import type {
  KnowledgeParams,
  KnowledgeType,
  KnowledgeList
} from '@/types/consult'
import KnowledgeCard from './KnowledgeCard.vue'
const props = defineProps<{
  type: KnowledgeType
}>()

const list = ref([] as KnowledgeList)
const loading = ref(false)
const finished = ref(false)

const page = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})

const getList = async () => {
  const { data } = await getKnowledgePage(page.value)
  list.value.push(...data.rows)
  if (page.value.current >= data.pageTotal) {
    finished.value = true
  } else {
    page.value.current++
  }
  loading.value = false
}

const onLoad = () => {
  getList()
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card :item="i" v-for="i in list" :key="i.id"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
