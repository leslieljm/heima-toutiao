<template>
    <div>
       <article-item v-for="item in articles" :key="item.art_id" :article="item"></article-item>
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
            articles: []
        }
    },
    created() {
        this.getFirstPageArticle()
    },
    methods: {
        // 发送请求,拿到当前文章的详情数据
        async getFirstPageArticle() {
            try {
                // 传两个参数:频道的id,当前时间戳
                // 当前时间戳:+new Date()   或者   Date.now()
                const {data} = await getArticlesAPI(this.id, +new Date())
                this.articles = data.data.results
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
        }
    }
}
</script>
<style lang="">
    
</style>