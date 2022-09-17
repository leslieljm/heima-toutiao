<template>
  <div>
    <!-- 1. 静态结构 -->
    <!-- 个人信息导航栏 -->
    <!-- $router.back()返回上一浏览页 -->
    <van-nav-bar
      class="navbar"
      title="个人信息"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 信息修改 -->
    <!-- 2. 更改头像 -->
    <input
      type="file"
      hidden
      ref="file"
      accept=".jpg,.png,.pdf"
      @change="selectPhoto"
    />
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image round width="0.8rem" height="0.8rem" :src="avatar" />
    </van-cell>
    <!-- 2.2 更改头像的弹出层 -->
    <van-popup
      v-model="isShowPhoto"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 2.3 把更改头像的弹出层里的内容抽成一个组件 -->
      <!-- 绑定v-if指令，让update-avatar组件随着弹出层的弹出创建，随着弹出层的隐藏而销魂 -->
      <!-- .sync语法糖：相当于给子组件传递了一个avatar参数，并绑定了一个自定义事件'update:avatar' -->
      <update-avatar
        v-if="isShowPhoto"
        :photo="photo"
        :avatar.sync="avatar"
      ></update-avatar>
    </van-popup>
    <!-- 3. 修改昵称 -->
    <van-cell title="昵称" :value="name" is-link @click="isShowNickname = true">
    </van-cell>
    <!-- 3.1 更改昵称的弹出层 -->
    <van-popup
      v-model="isShowNickname"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-nickname :nickname.sync="name"></update-nickname>
    </van-popup>
    <!-- 4. 修改性别 -->
    <van-cell
      title="性别"
      :value="gender == 0 ? '男' : '女'"
      is-link
      @click="isShowGender = true"
    >
    </van-cell>
    <!-- 4.1 更改性别的弹出层 -->
    <van-popup
      v-model="isShowGender"
      position="bottom"
      :style="{ height: '45%' }"
    >
      <update-gender :gender.sync="gender"></update-gender>
    </van-popup>
    <!-- 5. 修改生日 -->
    <van-cell
      title="生日"
      :value="birthday"
      is-link
      @click="isShowBirthday = true"
    >
    </van-cell>
    <!-- 5.1 更改生日的弹出层 -->
    <van-popup
      v-model="isShowBirthday"
      position="bottom"
      :style="{ height: '45%' }"
    >
      <update-birthday :birthday.sync="birthday"></update-birthday>
    </van-popup>
  </div>
</template>
<script>
// 知识复习拓展：
// 原生js里input框type为file点击会出现选择文件框，这是windows...系统自带的
// 原生js里input框还有一个属性hidden，可以隐藏input框，等于display:none
// 原生js里input框还有一个属性accept：指定用户选择的文件类型，如 ".jpg,.pdf,.png"
// multiple属性可以让用户一次选择多张图片，这些图片文件对象都被保存在this.$refs.file.files数组里

