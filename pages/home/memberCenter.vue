<template>
	<view style="overflow-x: hidden;">
		<view class="bg">
			<image class="bg-img" :src="membercenter.memberimage.image" mode="widthFix"></image>
		</view>
		<view class="info">
			<view class="info-content">
				<view class="info-name">
					<text class="info-name">{{ nickName }}</text>
				</view>
			</view>

			<view class="info-asset">
				<view class="info-asset-item">
					<text class="iai-title">积分</text>
					<text class="iai-value">{{ membercenter.jifen }}</text>
				</view>
				<view class="info-asset-item">
					<text class="iai-title">VIP会员</text>
					<text class="iai-value" v-if="membercenter.membercard == 1">1</text>
					<text class="iai-value" v-else>0</text>
				</view>
				<view class="info-asset-item">
					<text class="iai-title">优惠券</text>
					<text class="iai-value">{{ membercenter.copus }}</text>
				</view>
			</view>
		</view>
		<!-- #ifdef MP-ALIPAY -->
		<view class="button update" @click="onOpenCard"
			:style="{ backgroundImage: 'url(' + membercenter.memberimage.kaika_image + ')' }">
			<text class="button-text" v-if="membercenter.membercard == 0">立即开通</text>
			<text class="button-text" v-else>查看会员卡</text>
		</view>
		<!-- #endif -->

		<view class="privilege">
			<image class="privilege-item-pic" :src="membercenter.memberimage.member_image" mode="widthFix"></image>
			<view class="privilege-item" v-for="(item, index) in membercenter.membercenter" :key="index"
				hover-class="hover" @click="quanyitiao(item)">
				<image class="privilege-item-pic" :src="item.image" mode="widthFix"></image>
			</view>
		</view>
		<!-- 商品 -->
		<view class="" :style="{ backgroundImage: 'url(' + membercenter.memberimage.goods_image + ')' }"
			style="position: relative;background-size: 100% 100%;">
			<view class="" style="color: #856443;font-size: 16px;text-align: right;padding: 20px;"
				@click='JumpHot({ indexFlag: 3, id: 47 })'>
				查看完整精选 >
			</view>
			<view class="iz-goods-tpl">
				<view class="iz-goods-item" v-for="(item, index) in hotList" :key="index" @click="JumpDetail(item)">
					<view class="iz-img-box">
						<slot name="img">
							<u-image width="188rpx" height="242rpx" :src="item.image">
								<view slot="error" style="font-size: 24rpx;" errorIcon="trash" width="100%"
									height="100%">加载失败
								</view>
							</u-image>
						</slot>
					</view>
					<u-divider :hairline="true" lineColor="#eaeaea"></u-divider>
					<view class="goods-title u-line-1">
						{{ item.title }}
					</view>
					<view class="goods-price">
						<!-- <text class="price-company">¥</text> -->
						<text class="price-number">¥{{ item.day_price }}</text>
						<text class="price-company">/天</text>
					</view>
				</view>
			</view>
		</view>
		<view v-for="(item, index) in membercenter.memberimage.images" :key="membercenter.memberimage.id">
			<u-image :src="item" mode="widthFix" width="100%">
			</u-image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// statusBarHeight,
				current: 0,
				nickName: '',
				membercenter: {
					memberimage: {},
					membercenter: []
				},
				hotList: [],
			}
		},
		onLoad() {
			this.nickName = uni.getStorageSync('nickName')
			this.token = uni.getStorageSync('token')
			this.getmembercenter()
			this.hotListHttp() //热门推荐
		},
		onShow() {
		},
		methods: {
			hotListHttp() {
				let opt = {
					url: "/goods/hot",
					data: {
						pageSize: 4,
						pageIndex: 1,
						more: true
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.hotList = res.data.data
					}
				})
			},
			JumpDetail: (obj) => {
				uni.navigateTo({
					url: '../../pages/goods-detail/goods-detail?id=' + obj.id
				})
			},
			JumpHot(obj) {
				uni.navigateTo({
					url: "../product-list/product-list?sortFlag=" + obj.indexFlag + '&category_ids=' + obj.id
				})
			},
			quanyitiao(item) {
				// #ifdef MP-ALIPAY
				if (this.membercenter.membercard == '0') {
					uni.showToast({
						title: '请开通会员后查看会员所属特权',
						icon: 'none',
						duration: 1550
					})
					return true
				}
				// #endif
				if (item.content == '') {
					uni.navigateTo({
						url: item.url
					})
					uni.switchTab({
						url: item.url
					})
				} else {
					uni.navigateTo({
						url: './memberurl?title=' + item.name + "&id=" + item.id
					})
				}

			},
			onOpenCard() {
				var plugin = requirePlugin("alipassToolKit") // 引用名称需与 app.json 中定义名称相同
				let params = {
					url: this.membercenter.memberimage.url, //开卡链接，通过上文 获取投放链接 获取
					callback: function(res) {
						// console.log('======', res)
						if (res.success === true) {
							// console.log('----- success')
						}
					}
				}
				plugin.openCard(params); // 接口参数说明如下
			},

			rechargeChange(index) {
				this.current = index
			},
			back() {
				uni.showToast({
					icon: "none",
					title: "返回"
				})
			},
			getmembercenter() {
				let opt = {
					url: "/membercenter",
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					// console.log(JSON.stringify(res))
					this.membercenter = res.data
				})
			}
		}
	}
