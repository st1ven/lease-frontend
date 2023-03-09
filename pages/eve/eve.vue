<template>
	<view class="page eve_page" :class="params.type==1?'Daily-page':(params.type==2?'Used_an-page':'Hot_pc-page')">
		<view class="Daily_new" v-if="params.type==1">
			<view class="Daily" :style="{backgroundColor:background}">
				<image  class="topimage" :src="imageurl" mode="widthFix" ></image>
				<view class="box">
					<view class="Daily-li" v-for="(item,inx) in list" :key="inx">
						<view class="li-head">
							<text class="head-sort">TOP {{inx+1}}</text>
						</view>
						<view class="li-cont">
							<view class="li-img">
								<u-image :showLoading="true" :src="item.image" width="78rpx" height="107rpx"
									bgColor="#ccc">
									<view slot="error" style="font-size: 20rpx;" errorIcon="trash" width="100%"
										height="100%">加载失败</view>
								</u-image>
							</view>
							<view class="li-tip">
								<view class="li-title u-line-1">{{item.title}}</view>
								<view class="li-msg"> ¥ <text class="price"> {{item.day_price}}</text> /天 </view>
								<view class="li-btn ft-24" @click="JumpDetail(item)">
									立即租 <text class="arrow-r">
										<u-icon name="play-right-fill" color="#fff" size="24rpx"></u-icon>
									</text>

								</view>
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>
		<!-- 活动专区 type=2-->
		<view class="Used_an" v-if="params.type==2">
			<view class="Used_an-ul">
				<iz-goods-item ImgBoxH="333rpx" Bgc="transparent" :newList="list" :credit="true" />
			</view>

		</view>
		<!-- 爆款电脑 type=3-->
		<view class="Hot_pc" v-if="params.type==3">
			<view class="Daily hot" :style="{backgroundColor:background}">
				<image class="topimage" :src="imageurl" mode="widthFix"></image>
				<!-- <view class="hot-head">精选商品 任意选租</view> -->
				<view class="box">
					<view class="Daily-li hot-li" v-for="(item,inx) in list" :key="inx">
						<view class="li-head">
							<text class="head-sort">TOP {{inx+1}}</text>
							<!-- <text class="head-vouchers">领券省 {{item.used_an}}元</text> -->
						</view>
						<view class="li-cont">
							<view class="li-img">
								<u-image :showLoading="true" :src="item.image" width="78rpx" height="107rpx"
									bgColor="#ccc"></u-image>
							</view>
							<view class="li-tip">
								<view class="li-title u-line-1">{{item.title}}</view>
								<view class="li-msg"> ¥ <text class="price"> {{item.day_price}}</text> /天 </view>
								<view class="li-btn ft-24" @click="JumpDetail(item)">
									立即租 <text class="arrow-r">
										<u-icon name="play-right-fill" color="#fff" size="24rpx"></u-icon>
									</text>

								</view>
							</view>
						</view>
					</view>
				</view>

			</view>

		</view>
	</view>

</template>

