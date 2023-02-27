<template>
	<view>
		<view class="zone-box" v-for="(item,i) in list" :key="i">
			<view class="flex align-center mx-15 mt-10 mb-15">
				<text class="title-color ft-30 ft-bold">{{item.name}}</text>
				<text class="ml-auto ft-24 sub-color" @click="more(item)">查看更多</text>
			</view>
			<view class="goods-box flex">
				
					<view class="iz-goods-tpl">
						<view class="iz-goods-item" v-for="(items,index) in item.list" :key="index"
							@click="JumpDetail(items)">
							<view class="iz-img-box">
								<slot name="img">
									<u-image width="200rpx" height="242rpx" :src="items.image">
										<view slot="error" style="font-size: 24rpx;" errorIcon="trash" width="100%"
											height="100%">加载失败
										</view>
									</u-image>
								</slot>
							</view>
							<view class="goods-title u-line-1">
								{{items.title}}
							</view>
							<view class="goods-price">
								
								<text class="price-number">¥{{items.price}}</text>
								<text class="price-company">/天</text>
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
				list: []
			};
		},
		onLoad(obj) {
			this.params = obj
			console.log(obj)
			uni.setNavigationBarTitle({
				title: obj.title
			})
		},
		watch: {
			params(newVal, oldVal) {
				this.params = newVal
			}
		},
		onShow() {
			this.list = []
			if (this.params.type == 1) {
				this.init('phone')  //手机查看更多
			}
			if (this.params.type == 2) {
				this.init('computer') //电脑查看更多
			}
		},
		methods: {
			more(obj) {
				console.log(obj, 'obj')
				uni.navigateTo({
					url: "../product-list/product-list?sortFlag=" + 0 + "&id=" + obj.id
				})
			},
			JumpDetail: (item) => {
				uni.navigateTo({
					url: '../../pages/goods-detail/goods-detail?id=' + item.id
				})
			},
			init(url) {
				let opt = {
					url: '/' + url + '/plate'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.list = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.zone-box {
		margin: 30rpx 15rpx;
		padding: 40rpx 20rpx;
		border-radius: 20rpx;
		background-color: rgba($color: #B5E1FF, $alpha: 0.22);
	}

	.goods-box {
		display: flex;

		.iz-goods-tpl {
			padding: 0 40rpx;
			display: flex;
			flex-wrap: no-wrap;
			justify-content: flex-start;
			width: 100%;
			overflow: hidden;
		}

		.iz-goods-item {
			margin-top: 15rpx;
			margin-right: 20rpx;
			border-radius: 14rpx;
			background-color: #FFFFFF;
			width: 50%;

			.iz-img-box {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #F9F9F9;
				width: 300rpx;
				height: 346rpx;
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
	}
</style>
