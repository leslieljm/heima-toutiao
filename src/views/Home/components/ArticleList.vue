<template>
  <div class="article">
    <!-- @load事件：滚动条与底部距离小于offset值时的时候触发 -->
    <!-- offset：规定滚动条距离底部多少的时候触发load事件，默认值是300(px) -->
    <!-- immediate-check：初渲染的时候是否执行load事件，默认值是true -->
    <!-- loading：loading为true时，load事件不会触发；loading为false时，load事件会触发；loading会在load事件执行后，被van-list组件自动设置为true，所以要在load事件里的最后手动把loading改为false -->
    <!-- finished：Boolean，如果为false，load事件会被触发，如果为true，load事件不会再被触发了，并且显示finished-text的文本 -->
    <!-- error：boolean。是否加载失败，加载失败后点击错误提示可以重新触发load事件，必须使用sync修饰符 -->
    <!-- error-text：加载失败后的提示文案 -->
    <!-- List 组件可以与 PullRefresh 组件结合使用，实现下拉刷新的效果。 -->
    <!-- 下拉刷新，其实就是把加载的下一页的数据放到之前的数据的前面。所以可以复用加载下一页数据的函数，在里面进行逻辑判断 -->
    <!-- refreshLoading：refreshLoading为true时，@refresh事件不会触发；refreshLoading为false时，@refresh事件会触发；refreshLoading会在@refresh事件执行后，被van-list组件自动设置为true，所以要在@refresh事件里的最后手动把refreshLoading改为false -->
    <!-- @refresh：下拉刷新的时候会触发该事件，vant组件会自动把v-model绑定的refreshLoading改为true -->
    <van-pull-refresh v-model="refreshLoading" @refresh="getNextPageArticle">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多文章了~"
        @load="getNextPageArticle"
        offset="100"
        :immediate-check="false"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <article-item
          v-for="item in articles"
          :key="item.art_id"
          :article="item"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
// 引入API
import { getArticlesAPI } from '@/api'
// 引入ArticleItem组件
import ArticleItem from './ArticleItem'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    // 接收父组件传过来的频道id
    // 两个类型用数组包起来
    id: [String, Number]
  },
  data() {
    return {
      articles: [],
      preTimeStamp: '',
      loading: false,
      finished: false,
      error: false,
      refreshLoading: false
    }
  },
  created() {
    this.getFirstPageArticle()
  },
  methods: {
    // 发送请求,拿到第一页文章的详情数据
    async getFirstPageArticle() {
      try {
        // 传两个参数:频道的id,当前时间戳
        // 当前时间戳:+new Date()   或者   Date.now()
        const { data } = await getArticlesAPI(this.id, +new Date())
        this.articles = data.data.results
        // 保存下一页的时间戳，用于分页
        this.preTimeStamp = data.data.pre_timestamp
      } catch (error) {
        // 代码错误,上抛错误;400,以中文上抛错误;507,原封不动上抛错误
        const status = error.response?.status // 如果写成error.response.status,若error.response不存在,会报错;写成error.response?.status,如果 ? 前面是 undefined，不会报错，并且会抛出 undefined 值
        if (!error.response || status === 507) {
          throw error
        } else {
          if (status === 400) {
            // 400,以中文上抛错误.新建一个错误对象上抛
            throw new Error(error.response.data.message)
          }
        }
      }
    },
    async getNextPageArticle() {
      try {
        // 故意出错
                if (Math.random() < 0.5) {
                    throw new Error()
                }

        // 1. 发送请求
        const { data } = await getArticlesAPI(this.id, this.preTimeStamp)
        // 如果为最后一页(pre_timestamp为null)，就把finished设置为true，就不会再触发load事件了
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        // 2. 添加到articles
        // 如果是下滑加载，将数据放在最后。下滑加载的时候，vant组件会自动把loading改为true，以此来作为判断条件
        // 如果是下拉刷新，将数据放在最前面
        if (this.loading) {
          this.articles.push(...data.data.results)
        } else {
          this.articles.unshift(...data.data.results)
        }
        // 3. 更新时间戳
        this.preTimeStamp = data.data.pre_timestamp
      } catch (error) {
        // 对错误进行处理
        this.error = true
      } finally {
        // finally里的语句不管try成功与否都一定会执行
        // 4. 无论try里面的请求成功还是出错都要更改loading和refreshLoading，让load事件可以继续被触发。因为在下滑加载/或者下拉刷新的时候，vant组件会自动把loading或者refreshLoading改为true
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
/* 如何让盒子拥有自己的滚动条
   - 1. 定高；2. overflow: auto/ scroll/ overlay */
.article {
  height: calc(100vh - 92px - 83px - 100px);
  overflow: auto;

      /* 伪元素：
    &  代表当前元素它爹
    ::-webkit-scrollbar：滚动条的槽
    ::-webkit-scrollbar-thumb：滚动的滑块 */
      // 这里的&代表.article
      &::-webkit-scrollbar {
        width: 10px;
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #3296fa;
        border-radius: 10px;
      }
}
</style>
