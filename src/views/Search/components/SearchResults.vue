<template>
    <div class="search-results">
        <!-- 1. 静态结构 -->
        <!-- 通过v-model绑定loading，loading默认值为false -->
        <!-- 之前都是获取第一页数据和下滑加载下一页数据分开写，这里利用immediate-check属性为true让页面一创建就调用load事件把获取第一页数据和下滑加载下页数据合在一起 -->
        <van-list v-model="loading" @load="getSearchResults" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="请求失败，点击重新加载">
            <van-cell :title="item.title" v-for="item in searchResults" :key="item.art_id" @click="$router.push( {path: '/detail', query: {articleId: item.art_id}})">
            </van-cell>
        <!-- 7. 点击文章(cell单元格)会带着文章id(articleId)跳转到文章详情页('/detail')：路由传参 -->
        </van-list>
    </div>
</template>
<script>
// 2. 发送请求获取搜索结果
// 3. 同时，html结构里利用van-list的下滑加载功能做分页效果
import {getSearchResultsAPI} from '@/api'
export default {
    props: {
        //动态组件传参：一次传参，多次使用
        keywords: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            page: 1,
            perPage: 10,
            searchResults: [],
            finished: false,
            error: false
        }
    },
    methods: {
        // 2. 发送请求获取搜索结果
        async getSearchResults() {
            try {
                /* // 故意出错
                if (Math.random() < 0.5) {
                    throw new Error()
                } */
                // 发送请求获取搜索结果
            const {data} = await getSearchResultsAPI(this.page++, this.perPage, this.keywords)
            const results = data.data.results
            // 4. 解决一个bug：load事件是滚动条触底触发，当数据较少，滚动条出不来就相当于一直触底，load事件会一直触发发请求，利用finished属性来解决，searchResults为空数组的时候，把finished设置为true，finished为true不再触发load事件
            if (results.length === 0) {
                this.finished = true
            }
            // 保存搜索结果数据
            // this.searchResults.push(...results)
            this.searchResults = [...this.searchResults, ...results]
            } catch {
                // 5. 用van-list的error属性进行错误处理
                this.error = true
            } finally {
                // 无论出不出错finally语句都会执行，把loading改为false
                this.loading = false
            }
            
        }
    }
}
</script>
<style lang="less" scoped>
/* 6. 让头部导航栏固定：就是让搜索结果盒子有自己的滚动条：定高+overflow:auto/scroll/overlay，（overlay和overflow基本一样） */
.search-results {
    height: calc(100vh - 108px);
    overflow: auto;
}
</style>