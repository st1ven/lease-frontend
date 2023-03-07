<template>
	<view>
		<!-- 我的 -->
		<view class="user-box" v-if="token==''" :style="{backgroundImage:'url('+image.touxiangdengluqian+')'}">

			<u-avatar icon="account-fill" fontSize="100rpx" size="120rpx" color="#fff"></u-avatar>

			<button type="default" size="default" open-type="getAuthorize" class="login-btn" scope="userInfo"
				@getAuthorize="onGetAuthorize" @error="onAuthError">
				登录 / 注册
			</button>
		</view>

		<view class="user-name flex" v-else  :style="{backgroundImage:'url('+image.touxiangdengluhou+')'}">
			
				<u-avatar :src="avatar" size="120rpx"></u-avatar>
				<view class="name">
					{{nickName}}
				</view>
		</view>
		<view class="changtu" @click="huiyuan()" v-if="memberimage.status">
			<u-image :src="memberimage.user_image" mode="widthFix" radius="7px" width="100%" >
			</u-image>
		</view>
		<iz-card style="
    border-radius: 0 0 0.14rem 0.14rem;" title="我的订单" moreTitle="查看全部订单" @click="JumpOrder({inx:0})">
			<iz-card-item text="待审核" :src="image.daishenhe" @click="JumpOrder({inx:1})" />
			<iz-card-item text="待发货" :src="image.daifahuo" @click="JumpOrder({inx:2})" />
			<iz-card-item text="待收货" :src="image.daishouhuo" @click="JumpOrder({inx:3})" />
			<iz-card-item text="租赁中" :src="image.zulinzhong" @click="JumpOrder({inx:4})" />
			<iz-card-item text="已完结" :src="image.yiwanjie" @click="JumpOrder({inx:6})" /> 
		</iz-card>
		<iz-card title="我的服务">
			<iz-card-item width="25%" text="我的收藏" :src="image.wodeshoucang" @click="collection" />
			<iz-card-item width="25%" text="优惠券" :src="image.youhuiquan" @click="coupons" />
			<iz-card-item width="25%" text="商务合作" :src="image.shangwuhezuo" @click="cooperation()" />
			<iz-card-item width="25%" text="问题反馈" :src="image.wentifankui" @click="problem()" />
			<iz-card-item width="25%" text="使用帮助" :src="image.shiyongbangzhu" @click="help" />  
			<iz-card-item width="25%" text="用户协议" :src="image.yonghuxieyi"
				@click="agreement({title:'用户协议',_url:'agreement'})" />
			<iz-card-item width="25%" text="隐私协议" :src="image.yinsixieyi" @click="agreement({title:'隐私协议',_url:'privacy'})" />
			<iz-card-item width="25%" text="关于我们" :src="image.guanyuwomen" @click="agreement({title:'关于我们',_url:'about'})" />
			<iz-card-item width="25%" text="联系我们" :src="image.lianxiwomen" @click="$refs.contact.setStatus(true)" />
			<iz-card-item width="25%" text="订单续租" :src="image.dingdanxuzu" @click="JumpOrder({inx:4})" />
			<iz-card-item width="25%" text="身份认证" :src="image.shenfenrenzheng" @click="idcardd()" />
			<iz-card-item width="25%" v-if="tuiguangnum != 1 && token!=''" text="推广数据" :src="image.tuiguangshuju" @click="tuiguangurl()" />
			
		</iz-card>
		
		<u-toast ref="uToast"></u-toast>
		<!-- 联系我们 -->
		<Contact ref="contact" type="0"></Contact>
	</view>
	 
</template>

