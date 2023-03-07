<template>
	<view class="div">
		<!-- 自定义导航 分类-->
		<view class="fixed-box">
			<u-scroll-list :indicator="false" style="background-color: #fff;">
				<view class="uscroll" v-for="(item, index) in tarlist" :key="index" style=""
					@click="fenleibig(item.id,index)">
					<image :src="item.image" mode="heightFix" style="height: 120rpx;padding: 0px 5px;"></image>
					<text v-if="activetext == index"
						style="font-size: 12px;font-weight:bold;color: #FFAA00;">{{item.name}}</text>
					<text v-else style="font-size: 12px; color: #61687C;">{{item.name}}</text>
				</view>
			</u-scroll-list>
		</view>
		<view class="content-box">
			<!-- 侧边导航栏 -->
			<scroll-view scroll-y="true" :scroll-into-view="'nav-' + activeIndex" scroll-with-animation="true">
				<view :class="activeIndex === i ? 'active' : ''" v-for="(item,i) in sidebarList" :key="i" :id="item.id"
					class="tab-item" @click="genleigood(item.id,i)">
					{{item.name}}
				</view>
			</scroll-view>
			<!-- 内容 -->
			<view class="content">
				<view v-for="(item,inx) in targetList" :key="inx" class="cate-item" @click="more(item)">
					<view class="contentview">
						<view class="imageleft" style="width: 30%;text-align: center;">
							<u-image mode="widthFix" width="60px" :src="item.image">
							</u-image>
						</view>
						<view class="wenzxi" style="width: 70%;">
							<text class="u-line-2 ft-24 my-10" style="text-align: left;">{{item.title}}</text>
							<view style="display: flex;">
								<text v-if="item.activity == 'hot'"
									style="font-size: 12px;font-weight: 800;width:40%;color: #fff;background-color: #ff5500;border-radius: 8px 0;">热租</text>
								<text v-if="item.activity == 'new'"
									style="font-size: 12px;font-weight: 800;width:40%;color: #fff;background-color:#ff00ea;border-radius: 8px 0;">爆款</text>
								<text v-if="item.activity != 'new' && item.activity != 'hot'"
									style="font-size: 12px;font-weight: 800;width:40%;color: #fff;background-color:#ffaa00;border-radius: 8px 0;">推荐</text>
								<text
									style="font-size: 14px;font-weight: 800;color: red;text-align: right;">{{item.day_price}}/日</text>
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
				activeIndex: 0,
				sidebarList: [],
				targetList: [],
				allList: [],
				tarlist: [],
				heightele: 0,
				goodlist: [],
				fenleiid: 0,
				fenleinewid: 0,
				activetext: 0
			};
		},
		created() {

			this.fenlei()
		},
		methods: {
			fenleibig(item, index) {
				this.activetext = index || 0
				let opt = {
					url: "/category/fenleismart",
					data: {
						pid: item
					}
				}
				let _this = this
				this.$request(opt).then(res => {
					this.sidebarList = res.data
					this.genleigood(this.sidebarList[0].id)
				})
			},
			genleigood(id, index) {
				this.activeIndex = index || 0

				this.fenleinewid = id
				let opt = {
					url: "/category/fenleigood",
					data: {
						pid: id
					}
				}
				let _this = this
				this.$request(opt).then(res => {
					this.targetList = res.data
					this.goodlist = res.data
				})
			},
			fenlei() {
				let opt = {
					url: "/category/fenleibig",
				}
				let _this = this
				this.$request(opt).then(res => {
					// 打印调用成功回调
					console.log(res)
					this.tarlist = res.data
					this.fenleibig(this.tarlist[0].id, 0)
				})
			},
			sidebarClick(i) {
				this.activeIndex = i
				this.targetList = this.allList[i].children ? this.allList[i].children : []
			},
			more(obj) {
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + obj.id
				})
			},
			search() {
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
					// console.log(res)
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
	.uscroll {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2px 5px 0 8px;
	}

	.contentview {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: stretch;
		width: 100%;
	}

	.fixed-box {
		position: fixed;
		left: 0;
		z-index: 9;
		// top: 98rpx;
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		padding-bottom: 0rpx;
		box-shadow: 0px 1rpx 0px 0px rgba(68, 67, 67, 0.13);
		background-color: #fff;

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
		top: 192rpx;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;

		.tab-item {
			width: 170rpx;
			height: 90rpx;
			color: #61687C;
			font-size: 24rpx;
			font-weight: 400;
			line-height: 90rpx;
			text-align: center;
		}

		.active {
			color: #414960;
			font-size: 24rpx;
			font-weight: bold;
			position: relative;
			background-color: #FFFFFF;
		}

		.activetext {
			color: #414960;
			font-size: 20rpx;
			font-weight: bold;
			position: relative;
			background-color: #FFFFFF;
		}

		.activetext:after {
			color: #ff557f;
			font-size: 20rpx;
			font-weight: bold;
			position: relative;
			background-color: #55ff7f;
		}

		.active:after {
			content: '';
			display: block;
			position: absolute;
			top: 50%;
			width: 10rpx;
			height: 38rpx;
			background: #FFAA00;
			transform: translateY(-50%);
			border-radius: 0 10rpx 10rpx 0;
		}

		scroll-view {
			width: 170rpx;
			height: calc(100vh - 185rpx);
			position: fixed;
		}

		.content {
			position: absolute;
			top: 0px;
			left: 170rpx;
			right: 0;
			// bottom: 0;
			padding: 16px 16px;
			background: #ffffff;
			background-size: contain;
			background-attachment: fixed;
			background-repeat: no-repeat;
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
				border-bottom: 1px solid #f1f1f1;
				// height: 140rpx;
				// margin-bottom: 20rpx;
				padding: 20rpx 0;
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
					color: #1F1F1F;
					font-weight: 400;
					font-size: 22rpx;
					text-align: center;
				}
			}

			// .cate-item:nth-child(3n - 1) {
			// 	margin: 0 0.5%;
			// }

		}
	}
</style>
