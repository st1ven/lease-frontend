<template>
	<view class="div">
		<!-- 自定义导航 分类-->
		<view class="fixed-box">
			<u-scroll-list :indicator="false" style="background-color: #fff;">
				<view class="uscroll" v-for="(item, index) in tarlist" :key="index" @click="fenleibig(item.id,index)">
					<image :src="item.image" mode="widthFix" style="width: 80rpx; margin: 0px 8px;" ></image>
					<text v-if="activetext == index" style="font-size: 12px;font-weight:bold;color: #FFAA00;">{{item.name}}</text>
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
			<view class="content" >
				<view v-if="loading" style="padding: 10px 0;">
					<u-loading-icon color="#ffaa00" text="正在加载..." size="16" :vertical="true" textSize="14"></u-loading-icon>
				</view>
				<view v-for="(item,inx) in targetList" :key="inx" class="cate-item" @click="more(item)">
					<view class="contentview">
						<view class="imageleft" style="width: 30%;text-align: center;">
							<u-image mode="widthFix" width="60px" :src="item.image"></u-image>
						</view>
						<view class="wenzxi" style="width: 70%;">
							<text class="u-line-2 ft-24 my-10" style="text-align: left;">{{item.title}}</text>
							<view class="goods-tags">
								<view class="goods-tag tag-orange" v-if="item.activity == 'hot'">推荐</view>
								<view class="goods-tag tag-purple" v-if="item.activity == 'day'">新品</view>
								<view class="goods-tag tag-red" v-if="item.activity == 'new'">爆款</view>
								<view class="goods-tag">顺丰包邮</view>
							</view>
							<text style="font-size: 14px;font-weight: 800;color: #FF5B56;">￥{{item.day_price}}/天</text>
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
				loading: true,
				activeIndex: 0,
				sidebarList: [],
				targetList: [],
				allList: [],
				tarlist:[],
				heightele:0,
				goodlist:[],
				fenleiid:0,
				fenleinewid:0,
				activetext:0
			};
		},
		created() {
			
			this.fenlei()
		},
		methods: {
			fenleibig(item,index){
				this.activetext = index || 0
				let opt = {
					url: "/category/fenleismart",
					data:{
						pid:item
					}
				}
				let _this = this
				this.$request(opt).then(res => {
					this.sidebarList = res.data
					this.genleigood(this.sidebarList[0].id) 
				})
			},
			genleigood(id,index){
				this.loading = true
				this.activeIndex = index || 0

				this.fenleinewid = id
				let opt = {
					url: "/category/fenleigood",
					data:{
						pid:id
					}
				}
				let _this = this
				this.$request(opt).then(res => {
					this.loading = false
					this.targetList = res.data
					this.goodlist = res.data
				})
			},
			fenlei(){
				let opt = {
					url: "/category/fenleibig",
				}
				let _this = this
				this.$request(opt).then(res => {
					// 打印调用成功回调
					console.log(res)
					this.tarlist = res.data
					this.fenleibig(this.tarlist[0].id,0)
				})
			},
			sidebarClick(i) {
				this.activeIndex = i
				this.targetList =this.allList[i].children? this.allList[i].children : []
			},
			more(obj) {
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + obj.id
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
	.uscroll{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2px 5px 0 8px;
	}
	.contentview{
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
		top: 155rpx;
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

		.goods-tags {
			display: flex;
			gap: 8rpx;
			margin: 15rpx 0;
		}

		.goods-tag {
			color: #4D79FF;
			font-size: 18rpx;
			font-weight: 400;
			width: max-content;
			border-radius: 8rpx;
			padding: 5rpx 10rpx;
			border: .5px solid #4D79FF;
			background: rgba(77, 121, 255, 0.1);
		}

		.tag-red {
			color: #FF5B56;
			border: .5px solid #FF5B56;
			background: rgba(255, 91, 86, 0.1);
		}

		.tag-orange {
			color: #FFAA00;
			border: .5px solid #FFAA00;
			background: rgba(255, 170, 0, 0.1);
		}

		.tag-purple {
			color: #7856FF;
			border: .5px solid #7856FF;
			background: rgba(120, 86, 255, 0.1);
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
			background-repeat:no-repeat;
			display: flex;
			flex-wrap: nowrap;
			align-content: flex-start;
			flex-direction: column;
			align-items: center;
			min-height: 100vh;

			.cate-item {
				// width: 32%;
				width: 100%;
				border-bottom: 1px solid #FAFAFB;
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
					color: #414960;
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