// 2.4 更改头像逻辑：
//  - 1) 需求：点击更改头像栏出现选择文件框   实现：手动给一个input:file框，然后手动的触发其点击事件。vue通过ref和$refs来获取DOM
//  - 2) 获取用户选择的图片   实现：通过给input:file绑定change事件监听用户选择了图片的动作，再通过获取输入框的value值，来获取用户选择的图片。选择的文件被保存在了input:file的value属性上，保存的是文件的绝对路径。我们不用这个，我们用：
//     - this.$refs.file  该DOM对象上的files属性是一个数组，该数组保存的是用户选择的所有文件对象(就是选择的文件)。这些文件对象里实际存的是二进制数据，所以我们拿到文件对象后还要把file文件对象里的二进制数据转成img.src可识别的属性：把file对象转成base64
//  - 3) 将文件对象file转成base64。封装成一个返回promise对象的函数让更好的复用
//     - FileReader 插件：文件阅读器
//     - 创建一个文件阅读器：const fr = new FileReader()     文件阅读器调用readAsDataURL方法读文件：fr.readAsDataURL(file)    DataURL就是指base64文件   readAsDataURL()方法就是把文件读成base64文件   base64实际是一种编码方式
//     - 接收读取的结果：fr.onload = (e) => { e.target.result }   读文件是一个异步任务，所以我们给文件阅读器监听一下onload事件，绑定一个函数，当读文件的异步任务完成，这个函数就会被调用，e.target.result就是读的结果base64
//  - 4) 将转成的base64传递给子组件，子组件通过src属性将图片渲染到页面上。并打开弹窗
//  - 5) 利用第三方包cropper来做裁剪框：1. 下载包：yarn add cropperjs  2. 引入(别忘了还有css样式要引)...后面参照文档
//  - 6) 解决bug：不能连续选中同一张图片的bug，因为change事件监听不到     解决：在图片展示后，把input对象上的value属性清空
//  - 7) 解决bug：init()方法只在UpdateAvatar组件创建时mounted钩子里调用，
//  - 8) 更新用户的头像：发请求给服务器传裁剪的图片，服务器会返回图片的地址，把图片的地址更新到相应位置即可
// 发请求如果传参传对象，默认数据类型为二进制的JSON。浏览器会自动在请求头加上content-type数据类型，发请求时不需要我们加
// 发请求时，如果说后端要的是表单数据，就必须传表单数据，原生是用form表单提交表单数据的，但只能是get/post请求。
// 用axios发请求提交表单数据：FormData --> 通过js模拟表单数据：原生用form表单提交表单数据必须要有name和value
// const fm = new FormData()  fm.append(key, value)  key就相当于原生的name，value就相当于原生的value，这就是模拟
// 然后再通过axios改变请求方式发请求
import UpdateAvatar from './components/UpdateAvatar.vue'
import UpdateNickname from './components/UpdateNickname.vue'
import UpdateGender from './components/UpdateGender.vue'
import UpdateBirthday from './components/UpdateBirthday.vue'
import { getUserUpdateInfoAPI } from '@/api'
import { resolveToBase64 } from '@/utils'
export default {
  components: {
    UpdateAvatar,
    UpdateNickname,
    UpdateGender,
    UpdateBirthday
  },
  data() {
    return {
      isShowPhoto: false,
      isShowNickname: false,
      isShowGender: false,
      isShowBirthday: false,
      photo: '',
      avatar: '',
      name: '',
      gender: '',
      birthday: ''
    }
  },
  created() {
    this.getUserUpdateInfo()
  },
  methods: {
    async getUserUpdateInfo() {
      try {
        const { data } = await getUserUpdateInfoAPI()
        // console.log(data)
        this.avatar = data.data.photo
        this.name = data.data.name
        this.gender = data.data.gender
        this.birthday = data.data.birthday
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请先登录~')
        } else {
          throw error
        }
      }
    },
    async selectPhoto() {
      // 获取用户选择的图片
      //   console.log(this.$refs.file.value); // value属性值是一个绝对路径
      //   console.dir(this.$refs.file); // 该DOM对象上的files属性是一个数组，该数组保存的是用户选择的所有文件对象(就是选择的文件)，这些文件对象实际存的是二进制数据
      // 把file文件对象里的二进制数据转成img.src可识别的属性：把file对象转成base64
      const file = this.$refs.file.files[0]
      //   console.log(file);
      const base64 = await resolveToBase64(file) // await相当于调用.then方法，.then()方法里的成功的回调函数里返回了e.target.result
      //   console.log(base64);

      // 传递base64给子组件
      this.photo = base64
      // 打开弹窗
      this.isShowPhoto = true

      // 解决bug：不能连续选中同一张图片的bug
      this.$refs.file.value = '' // 在图片展示后，把input对象上的value属性清空
    }
  }
}
</script>
<style lang="less" scoped>
.navbar {
  background-color: #3396fc;

  :deep(.van-nav-bar__title) {
    color: #fff !important;
  }
  :deep(.van-icon) {
    color: #fff !important;
  }
}
</style>
