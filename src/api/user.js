// user.js 它的划分是根据后端接口文档划分的
import request from '@/utils/request'
import store from '../store'

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

/**
 * 获取用户信息
 * @returns Promise
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/v1_0/user',
    // 目前学过的请求参数：
    // - 1. 查询参数
    // - 2. 请求体参数
    // - 3. 请求头参数：在headers里面写
    // - 4. 路径参数：直接跟在路径后，有:占位
    headers: {
      // 如果在的不是vue文件，不能用this.$store的话，通过手动引入vuex配置文件，拿到暴露出的store，就相当于this.$store
      Authorization: `Bearer ${store.state.tokenObj.token}`
    }
  })
}

/**
 * 上传图片。服务器会返回图片地址url
 * @param {*} file 裁剪过后的图片的file对象
 * @returns Promise
 */
export const uploadPhotoAPI = (file) => {
  const fm = new FormData()
  fm.append('photo', file)

  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: fm
  })
}

/**
 * 获取用户编辑信息
 * @returns Promise
 */
export const getUserUpdateInfoAPI = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

export const updateUserInfoAPI = (userInfo) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: userInfo
  })
}
