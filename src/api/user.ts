import request from '@/utils/request'
import type { User, CodeType, UserInfo, Patient, add } from '@/types/user'

export const login = (mobile: string, password: string) =>
  request.post<User>('login/password', { mobile, password })

export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request.get<{ code: string }>('/code', {
    params: { mobile, type }
  })
}

export const loginByMobile = (mobile: string, code: string) => {
  return request.post<User>('/login', { mobile, code })
}

export const getUserInfo = () => {
  return request.get<UserInfo>('/patient/myUser')
}

export const getPatientList = () => {
  return request.get<Patient>('/patient/mylist')
}

export const addPatient = (data: add) => {
  return request.post('patient/add', data)
}

export const editPatient = (data: add) => {
  return request.put('/patient/update', data)
}

export const delPatient = (id: string) => {
  return request.delete(`/patient/del/${id}`)
}
