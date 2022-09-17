<template>
    <div>
        <!-- 顶部导航 -->
        <van-nav-bar
          title="更新昵称"
          left-text="取消"
          right-text="保存"
          left-arrow
          @click-left="onClickLeft"
          @click-right="onClickRight"
        />
        <!-- 修改昵称区域 -->
        <van-field
          ref="updateNickname"
          v-model="updateNickname"
          rows="2"
          autosize
          type="textarea"
          maxlength="11"
          show-word-limit
        />
    </div>
</template>
<script>
import {updateUserInfoAPI} from '@/api'
export default {
    props: {
        nickname: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            updateNickname: ''
        }
    },
    created() {
        this.updateNickname = this.nickname
    },
    methods: {
    onClickLeft() {
        this.$parent.$parent.isShowNickname = false
    },
    async onClickRight() {
      try {
        await updateUserInfoAPI({name: this.updateNickname})
        this.$emit('update:nickname', this.updateNickname)
        this.$parent.$parent.isShowNickname = false
        this.$toast.success('更新昵称成功')
      } catch (error) {
        if (error.response && error.response.status === 401) {
            this.$toast.fail('更新昵称失败')
        } else {
            throw error
        }
      }
    },
  },
}
</script>
<style lang="">
    
</style>