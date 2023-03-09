<template>
	<view>
		<view class="swiper-box">
			<u-swiper indicator previousMargin="30" nextMargin="30" circular :autoplay="false" radius="5" @click="bann"
				:list="bannerList" />
		</view>
		<view class="zhuanqu" v-for="(item,i) in secondList" :key="i" v-if="item.list[0]"
			:style="{backgroundImage:'url('+imageurl+')'}">
			<view class="title-box" v-if="item.list[0]">
				<text class="title">{{item.name}}</text>
				<view class="flex align-center ml-auto" @click="JumpDetail(item.id)">
					<text class="more">查看更多</text>
					<u-icon color="#fff" size="14" name="arrow-right-double" />
				</view>
			</view>
			<view class="flex flexxx">
				<scroll-view scroll-x="true" class="flex">
					<view class="goods-box">
						<view v-for="(list,index) in item.list" :key="index" class="goods-item" @click="Jumplist(list)">
							<image mode="aspectFit" :src="list.image" />
							<view class="title u-line-2">
								{{list.title}}
							</view>
							<view class="goods-price">
								<!-- <text class="price-company">¥</text> -->
								<text class="price-number">¥{{list.day_price}}</text>
								<text class="price-company">/天起</text>
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
				good: [],
				imageurl: '',
			};
		},
		onShow() {
			this.swiperList()

		},
		onLoad(obj) {
			uni.setNavigationBarTitle({
				title: obj.title
			});
			this.init(obj.id)
			this.gonggeimg()
		},
		methods: {
			tanchuceng() {
				uni.showActionSheet({
					itemList: ['A', 'B', 'C'],
					success: function(res) {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			},
			bann(index) {
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + this.good[index].good_id
				})
			},
			JumpDetail: (item) => {
				// console.log(JSON.stringify(item))
				uni.navigateTo({
					url: "../product-list/product-list?sortFlag=0&id=" + item
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
			gonggeimg() {
				let opt = {
					url: '/gonggeimage'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.imageurl = res.data
				})
			},
			init(id) {
				let opt = {
					url: '/second/gongge',
					data: {
						id: id //分类id
					}
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

	.zhuanqu {
		// background-image: url(https://oss.jiulove.cn/uploads/20220311/ba86729c56c76a4806e7e73d88d676f3.png);
		width: 96%;
		margin: 0 2% 2%;
		border-radius: 10px;
		padding-bottom: 15px;
		background-repeat: round;
	}

	.flexxx {
		background: #fff;
		width: 94%;
		margin-left: 3%;
		border-radius: 10px;
		padding: 10px 0 10px;
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
			color: #fff;
			font-size: 24rpx;
			margin-left: auto;
		}
	}

	.goods-box {
		display: flex;
		flex-direction: row;
		padding: 0 30rpx;
		justify-content: flex-start;

		image {
			width: 220rpx;
			height: 219rpx;
		}

		.goods-item {
			width: 220rpx;
			margin-right: 20rpx;

			.title {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
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
		background: linear-gradient(0deg, #ff9090 0%, #ff0000 100%);
	}
</style>
