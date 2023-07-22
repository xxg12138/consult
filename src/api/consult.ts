import request from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  PageParams,
  DoctorPage,
  follow,
  TopDep,
  ConsultOrderListParams,
  ConsultOrderPage
} from '@/types/consult'

// export const getKnowledgePage = (params) => {
//   return request.get('/patient/home/knowledge', params)
// }

export const getKnowledgePage = (params: KnowledgeParams) => {
  return request.get<KnowledgePage>('patient/home/knowledge', { params })
}

export const getDoctorPage = (params: PageParams) => {
  return request.get<DoctorPage>('/home/page/doc', { params })
}

export const followOrUnfollow = (data: follow) => {
  return request.post('/like', { data })
}

export const getAllDep = () => {
  return request.get<TopDep[]>('dep/all')
}

export const getConsultOrderDetail = (orderId: string) => {
  return request.get('/patient/consult/order/detail', {
    params: {
      orderId
    }
  })
}

export const getPrescriptionPic = (id: string) => {
  return request.get<{ url: string }>(`/patient/consult/prescription/${id}`)
}

// 评价问诊
export const evaluateConsultOrder = (data: {
  docId: string
  orderId: string
  score: number
  content: string
  anonymousFlag: 0 | 1
}) => request.post<{ id: string }>('/patient/order/evaluate', data)

export const getConsultOrderList = (params: ConsultOrderListParams) => {
  return request.get<ConsultOrderPage>('/patient/consult/order/list', {
    params
  })
}
// 取消订单
export const cancelOrder = (id: string) =>
  request.put(`/patient/order/cancel/${id}`)

// 删除订单
export const deleteOrder = (id: string) =>
  request.delete(`/patient/order/${id}`)
