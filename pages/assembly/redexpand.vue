<template>
	<view class="" :style="{backgroundColor:contentt.color}">
		<image :src="contentt.top" mode="widthFix" style="width: 100%;" :lazy-load="true"></image>
		<view :style="{backgroundImage:'url('+contentt.back+')'}" class="guanzhu">
			<button  v-if="tokenstatus ==''"   open-type="getAuthorize" scope="userInfo" @getAuthorize="onGetAuthorize" @error="onAuthError" style="background-color: #f8f8f800;border: 0px solid #0000;border-color: transparent;">
				<text style="font-size: 14px;background-color: #3974F4;color: #fff;padding: 4px 20px;border-radius: 5px;">授权登录</text>
			</button>
		</view>

		<image :src="contentt.bottom" mode="widthFix" style="width: 100%;" :lazy-load="true"></image>
		<view class="detail-cont">
			<u-parse :content="contentt.content" :previewImg="false"></u-parse>
		</view>
		<view class="buttonn">
			<view class="" @click="shouye">
				<image v-if="contentt.left !=''" :src="contentt.left" mode="widthFix" :lazy-load="true" style="width: 300rpx"></image>
			</view>
			<view class="" @click="followquery">
				<image v-if="contentt.right" :src="contentt.right" mode="widthFix" :lazy-load="true" style="width: 300rpx"></image>
			</view>
		</view>
    </view>
</template>

<script> 
	export default {
	data() {
		return {
			canUse: uni.canIUse('lifestyle'),
			action: {},
			activityId: '',
			isReady: false,
			item:'',
			contentt:'',
			tokenstatus:'',
			guanzhu:'',
			isis:''
		}
	},
	onLoad(query) {
		this.kaibao()
		// #ifdef MP-ALIPAY
		this.activityId=query.activityId
		if(this.activityId != null && query.activityId != null){
			uni.setStorageSync('activityId', this.activityId);
		}else{
			if(uni.getStorageSync('activityId') != null){
				this.activityId = uni.getStorageSync('activityId')
			}
		}
		this.action={ type: '' } //红包不弹窗
		uni.loadPlugin({
		  plugin: '2021003125612168@*',
		  success: () => {
			this.isReady= true
		  }
		});
		// #endif
		// this.tokenexpir()
	},
	onShow() {
		this.tokenexpir()
	},
	methods: {
		// 检测token是否过期
		tokenexpir(){
			this.tokenstatus = uni.getStorageSync('token')
			if(this.tokenstatus != ''){
				let opt = {
					url: '/index/tokenexpirtime',
					data: {
						token: this.tokenstatus
					}
				}
				this.$request(opt).then(res => {
					if(res.data == '0'){
						this.tokenstatus = ''
						uni.removeStorageSync('token');
					}
				})
			}
		},
		shouye(){
			uni.navigateTo({
				url:this.contentt.url
			})
			uni.switchTab({
				url:this.contentt.url
			})
		},
		kaibao(){
			let opt = {
				url: '/kaibaopeng'
			}
			this.$request(opt).then(res => {
				this.contentt = res.data
			})
		},
		 onTapDirectReceiveRedEnvelope() {
		   this.action= { type: 'directReceive' }
		 },
		 onClose() {
		   this.action= { type: '' }
		 },
		 onError() {
			this.action={ type: '' }
		 },
		 followquery(){
			 // console.log('000');
			 if(this.tokenstatus ==''){
				 uni.showToast({
				 	icon:'none',
					title:'需要先进行登录哦~'
				 })
			 }else{
				 // console.log('111');
				 let opt = {
					url: '/user/followquery'
				 }
				 this.$request(opt).then(res => {
					 console.log('0')
					 if(res.data.code = 10000){
						 if(res.data.is_follow == 'T'){
							 this.guanzhu = 'T'
							 this.action={ type: 'directReceive' }
							
						 }else if(res.data.is_follow == 'F'){
							 this.guanzhu = 'F'
							 uni.showToast({
								icon:'none',
								title:'关注公众号并收藏小程序后点击重新开包即可获取奖励',
								duration:3000
							 })
							 
						 }
					 }else{
						 uni.showToast({
							icon:'none',
							title:'领取失败喽'
						 })
						 
					 }
				 })
				 
			 }
		 },
		 //授权登录
		 onGetAuthorize() {
		 	let _this = this
		 	let loginObj = {}
		 	uni.showLoading({
		 		title: "登录中..."
		 	})
		 	uni.getOpenUserInfo({
		 		fail: res => {
		 			
		 		},
		 		success: res => {
		 			
		 			const userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 
		 			if (userInfo.code != 10000) {
		 				return uni.showToast({
		 					title: userInfo.msg
		 				});
		 			}
		 			loginObj.avatar = userInfo.avatar
		 			loginObj.nickname = userInfo.nickName
		 			loginObj.userid = uni.getStorageSync('yaouserid')
					loginObj.red  = '1'
		 			this.avatar = userInfo.avatar
		 			this.nickName = userInfo.nickName
		 			uni.getAuthCode({
		 				scopes: 'auth_base',
		 				// scopes: ['auth_base','order_service'],
		 				success: (authData) => {
		 					loginObj.code = authData.authCode
		 					_this.loginFunc(loginObj) //开始登录
		 				}
		 			});
		 		},
		 	});
		 },
		 // 授权失败回调
		 onAuthError() {
		 	uni.showToast({
		 		title: "授权失败"
		 	});
		 },
		 loginFunc(loginObj) {
		 	let opt = {
		 		url: "/aliyun/login",
		 		method: 'POST',
		 		header: "application/x-www-form-urlencoded;charset=utf-8",
		 		data: loginObj
		 	}
		 	this.$request(opt).then(res => {
		 		uni.setStorageSync('token', res.data.token);
		 		uni.setStorageSync('avatar', this.avatar || '');
		 		uni.setStorageSync('nickName', this.nickName || '');
				this.tokenstatus = res.data.token
		 		this.loginFlag = 1
		 		setTimeout(() => {
		 			uni.hideLoading()
		 			// this.buyOk()
					this.followquery()
		 			this.$refs.uToast.show({
		 				message: '登录成功',
		 				type: 'success'
		 			})
		 		}, 100)
		 	})
		 },
		
	},
	}
</script>

<style>
	.guanzhu{
		color:blueviolet;
		display: flex;
		align-content: center;
		height:100rpx ;
		background-size: 100% 100%;
		align-items: center;
		justify-content: space-evenly;
	}
	.textt{
		background: #5199ff;
		padding: 5px 20px;
		border-radius: 10px;
		color: #fff;
		font-size: 14px;
	}
	.buttonn{
		position: fixed;
		z-index: 1030;
		bottom: 45px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
		align-items: center;
	}

</style>