import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 单页面应用(SPA)
// 首屏加载速度很慢，因为打包时所有的页面都打包到app.vue，加载的时候要把所有的页面都请求加载过来
// 解决这个问题可以使用 路由懒加载：使用到了路由页面，再去请求它
// - route对象里component使用一个函数，函数里返回import函数的调用，import函数的调用会返回对应的组件
const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  routes
})

export default router
