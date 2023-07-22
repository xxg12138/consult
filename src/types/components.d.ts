/* 
为项目全局组件声明类型
*/
import CpNavBar from '@/components/cp-nav-bar.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar
    CpRadioBtn: typeof CpRadioBtn
  }
}
