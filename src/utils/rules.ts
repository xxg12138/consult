export const mobileRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
]

export const passwordRules = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码需8-24个字符' }
]

export const codeRules = [
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '验证码6个数字' }
]

export const nameRules = [
  { reqired: true, message: '请输入姓名' },
  { pattern: /^[\u4e00-\u9fa5]{2,16}$/, message: '中午2~16个字符' }
]

export const idCardRules = [
  { required: true, message: '请输入身份证号' },
  {
    pattern:
      /^[1-9]\d{5}(18|19|20)\d{2}(0\d|1[0-2])(0\d|1\d|2\d|3[01])\d{3}(\d|X)$/,
    message: '身份证号不正确'
  }
]
