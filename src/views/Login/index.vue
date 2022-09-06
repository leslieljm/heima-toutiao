<template>
    <div>
       <!-- 头部导航 -->
       <!-- 改css样式可以通过添加类名来做，防止污染 -->
       <van-nav-bar
          title="登录"
          class="nav_bar"
        />
       <!-- 登录表单 -->
       <!-- van-field：输入框。text, password, 文本域-->
       <!-- v-model:用户输入的值.双向绑定数据 -->
       <!-- name属性:用于标识表单项.提交的数据,会提交给name的属性值 -->
       <!-- rules 是一个数组,里面是一个对象,可以写多条规则/对象:
        :rules="[{ required: 是否必选, message: '错误的提示信息'}, {pattern: 校验正则}, {trigger: 规则校验的触发时机/事件(onChange, onBlur) }]" -->
       <van-form @submit="onSubmit" class="form">
        <van-field
          v-model="mobile"
          name="mobile"
          placeholder="请输入手机号"
          :rules="[{ required: true, message: '请输入手机号' },
          {pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, message: '手机格式错误'}]"
        >
        <template #label>
            <span class="toutiao toutiao-shouji"></span>
        </template>
        </van-field>
        <van-field
          v-model="code"
          name="code"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请输入验证码' },
           {pattern: /[0-9]{6}/, message: '验证码格式错误'}]"
        >
        <template #label>
            <span class="toutiao toutiao-yanzhengma"></span>
        </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            mobile: '',
            code: '',
        }
    },
    methods: {
    onSubmit(values) {
      console.log('submit', values);
    },
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
</style>