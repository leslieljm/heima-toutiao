<template>
  <div>
    <!-- 头部导航 -->
    <!-- 改css样式可以通过添加类名来做，防止污染 -->
    <van-nav-bar title="登录" class="nav_bar" />
    <!-- 登录表单 -->
    <!-- van-field：输入框。text, password, 文本域-->
    <!-- v-model:用户输入的值.双向绑定数据 -->
    <!-- name属性:用于标识表单项.提交的数据,会提交给name的属性值 -->
    <!-- rules 是一个数组,里面是一个对象,可以写多条规则/对象:
        :rules="[{ required: 是否必选, message: '错误的提示信息'}, {pattern: 校验正则}, {trigger: 规则校验的触发时机/事件(onChange, onBlur) }]" -->
    <van-form @submit="onSubmit" class="form" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #label>
          <span class="toutiao toutiao-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <!-- 字体图标插槽 -->
        <template #label>
          <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        <!-- 发送验证码按钮插槽 -->
        <template #button>
          <!-- 发送验证码按钮, 形成互斥的效果 -->
          <!-- 在表单中，除了提交按钮外，可能还有一些其他的功能性按钮，如发送验证码按钮。在使用这些按钮时，要注意将native-type设置为button，否则会触发表单提交。 -->
          <!-- 这个问题的原因是浏览器中 button 标签 type 属性的默认值为submit -->
          <van-button
            native-type="button"
            size="small"
            round
            class="code-btn"
            v-if="isShowCodeBtn"
            @click="sendCode"
            >获取验证码</van-button
          >
          <!-- vant倒计时 -->
          <van-count-down
            :time="60 * 1000"
            format="ss秒"
            v-else
            @finish="isShowCodeBtn = true"
          />
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
// token 身份证 标识用户
// 用处: 标识用户是否登录了
// token不能存在本地储存里,因为本地存储的数据没有响应式
// 存放在vuex里, vuex里的数据是有响应式的,因为是用vue写的
// vue相当于vue项目的数据仓库,里面的数据是有响应式的

// 引入表单验证规则, 这样引用以后不能直接用,一定要在data里面注册
import { mobileRules, codeRules } from '@/views/Login/rules'
// 引入api
import { login, sendCodeAPI } from '@/api'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCodeBtn: true
    }
  },
  methods: {
    // vant的submit事件只有在表单校验通过以后才能触发
    // vant表单的submit事件会自动验证表单
    async onSubmit() {
      // console.log('submit', values)

      // 正在登录的提示
      // message: 提示文案
      // forbidClick: 禁止点击
      // duration: 展示的时长, 为0会一直展示, 因为toast提示只能展示一个,后面再出现toast提示会把它顶掉让它停止.也可以用this.$toast.clear()方法手动清掉
      this.loading()
      try {
        // 登录
        const { data } = await login(this.mobile, this.code)
        // 将登录后服务端响应回来的数据存入vuex
        this.SET_TOKEN(data.data)
        // 先跳路由页面再显示提示
        this.$router.push('/profile')
        // 成功的提示
        this.$toast.success('登录成功')
      } catch (error) {
        // 细分失败的情况: 如果是手机号或者验证码错了,用户能知道
        // error的两种情况: 1. js原生错误/代码错误  浏览器抛出
        //                 2. 请求错误: axios封装的error(Promise reject的结果)对象
        // axios封装的error对象分析:
        //  - error.response.data 后端返回的数据
        //  - error.response.status 后端返回的状态码

        //  如果是 请求错误: error是axios封装的error对象, 让用户知道
        if (error.response && error.response.status === 400) {
          // 失败的提示
          this.$toast.fail(error.response.data.message)
        } else {
          // 如果是 1. 代码错误, 2. 507 : 让程序员自己知道, 可以打印, 可以抛出
          // 打印错误对象用console.dir(), console.log()打印的是字符串
          console.dir(error)
          // throw error
          // 手动清掉toast提示
          this.$toast.clear()
        }
      }
    },
    // 封装this.$toast.loading()方法
    loading() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
    },
    async sendCode() {
      // 0. 验证用户是否输入有效的手机号
      // vant表单的validate方法: 验证表单，支持传入 name 来验证单个或部分表单项
      //  - 1. 给整个form表单绑定ref
      //  - 2. 调用this.$refs.form.validate(), 会返回一个Promise对象
      await this.$refs.form.validate('mobile')

      this.loading()
      // 1. 发送请求
      try {
        await sendCodeAPI(this.mobile)
        // 2. 显示倒计时组件. 如果出现错误,就会直接进入catch里面的代码,就不会显示倒计时,所以写在这里
        this.isShowCodeBtn = false
        this.$toast.success('发送验证码成功')
      } catch (error) {
        //  如果是 请求错误: error是axios封装的error对象, 让用户知道
        if (
          error.response &&
          (error.response.status === 429 || error.response.status === 404)
        ) {
          this.$toast.fail(error.response.data.message)
        } else {
          // 如果是代码错误: 让程序员自己知道, 可以打印, 可以抛出
          // 手动清掉提示
          this.$toast.clear()
          throw error
        }
      }
    },
    ...mapMutations(['SET_TOKEN'])
  }
}
</script>
<style scoped lang="less">
/* scoped 样式作用于当前的组件
   若想在当前/一个组件修改另一个组件的样式，利用深度穿透：
   :deep(选择器) 深度选择器。是vue-cli脚手架提供的语法*/
.nav_bar {
  background-color: #3296fa;
}

/* 在当前组件修改vant组件的样式。vant组件库，里面有很多组件 */
:deep(.van-nav-bar__title) {
  color: #fff;
}

:deep(.form) {
  .van-cell__title {
    flex: 1;
  }
  .van-cell__value {
    flex: 20;
  }
  .toutiao {
    font-size: 40px;
  }
}

.code-btn {
  height: 0.64rem;
  background-color: #eee;
  color: #917b66;
}
</style>
