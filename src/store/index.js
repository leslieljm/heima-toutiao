import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// 作业： 封装本地存储

// vuex-persistedstate插件 --> 持久化state到本地存储
// 1. 下载：yarn add vuex-persistedstate@3.2.1
// 2. 引入：import createPersistedState from 'vuex-persistedstate'
// 3. 调用：插件导出的都是函数，要调用一下：plugins: [createPersistedState()],
// 4. 插件配置项：
//  - key: 默认值是vuex
//  - storage: 存储的方式，默认值是本地存储
//  - reducer: 函数，return一个对象，对象就作为存储的value
//    - reducer函数接收/有一个参数是state，就是state数据

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'HEIMA_TOUTIAO',
      // storage: window.sessionStorage,
      reducer(state) {
        const { tokenObj, myChannels, histories } = state
        // return后 一定要加{}
        return { tokenObj, myChannels, histories }
      }
    })
  ],
  state: {
    // tokenObj: JSON.parse(window.localStorage.getItem('HEIMATOUTIAO_TOKEN')) || {}
    tokenObj: {},
    myChannels: [],
    histories: []
  },
  getters: {
    isLogin(state) {
      // 两次取反代表这个变量的布尔属性！！！如果直接return这个变量，return的是这个变量的值
      return !!state.tokenObj.token
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      // 将token存到vuex
      state.tokenObj = token
      // token持久化：本地存储
      // window.localStorage.setItem('HEIMATOUTIAO_TOKEN', JSON.stringify(token))
    },
    /**
     * 把删除或者添加后的最新的channels频道数组存到vuex
     * @param {*} channels 删除或者添加后的最新的channels频道数组
     */
    SET_MY_CHANNELS(state, channels) {
      state.myChannels = channels
    },
    /**
     * 把删除或者添加以后的新的搜索历史数组存到vuex
     * @param {Array} histories 删除或者添加以后的新的搜索历史数组
     */
    SET_HISTORIES(state, histories) {
      state.histories = histories
    }
  }
})
