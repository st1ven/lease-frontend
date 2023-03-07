<template>
	<view>
			
		<button class="buy-ok" open-type="getAuthorize" scope="userInfo" @getAuthorize="onGetAuthorize" @error="onAuthError" :style="{background: stylee,color:stylecolor}">
			{{titlee}}
		</button>
	</view>
</template>

<script>
	export default {
		name:"fengwologin",
		props: {
			titlee:'',
			stylee: {  
                type: String,  
                default: '' 
            } ,
			stylecolor:{
				type: String,
				default: '' 
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			//授权登录
			onGetAuthorize() {
				let _this = this
				let loginObj = {}
				uni.showLoading({
					title: "登录中..."
				})
				my.getOpenUserInfo({
					fail: res => {
						// console.log(res);
					},
					success: res => {
						// console.log(res);
						const userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 
						if (userInfo.code != 10000) {
							return uni.showToast({
								title: userInfo.msg
							});
						}
						loginObj.avatar = userInfo.avatar
						loginObj.nickname = userInfo.nickName
						loginObj.userid = uni.getStorageSync('yaouserid')
						this.avatar = userInfo.avatar
						this.nickName = userInfo.nickName
						my.getAuthCode({
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
					uni.$emit("tokenstatus",res.data.token)
					
					this.loginFlag = 1
					setTimeout(() => {
						uni.hideLoading()
						// this.buyOk()
						this.$refs.uToast.show({
							message: '登录成功',
							type: 'success'
						})
					}, 100)
				})
			},
		}
	}
</script>

<style>
	.buy-ok {
		width: 626rpx;
		height: 80rpx;
		/* background: linear-gradient(179deg, #fff1bd 0%, #ffb818 100%); */
		border-radius: 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: #fff;
		margin-top: 27rpx;
	}
</style>