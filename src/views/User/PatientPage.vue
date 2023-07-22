<script setup lang="ts">
import { getPatientList, editPatient, delPatient } from '@/api/user'
import type { Patient, add } from '@/types/user'
import { ref, onMounted, computed } from 'vue'
import { nameRules, idCardRules } from '@/utils/rules'
import { addPatient } from '@/api/user'
import type { FormInstance } from 'vant'
import { showConfirmDialog, showToast } from 'vant'
import { useRoute } from 'vue-router'
const route = useRoute()
const isChange = computed(() => {
  return route.query.isChange === '1'
})
const form = ref<FormInstance>()
const list = ref([] as Patient)
const show = ref(false)
const str = ref('')
const showLeft = ref(false)
const perple = ref({} as add)
perple.value.defaultFlag = 0
perple.value.gender = 1

const flag = ref(false)

const getList = async () => {
  const { data } = await getPatientList()
  list.value = data
  if (isChange.value && list.value.length) {
    const defPatient = list.value.find((item) => item.defaultFlag === 1)
    if (defPatient) patientId.value = defPatient.id
    else patientId.value = list.value[0].id
  }
}
onMounted(() => {
  getList()
})
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

const closeDialog = () => {
  showLeft.value = false
  perple.value = {} as add
  perple.value.defaultFlag = 0
  perple.value.gender = 1
}

const dispose = async () => {
  form.value?.validate(['name', 'id']).then(async (i) => {
    const gender = perple.value.idCard.slice(-2, -1) % 2

    if (gender !== perple.value.gender) {
      showConfirmDialog({
        title: '温馨提示',
        message: '填写的性别和身份证号中的不一致\n您确认提交吗？'
      })
        .then(() => {
          addFn()
        })
        .catch(() => {
          // on cancel
        })
    } else {
      addFn()
    }
  })
}

const events = () => {
  showLeft.value = false
  show.value = true
  list.value = []
  getList()
  perple.value = {} as add
  perple.value.defaultFlag = 0
  perple.value.gender = 1
}

const addFn = async () => {
  try {
    if (perple.value.id) {
      await editPatient(perple.value)
      str.value = '修改成功'
    } else {
      await addPatient(perple.value)
      str.value = '保存成功'
    }
    events()
  } catch (err) {
    return
  }
}

const default_perple = () => {
  if (flag.value) {
    return (perple.value.defaultFlag = 1)
  }
  return (perple.value.defaultFlag = 0)
}

const edit = (item?: Patient) => {
  if (item) {
    const { id, gender, name, idCard, defaultFlag } = item
    perple.value = {
      id,
      gender,
      name,
      idCard,
      defaultFlag
    }
    showLeft.value = true
  }
}

const del = async () => {
  try {
    showConfirmDialog({
      title: '标温馨提示',
      message: `您确认要删除 ${perple.value.name} 患者信息吗 ？`
    }).then(async () => {
      await delPatient(perple.value.id)
      str.value = '删除成功'
      events()
    })
  } catch (err) {
    console.log(err)
  }
}
const patientId = ref<string>()
const selectedPatient = (item: Patient) => {
  if (isChange.value) {
    patientId.value = item.id
  }
}
import { useRouter } from 'vue-router'
import { useConsultStore } from '@/stores/index'
const router = useRouter()
const store = useConsultStore()
const next = () => {
  if (!patientId.value) return showToast('请选择患者')
  store.setPatient(patientId.value)
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChange ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <!-- 头部提示 -->
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <div class="patient-list">
      <div
        class="patient-item"
        v-for="item in list"
        :key="item.id"
        @click="selectedPatient(item)"
        :class="{ selected: patientId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6})(.+)(.{4})$/, '\$1********\$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="edit(item)"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6" @click="showLeft = true">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>

    <!-- 底部按钮 -->
    <div class="patient-next" v-if="isChange" @click="next">
      <van-button type="primary" round block>下一步</van-button>
    </div>

    <!-- 侧边栏 -->
    <van-popup
      position="left"
      v-model:show="showLeft"
      :style="{ width: '100%', height: '100%' }"
      @update:show="showLeft = $event"
    >
      <cp-nav-bar
        :back="closeDialog"
        :title="perple.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        :add="dispose"
      ></cp-nav-bar>
      <van-form autocomplete="off" ref="form">
        <van-field
          v-model="perple.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
          :rules="nameRules"
          name="name"
        />
        <van-field
          v-model="perple.idCard"
          label="身份证号"
          name="id"
          placeholder="请输入身份证号"
          :rules="idCardRules"
        />
        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn
              v-model="perple.gender"
              :options="options"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人" @click="default_perple">
          <template #input>
            <van-checkbox :icon-size="18" round v-model.stop="flag" />
          </template>
        </van-field>
      </van-form>

      <van-button v-if="perple.id" type="default" round @click="del"
        >删除</van-button
      >
    </van-popup>

    <van-toast v-model:show="show" style="padding: 0">
      <template #message>
        <div class="toast">{{ str }}</div>
      </template>
    </van-toast>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  position: relative;
  padding-top: 40px;
  padding-bottom: 80px;
  .patient-next {
    padding: 15px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 80px;
    background-color: #fff;

    box-sizing: border-box;
    .van-button {
      background-color: var(--cp-primary);
      color: #fff;
    }
  }

  .toast {
    width: 100px;
    height: 40px;
    line-height: 40px;
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}

.particulars-detail-popup {
  background: rgba(0, 0, 0, 0.7) !important;
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
</style>
