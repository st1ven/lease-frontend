<template>
  <view class="login">
    <view class="login-title">
      登录机转转
    </view>
    <view class="login-form">
      <view class="login-form-item">
        <view class="login-form-item-icon">
          <u-icon name="phone" size="28"></u-icon>
        </view>
        <view class="login-form-item-input">
          <u-input class="input" v-model="model.mobile" style="font-size: 38rpx;" placeholder-style="font-size: 38rpx;"
            type="number" placeholder="请输入手机号" />
        </view>
      </view>
      <view class="login-form-item">
        <view class="login-form-item-icon">
          <u-icon name="chat" size="28"></u-icon>
        </view>
        <view class="login-form-item-input">
          <u-input class="input" v-model="model.code" style="font-size: 38rpx;" placeholder-style="font-size: 38rpx;"
            type="number" placeholder="请输入验证码" />
        </view>
        <view class="login-form-item-code">
          <u-button class="custom-style" ripple type="warning" @click="getCode" :disabled="codeTips !== 60">
            {{ codeTips === 60 ? '获取验证码' : codeTips + 's' }}
          </u-button>
        </view>
      </view>
      <!-- <view class="login-form-item">
        <view class="login-form-item-icon">
          <u-icon name="man-add" size="28"></u-icon>
        </view>
        <view class="login-form-item-input">
          <u-input class="input" v-model="model.userid" style="font-size: 38rpx;" placeholder-style="font-size: 38rpx;"
            type="number" placeholder="请输入邀请码（选填）" />
        </view>
      </view> -->
      <view class="login-form-tips">
        <!-- 单选框 -->
        <!-- {{ checkFlag }} -->
        <u-checkbox-group>
          <u-checkbox  @change="checkChange">
          </u-checkbox>
        </u-checkbox-group>
        <view>
          <text> 未注册过的手机号验证后自动创建账户,登录即代表您已经同意 </text>
          <text class="login-form-tips-likeA" @click="agreement({ title: '隐私协议', _url: 'privacy' })">《机转转隐私政策》</text>
        </view>

      </view>
    </view>
    <view class="login-submit">
      <u-button class="custom-style" :custom-style="{
        height: '90rpx',
        fontSize: '38rpx'
      }" :ripple="true" type="warning" round @click="login">登录</u-button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      model: {
        mobile: '',
        code: ''
      },
      codeTips: 60,
      // 上一级页面
      // fromPage: {
      //   type: '',
      //   url: ''
      // },
      fromPage: '/pages/index/index',
      checkFlag: false,
    }
  },
  onLoad(query) {
    console.log(query, 'query')
    if (query.fromPage) {
      this.fromPage = query.fromPage
    }
  },
  methods: {
    getCode() {
      // 判断是否输入手机号
      if (!this.model.mobile) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return
      }
      // 使用正则验证手机号是否符合规范
      if (!/^1[3456789]\d{9}$/.test(this.model.mobile)) {
        uni.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return
      }
      // showloading
      uni.showLoading({
        title: '发送中...',
        mask: true
      })
      // 发送验证码
      let opt = {
        "url": "/register/verify",
        "method": "POST",
        "header": 'application/json',
        "data": {
          "mobile": this.model.mobile
        }
      }
      console.log(opt, 'opt')
      this.$request(opt).then(res => {
        console.log(res, 'res')
        uni.showToast({
          title: '验证码发送成功',
          icon: 'none'
        })
        // 关闭loading
        uni.hideLoading()
        // 开启定时器
        this.timer = setInterval(() => {
          this.codeTips--
          if (this.codeTips === 0) {
            clearInterval(this.timer)
            this.codeTips = 60
          }
        }, 1000)
      }).catch(err => {
        console.log(err, 'errr')
      })
    },
    checkChange(obj) {
      console.log(obj, 'objjjjj')
      this.checkFlag = obj;
    },
    login() {
      console.log(this.model, this.checkFlag, 'model')
      // 
      // return 
      if (!this.checkFlag) {
        uni.showToast({
          title: '请先同意用户隐私政策',
          icon: 'none'
        })
        return 
      }
      if (!this.model.mobile) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return 
      }
      if (!this.model.code) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return 
      }
      // showloading 
      uni.showLoading({
        title: '登录中...',
        mask: true
      })
      let opt = {
        "url": "/mobilelogin",
        "method": "POST",
        "header": 'application/json',
        "data": this.model
      }
      console.log(opt, 'opt')
      this.$request(opt).then(res => {
        console.log(res, 'res')
        // 关闭loading
        uni.hideLoading()
        uni.showToast({
          title: '登录成功',
          icon: 'none'
        })
        uni.setStorageSync('token', res.data.token)
        uni.setStorageSync('avatar', res.data.avatar || '')
        uni.setStorageSync('nickName', res.data.nickname)
        uni.setStorageSync('mobile', this.model.mobile);
        uni.$emit("tokenstatus", res.data.token)
        uni.redirectTo({
          url: this.fromPage,
          fail: (err) => {
            console.log(err, 'err')
            uni.switchTab({
              url: this.fromPage
            })
          }
        })
      }).catch(err => {
        console.log(err, 'errr')
      })
    },
    agreement(obj) {
      uni.navigateTo({
        url: "../home/agreement?title=" + obj.title + "&_url=" + obj._url
      })
    },
  },
}
</script>

<style lang="scss">
.login {

  /deep/ .input {
    .u-input__input {
      font-size: 38rpx;
    }
  }


  // border: 1px solid red;
  height: 100vh;
  padding: 0 60rpx;
  background-color: #fff;

  .uni-page {
    padding-top: 0 !important;
  }

  &-title {
    font-size: 52rpx;
    // font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #050505;
    line-height: 52rpx;
    margin-bottom: 16rpx;
    margin-top: 6vh;
  }

  &-form {
    margin-top: 20vh;

    &-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 20rpx;
      margin-top: 60rpx;

      &-icon {
        margin-right: 20rpx;
      }

      &-input {
        flex: 1;
        font-size: 38rpx;
      }

      &-code {
        margin-left: 20rpx;
        font-size: 38rpx;
      }

    }

    &-tips {
      margin-top: 20rpx;
      color: #aeaeae;
    }

  }

  &-submit {
    margin-top: 60rpx;
  }
}

.custom-style {
  background-color: #FF6633;
  border: #FF6633;
  color: #fff;
}

.login-form-tips {
  display: flex;

  &-likeA {
    // a 标签样式
    color: blue
  }
}
</style>