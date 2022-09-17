<template>
    <div>
      <van-picker
      title="更新性别"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      :default-index="gender"
    />
    </div>
</template>
<script>
import {updateUserInfoAPI} from '@/api'
export default {
    props: {
        gender: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            columns: ['男', '女']
        }
    },
    methods: {
      onCancel() {
        this.$parent.$parent.isShowGender = false
    },
    async onConfirm(value, index) {
      try {
        await updateUserInfoAPI({gender: index})
        this.$emit('update:gender', index)
        this.$parent.$parent.isShowGender = false
        this.$toast.success('更新性别成功')
      } catch (error) {
        if (error.response && error.response.status === 401) {
            this.$toast.fail('更新性别失败')
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