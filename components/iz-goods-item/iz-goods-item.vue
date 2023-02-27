<template>
	<view class="iz-goods-tpl" :style="'background-color:'+Bgc || '#f0f0f0'">
		<view class="iz-goods-item" v-for="(item,index) in Lists" :key="index" :style="itemStyle"
			@click="JumpDetail(item)">
			<view class="iz-img-box" :style="'height:'+ImgBoxH">
				<slot name="img">
					<!-- <u-image width="188rpx" height="242rpx" src="/static/index-icon/10.webp" /> -->
					<u-image width="188rpx" height="242rpx" :src="item.image">
						<view slot="error" style="font-size: 24rpx;" errorIcon="trash" width="100%" height="100%">加载失败
						</view>
					</u-image> 
				</slot>
			</view>
			<u-divider :hairline="true" lineColor="#eaeaea"></u-divider>
			<view class="goods-title u-line-1">
				{{item.title}}
			</view>
			<view class="goods-price">
				<!-- <text class="price-company">¥</text> -->
				<text class="price-number">¥{{item.day_price}}</text>
				<text class="price-company">/天</text>
				<view class="goods-tag" v-if="credit==true">信用免押</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "iz-goods-item",
		props: {
			width: {
				type: String,
				default: '48%'
			},
			ImgBoxH: {
				type: String,
				default: '100%',
			},
			Bgc: String,

			credit: true,
			newList: {},

		},
		computed: {
			itemStyle() {
				return {
					width: this.width
				}
			}
		},
		created() {},
		watch: {
			newList(newVal, oldVal) {
				this.Lists = newVal
			}
		},
		data() {
			return {
				Lists: this.newList
			};
		},
		methods: {
			JumpDetail: (obj) => {
				uni.navigateTo({
					url: '../../pages/goods-detail/goods-detail?id=' + obj.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.iz-goods-tpl {
		padding: 0 40rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		background-color: #F0F0F0;
		width: 100%;
		box-sizing: border-box;
	}

	.iz-goods-item {
		margin : 15rpx 0;
		border-radius: 14rpx;
		background-color: #FFFFFF;

		.iz-img-box {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #FFFFFF;
		}

		.goods-title {
			font-size: 24rpx;
			color: #1F1F1F;
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
</style>
