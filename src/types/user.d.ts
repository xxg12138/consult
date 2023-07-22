/* 
用户相关ts类型
 */

export type User = {
  token: 'string'
  refreshToken: 'string'
  avatar: 'string'
  mobile: 'string'
  account: 'string'
  id: 'string'
}

export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

type OmitUser = Omit<User, 'token' | 'refreshToken'>
export type UserInfo = OmitUser & {
  /** 关注 */
  likeNumber: number
  /** 收藏 */
  collectionNumber: number
  /** 积分 */
  score: number
  /** 优惠券 */
  couponNumber: number
  orderInfo: {
    /** 待付款 */
    paidNumber: number
    /** 待发货 */
    receivedNumber: number
    /** 待收货 */
    shippedNumber: number
    /** 已完成 */
    finishedNumber: number
  }
}

export type Patient = {
  name: 'string'
  idCard: 'string'
  // 默认患者0 不是默认患者1
  defaultFlag: 0 | 1
  // 1男 0女
  gender: 0 | 1
  genderValue?: 'string'
  age?: 0
  id?: 'string'
}[]

export type add = {
  name: string
  idCard: number | string
  gender: 0 | 1
  defaultFlag: 1 | 0
  id?: string
}