</script>

<style lang="scss">
	.main-title {
		padding: 30rpx 30rpx;
		font-size: 34rpx;
		color: #1C1C1C;
	}

	.tip {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #A5A3A2;
	}

	.iz-goods-tpl {
		padding: 0 40rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		// background-color: #F6F6FB;
		width: 100%;
		box-sizing: border-box;
	}

	.iz-goods-item {
		width: 48%;
		margin: 15rpx 0;
		border-radius: 14rpx;
		background-color: #FFFFFF;

		.iz-img-box {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #FFFFFF;
			height: 333rpx;
		}

		.goods-title {
			font-size: 24rpx;
			color: #171B25;
			margin: 15rpx;
		}

		.goods-price {
			margin: 0 15rpx 15rpx 15rpx;
		}

		.goods-tag {
			color: #95D1F9;
			font-size: 18rpx;
			font-weight: 400;
			margin-left: auto;
			border-radius: 8rpx;
			padding: 5rpx 10rpx;
			border: 1rpx solid #B5E1FF;
		}
	}

	.rmb {
		font-size: 26rpx;
		color: #E3BE83;
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 400rpx;
		z-index: -2;

		&-img {
			width: 100%;
			height: 100%;
		}
	}

	.hover {
		opacity: 0.7;
	}


	.info {
		position: relative;
		padding: 0 15rpx;
		width: 730rpx;
		height: 360rpx;

		&-bg {
			position: absolute;
			width: 730rpx;
			height: 360rpx;
			z-index: -1;
		}

		&-content {
			padding: 70rpx 50rpx 0 50rpx;
			margin-bottom: 50rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		&-avatar {
			margin-right: 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			width: 85rpx;
			height: 85rpx;
			background-color: #fff;
			padding: 1rpx;
			border-radius: 50%;

			&-pic {
				width: 83rpx;
				height: 83rpx;
				// width: 50%;
				// height: auto;
			}
		}

		&-name {
			display: flex;
			flex-direction: column;
			color: #856443;
			font-size: 35rpx;
			font-weight: bold;
		}

		&-level {
			margin-top: 15rpx;
			font-size: 24rpx;
		}

		&-asset {
			padding: 0 50rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			&-item {
				display: flex;
				flex-direction: column;
			}
		}
	}

	.iai {
		&-title {
			margin-bottom: 20rpx;
			margin-right: 100rpx;
			font-size: 24rpx;
			color: #CFB386;
		}

		&-value {
			font-size: 35rpx;
			color: #856443;
		}
	}

	.button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 85rpx;
		border-radius: 10rpx;
		background-size: 100% 100%;
		position: relative;

		&-text {
			font-size: 30rpx;
			color: #fff;
			letter-spacing: 10px;
		}
	}

	.update {
		margin: 35rpx 30rpx 20rpx 30rpx;
	}

	.privilege {
		padding: 0 30rpx;
		margin-bottom: 40rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		// background: #fff;
		// margin: 40rpx;
		// border-radius: 20rpx;

		&-item {
			// margin: 0 23rpx;
			margin-bottom: 25rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 48%;
			margin: 0 1%;

			&-pic {
				width: 100%;
				height: auto;
				// width: 80rpx;
				// height: 80rpx;
				margin-bottom: 20rpx;
			}

			&-text {
				font-size: 24rpx;
				color: #383738;
			}
		}
	}

	.level {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 750rpx;
		height: 466rpx;
		background-size: 100%;

		&-rate {
			position: absolute;
			top: 43rpx;
			left: 33rpx;
			display: flex;
			flex-direction: row;
			align-items: center;

			&-text1 {
				margin-right: 20rpx;
				color: #1C1C1C;
				font-size: 34rpx;
			}

			&-text2 {
				font-size: 34rpx;
				color: #C07C07;
			}
		}

		&-info {
			// position: absolute;
			// top: 188rpx;
			// left: 350rpx;
			margin-top: 70rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			&-icon {
				margin-bottom: 20rpx;
				width: 48rpx;
				height: 38rpx;
			}

			&-text {
				margin-bottom: 20rpx;
				font-size: 26rpx;
				color: #292929;
			}

			&-integral {
				font-size: 40rpx;
				color: #C07C07;
			}
		}

		&-distance {
			position: absolute;
			left: 30rpx;
			right: 30rpx;
			bottom: 35rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			&-text {
				font-size: 26rpx;
				color: #292929;
			}

			&-button {
				padding: 0 30rpx;
				height: 60rpx;
			}
		}
	}
</style>