<template>
    <div>
        <!-- 1. 静态结构 -->
        <!-- 搜索历史标题 -->
        <van-cell title="搜索历史">
            <template #extra>
                <van-icon name="delete-o" v-if="!isEdit" @click="isEdit = true" />

                <div v-else>
                    <span @click="$store.commit('SET_HISTORIES', [])">全部删除</span>&nbsp;
                    <span @click="isEdit = false">完成</span>
                </div>
            </template>
        </van-cell>
        <!-- 搜索历史 -->
        <van-cell v-for="item in histories" :key="item" :title="item" @click="!isEdit && $emit('change-keywords', item)">
            <template #extra>
                <van-icon name="close" v-show="isEdit" @click="$store.commit('SET_HISTORIES', histories.filter(i => i !== item))"/>
            </template>
        </van-cell>
    </div>
</template>
<script>
// 3.核心部分：搜索历史。   启示：在vuex的函数里只进行存数据到state里，不要进行数据处理。对onSearch()方法的思考：要学会分析功能的复用性
// - 1) 搜索历史从哪里来，涉及到存搜索历史到本地存储
//   - 触发onSearch函数的时候保存搜索历史，所以在onSearch函数里保存搜索历史到本地存储：先保存到vuex，再通过vuex-persistedstate插件持久化state里的搜索历史数据到本地存储
//   - 注意一个小需求：存到本地的时候对搜索历史做去重，重的搜索历史在最前/上面
// - 2) 从vuex里拿到最新的搜索历史数据进行渲染
// 4. 实现全部删除功能：把vuex里存的搜索历史变成空数组
// 5. 实现单个删除功能：删除就是筛选，把筛选后得到的新的搜索历史数组存到vuex/本地
// 6. 点击搜索历史功能：其实就是更改输入框里的keywords，它的逻辑和onSearch()函数里的逻辑是一样的，所以直接调用onSearch()方法。但要注意必须是在非编辑删除状态下。
import {mapState} from 'vuex'
export default {
    data() {
        return {
            // 2. 实现搜索历史编辑状态切换
            // 用一个变量记录是否处于编辑状态
            isEdit: false
        }
    },
    computed: {
        ...mapState(['histories'])
    }
}
</script>
<style lang="">
    
</style>