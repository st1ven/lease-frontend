<template>
	<!-- 物流信息 -->
	<view class="logistics-page">
		<view class="logistics-head">
			<view class="head-img">
				<u-image :showLoading="true" :src="courier.goods_image || '/static/image/daishouhuo.png'" width="130rpx"
					height="130rpx"></u-image>
			</view>
			<view class="head-box">
				<view class="head-box1">快递公司：{{courier.express_name || ""}} </view>
				<view class="head-box2">快递单号：{{courier.express_no ||""}} <text class="copy" @click="copy">复制</text>
				</view>
			</view>
		</view>
		<view class="logistics-box">
			<u-steps current="0" direction="column" activeColor="#ffaa00" inactiveColor="#9FA3B0" :dot="true">
				<view class="" v-for="(item,index) in stepList" :key="index">
					<u-steps-item :title="item.time" :desc="item.context" v-if="index==0">
						<text class="slot-icon" slot="icon">
							<u-icon name="checkmark-circle-fill" color="#ffaa00" size="30rpx"></u-icon>
						</text>
					</u-steps-item>
					<u-steps-item :title="item.time" :desc="item.context" v-else></u-steps-item>
				</view>
			</u-steps>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				params: {},
				courier: {
					name: '', //快递公司名字
					code: '', //快递单号
					image: "" //快递logo
				},
				stepList: [{
					name: "仓库打包中...",
					time: "",
					context: "已下单"
				}]
			}
		},
		onLoad(obj) {
			this.params = obj
		},
		onShow() {
			this.init()
		},
		methods: {
			copy() {
				uni.setClipboardData({
					data: this.courier.express_no,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
						});
					}
				});

			},
			init() {
				let opt = {
					url: '/order/logistics',
					data: {
						id: this.params.id
					}
				}
				this.$request(opt).then(res => {
					if (res.data.data.returnCode == 400) {
						return this.$refs.uToast.show({
							message: res.message || '查询失败，暂时没有物流信息',
							icon: 'error',
							type: 'error',
							duration:3000,
							complete() {
								uni.navigateBack({ //返回上一页
									success: () => {
										let page = getCurrentPages().pop(); //跳转页面成功之后
										if (!page) {
											return;
										} else {
											page.onLoad(page.options); // page自带options对象.
										}
									}
								})
							}
						})
					}
					this.courier = res.data.item
					this.stepList = res.data.data.data 
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.logistics-page {
		background-color: #F6F6FB;
		height: 100vh;
		padding: 15rpx;

		.logistics-head {
			height: 150rpx;
			border-radius: 14rpx;
			background-color: #fff;
			padding: 15rpx 0 6rpx 15rpx;
			display: flex;

			.head-img {
				margin-right: 19rpx;
			}

			.head-box {
				margin-top: 30rpx;
				font-size: 24rpx;
				color: #171B25;

				.copy {
					color: #ffaa00;
					margin-left: 15rpx;
				}

				.head-box1 {
					margin-bottom: 20rpx;
				}
			}
		}

		.logistics-box {
			background-color: #fff;
			margin-top: 15rpx;
			border-radius: 14rpx;
			padding: 70rpx 39rpx;
		}

		/deep/ .u-text__value--main {
			color: #ffaa00;
			margin-bottom: 5rpx;
		}

		/deep/ .u-steps-item--column {
			padding-bottom: 50rpx;
		}

		/deep/ .u-text__value--content {
			color: #9FA3B0;
		}
		
		/deep/ .u-text__value--tips {
			color: #61687c;
		}

		/deep/ .u-steps-item__wrapper__dot {
			height: 16rpx;
			width: 16rpx;
		}

		/deep/ .u-steps-item__line--column {
			height: 100% !important;
		}
	}
</style>
