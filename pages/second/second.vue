<template>
	<!--  -->
	<view>
		<view class="swiper-box">
			<u-swiper indicator previousMargin="30" nextMargin="30" circular :autoplay="false" radius="5"
			 @click="bann" :list="bannerList" />
		</view>
		<!-- 二手手机专区 Start -->
		<view class="" v-for="(item,i) in secondList" :key="i">
			<view class="title-box">
				<text class="title">{{item.name}}</text>
				<view class="flex align-center ml-auto" @click="JumpDetail(item)">
					<text class="more">查看更多</text>
					<u-icon color="#61687C" size="14" name="arrow-right-double" />
				</view>
			</view>
			<view class="flex">
				<scroll-view scroll-x="true" class="flex">
					<view class="goods-box" >
						<view v-for="(list,index) in item.list" :key="index" class="goods-item"@click="Jumplist(list)">
							<image mode="aspectFit" :src="list.image" />
							<view class="title u-line-2"  style="height: 52rpx;">
								{{list.title}}
							</view>
							<view class="goods-price">
								<!-- <text class="price-company">¥</text> -->
								<text class="price-number">¥{{list.price}}</text>
								<text class="price-company">/天</text>
								<view class="goods-tag">
									免押金
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 二手手机专区 End -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				secondList: [],
				bannerList: [],
				good:[],
			};
		},
		onShow() {
			this.swiperList()
			this.init()
		},
		methods: {
			bann(index){
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + this.good[index].good_id
				})
			},
			JumpDetail: (item) => {
				uni.navigateTo({
					url: '../second-detail/second-detail?title=' + item.name + '&id=' + item.id
				})
			},
			Jumplist(obj) {
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + obj.id
				})
			},
			// 轮播图数据
			swiperList() {
				let opt = {
					url: '/second/banner'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.bannerList = res.data.map(item => item.image)
					this.good = res.data
				})
			},
			init() {
				let opt = {
					url: '/second/index'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.secondList = res.data
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.swiper-box {
		padding: 30rpx;
		background-color: #F6F6FB;
	}

	.title-box {
		display: flex;
		align-items: center;
		flex-direction: row;
		padding: 30rpx 30rpx;

		.title {
			color: #171B25;
			font-size: 30rpx;
			font-weight: bold;
		}

		.more {
			color: #61687C;
			font-size: 24rpx;
			margin-left: auto;
		}
	}

	.goods-box {
		display: flex;
		flex-direction: row;
		padding: 0 30rpx;
		justify-content: space-between;

		image {
			width: 220rpx;
			height: 219rpx;
		}

		.goods-item {
			width: 220rpx;
			margin-right: 20rpx;

			.title {
				font-size: 22rpx;
				color: #171B25;
				letter-spacing: 2rpx;
				margin: 0rpx;
			}
		}
	}

	.price-number {
		margin: 0 5rpx;
	}

	.goods-tag {
		width: 65rpx;
		height: 24rpx;
		color: #FFFEFE;
		font-size: 16rpx;
		margin-top: 6rpx;
		margin-left: auto;
		line-height: 24rpx;
		text-align: center;
		border-radius: 0 19rpx 0 18rpx;
		background: linear-gradient(0deg, #F2BF85 0%, #EFA10A 100%);
	}
</style>
