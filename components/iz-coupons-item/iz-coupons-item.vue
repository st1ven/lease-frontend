<template>
	<view class="iz-coupons-box ">
		<view class="" v-if="initList.length != false">
			<view class="max" v-if="type==1">
				<view class="iz-coupons-item " v-for=" (item,i) in initList">
					<view class="price-box">
						<view>
							<text class="price-company">¥</text>
							<text class="price-number">{{item.amount}}</text>
						</view>
						<view class="primie">{{item.name}}</view>
					</view>
					<view class="title-box">
						<text class="ft-32 ft-bold title-color pt-20 flex-1">优惠券</text>
						<text class="time">使用时间：{{item.usetime}}</text>
					</view>
					<view class="btn" v-if="item.get_status==0">已领取</view>
					<view v-if="tokenstatus !='' || tokenstatuss != ''">
						<view class="btn btn-no" v-if="item.get_status==1"  @click="receive(item,i)">领取</view>
					</view>
					<button  class="btn btn-no" open-type="getAuthorize"
									scope="userInfo" @getAuthorize="onGetAuthorize" @error="onAuthError" v-if="tokenstatus =='' && tokenstatuss=='' ">
												领取
					</button>
				</view>
			</view>

			<view class="maxs" v-if="type==0">
				<view class="iz-coupons-item" v-for=" (item,i) in initList">
					<view class="price-box">
						<view>
							<text class="price-company">¥</text>
							<text class="price-number">{{item.coupons.amount}}</text>
						</view>
						<view class="primie">{{item.coupons.name}}</view>
					</view>
					<view class="title-box">
						<text class="ft-32 ft-bold title-color pt-20 flex-1">优惠券</text>
						<text class="time">使用时间：{{item.coupons.usetime}}</text>
					</view>
					<view class="btn btn-no" v-if="status==1" @click="goGood(item)">去使用</view>
					<view class="btn" v-if="status==2">已使用</view>
					<view class="btn" v-if="status==3">已过期</view>
				</view>
			</view>

		</view>
		<view class="coupons-no" v-else>
			<u-icon name="warning" color="#ccc" size="45rpx" labelColor="#ccc" labelSize="30rpx" label="暂时没有优惠劵哦~">
			</u-icon>
		</view>
	</view>

</template>

<script>
	export default {
		name: "iz-coupons-item",
		props: {
			type: 0, //商品列表里面的领取
			goodsId: "",
			status: "",
			showFlag: true,
			tokenstatus:'',
			
		},
		data() {
			return {
				btnOnFlag: false,
				goods_id: this.goodsId,
				initList: [],
				tabStatus: this.status || 1,
				pageSize: 20,
				pageIndex: 1,
				tokenstatuss:'',
			};
		},
		watch: {
			goodsId(newVal, oldVal) {
				this.goods_id = newVal
			},
			status(newVal, oldVal) {
				this.tabStatus = newVal
				this.pageInit()
			},
		},
		onShow() {
			this.tokenstatuss = uni.getStorageSync('token')
		},
		mounted() {
			this.initList = []
			if (this.type == 1) {
				this.init()
			}
			if (this.type == 0) {
				this.pageInit()
			}

		},

		methods: {
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
					// 打印调用成功回调
					// console.log(res, ' -------获取登录信息-----')
					uni.setStorageSync('token', res.data.token);
					uni.setStorageSync('avatar', this.avatar || '');
					uni.setStorageSync('nickName', this.nickName || '');
					// this.avatar = uni.getStorageSync('avatar')
					// this.nickName = uni.getStorageSync('nickName')
					this.tokenstatuss = res.data.token
					// this.$emit('tokenstatus',res.data.token)
					this.loginFlag = 1
					setTimeout(() => {
						uni.hideLoading()
						// this.buyOk()
					}, 100)
					// this.avatar = userInfo.avatar
					// this.nickName = userInfo.nickName
					// this.$refs.uToast.show({
					// 	message: res.msg,
					// 	icon: 'success',
					// 	type: 'success'
					// })
				})
			},
			goGood(item) {
				// console.log(item)
				uni.navigateTo({
					url: '/pages/product-list/product-list?sortFlag=2&coupons_id=' + item.coupons.id
				})
			},
			pageInit() {
				let opt = {
					url: '/coupons',
					data: {
						status: this.tabStatus,
						pageSize: this.pageSize,
						pageIndex: this.pageIndex
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					// console.log(res.data.data)
					this.initList = res.data.data

				})
			},
			init() {
				let opt = {
					url: '/goods/couponslist',
					data: {
						goods_id: this.goods_id
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.initList = res.data
				})
			},
			dingyue(){
				uni.requestSubscribeMessage({
					  entityIds: ['05796c6d39444257b68cee713c36e564', 'f84418a09de1431a8ec84f8fb3706748']
					});
			},
			receive(item, i) {
				this.dingyue()
				let opt = {
					url: '/goods/receive/coupons',
					data: {
						coupons_id: item.id
					}
				}
				this.initList[i].get_status = 0

				this.$request(opt).then(res => {
					// 打印调用成功回调
					
					uni.showToast({
						title: res.msg || "获取数据失败"
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.max {
		max-height: 800rpx;
		// min-height: 400rpx;
	}

	.maxs {
		max-height: 100vh;
	}

	.iz-coupons-box {
		overflow-y: scroll;

		.coupons-no {
			position: absolute;
			top: 200rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.price-box {
			width: 200rpx;
			height: 120rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: space-around;

			.price-company {
				font-size: 30rpx;
				font-weight: bold;
			}

			.price-number {
				font-size: 42rpx;
			}

			.primie {
				color: #666666;
				font-size: 20rpx;
				font-weight: 400;
				letter-spacing: 2rpx;
			}
		}

		.title-box {
			flex: 1;
			display: flex;
			// height: 110rpx;
			display: flex;
			padding-left: 30rpx;
			flex-direction: column;

			.time {
				color: #999999;
				font-size: 20rpx;
				letter-spacing: 2rpx;
			}
		}

		.btn {
			width: 113rpx;
			height: 49rpx;
			color: #FFFFFF;
			font-size: 20rpx;
			text-align: center;
			line-height: 49rpx;
			background: #C8C7C7;
			margin-right: 30rpx;
			border-radius: 25rpx;
		}

		.btn-no {
			background-color: #14a3e4;
		}

		.iz-coupons-item {
			display: flex;
			align-items: center;
			justify-content: center;

			width: 680rpx;
			height: 191rpx;
			position: relative;
			border-radius: 10rpx;
			margin: 30rpx auto 0 auto;
			border-left: 10rpx solid #9fd1fb;
			filter: drop-shadow(0 0 8rpx rgba(0, 0, 0, 0.1));
			background:
				radial-gradient(circle at right top, transparent 20rpx, #ffffff 0) top left / 200rpx 51% no-repeat,
				radial-gradient(circle at right bottom, transparent 20rpx, #ffffff 0) bottom left / 200rpx 51% no-repeat,
				radial-gradient(circle at left top, transparent 20rpx, #ffffff 0) top right / 480rpx 51% no-repeat,
				radial-gradient(circle at left bottom, transparent 20rpx, #ffffff 0) bottom right / 480rpx 51% no-repeat;
		}

		.iz-coupons-item:after {
			position: absolute;
			content: "";
			top: 25rpx;
			left: 196rpx;
			bottom: 25rpx;
			border: 0.1rpx dashed #dedee0;
		}

	}
</style>
