<template>
	<view class="iz-goods-tpl" :style="'background-color:'+Bgc || '#f6f6fb'">
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
			<view class="goods-title" :class="textLine || 'u-line-1'">
				{{item.title}}
			</view>
			<view class="goods-tags" v-if="credit==true">
				<view class="goods-tag tag-red">{{conditionMap[item.condition]}}</view>
				<view class="goods-tag">{{item.activity == '' ? '精品推荐' : activityMap[item.activity]}}</view>
				<view class="goods-tag" v-if="credit==true">信用免押</view>
			</view>
			<view class="goods-price">
				<!-- <text class="price-company">¥</text> -->
				<text class="price-number">¥{{item.day_price}}</text>
				<text class="price-company">/天</text>
				<view class="goods-info">{{item.show_sales}}人已租</view>
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
			textLine: String,
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
				Lists: this.newList,
				activityMap: {
					hot: '热门推荐',
					day: '每日新品',
					new: '最新上市',
					popular: '爆款电脑'
				},
				conditionMap: {
					new: '全新',
					second: '二手'
				}
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
		padding: 0 12px 8px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		background-color: #f6f6fb;
		width: 100%;
		box-sizing: border-box;
	}

	.iz-goods-item {
		margin: 16rpx 0;
		border-radius: 14rpx;
		background-color: #FFFFFF;

		.iz-img-box {
			display: flex;
			border-radius: 14rpx;
			align-items: center;
			justify-content: center;
			background: #FFFFFF;
		}

		.goods-title {
			font-size: 24rpx;
			color: #414960;
			margin: 16rpx;
		}

		.goods-price {
			margin: 0 16rpx 16rpx 16rpx;
		}

		.goods-info {
			color: #9FA3B0;
			font-size: 18rpx;
			font-weight: 400;
			margin-left: auto;
		}

		.goods-tags {
			display: flex;
			gap: 8rpx;
			margin: 16rpx;
		}

		.goods-tag {
			color: #4D79FF;
			font-size: 18rpx;
			font-weight: 400;
			width: max-content;
			border-radius: 8rpx;
			padding: 4rpx 10rpx;
			border: .5px solid #4D79FF;
			background: rgba(77, 121, 255, 0.1);
		}

		.tag-red {
			color: #FF5B56;
			border: .5px solid #FF5B56;
			background: rgba(255, 91, 86, 0.1);
		}
	}
</style>
