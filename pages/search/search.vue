<template>
	<!-- 搜索列表 -->
	<view class="page search-page">
		<view class="search-box">
			<!-- <u-search actionText="搜索" show-action animation /> -->
			<u-search placeholder="请输入关键词" actionText="搜索" :clearabled="true" v-model="searchTxt"
				@custom="searchCustom(searchTxt)" @search="searchCustom(searchTxt)" animation></u-search>
		</view>
		<text class="title">
			<text style="color: #FF5B56;">热搜</text>榜单
		</text>
		<view class="hot-li" v-for="(item, index) in hotList" @click="searchCustom(item.title)">
			<view class="hot-rank" :class="'hot-rank-'+(index+1)">{{index+1}}</view>
			<view class="hot-txt u-line-1">{{item.title}}</view>
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
					data: {}
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

		/deep/ .u-search__content {
			border-radius: 10rpx!important;
			background: #F1F2F5!important;
		}

		/deep/ .u-search__content__input {
			background-color: #F1F2F5!important;
		}

		/deep/ .u-search__action {
			color: #414960!important;
		}

		.title {
			margin: 30rpx;
			font-weight: 600;
			color: #414960;
			font-size: 30rpx;
		}

		.hot-li {
			font-size: 28rpx;
			color: #414960;
			display: flex;
			padding: 32rpx 0rpx 26rpx 40rpx;
			border-bottom: 1px solid #FAFAFB;
			.hot-rank {
				width: 32rpx;
				height: 32rpx;
				line-height: 32rpx;
				text-align: center;
				border-radius: 4px;
				color: #FF5B56;
				margin-right: 16rpx;
			}
			.hot-rank-1 {
				color: #fff;
				font-size: 24rpx;
				font-weight: bold;
				background-color: #FF5B56;
			}
			.hot-rank-2 {
				color: #fff;
				font-size: 24rpx;
				font-weight: bold;
				background-color: #ff6921;
			}
			.hot-rank-3 {
				color: #fff;
				font-size: 24rpx;
				font-weight: bold;
				background-color: #ffaa00;
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
