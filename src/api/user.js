// user.js 它的划分是根据后端接口文档划分的
import request from '@/utils/request'

/**
 * 登录
 * @param {String} mobile 手机号
 * @param {Number} code 验证码
 * @returns Promise
 */
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}

/**
 * 发送验证码
 *  /v1_0/sms/codes/:mobile  :mobile的形式为路径参数,只需要把参数拼接上去即可
 * @param {String} mobile 手机号  路径参数
 * @returns Promise
 */
export const sendCodeAPI = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}
