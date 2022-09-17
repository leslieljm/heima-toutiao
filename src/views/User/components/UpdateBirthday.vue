<template>
    <div>
      <van-datetime-picker
      v-model="pickDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
    </div>
</template>
<script>
import {updateUserInfoAPI} from '@/api'
export default {
    props: {
        birthday: {
            type: String,
            required: true
        }
    },
    data() {
        return {
          minDate: new Date(1990, 2, 1),
          // 这里new Date()里不传值就是现在的时间
          maxDate: new Date(),
          pickDate: '',
        }
    },
    created() {
        const arr = this.birthday.split('-')
        this.pickDate = new Date(arr[0], arr[1] - 1, arr[2])
    },
    methods: {
    onCancel() {
        this.$parent.$parent.isShowBirthday = false
    },
    async onConfirm(value) {
      // console.log(value.getFullYear()); // 获取的value是选择的时间的Date实例对象，即new Date(选择的时间)
      try {
        const birthdayDate = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`
        await updateUserInfoAPI({birthday: birthdayDate})
        this.$emit('update:birthday', birthdayDate)
        this.$parent.$parent.isShowBirthday = false
        this.$toast.success('更新生日成功')
      } catch (error) {
        if (error.response && error.response.status === 401) {
            this.$toast.fail('更新生日失败')
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