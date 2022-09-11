<template lang="">
  <div class="profile">
    <!-- 头部 -->
    <header>
      <!-- 未登录的结构 -->
      <div class="login banner" v-if="isLogin">
        <van-row></van-row>
        <van-row>
          <van-col span="12">
            <van-row
              style="height: 100%"
              type="flex"
              justify="space-around"
              align="center"
            >
              <van-image
                round
                width="1.5rem"
                height="1.5rem"
                :src="userInfo.photo"
              />
              <span class="mobile">{{userInfo.name}}</span>
            </van-row>
          </van-col>

          <van-col span="5" offset="7">
            <!-- style="height: 100%"是相对于其父盒子，所以van-col高度一定要给 -->
            <van-row
              type="flex"
              justify="center"
              align="center"
              style="height: 100%"
            >
              <van-button size="small" round class="edit-btn"
                >编辑按钮</van-button
              >
            </van-row>
          </van-col>
        </van-row>

        <van-row>
          <van-grid class="grid" :border="false">
            <van-grid-item text="头条">
              <template #icon>{{userInfo.art_count}}</template>
            </van-grid-item>
            <van-grid-item text="粉丝">
              <template #icon>{{userInfo.fans_count}}</template>
            </van-grid-item>
            <van-grid-item text="关注">
              <template #icon>{{userInfo.follow_count}}</template>
            </van-grid-item>
            <van-grid-item text="获赞">
              <template #icon>{{userInfo.like_count}}</template>
            </van-grid-item>
          </van-grid>
        </van-row>
      </div>
      <!-- 登录状态的结构 -->
      <div class="logout banner" v-else @click="$router.push('/login')">
        <van-image width="1.76rem" height="1.76rem" :src="mobileSrc" />
        <span class="text">登录/注册</span>
      </div>
    </header>

    <!-- 主体 -->
    <main>
      <!-- clickable 相当于 :clickable="true"  点击反馈 -->
      <van-grid :column-num="2" clickable>
        <van-grid-item text="收藏">
          <template>
            <span class="toutiao toutiao-shoucang"></span>
          </template>
        </van-grid-item>
        <van-grid-item text="历史">
          <template>
            <span class="toutiao toutiao-lishi"></span>
          </template>
        </van-grid-item>
      </van-grid>

      <div class="link">
        <!-- 设置 is-link 属性后会在单元格右侧显示箭头，并且可以通过 arrow-direction 属性控制箭头方向。 -->
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </div>
    </main>

    <!-- 底部 -->
    <footer>
      <!-- block 是否为块级元素，开启该属性后和父级盒子一样宽 -->
      <van-button block style="color: red" v-if="isLogin" @click="logout"
        >退出</van-button
      >
    </footer>
  </div>
</template>
<script>
// van-image的坑  不识别相对路径和绝对路径，需要把图片模块先引进来(用require和es6模块化语法都可)然后再放到data里面使用，另外可识别外部路径
import { mapGetters } from 'vuex'
import mobileSrc from '@/assets/images/mobile.png'
// 引入API
import { getUserInfoAPI } from '@/api'
export default {
  name: 'My',
  data() {
    return {
      mobileSrc,
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters(['isLogin'])
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async logout() {
      await this.$dialog.confirm({
        title: '黑马头条',
        message: '是否确认退出该账号'
      })
      // 退出账号清除token
      this.$store.commit('SET_TOKEN', {})
    },
    // 获取用户信息
    async getUserInfo() {
      try {
        // 用户登录了才发起获取获取用户信息的请求
        // 如果网络请求错误，在网络/fetch里面去检查url和请求参数，如果url里出现了20%的文字，是url多了一个文档
        if (!this.isLogin) return

        const { data } = await getUserInfoAPI()
        this.userInfo = data.data
      } catch (error) {
        // error
        // 1. 代码错误导致的 2. 发请求导致的(axios包装的错误对象，error对象里会有response属性存在)
        // 代码错误和400, 507 给程序员提示；401给用户提示让重新登录
        if (error.response && error.response.status === 401) {
          this.$toast.fail('用户认证失败，请重新登录')
        } else {
          // 抛出错误，给程序员提示
          throw error
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.profile {
  background-color: #f5f7f9;
  /* 100vh 一屏高度 */
  height: 100vh;

  .link {
    margin: 10px 0;
  }

  .toutiao {
    font-size: 40px;
  }

  .toutiao-shoucang {
    color: red;
  }

  .toutiao-lishi {
    color: orange;
  }
}

/* background-size要想和background合写，必须有background-position */
/* vue的css样式里url可以识别 @ */
.banner {
  width: 100%;
  height: 5.3333rem;
  background: url('@/assets/images/banner.png') no-repeat 0 0 / cover;
}

.logout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.text {
  font-size: 30px;
  color: #fff;
  margin-top: 10px;
}

.login {
  display: flex;
  flex-direction: column;

  /* 最好不要用后代选择器，因为van-row里面还可以嵌套van-column，van-column还可以嵌套van-row，后代选择器会把后面的全都选上，最好用子代选择器 */
  > .van-row {
    flex: 1;
  }

  .mobile {
    color: #fff;
    font-size: 30px;
  }

  .van-col {
    height: 100%;
  }

  .edit-btn {
    height: 0.42667rem;
    color: #666;
  }
}

:deep(.grid) {
  color: #fff;
  .van-grid-item__content {
    font-size: 30px;
    background-color: inherit;
  }

  .van-grid-item__text {
    color: #fff;
  }
}
</style>
