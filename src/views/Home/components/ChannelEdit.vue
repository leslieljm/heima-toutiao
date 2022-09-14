<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <!-- 标题 -->
    <van-cell title="我的频道">
      <!-- 宽高最好不要用行内样式写，否则不能进行媒体适配 -->
      <van-button
        size="mini"
        round
        style="color: red; border-color: red"
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 频道：用<van-grid>写 -->
    <div class="my-pannel">
      <!-- gutter：格子之间的间距，默认单位为px -->
      <van-grid gutter="10" :border="false">
        <!-- x号图标用icon写，用定位定到右上角 -->
        <!-- 如果不是编辑状态，让icon属性值为''空字符串，就不会渲染了 -->
        <!-- 是编辑状态并且频道名不是推荐才显示x号图标 -->
        <van-grid-item
          v-for="(item, index) in myChannels"
          :key="item.id"
          :text="item.name"
          :icon="isEdit && item.name !== '推荐' ? 'cross' : ''"
          :class="{ active: item.name === '推荐' }"
          @click="handleMyChannel(item, index)"
        />
      </van-grid>
    </div>
    <!-- 推荐频道 -->
    <!-- 标题 -->
    <van-cell title="推荐频道"> </van-cell>
    <!-- 频道：用<van-grid>写 -->
    <div class="recommend-pannel">
      <!-- gutter：格子之间的间距，默认单位为px -->
      <van-grid gutter="10" :border="false">
        <!-- x号图标用icon写，用定位定到右上角 -->
        <van-grid-item
          v-for="item in recommendChannels"
          :key="item.id"
          :text="item.name"
          icon="plus"
          @click="$emit('add-channel', item)"
        />
      </van-grid>
    </div>
  </div>
</template>
<script>
// 推荐频道的数据：通过所有频道的数据去掉我的频道的数据计算出来

// 引入API
import { getAllChannelsAPI } from '@/api'
export default {
  props: {
    myChannels: Array
  },
  data() {
    return {
      // 记录是否处于编辑状态
      isEdit: false,
      allChannels: []
    }
  },
  created() {
    this.getAllChannels()
  },
  computed: {
    recommendChannels() {
      // 推荐频道：所有频道 - 我的频道
      // filter返回值：数组
      return this.allChannels.filter((allChannelItem) => {
        // 所有频道 - 我的频道
        // 我的频道数组里面，看一下，有没有allChannelsItem，有return false
        // find方法：找得到返回那一项，找不到返回undefined
        return !this.myChannels.find(
          (myChannelItem) => myChannelItem.id === allChannelItem.id
        )
      })
    }
  },
  methods: {
    // 获取所有频道
    async getAllChannels() {
      const { data } = await getAllChannelsAPI()
      console.log(data)
      this.allChannels = data.data.channels
    },
    handleMyChannel({name, id}, index) {
        // 如果是编辑状态且频道不是推荐，就删除频道
        if (this.isEdit && name !== '推荐') {
          // 自定义删除事件子组件触发。把删除频道的id传给父组件去删除
          this.$emit('del-channel', id)
        } else {
            // 如果不是编辑状态或者是编辑状态但频道是推荐：1.关闭弹窗；2.切换频道
            this.$emit('change-active', index)
        }
    }
  }
}
</script>
<style lang="less" scoped>
.channel-edit {
  padding-top: 92px;
}

/* postcss插件无法把行内样式里的px转换成rem，所以宽高不要写在行内样式里 */
:deep(.edit-btn) {
  width: 100px;
  font-size: 25px;
}

:deep(.van-grid-item__content) {
  background-color: #f4f5f6;
}
// 我的频道
.my-pannel {
  // 编辑按钮居中
  .van-cell__value {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  // 关闭按钮样式
  :deep(.van-grid-item__content) {
    position: relative;

    .van-grid-item__content {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  :deep(.active) {
    .van-grid-item__text {
      color: red;
    }
  }
}
:deep(.van-icon-cross) {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 25px;
  transform: translate(20%, -35%);
  border: 0.02667rem solid #000;
  border-radius: 50%;
  text-align: center;
  line-height: 0.32rem;
}
// 推荐频道
.recommend-pannel {
  // 推荐频道加号样式
  :deep(.van-grid-item__content) {
    flex-direction: row;

    .van-grid-item__icon {
      font-size: 0.5rem;
    }

    .van-grid-item__text {
      margin-top: 0;
    }
  }
}
</style>
