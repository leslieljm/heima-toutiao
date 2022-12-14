import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入字体图标
import '@/assets/fonts/iconfont.css'
// 引入vant全部组件和css
import Vant from 'vant'
import 'vant/lib/index.css'
// 引入flexible(做rem适配)
import 'amfe-flexible'

// console.log(store) // 相当于this.$store
// 注册使用vant组件库
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
