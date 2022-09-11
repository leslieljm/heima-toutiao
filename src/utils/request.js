// 1. 下载axios: yarn add axios
// 2. 引入axios
// 3. 配置axios
import axios from 'axios'
import store from '@/store'

/* axios.defaults.baseURL = 'http://toutiao.itheima.net'
axios.defaults.timeout = 5000 */

// 解决项目可能出现多个baseURL的问题:克隆axios
// const request = axios.create() 克隆axios.如果再有一个baseURL,只需要克隆一个然后导出就行了
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 5000
})

// 需求：如果登录了，所有的请求都加上Authorization。当然也有接口是即使登录了也不需要带Authorization参数，后端接收参数是这样的，可以多传，但不能少传
// 请求拦截器
request.interceptors.request.use(function (config) {
  // 每一次发请求都会执行该函数
  // 该函数是关于在发送请求之前做些什么
  // console.log(config) // config是每一次请求的配置对象,可以对config进行修改后再return config
  // 如果登录了，所有的请求都加上Authorization
  const {
    getters: { isLogin },
    state: { tokenObj }
  } = store
  if (isLogin) {
    config.headers.Authorization = `Bearer ${tokenObj.token}`
  }
  // 必须返回config
  return config
})

export default request
