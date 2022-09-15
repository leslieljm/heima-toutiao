<template>
    <div>
        <!-- 1. 静态结构 -->
        <van-cell v-for="(item, index) in highLightSuggestions" icon="search" @click="$emit('change-keywords', suggestions[index])">
            <template #title>
                <span v-html="item"></span>
            </template>
        </van-cell>
    </div>
</template>
<script>
// 2. 发送请求获取搜索建议数据
// 8. 利用第三方包lodash(js方法集)来实现防抖
// - 下载lodash：yarn add lodash
// - 按需引入debounce函数
// - 把需要防抖动的函数用debounce函数包一下：debounce(需要防抖动的函数, 延迟时间)

// 9. 处理包含关键词的字符高亮的问题：利用v-html指令渲染处理过后的数据
// - map()方法：返回新数组，长度和原数组一致，新数组每一项的值依赖于map()方法return后面返回的内容
// - 动态正则：正则可以变化
//   - /Anglar/ig 字面量形式的正则, 不能动态生成正则的内容
//   - new RegExp(a, 'ig')  第一个参数a为正则内容，可以为变量可以为字符串，第二个参数为正则修饰符(i是忽略大小写，g是全局匹配)
// - 字符串的replace(被替换的字符，替换的字符)方法，第一个参数可以传一个正则，第二个参数可以传一个函数，这个函数会拿到匹配到的结果，返回的结果作为替换的结果
import {getSuggestionsAPI} from '@/api'
import {debounce} from 'lodash'
export default {
    props: {
        keywords: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            suggestions: []
        }
    },
    // 3. 监听搜索框值的变化，发送获取搜索建议的请求。不能在created钩子里发送请求，因为created钩子只在组件初始化时调用一次
    watch: {
        keywords: {
            // 4. 写成完整对象形式开启立即监听。因为有一个bug：当输入了第一个字符时，在父组件里会决定渲染本SearchSuggestion组件，在本搜索建议组件里进行了初始化，并没有发生keywords的变化。所以要开启立即监听，一上来就执行一下handler函数
            immediate: true,
            handler: 'getSuggestions'
        }
    },
    computed: {
        highLightSuggestions() {
            // 创建一个当前关键词的正则
            const reg = new RegExp(this.keywords, 'ig')

            return this.suggestions.map((str) => {
                return str.replace(reg, (match) => {
                    return `<span style="color:red">${match}</span>`
                })
            })
        }
    },
    methods: {
        // 把函数用debounce函数包的时候，把函数写成完整形式
        getSuggestions: debounce(async function() {
            try {
                const {data} = await getSuggestionsAPI(this.keywords)
                console.log(data);
                // 5. 把数据给到组件循环渲染到页面上
                // 6. 处理一个后端的小bug：筛选掉为null/ undefined等的元素
                // 浏览器对象内置方法：Boolean()，会返回传的参数的Boolean值
                // 下面的写法可以更优雅：this.suggestions = data.data.options.filter(Boolean)。因为filter方法就是会调用里面的函数，然后往里面的函数传数组的每一项作为参数，里面的函数会返回一个布尔值，而Boolean()方法就是一个函数，filter把数组的每一项传给Boolean()方法，Boolean()方法返回一个布尔值，合并同类项
                this.suggestions = data.data.options.filter((item) => Boolean(item))
            } catch (error) { 
                // 7. 处理失败情况
                if (error.response) {
                    this.$toast.fail('获取搜索建议失败')
                } else {
                    throw error
                }
            }
        }, 300)
    }
}
</script>
<style lang="">
    
</style>