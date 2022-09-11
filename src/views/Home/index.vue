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

      <span class="toutiao toutiao-gengduo"></span>
    </van-tabs>
  </div>
</template>
<script>
// 扩展知识
// 1. ?? 【空值合并运算符】,相当于 ||,||常用于括号当中,??常用于语句当中
// 2. ?.【可选链操作符】 if (error.response?.status===400){...} es11语法，  如果 ? 前面是 undefined，就不会报错，并且会抛出 undefined 值
// 引入API
import { getChannelAPI } from '@/api'
// 引入组件
import ArticleList from './components/ArticleList.vue'
export default {
  components: {
    ArticleList
  },
  data() {
    return {
      active: 0,
      channels: []
    }
  },
  created() {
    this.getChannel()
  },
  methods: {
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
