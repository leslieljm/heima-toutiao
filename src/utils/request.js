// 1. 下载axios: yarn add axios
// 2. 引入axios
// 3. 配置axios
import axios from 'axios'

/* axios.defaults.baseURL = 'http://toutiao.itheima.net'
axios.defaults.timeout = 5000 */

// 解决项目可能出现多个baseURL的问题:克隆axios
// const request = axios.create() 克隆axios.如果再有一个baseURL,只需要克隆一个然后导出就行了
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 5000
})
export default request