<script>
	export default {

		data() {
			return {
				params: {},
				list: [],
				background:'',
				imageurl:''
				
			};
		},
		onLoad(obj) {
			this.params = obj
			uni.setNavigationBarTitle({
				title: obj.title
			})
		},
		watch: {
			params(newVal, oldVal) {
				this.params = newVal
				this.list = []
			}
		},
		onShow() {
			if (this.params.type == 1) {
				this.newFunc()
			}
			if (this.params.type == 2) {
				this.secondFunc()
			}
			if (this.params.type == 3) {
				this.hotFunc()
			}
		},
		methods: {
			JumpDetail(item) {
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + item.id
				})
			},

			newFunc() {
				let opt = {
					url: '/goods/day',
					more: true,
					pageSize: 10,
					pageIndex: 1
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.list = res.data
						this.background = res.url.background
						this.imageurl = res.url.imagerul
						// console.log(res, '-----new-----')
						console.log(JSON.stringify(res))
					}
				})
			},
			//活动专区
			secondFunc() {
				let opt = {
					url: "/goods/second",
					// pageSize: 20,
					// pageIndex: 1,
					// more: true
				}

				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.list = res.data
					}
				})
			},
			//爆款电脑
			hotFunc() {
				let opt = {
					url: '/goods/new',
					data: {
						more: true,
						pageSize: 20,
						pageIndex: 1
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.list = res.data.data
						this.background = res.url.background
						this.imageurl = res.url.imagerul
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.eve_page {
		height: 100vh;
		width: 100%;
		position: relative;
		// overflow-x: scroll;
		// padding-bottom: 40rpx
	}

	.Daily-page,
	.Daily_new {
		// background-color: #9D1713;
		background-attachment: fixed;
	}

	.Used_an-page,
	.Used_an {
		// background-color: #F3532F;
		background-attachment: fixed;
	}

	.Hot_pc-page,
	.Hot_pc {
		// background-color: rgba(#F6A38C, 0.9);
		background-attachment: fixed;
	}

	.Daily_new {
		// background-image: url("https://oss.jiulove.cn/zl/new.png");
		height: 100%;
		background-size: 100%;
	}

	.Hot_pc {
		// background-image: url("https://oss.jiulove.cn/zl/Digital_hot.png");
		height: 78%;
		background-size: 100%;
	}

	.Used_an {
		// background-image: url("https://oss.jiulove.cn/zl/ershou.png");
		height: 100%;
		background-size: 100%;
		// margin-bottom: 0.2rem;
		// padding-top: 4.8rem;

	}

	.Daily_new,
	.Hot_pc {
		// padding-top: 320rpx;
		background-repeat: no-repeat;

		.box {
			max-height: 80%;
			overflow-x: scroll;
		}

		.head {
			font-size: 36rpx;
			font-weight: bold;
			color: #FfF;
			text-align: center;
			padding: 32rpx 0;
		}

		.Daily {
			// background-color: #9D1713;
			// border-radius: 24rpx;
			// border: 1px solid #fff;
			box-sizing: border-box;
			text-align: center;
			// position: absolute;
			// top: 500rpx;
			// left: 5%;
			// width: 90%;
			// height: 92%;
			// overflow-x: scroll;
			margin: 0 auto 40rpx;

			.Daily-li {
				height: 234rpx;
				margin: 0 10% 40rpx;
				border: 1px solid #fff;
				border-radius: 14rpx;
				background-color: #FFF;
				box-sizing: border-box;

				.li-head {
					height: 52rpx;
					line-height: 52rpx;
					font-weight: bold;
					background: linear-gradient(90deg, #C21D18 0%, rgba(255, 255, 255, 0) 100%);
					font-family: "YouSheBiaoTiHei";
					text-align: left;
					border-top-left-radius: 15rpx 15rpx;
					display: flex;
					font-style: italic;

					.head-sort {
						color: #fff;
						margin-right: 10rpx;
						padding: 0 0.55rem;
						background-color: #C21D18;
						height: 52rpx;
						line-height: 52rpx;
						// border-radius: 20rpx 20rpx 0;
						border-top-left-radius: 15rpx 15rpx;
						border-top-right-radius: 20rpx 20rpx;
						// border-top-right-radius: 20rpx;
					}

					.head-vouchers {
						font-size: 26rpx;
						color: #9D1713;
					}

				}

				.li-cont {
					padding: 38rpx 34rpx 34rpx 38rpx;
					display: flex;
					box-sizing: border-box;
					position: relative;
					flex-direction: row;

					.li-img {
						// flex-shrink: 78rpx;
						width: 78rpx;
						height: 107rpx;
					}

					.li-tip {
						margin-left: 12rpx;

						.li-title {
							font-size: 28rpx;
							width: 357rpx;
							height: 60rpx;
							display: -webkit-box; //一定要写
							-webkit-line-clamp: 2; //控制行数
							-webkit-box-orient: vertical; //一定要写
						}

						.li-msg {
							font-size: 16rpx;
							color: #FF5B56;
							text-align: left;

							.price {
								font-size: 36rpx;
								font-weight: bold;
							}
						}

						.li-btn {
							position: absolute;
							right: 35rpx;
							bottom: 34rpx;
							width: 176rpx;
							margin-left: 50rpx;
							width: 155rpx;
							height: 48rpx;
							line-height: 48rpx;
							color: #fff;
							background: linear-gradient(208deg, #FF126A 0%, #FF7143 50%, #FFCF3B 100%);
							border-radius: 24rpx;

							.arrow-r {
								position: absolute;
								bottom: 10rpx;
								right: 14rpx;
							}
						}

					}
				}
			}
		}

	}
	.topimage{
		width: 100%;
		// padding: 10px;
	}
	.Used_an {
		position: relative;

		.Used_an-ul {
			position: absolute;
			top: 45%;
			left: 0;
			width: 100%;
			height: calc(100% - 50%);
			overflow-x: scroll;
		}
	}

	.Hot_pc {
		.hot {
			// background-color: #FFF2E4;
			// width: 80%;
			// left: 10%;
			box-shadow: -5px 9px 30px 0px rgba(160, 24, 0, 0.29);

			.hot-head {
				color: #fff;
				font-size: 30rpx;
				width: 80%;
				height: 68rpx;
				line-height: 68rpx;
				margin: -20rpx 10% 53rpx;
				background: url("https://mrental.996sh.com/zl/Digital_hot_title.png")no-repeat;
				background-size: 100% 100%;
			}

			.hot-li {
				border: none;

				.li-head {
					background: linear-gradient(90deg, #FF5338 0%, rgba(255, 255, 255, 0) 100%);

					.head-sort {
						background-color: #FF5438;
					}

					.head-vouchers {
						color: #FF5438;
					}
				}
			}
		}
	}
</style>
