<template>
	<view class="page eve_page" :class="params.type==1?'Daily-page':(params.type==2?'Used_an-page':'Hot_pc-page')" style="background-color: #f6f6fb;">
		
		
			<view class="Daily" style="margin-bottom: 50px;" :style="{backgroundColor:background}">
				<image  class="topimage" :src="imageurl" mode="widthFix" ></image>
				<view class="rank-box boxx"  :style="{backgroundImage:'url('+list.remarkstop+')'}"   v-if="params.id == '1'">
							<scroll-view scroll-x="true" class="flex" style="padding-top: 40px;">
								<!-- #ifdef H5 -->
								<view class="diso">
								<!-- #endif -->
								<view class="rank-item" :style="{backgroundImage:'url('+list.remarksbackground+')'}" v-for="(item,i) in list.coupons" :key="i" @click="receive(item)">
									<view class="quantou">
										<text style="color: #5b3c27;">
											<text style="font-size: 30px;">
											{{item.amount}}
											</text>元
										</text>
									</view>
									<view class="goods-price">
										<text class="price-number">立减{{item.amount}}元</text>
									</view>
								</view>
								<!-- #ifdef H5 -->
								</view>
								<!-- #endif -->
							</scroll-view>
							
				</view>
				
				<view class="baoguo">
				<view class="shangp" v-for="(item,inx) in list.goods" :key="inx"  v-if="params.id == '3' || params.id == '4'">
					<view class="jieshao" >
						<u-image :showLoading="true" :src="item.image" width="150rpx" height="150rpx" bgColor="#ccc">
						</u-image>
						<view class="title">{{item.title}}</view>
						<view class="buttonzu" @click="JumpDetail(item)" :style="{backgroundColor:background}">立即抢租</view>
					</view>
				</view>
				
				<image  class="topimage" style="margin-bottom: 50px;" :src="bottomimage" mode="widthFix" ></image>
			</view>
		</view>	
	</view>

</template>

<script>
	export default {

		data() {
			return {
				params: {},
				list: [],
				background:'',
				imageurl:'',
				bottomimage:''
				
			};
		},
		onLoad(obj) {
			this.params = obj
			uni.setNavigationBarTitle({
				title: obj.title,
			})
		},
		watch: {
			// params(newVal, oldVal) {
			// 	this.params = newVal
			// 	this.list = []
			// 	console.log(JSON.stringify(list))
			// }
		},
		onShow() {
				this.newFunc()
		},
		methods: { 
			receive(item) {
				let opt = {
					url: '/goods/receive/coupons',
					data: {
						coupons_id: item.id
					}
				}
				this.$request(opt).then(res => {					 
					uni.showToast({
						title: res.msg || "获取数据失败"
					})
				})
				uni.navigateTo({
					url: '/pages/product-list/product-list?sortFlag=2&coupons_id=' + item.id
				})
			},
			JumpDetail(item) {
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + item.id
				})
			},

			newFunc() {
				let opt = {
					data:{
						id: this.params.id
					},
					url: '/goods/membergoods',
					
					// pageSize: 10,
					// pageIndex: 1
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					// if (res.code == 1) {
						this.list = res.data
						this.background = res.data.background
						this.imageurl = res.data.imageurl
						this.bottomimage = res.data.bottomimage
					// }
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.shangp{
		width: 40%;
		background: #fff;
		padding: 10px 5px;
		border-radius: 10px;
		margin: 10px 5px;
	}
	.price-number{
		padding: 10px 0px;
		border-radius:10px ;
		color: #f5e5cd;
		font-size: 10px;
	}
	.quantou{
		text-align: center;
		padding: 20px 10px;
		border-radius:10px;
	}
	.baoguo{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.jieshao{
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
	}
	.title{
		white-space: nowrap;
		overflow: hidden;
		width: 100%;
		text-overflow :ellipsis;
		font-size: 15px;
		padding: 10px 0;
		text-align: center;
	}
	.rank-item{
		border-radius: 10px;
		background-size: 100% 100%;
	}
	.buttonzu{
		padding: 3px 10px;
		color: #fff;
		border-radius: 10px 0;
	}
	.eve_page {
		height: 100vh;
		width: 100%;
		position: relative;
	}

	.Daily-page,
	.Daily_new {
		background-attachment: fixed;
	}
	
	.topimage{
		width: 100%;
		// padding: 10px;
	}
	.rank-box {
		margin-top: 15rpx;
		padding: 30rpx 0;
		background-color: #FFFFFF;
		background-size: 100% 100%;
		.title-box {
			display: flex;
			align-items: center;
			flex-direction: row;
			margin: 0 30rpx 0 30rpx;
	
			.title {
				font-size: 32rpx;
				font-weight: bold;
			}
	
			.more {
				color: #61687C;
				font-size: 24rpx;
				margin-left: auto;
			}
		}
	
		scroll-view {
			width: 100%;
			margin-top: 30rpx;
			white-space: nowrap;
		}
	
		.goods-price {
			// align-items: center;
			justify-content: center;
		}
	}
	.diso{
		display: flex;
	}
	.rank-item {
		display: flex;
		margin-left: 20rpx;
		width: 30%;
		flex-direction: column;
		padding: 20rpx 0 10rpx 0;
		image {
			margin: 0 auto;
		}
	
		&:last-child {
			margin-right: 30rpx;
		}
	
		&>text {
			// text-align: center;
		}
	}
</style>
