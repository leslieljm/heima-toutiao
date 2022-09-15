<template>
  <div>
    <!-- 1.2 在手机端：点击搜索框会默认弹出键盘，在安卓手机中，键盘里会有一个确定按钮，点击确定搜索，但苹果手机没有，解决办法： -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <!-- 1. 搜索框 -->
    <form action="/">
      <van-search
        class="search"
        v-model.trim="keywords"
        background="#3396fc"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @focus="isShowSearchResults = false"
        @cancel="$router.push('/')"
      />
      <!-- 2.2 当显示搜索结果后，再聚焦搜索框显示搜索建议(此种情况就是搜索框有值但不允许显示搜索结果)，所以给搜索框绑定聚焦事件，让isShowSearchResults = false -->
    </form>
    <!-- 2. 搜索历史/搜索建议/搜索结果 -->
    <!-- 2.1 利用动态组件<component>来切换，用is属性来指定渲染哪个组件，属性值为组件名字符串 -->
    <!-- <search-history></search-history>
        <search-suggestion></search-suggestion>
        <search-results></search-results> -->
    <component
      :is="componentName"
      :keywords="keywords"
      @change-keywords="onSearch"
    ></component>
    <!-- 动态组件传参和普通组件写法一样，但动态组件传的参数和自定义事件，子组件都可以接收和触发自定义事件 -->
  </div>
</template>
<script>
// 3. 写搜索建议组件
// 4. 写搜索结果组件
// 5. 搜索框的取消按钮，点击回到首页
// 6. 实现的功能，点击搜索建议时，改变搜索关键词成建议的词条且进行了搜索切换成搜索结果组件
// - 实现注意点：1)搜索关键词是父组件传过去的，我们不能直接在子组件改传过去的props，所以通过自定义事件子向父传参，在父组件更改keywords
//              2)子向父传参的时候不能直接传item，因为item是highLightSuggestions处理过后的数据，所以用suggestions[index]，因为suggestions数组和highLightSuggestions数组长度一致可以用index
//              3)需求还要求进行了搜索，所以可以直接调用onSearch函数，在该函数里面更改keywords。
// 7. 写搜索历史组件
import SearchHistory from './components/SearchHistory.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
import SearchResults from './components/SearchResults.vue'

import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Search',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResults
  },
  data() {
    return {
      keywords: '',
      // 用于记录是否显示搜索结果
      isShowSearchResults: false
    }
  },
  computed: {
    // 把之前的搜索历史拿过来
    ...mapState(['histories']),
    componentName() {
      // 渲染搜索历史：搜索框的值为空
      // 渲染搜索建议：搜索框有值，并且不渲染搜索结果
      // 渲染搜索结果：触发搜索事件时
      if (this.keywords === '') {
        return 'SearchHistory'
      }
      if (this.isShowSearchResults) {
        return 'SearchResults'
      }
      return 'SearchSuggestion'
    }
  },
  methods: {
    ...mapMutations(['SET_HISTORIES']),
    // 触发onSearch函数：1. 用户手动敲回车；2. 点击了搜索建议
    onSearch(keywords) {
      // console.log(suggestionWords)
      // van-search提供的search事件本来默认就会向对应的函数传一个参数，参数为输入框里的值

      // 把keywords关键词存到本地存储：把之前的搜索历史histories数组拿过来，把新搜索的关键词放在之前的搜索历史histories数组前面，再存到本地存储
      //  - 存到本地存储怎么实现：先保存到vuex，再通过vuex-persistedstate插件持久化state里的搜索历史数据到本地存储
      //  - 一个小需求：存到本地的时候对搜索历史做去重，重的搜索历史在最前/上面
      //    - 实现去重：1. 把没有去重的数组放到new Set(arr)里；2. [...set]。Set数据结构会把后面重复数据的去掉，所以重的搜索历史就在最前/上面
      const distinctHistories = [...new Set([keywords, ...this.histories])]
      this.SET_HISTORIES(distinctHistories)
      this.keywords = keywords
      this.isShowSearchResults = true
    }
  }
}
</script>
<style lang="less" scoped>
// class和style属性的特殊
// - vue会自动帮你把class和style合并到组件的根节点上
.search {
  /* 属性选择器。在外面包一层，防止污染该组件内含有该属性的其他dom */
  [role='button'] {
    color: #fff;
  }
}
</style>
