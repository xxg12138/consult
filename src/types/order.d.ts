import { ExpressStatus } from '@/enums'
export type Express = {
  /** 物流信息ID */
  id: string
  /** 物流内容 */
  content: string
  /** 创建时间 */
  createTime: string
  /** 物流状态 */
  status: ExpressStatus
  /** 状态文章 */
  statusValue: string
}

export type Location = {
  /** 经度 */
  longitude: string
  /** 纬度 */
  latitude: string
}

export type Logistics = {
  /** 预计送达时间 */
  estimatedTime: string
  /** 物流公司名称 */
  name: string
  /** 物流编号 */
  awbNo: string
  /** 最新物流状态 */
  status: ExpressStatus
  /** 最新物流状态文字 */
  statusValue: string
  /** 物流信息数组 */
  list: Express[]
  /** 轨迹信息数组 */
  logisticsInfo: Location[]
  /** 当前运输位置 */
  currentLocationInfo: Location
}
