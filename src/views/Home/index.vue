<template>
  <div>
    <!-- 搜索框 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button icon="search" size="small" round block>搜索</van-button>
      </template>
    </van-nav-bar>
    <!-- 频道及文章展示 -->
    <!-- active:高亮的tab的索引 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
    <van-tabs v-model="active" swipeable>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 文章详情 -->
        <article-list :id="item.id"></article-list>
      </van-tab>

      <span class="toutiao toutiao-gengduo" @click="isShow = true"></span>
    </van-tabs>

    <!-- 弹出层：van-popup -->
    <!-- 设置 closeable 属性后，会在弹出层的右上角显示关闭图标 -->
    <!-- close-icon-position：关闭图标位置，可选值为top-left bottom-left bottom-right -->
    <van-popup
      v-model="isShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <!-- 把<van-popup>改成双标签，里面的内容就是显示在弹出层里的内容 -->
      <!-- 因为编辑频道组件里面的我的频道和首页的频道数据是联动一致的，所以把首页的channels数据传过去 -->
      <!-- 如果接收的组件props里写成小驼峰形式，这里传的时候可以写成短横线形式 -->
      <!-- 高亮的active值和频道的索引号是对应的，所以需求：频道编辑组件里未编辑状态下点击频道关闭弹窗并切换频道，要实现这个需求要把点击的频道的索引传过来作为active的值 -->
      <channel-edit
        v-if="isShow"
        :my-channels="channels"
        @change-active=";[(isShow = false), (active = $event)]"
        @del-channel="delChannel"
        @add-channel="addChannel"
      ></channel-edit>
      <!-- 自定义删除频道事件和添加频道事件子组件触发 -->
    </van-popup>
  </div>
</template>
<script>
// 扩展知识
// 1. ?? 【空值合并运算符】,相当于 ||,||常用于括号当中,??常用于语句当中
// 2. ?.【可选链操作符】 if (error.response?.status===400){...} es11语法，  如果 ? 前面是 undefined，就不会报错，并且会抛出 undefined 值

// 引入API
import { getChannelAPI, delChannelAPI, addChannelAPI } from '@/api'
// 引入组件
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,
      channels: [],
      isShow: false
    }
  },
  created() {
    this.initChannels()
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  methods: {
    ...mapMutations(['SET_MY_CHANNELS']),
    // 获取我的频道数据的逻辑：
    // - 1. 如果登录了
    //   - channels应该发请求获取用户自己的频道
    // - 2. 未登录
    //   - 1) 若本地存储里我的频道有数据，我的频道用本地存储的数据
    //   - 2) 若本地存储里我的频道没有数据，发请求获取默认的频道数据
    initChannels() {
      if (this.isLogin) {
        this.getChannel()
      } else {
        // 获取本地存储的数据
        const myChannels = this.$store.state.myChannels
        if (myChannels.length === 0) {
          this.getChannel()
        } else {
          this.channels = myChannels
        }
      }
    },
    async getChannel() {
      try {
        const { data } = await getChannelAPI()
        this.channels = data.data.channels
      } catch (error) {
        // 代码的错误,给程序员提示;axios状态码为507,提示用户刷新
        if (!error.response) {
          throw error
        } else {
          // axios封装的error对象
          // error.response.status  后端返回的状态码
          // error.response.data  后端返回的数据
          const status = error.response.status
          // 把&&换成??(空值合并运算符)是一样的:当status === 507为真的时候执行下一条语句.&&常用于括号当中,??常用于语句当中
          status === 507 && this.$toast.fail('服务端异常,请刷新')
        }
      }
    },
    // 两套系统：
    // - 用户登录了：我的频道是用户自己的频道信息，我们应该把我的频道数据 持久化到线上的服务器(发送请求)
    // - 未登录：我的频道是默认的频道信息，我们应该把我的频道数据 持久化到本地存储
    async delChannel(id) {
      // 启示：对于删除或者添加操作都要进行两步：后端发送请求删除添加+前端视图删除添加。这样可以减少发送请求，如果只进行后端操作，就会要在操作后再发送请求去请求数据。
      // 一定要先写后端再写前端，后端成功前端才进行操作，后端不成功前端不进行操作
      try {
        // 删除后最新的我的频道
        const newChannels = this.channels.filter((item) => item.id !== id)
        if (this.isLogin) {
          // 用户登录了：我的频道是用户自己的频道信息，我们应该把我的频道数据 持久化到线上的服务器(发送请求)
          // 1. 发送请求（后端）删除频道
          await delChannelAPI(id)
        } else {
          // 未登录：我的频道是默认的频道信息，我们应该把我的频道数据 持久化到本地存储
          // 未登录把我的频道存到本地存储
          // - 1. 在vuex的state里声明一个变量等着去接收我的频道
          // - 2. 在vuex的mutations里创建一个函数去把我的频道给到/修改该变量
          // - 3. 利用vuex-persistedstate插件持久化到本地存储
          this.SET_MY_CHANNELS(newChannels)
        }

        // 2. 视图层（前端）删除频道
        this.channels = newChannels
        this.$toast.success('删除频道成功~')
      } catch (error) {
        // 发送请求的错误(axios包装的错误对象)且状态码为401
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录再删除~')
        } else {
          // 其他错误让程序员知道
          throw error
        }
      }
    },
    async addChannel(channel) {
      try {
        if (this.isLogin) {
          // 用户登录了：我的频道是用户自己的频道信息，我们应该把我的频道数据 持久化到线上的服务器(发送请求)
          // 1. 发送请求（后端）添加频道
          // 第二个传的参数为告诉后端添加到我的频道数组的哪个位置(索引号)，由于后端的我的频道的数据和前端的是一样的，所以我们可以用前端的我的频道的数据的长度(this.channels.length)作为这个参数
          await addChannelAPI(channel.id, this.channels.length)
        } else {
          // 未登录：我的频道是默认的频道信息，我们应该把我的频道数据 持久化到本地存储
          // 未登录把我的频道存到本地存储
          // 把之前的我的频道的数组和添加的频道展开合并成最新的我的频道数组，存到本地存储
          this.SET_MY_CHANNELS([...this.channels, channel])
        }
        // 2. 视图层（前端）添加频道
        this.channels.push(channel)
        this.$toast.success('添加频道成功~')
      } catch (error) {
        // 发送请求的错误(axios包装的错误对象)且状态码为401
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录再添加~')
        } else {
          // 其他错误让程序员知道
          throw error
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.navbar {
  background-color: #3296fa;

  :deep(.van-nav-bar__title) {
    // inherit 继承  unset 不设置
    max-width: unset;
  }

  .van-button--default {
    background-color: #5babfb;
    border: 0;
    color: #fff;
    font-size: 30px;
  }

  .van-icon {
    color: #fff;
  }

  .van-button--block {
    width: 7.4rem;
  }
}

/* tabs导航条样式 */
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
</style>
