<template>
  <div>
    <!-- <router-view></router-view> -->
    <div>{{count}}</div>
    <div>{{bigNum}}</div>
    <button @click="SET_COUNT(10)">点击count++</button>
  </div>
</template>
<script>
  // 一，
  // 1，本地提交代码和远程提交代码
  // git log 查看commit(提交到本地仓库)记录/日志
  // git status 查看当前仓库的状态。看到nothing to commit, working tree clean表明都已提交，没有可提交的内容了
  // git add . 提交到暂存区
  // git commit -m '消息'
  // - feat：新增特性
  // - style：样式的修改
  // - fixed：bug的修改(debug)
  // - comment：改了注释

  // git remote -v 查看此本地仓库连接的是哪一个远程仓库

  // 二，
  // 2. 下载vant：yarn add vant@latest-v2 -S
  // 3. 在main.js里引入vant全部组件和css
  // 4. 注册vant组件库：Vue.use(Vant)

  // 三，
  // rem适配
  // - 1. 让rem动起来：使用 [lib-flexible] 动态设置 REM 基准值（即设置html 标签的字体大小）
  //   - lib-flexible插件将1rem的值设置为1/10的视口的宽. 设置完毕后: width:0.2rem意思为: 不管什么分辨率下都是0.2个1/10视口宽的盒子.
  //   - 1.1 安装amfe-flexible插件：yarn add amfe-flexible
  //   - 1.2 在main.js里引入：import 'amfe-flexible'，package.json里面没有main字段的话，会自动去找index.js文件(是整个包/插件的入口)引入
  // - 2. 盒子使用rem
  //   - 自动的识别css中的px，并将其转成rem：用post-css，css的预处理器，vue脚手架已经帮我们配好了
  //   - 2.1 post-css 自己能干的事很少，需要下载它的生态插件：yarn add postcss-pxtorem
  //   - 2.2 告诉post-css，我们要使用这个插件：新建配置post-css的文件 .postcssrc.js

// 四, 准备和引入字体图标

// mapState --> 将vuex里的state里的数据映射到computed
// 使用
// - 1. 引入mapState: mapState是一个函数,会返回一个对象
// - 2. mapState函数里的参数: ['映射的属性']

// mapGetters --> 将vuex里的getters里的数据映射到computed
// 使用
// - 1. 引入mapGetters: mapGetters是一个函数,会返回一个对象
// - 2. mapGetters函数里的参数: ['映射的属性']

// mapMutations --> 将vuex里的mutations里的方法映射到methods
// 使用方法一样
import {mapState, mapGetters, mapMutations} from 'vuex'
// console.log(mapState(['count']));
export default {
    methods: {
      increment() {
        this.$store.commit('SET_COUNT', 10)
      },
      ...mapMutations(['SET_COUNT'])
    },
    computed: {
      ...mapState(['count']),  // 把调用mapState()函数返回的对象解构,把映射过来的count解构出来,count的值是一个函数(mapState函数把count包装成一个函数),这就在computed里放了一个count(){}函数,count就是该组件里的计算属性
      ...mapGetters(['bigNum'])
    }
}
</script>
<style>
  
</style>
