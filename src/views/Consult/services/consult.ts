import request from '@/utils/request'
import type {
  Image,
  ConsultOrderPreParams,
  ConsultOrderPreData,
  PartialConsult
} from '@/types/consult'
import type { Patient } from '@/types/user'
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  console.log(fd)

  return request.post<Image>('/upload', fd)
}
// 拉取预支付订单信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) => {
  return request.get<ConsultOrderPreData>('/patient/consult/order/pre', {
    params
  })
}
// 查询患者详情
export const getPatientDetail = (id: string) =>
  request<Patient>(`/patient/info/${id}`)

// 生成订单
export const createConsultOrder = (data: PartialConsult) =>
  request.post<{ id: string }>('/patient/consult/order', data)

export const getConsultOrderPayUrl = (data: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => {
  return request.post('/patient/consult/pay', data)
}
