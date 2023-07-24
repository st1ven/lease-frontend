<template>
	<view style="background-color: #f6f6fb;">
		<!-- 自定义导航 分类-->
		<view class="fixed-box">
			<view class="search-box" @click="search()">
				<u-icon name="search" color="#9FA3B0" />
				<text class="title">请输入</text>
			</view >
		</view>
		<view class="content-box">
			<!-- 侧边导航栏 -->
			<scroll-view scroll-y="true" :scroll-into-view="'nav-' + activeIndex" scroll-with-animation="true">
				<view :class="activeIndex === i ? 'active' : ''" v-for="(item,i) in sidebarList" :key="i" :id="item.id"
					class="tab-item" @click="sidebarClick(i)">
					{{item.name}}
				</view>
			</scroll-view>
			<!-- 内容 -->
			<view class="content" >
				<view v-for="(item,inx) in targetList" :key="inx" class="cate-item" @click="more(item)">
					<view class="image-box">
						<u-image width="100%" mode="aspectFit" height="180rpx" style="border-radius:10px;" :src="item.image">
							<template v-slot:loading>
								<u-loading-icon color="#ccc"></u-loading-icon>
							</template>
							<view slot="error" style="font-size: 20rpx;color: #ccc">加载失败</view>
						</u-image>
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
				activeIndex: 0,
				sidebarList: [],
				targetList: [],
				allList: []
			};
		},
		created() {
			this.allListFunc()
		},
		methods: {
			sidebarClick(i) {
				this.activeIndex = i
				this.targetList =this.allList[i].children? this.allList[i].children : []
			},
			more(obj) {
				uni.navigateTo({
					url: "../product-list/product-list?sortFlag=0&platform=admin&id=" + obj.id
				})
			},
			search(){
				uni.navigateTo({
					url: "../search/search"
				})
			},
			allListFunc() {
				let opt = {
					url: "/category/index",
				}
				let _this = this
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.allList = res.data

					this.allList.forEach((item, i) => {
						_this.sidebarList.push({
							name: item.name,
							id: item.id
						})
						if (i == 0) {
							_this.targetList = item.children
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fixed-box {
		position: fixed;
		left: 0;
		z-index: 9;
		top: 98rpx;
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		padding-bottom: 15rpx;
		box-shadow: 0px 1rpx 0px 0px rgba(68, 67, 67, 0.13);

		.search-box {
			width: 400rpx;
			display: flex;
			border-radius: 10px;
			align-items: center;
			flex-direction: row;
			background: #F9F9F9;
			margin-left: 30rpx;
			padding: 0 30rpx;

			.title {
				opacity: 0.8;
				color: #909090;
				margin-left: 15rpx;
			}
		}
	}

	.content-box {
		position: relative;
		top: 185rpx;
		left: 0;
		right: 0;
		bottom: 0;
		background: #F0F0F0;

		.tab-item {
			width: 170rpx;
			
			height: 90rpx;
			color: #171B25;
			font-size: 24rpx;
			font-weight: 400;
			line-height: 90rpx;
			text-align: center;
		}

		.active {
			color: #171B25;
			font-size: 30rpx;
			font-weight: bold;
			position: relative;
			background-color: #FFFFFF;
			border-radius: 0 10rpx 10rpx 0;
		}

		.active:after {
			content: '';
			display: block;
			position: absolute;
			top: 50%;
			width: 10rpx;
			height: 38rpx;
			background: #ff6633;
			transform: translateY(-50%);
		}

		scroll-view {
			width: 170rpx;
			height: calc(100vh - 185rpx);
			position: fixed;
		}

		.content {
			position: absolute;
			top: 0px;
			left: 91px;
			right: 0;
			// bottom: 0;
			padding: 16px 16px;
			background: #ffffff;
			background-size: contain;
			background-attachment: fixed;
			background-repeat:no-repeat;
			// border-radius: 7px 7px 0 0;
			border-radius: 0 7px;
			display: flex;
			flex-wrap: nowrap;
			align-content: flex-start;
			flex-direction: column;
			align-items: center;

			.cate-item {
				// width: 32%;
				width: 100%;
				// height: 140rpx;
				margin-bottom: 20rpx;
				padding: 15rpx 0;
				display: flex;
				align-items: center;
				flex-direction: column;
					
				.image-box {
					height: 123rpx;
					// width: 90rpx;
					width: 100%;
					margin: 0 auto;
				}

				text {
					// width: 80%;
					width: 100%;
					color: #171B25;
					font-weight: 400;
					font-size: 22rpx;
					text-align: center;
				}
			}

		}
	}
</style>
