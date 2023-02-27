<template>
	<!-- 搜索列表 -->
	<view class="page search-page">
		<view class="search-box">
			<!-- <u-search actionText="搜索" show-action animation /> -->
			<u-search placeholder="请输入关键词" actionText="搜索" :clearabled="true" v-model="searchTxt"
				@custom="searchCustom(searchTxt)" @search="searchCustom(searchTxt)"></u-search>
		</view>
		<text class="title">
			热搜榜单
		</text>
		<view class="hot-li" v-for="(item, index) in hotList" @click="searchCustom(item.title)">
			<view class="hot-rank">{{index+1}}</view>
			<view class="hot-txt  u-line-1">{{item.title}}</view>
		</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				searchTxt: "",
				hotList: [],

			};
		},
		onShow() {
			this.init()
		},
		methods: {
			searchCustom (item) {
				console.log(item)
				uni.navigateTo({
					url: '../product-list/product-list?sortFlag=0&type=search&title=' +item
				})
			},
			init(){
				let opt = {
					url: '/search/goods',
					data: {
						status: this.tabStatus,
						pageSize: this.pageSize,
						pageIndex: this.pageIndex
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.hotList = res.data 
					 
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-page {
		height: 100vh;
		background-color: #FFFFFF;

		.search-box {
			padding: 30rpx;
		}

		.title {
			margin: 30rpx;
			color: #1F1F1F;
			font-size: 30rpx;
		}

		.hot-li {
			font-size: 28rpx;
			color: #1F1F1F;
			display: flex;
			padding: 16rpx 0rpx 16rpx 36rpx;
			border-bottom: 1px solid #f1f1f1;
			.hot-rank {
				margin-right: 10rpx;
			}
			.hot-txt {
				width: 90%;
			}
		}

		.hot-box {
			margin: 30rpx;
			display: flex;
			flex-wrap: wrap;
			align-items: center;

			text {
				font-size: 24rpx;
				margin-right: 30rpx;
				padding: 10rpx 15rpx;
				border-radius: 20rpx;
				background-color: #f9f9f9;
			}
		}
	}
</style>
