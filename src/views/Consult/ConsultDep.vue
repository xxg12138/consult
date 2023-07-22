<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllDep } from '@/api/consult'
import type { TopDep } from '@/types/consult'
import { useConsultStore } from '@/stores/index'
const active = ref(0)
const store = useConsultStore()
const allDep = ref([] as TopDep[])
onMounted(async () => {
  const { data } = await getAllDep()
  allDep.value = data
  console.log(allDep.value)
})
</script>

<template>
  <div class="consult-dep-page" v-if="allDep.length > 0">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item
          v-for="item in allDep"
          :key="item.id"
          :title="item.name"
        />
      </van-sidebar>
      <div class="sub-dep">
        <router-link
          to="/consult/illness"
          v-for="item in allDep[active].child"
          :key="item.id"
          @click="store.setDep(item.id)"
          >{{ item.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
  .wrapper {
    height: calc(100vh - 46px);
    overflow: hidden;
    display: flex;
    .sub-dep {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      > a {
        display: block;
        padding: 14px 30px;
        color: var(--cp-dark);
      }
    }
  }
}
</style>
