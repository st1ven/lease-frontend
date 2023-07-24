<template>
	<view style="background-color: #f6f6fb;">
		<view class="user-info">
			<view style="display: flex; align-items: center;" v-if="token == ''">
				<u-avatar icon="account-fill" bg-color="#ffffff4d" fontSize="80rpx" size="120rpx" color="#fff">
				</u-avatar>
				<!-- #ifdef MP-ALIPAY -->
				<button type="default" size="default" open-type="getAuthorize" class="login-btn" scope="userInfo"
					@click="onGetAuthorize" @error="onAuthError">
					立即登录
				</button>
				<!-- #endif -->
				<!-- #ifndef MP-ALIPAY -->
				<div class="login-btn" @click="onGetAuthorize">
					立即登录
				</div>
				<!-- #endif -->
			</view>
			<view style="display: flex; align-items: center;" v-else>
				<u-avatar :src="avatar" v-if="avatar" size="120rpx"></u-avatar>
				<u-avatar icon="account-fill" v-else bg-color="#ffffff4d" fontSize="80rpx" size="120rpx" color="#fff">
				</u-avatar>
				<view class="user-info-title">{{ nickName }}</view>
			</view>
		</view>
		<view class="info-margin">
			<!-- #ifdef MP-ALIPAY -->
			<view class="changtu" @click="huiyuan()" v-if="memberimage.status">
				<u-image :src="memberimage.user_image" mode="widthFix" width="100%"></u-image>
			</view>
			<!-- #endif -->
			<iz-card title="我的订单" moreTitle="查看全部订单" @click="JumpOrder({ inx: 0 })">
				<iz-card-item text="待审核" :src="image.daishenhe" @click="JumpOrder({ inx: 1 })" />
				<iz-card-item text="待发货" :src="image.daifahuo" @click="JumpOrder({ inx: 2 })" />
				<iz-card-item text="待收货" :src="image.daishouhuo" @click="JumpOrder({ inx: 3 })" />
				<iz-card-item text="租赁中" :src="image.zulinzhong" @click="JumpOrder({ inx: 4 })" />
				<iz-card-item text="已完结" :src="image.yiwanjie" @click="JumpOrder({ inx: 6 })" />
			</iz-card>
		</view>
		<!-- 滞纳金 -->
		<view style="padding: 0 12px 20rpx 12px;" v-for="(item, latefeeIndex) in latefee" :key="latefeeIndex">
			<u-alert :title="'订单号：' + item.order_sn + '\n' + item.late_fee_title" :description="item.late_fee_desc" type="error"
				fontSize="28rpx" @click="order(item)"></u-alert>
		</view>
		<iz-card title="我的服务">
			<iz-card-item width="25%" text="我的收藏" :src="image.wodeshoucang" @click="collection" />
			<iz-card-item width="25%" text="优惠券" :src="image.youhuiquan" @click="coupons" />
			<iz-card-item width="25%" text="商务合作" :src="image.shangwuhezuo" @click="cooperation()" />
			<iz-card-item width="25%" text="问题反馈" :src="image.wentifankui" @click="problem()" />
			<iz-card-item width="25%" text="用户协议" :src="image.yonghuxieyi"
				@click="agreement({ title: '用户协议', _url: 'agreement' })" />
			<iz-card-item width="25%" text="隐私协议" :src="image.yinsixieyi"
				@click="agreement({ title: '隐私协议', _url: 'privacy' })" />
			<iz-card-item width="25%" text="关于我们" :src="image.guanyuwomen"
				@click="agreement({ title: '关于我们', _url: 'about' })" />
			<iz-card-item width="25%" text="联系我们" :src="image.lianxiwomen" @click="$refs.contact.setStatus(true)" />
			<iz-card-item width="25%" text="订单续租" :src="image.dingdanxuzu" @click="JumpOrder({ inx: 4 })" />
			<iz-card-item width="25%" text="认证中心" :src="image.renzhengzhongxin" @click="jumpAuth()" />
			<!-- 			<iz-card-item width="25%" text="身份认证" :src="image.shenfenrenzheng" @click="idcardd()" />
			<iz-card-item width="25%" text="紧急联系人" :src="image.jinjlianxiren" @click="contactdd()" /> -->
			<iz-card-item width="25%" v-if="tuiguangnum != 1 && token != ''" text="推广数据" :src="image.tuiguangshuju"
				@click="tuiguangurl()" />
			<!-- #ifndef MP-ALIPAY -->
			<iz-card-item v-if="token" width="25%" text="退出登录" :src="image.logout" @click="logOut" />
			<!-- #endif -->
		</iz-card>
		<u-toast ref="uToast"></u-toast>
		<!-- 联系我们 -->
		<Contact ref="contact" type="0"></Contact>
		<view class="recommend-box">
			<text class="line"></text>
			<text class="title">热门推荐</text>
			<text class="line"></text>
		</view>
		<view v-if="loading" style="padding-top: 20px;">
			<u-loading-icon color="#FF6633" text="正在加载..." size="16" :vertical="true" textSize="14"></u-loading-icon>
		</view>
		<view class="recommend-goods" style="margin-top: 10px;">
			<view class="recommend-goods-ul">
				<iz-goods-item ImgBoxH="333rpx" :credit="true" :newList="newList" Bgc="#f6f6fb" textLine="u-line-2" />
			</view>
		</view>
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
			loading: true,
			nickName: '',
			newList: [],
			avatar: '',
			loginFlag: 0,
			token: "",
			phoneNumber: '', //手机
			tuiguangnum: 1,
			image: [],
			memberimage: '',
			latefee: []
		}
	},
	onShow() {
		this.newListHttp()

		this.avatar = uni.getStorageSync('avatar')
		this.nickName = uni.getStorageSync('nickName')
		this.token = uni.getStorageSync('token')
		this.latefee = uni.getStorageSync('latefee')
		this.getimage()
		this.getmemberimage()

		if (this.token != '') {
			this.tuiguang()
		}
		if (this.latefee == '' && this.token != '') {
			this.getLateFee()
		}

	},
	watch: {
		token(newVal, oldVal) {
			this.token = newVal
		},
	},
	methods: {
		order(item) {
			uni.navigateTo({
				url: '../order-list/order?id=' + item.id
			})
		},
		getLateFee() {
			let opt = {
				url: '/user/latefee'
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				uni.setStorageSync('latefee', res.data)
				this.latefee = res.data
			})
		},
		huiyuan() {
			// #ifndef MP-ALIPAY
			let token = uni.getStorageSync('token');
			if (!token) {
				// 提示请先登录
				this.$u.toast('请先登录');
				uni.navigateTo({
						url: '../login/login?fromPage=/pages/home/memberCenter',
					})
				return;
			} 
			// #endif
			uni.navigateTo({
				url: "./memberCenter"
			})
		},
		getmemberimage() {
			let opt = {
				url: "/index/getmemberimage",
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.memberimage = res.data

			})
		},
		getimage() {
			let opt = {
				url: "/index/getimage",
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.image = res.data
			})
		},
		tuiguangurl() {
			uni.navigateTo({
				url: "./invitation"
			})
		},
		dingyue() {
			uni.requestSubscribeMessage({
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
				// #ifndef MP-ALIPAY
				setTimeout(() => {
					uni.redirectTo({
						url: '../login/login?fromPage=/pages/order-list/order-list?inx='+ obj.inx,
					})
				}, 1000);
				// #endif
			}

		},

		//热门产品
		newListHttp() {
			let opt = {
				url: "/goods/hot",
				data: {
					pageSize: 6,
					pageIndex: 1,
					more: true
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				if (res.code == 1) {
					this.newList = res.data.data
				}
				this.loading = false
			})
		},
		tuiguang() {
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
			uni.getPhoneNumber({
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
			// 支付宝小程序
			// #ifdef  MP-ALIPAY
			let _this = this
			let loginObj = {}
			uni.showLoading({
				title: "登录中..."
			})
			uni.getOpenUserInfo({
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
			// #endif
			// app 直接跳转到 login 页面
			// #ifndef MP-ALIPAY
			uni.navigateTo({
				url: '../login/login?fromPage=/pages/home/home',
			})
			// #endif
		},
		// 退出登录
		logOut() {
			uni.removeStorageSync('token')
			uni.removeStorageSync('avatar')
			uni.removeStorageSync('nickName')
			this.token = ''
			this.loginFlag = 0
			this.$refs.uToast.show({
				message: "退出成功",
				icon: 'success',
				type: 'success'
			})
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
		jumpAuth() {
			this.token = uni.getStorageSync('token')
			if (this.token) {
				uni.navigateTo({
					url: "../home/authentication"
				})
			} else {
				this.$refs.uToast.show({
					message: "请先登录",
					icon: 'error',
					type: 'error'
				})
			}
		},
		// idcardd() {
		// 	uni.navigateTo({
		// 		url: "../idcard/idcard?type=detail"
		// 	})
		// },
		// contactdd() {
		// 	this.token = uni.getStorageSync('token')
		// 	if (this.token) {
		// 		uni.navigateTo({
		// 			url: "../contact/contact"
		// 		})
		// 	} else {
		// 		this.$refs.uToast.show({
		// 			message: "请先登录",
		// 			icon: 'error',
		// 			type: 'error'
		// 		})
		// 	}
		// },
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
/deep/ .u-avatar--circle {
	border: 1px solid #fff;
}

.recommend-box {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: row;
	padding: 24rpx 0 10rpx;

	.line {
		width: 83rpx;
		height: 1rpx;
		background: #D5D7DC;
	}

	.title {
		margin: 0 30rpx;
		font-size: 32rpx;
		color: #414960;
		font-weight: bold;
	}
}

.recommend-goods {

	background-color: #fff;

	.recommend-goods-title {
		color: #171B25;
		font-size: 32rpx;
		text-align: center;
		padding: 15rpx;
		font-weight: bold;
	}
}

.info-margin {
	margin-top: -10vh;
}

.user-info {
	background: url('../../static/base/jzz/header.png');
	background-color: #FF6633;
	background-size: 20vh;
	background-repeat: no-repeat;
	background-position: 100% 0;
	/* #ifdef H5 */
	padding: 4vh 15px 0 15px;
	height: 22vh;
	background-position: 100% 3vh;
	/* #endif */
	/* #ifdef APP-PLUS */
	padding: 8vh 15px 0 15px;
	height: 21vh;
	background-position: 100% 6vh;
	/* #endif */
	/* #ifndef H5 || APP-PLUS */
	padding: 15px;
	height: 20vh;
	/* #endif */

	// border: 1px solid red;
	&-title {
		color: #fff;
		font-size: 22px;
		font-weight: bold;
		margin-left: 14px;
		// border: 1px solid red;
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}

.changtu {
	margin: 0 56rpx;
}

.login-btn,
.user-info-title {
	color: #fff;
	font-size: 18px;
	font-weight: bold;
	margin-left: 14px;
	background-color: rgba(0, 0, 0, 0);
	border: 1px solid rgba(0, 0, 0, 0);
	padding: 0;
	width: 100%;
	text-align: left;
}
</style>
