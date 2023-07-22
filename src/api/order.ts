import request from '@/utils/request'
import { Logistics } from '@/types/order.d.ts'
// 获取药品订单物流信息
export const getMedicalOrderLogistics = (id: string) =>
  request.get<Logistics>(`/patient/order/${id}/logistics`)
