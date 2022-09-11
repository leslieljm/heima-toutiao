import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 单页面应用(SPA)
// 性能优化：懒加载路由页面
// 首屏加载速度很慢，因为打包时所有的页面都打包到app.vue，加载的时候要把所有的页面都请求加载过来
// 解决这个问题可以使用 路由懒加载：使用到了路由页面，再去请求它
// - route对象里component使用一个函数，函数里返回import函数的调用，import函数的调用会返回对应的组件

// Chunk：项目打包后，一个或多个模块的集合。(在这个案例里一个路由模块打包成一个js文件(app.js(多个模块的集合)/ video.js))，这个js文件就是一个Chunk)。做了懒加载，项目打包后的app.js是不包括其他路由Chunk的，使用到了路由页面，再去请求它
// 懒加载的Chunk 默认的名字是模块的路径
// 通过魔法注释改名：/* webpackChunkName: "新名字" */
// webpackChunkName魔法注释：可以把一些Chunk合并(把名字设置成相同的)，这样可以减少请求的次数
const routes = [
  {
    path: '/',
    // 如果不重定向，从别处切到首页不生效，因为浏览器解析时会把空格去掉，则进的是根目录('/')，且我们打开网页时打开的是网页根路径，而我们的需求是默认就是在首页，所以给根路径一个重定向解决这个问题
    redirect: '/ ',
    component: () => import('@/views/Layout'),
    children: [
      {
        path: '/ ',
        component: () => import('@/views/Home')
      },
      {
        path: '/video',
        component: () => import(/* webpackChunkName: "base" */ '@/views/Video')
      },
      {
        path: '/qa',
        component: () => import(/* webpackChunkName: "base" */ '@/views/QA')
      },
      {
        path: '/profile',
        component: () => import('@/views/My')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  routes
})

export default router
