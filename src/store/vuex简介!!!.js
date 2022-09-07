import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// vuex 数据存放在vuex数据仓库里

// state:
//  - 变量/数据声明在state里
//  - 其他组件取: (this.)$store.state.属性名.  每个组件实例/vm身上都有一个属性$store

// mutations:
// vuex修改数据
// - vuex修改数据原则: 必须要通过vuex里mutations里的方法去修改
// - mutations: {函数, 函数...}
// - 规范: 函数命名采用大驼峰
// - 其他组件触发mutations里面的方法: this.$store.commit('mutations里的方法名', 参数)
//   - (this).$store.commit()方法里的参数:
//     - state: 数据
//     - payload: 载荷, 触发mutations里函数的参数

// getters: {函数, 函数}
// getters --> 相当于computed计算属性
// getters里的每个函数的第一个参数都是 state
// 其他组件取: (this.)$store.getters.函数名/计算属性名
export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    bigNum(state) {
      return state.count * 10
    }
  },
  mutations: {
    // 不能直接获取state,必须要传参传到函数里面去
    // 第一个参数只能固定传state,然后通过state.属性去获取使用. 后面只能再传一个参数,这个形参可以是其他变量名
    SET_COUNT(state, payload) {
      state.count += payload
    }
  }
})
