<template>
  <div class="update-avatar">
    <img :src="photo" alt="" ref="image" />
    <!-- 底部区域 -->
    <div class="toolbar">
      <span>取消</span>
      <span @click="confirm">完成</span>
    </div>
  </div>
</template>
<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { uploadPhotoAPI } from '@/api'
export default {
  props: {
    photo: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // new Cropper后，会生成新的结构放在原图片结构的地方，并把原图片结构隐藏掉。
    init() {
      this.myCropper = new Cropper(this.$refs.image, {
        viewMode: 1,
        dragMode: 'none',
        initialAspectRatio: 1,
        aspectRatio: 1,
        preview: '.before',
        background: false,
        autoCropArea: 0.6,
        zoomOnWheel: false
      })
    },
    // blob就是裁剪过后的图片的file对象,
    confirm() {
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        const { data } = await uploadPhotoAPI(blob)
        // 更新src
        this.$emit('update:avatar', data.data.photo)
        // 弹层
        this.$parent.$parent.isShowPhoto = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.update-avatar {
  background: #000;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 65%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 9999;
  }
  .toolbar {
    position: fixed;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
  }
}
</style>