<script>
	import Contact from "./components/contact.vue"
	export default {
		components: {
			Contact
		},

		data() {
			return {
				nickName: '',
				newList: [],
				avatar: '',
				loginFlag: 0,
				token: "",
				phoneNumber: '', //手机
				tuiguangnum:1,
				image:[],
				memberimage:''
			}
		},
		onShow() {
			this.newListHttp()
			
			this.avatar = uni.getStorageSync('avatar')
			this.nickName = uni.getStorageSync('nickName')
			this.token = uni.getStorageSync('token')
			this.getimage()
			this.getmemberimage()

			if(this.token != ''){
				this.tuiguang()
			}
			
		},
		watch: {
			token(newVal, oldVal) {
				this.token = newVal
			},
		},
		methods: {
			huiyuan(){
				uni.navigateTo({
					url: "./memberCenter"
				})
			},
			getmemberimage(){
				let opt = {
					url: "/index/getmemberimage",
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.memberimage = res.data
					
				})
			},
			getimage(){
				let opt = {
					url: "/index/getimage",
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.image = res.data
				})
			},
			tuiguangurl(){
				uni.navigateTo({
					url: "./invitation"
				})
			},
			dingyue(){
				my.requestSubscribeMessage({
				  entityIds: [''],
				  complete: (res) => {
				    console.log("接口调用结束的回调", res);
				  }
				});
			},
			JumpOrder(obj) {
				this.token = uni.getStorageSync('token')
				if (this.token) {
					uni.navigateTo({
						url: "../order-list/order-list?inx=" + obj.inx
					})
				} else {
					this.$refs.uToast.show({
						message: "请先登录",
						icon: 'error',
						type: 'error'
					})
				}

			},

			//最新数据
			newListHttp() {
				let opt = {
					url: "/goods/new?more=ture",
					data: {
						pageSize: 20,
						pageIndex: 1
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.newList = res.data.data
					}
				})
			},
			tuiguang(){
				let opt = {
					url: "/tuiguang",
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.tuiguangnum = res.data
				})
			},
			loginFunc(loginObj) {
				console.log('开始登录了')
				let opt = {
					url: "/aliyun/login",
					method: 'POST',
					header: "application/x-www-form-urlencoded;charset=utf-8",
					data: loginObj
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					console.log(res, ' -------获取登录信息-----')
					uni.setStorageSync('token', res.data.token);
					uni.setStorageSync('avatar', this.avatar || '');
					uni.setStorageSync('nickName', this.nickName || '');

					this.token = res.data.token
					this.loginFlag = 1
					setTimeout(() => {
						uni.hideLoading()
						this.tuiguang()
					}, 100)

				})
			},
			getUserInfo() {
				let opt = {
					url: "/user",
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					console.log(res, ' -------个人 信息-----')

				})
			},
			//授权手机号
			onGetPhone() {
				my.getPhoneNumber({
					success: (res) => {
						console.log(res, '---授权手机')
					},
					fail: (res) => {
						this.$refs.uToast.show({
							message: res || "手机号授权失败",
							icon: 'error',
							type: 'error'
						})
					},
				});
			},
			//授权登录
			onGetAuthorize() {
				let _this = this
				let loginObj = {}
				uni.showLoading({
					title: "登录中..."
				})
				my.getOpenUserInfo({
					fail: res => {
						console.log(res);
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
			collection() {
				//我的收藏
				this.token = uni.getStorageSync('token')
				if (this.token) {
					uni.navigateTo({
						url: "../home/collection"
					})
				} else {
					this.$refs.uToast.show({
						message: "请先登录",
						icon: 'error',
						type: 'error'
					})
				}
			},
			cooperation() {
				// 商务合作
				uni.navigateTo({
					url: "../home/cooperation"
				})
			},
			coupons() {
				//优惠劵
				this.token = uni.getStorageSync('token')
				if (this.token) {
					uni.navigateTo({
						url: "../home/coupons"
					})
				} else {
					this.$refs.uToast.show({
						message: "请先登录",
						icon: 'error',
						type: 'error'
					})
				}
			},
			help() {
				uni.navigateTo({
					url: "../home/help"
				})
			},
			idcardd() {
				uni.navigateTo({
					url: "../idcard/idcard?type=detail"
				})
			},
			agreement(obj) {
				uni.navigateTo({
					url: "../home/agreement?title=" + obj.title + "&_url=" + obj._url
				})
			},
			problem() {
				uni.navigateTo({
					url: "../home/problem"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.changtu{
		// border-radius: 0.14rem;
		margin: 0rem 0.4rem 0.1rem 0.4rem;
		// padding: 0.2rem 0.3rem 0 0.3rem;
	}
	.user-name {
		background: #F0F0F0;
		padding: 50rpx 60rpx;
		flex-direction: row;
		align-items: center;
// background: #FFFFFF;
    border-radius: 0.14rem;
    margin: 0.4rem 0.4rem 0.2rem 0.4rem;
	background-repeat: round;
		.name {
			margin-left: 19rpx;
		}

		.login-btn {

			font-size: 24rpx;
			color: #1F1F1F;
			background-color: #F0f0f0
		}
	}

	.user-box {
		background: #F0F0F0;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 50rpx 60rpx;
		// background: #FFFFFF;
		border-radius: 0.14rem;
		margin: 0.4rem 0.4rem 0.1rem 0.4rem;
		background-repeat: round;
		// background-image: url(https://oss.jiulove.cn/uploads/20220312/2207ba16f72dc31111fd86a2eea7bf81.gif);		
		.avatar {
			width: 232rpx;
			height: 232rpx;
		}



		.login-btn {
			margin-left: 28rpx;
			font-size: 30rpx;
			color: #1F1F1F;
			background-color: #f0f0f000;
			border: 1px solid #f0f0f000;
			padding: 0 15px;
			border-radius: 10px;
		}
	}

	.goods-box {
		// margin: 0 40rpx;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
