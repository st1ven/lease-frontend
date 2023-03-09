<template>
	<!--  -->
	<view :style="{backgroundColor:xinxi.backgroundcolor}">
		
		<!-- <view style="background-color: aqua;"> -->
		<view class="Daily_new" >
				<view class="Daily">
				<image class="topimage" :lazy-load="true" :src="xinxi.top_image" mode="widthFix" ></image>
				<view :style="{backgroundImage:'url('+xinxi.goods_image+')'}" style="z-index: 9999;">
				<view class="kuang" style="padding: 10px 12px;"   v-if="couponsopen.mercouponsopen == '1'">
					<get-coupon :params="zfbparams" :zIndex="9999">
						
						<u-image v-if="xinxi.couponimage" @click="huodongding" :lazy-load="true" width="100%" :src="xinxi.couponimage" radius="8px" mode="widthFix"></u-image>
						<u-image v-else @click="huodongding" :lazy-load="true" width="100%" :src="image" radius="8px" mode="widthFix"></u-image>
					</get-coupon>
				</view>
				<view v-if="loadding" style="padding-top: 20px;">
					<u-loading-icon  color="#ffaa00" text="正在加载..." size="16" :vertical="true" textSize="14"></u-loading-icon>
				</view>
				<image :src="xinxi.background_image" mode="widthFix" style="width: 100%;"></image>
					
				<view class="topgoods" style="padding:0 10px;">
					<view v-for="(item,index) in data.slice(0,4)" :key="index" @click="JumpDetail(item)" class="topdisplay" :style="{backgroundImage:'url('+xinxi.goodbackground+')'}">
						<view class="toptwo" >
							<view class="onetext">
								{{item.title}}
							</view>
							<image :src="xinxi.bottom_image" mode="widthFix" style="width: 100%;"></image>
							<image v-if="xinxi.textstatus == '0' || xinxi.textstatus == '2'" :src="xinxi.ext1_image" mode="widthFix" style="width: 100%;"></image>
							<view  v-else class="oneimage" :style="{backgroundImage:'url('+xinxi.ext1_image+')'}">
								<text  class="onetextbo">爆款专享价<text style="color: #ffd900;">{{item.price}}</text>元/天起</text>
							</view>
						</view>
						<image :src="item.image"  style="width:120rpx;padding: 10px;height:120rpx;"></image>
					</view>
					
				</view>	
				<view class="iz-goods-tpl">
					<view class="iz-goods-item" v-for="(item,index) in data.slice(4,data.length)" :key="index" @click="JumpDetail(item)" :style="{backgroundImage:'url('+xinxi.banner_image+')'}">
						<view class="iz-img-box">
							<image  :src="item.image" mode="widthFix" style="width: 80px;"></image>
						</view>
						<view class="onetext" style="width: 80%;font-size: 12px;">
							{{item.title}}
						</view>
						<image :src="xinxi.bottom_image" mode="widthFix" style="width: 80%;margin: 10px 0pt;"></image>
						<image v-if="xinxi.textstatus == '1' ||  xinxi.textstatus == '2'" :src="xinxi.ext2_image" mode="widthFix" style="width: 80%;margin: 10px 0pt;"></image>
						<view class="" v-else style="padding: 0 15px 10px;">
							<view  v-if="xinxi.ext2_image  == ''" class="oneimage" :style="{backgroundImage:'url('+xinxi.ext1_image+')'}">	
									<text class="onetextbo" style="font-size: 10px;padding: 2px 10px;">专享<text style="color: #ffd900;">{{item.price}}</text>元/天起</text>
							</view>
							<view  v-else class="oneimage" :style="{backgroundImage:'url('+xinxi.ext2_image+')'}">
									<text class="onetextbo" style="font-size: 10px;padding: 2px 10px;">专享<text style="color: #ffd900;">{{item.price}}</text>元/天起</text>
							</view>
						</view>
					</view>
				</view>
				</view>
				</view>
				<view class="box" v-if="xinxi.rules" style="padding: 200rpx 60rpx 300rpx;text-align: left;" :style="{backgroundImage:'url('+xinxi.bottom_image+')'}">
					<u-parse :content="xinxi.rules" :previewImg="false"></u-parse>
				</view>
				<!-- <image v-if="!(xinxi.rules)" :src="xinxi.bottom_image" style="width: 100%;" mode="widthFix"></image> -->
			</view>
		</view>
	</view>
</template>

<script> 
	export default {
		data() {
			return {
				topimage:'',
				good:[],
				data:[],
				tittle:'',
				xinxi:{},
				tokenstatus:'',
				userid:'',
				zfbparams: [],
				image:'',
				couponsopen:{},
				loadding:true,
				indexstatus:''
				
			};
		},
		onShow() {	
			// this.swiperList()
			this.tokenstatus = uni.getStorageSync('token')
			
		},
		onLoad(index) {
			this.huoqu(index.id || 5)
			this.userid = index.userid
			this.cookiee()
			uni.setNavigationBarTitle({
				title: index.title || "活动专区"
			})
			this.lingquan(index.id || 5)
			this.imagee()
		},
		methods: {
			huodongding(){
				let opt = {
					url: '/index/dingyue?biaoshi=copus'
				}
				this.$request(opt).then(res => {
					var dingyueid = res.data
				my.requestSubscribeMessage({
					//优惠券到期提醒，优惠券领取提醒
					entityIds: dingyueid,
					fail: (res) => {
						uni.showToast({
							title: res.errorMessage || '订阅成功',
							duration: 3000,//单位毫秒
							icon:'none'
						});
					}
				});
				})
			},
			imagee(){
				let opt = {
					url: '/userlingquanimage'
				}
				this.$request(opt).then(res => {
					this.image = res.data
					this.couponsopen = res.url
				})
			},
			lingquan(id){
		
				let opt = {
					url: '/userlingquan?id=' + id
				}
				this.$request(opt).then(res => {
					this.zfbparams = res.data
				})
			},
			JumpDetail(item) {
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + item.id
				})
			},
			// 轮播图数据
			huoqu(index) {
				let opt = {
					url: '/activity?id=' + index
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.data = res.data
					// console.log(JSON.stringify(res))
					this.xinxi = res.url
					this.loadding = false
				})
			},
			cookiee(){
				if(this.userid){
					uni.setStorage({
						key: 'yaouserid',
						data: this.userid,
					});
					// console.log(this.userid)
					let opt = {
						url: '/index/yaoqing',
						data: {
							yaouserid:this.userid,
						}
						
					}
					this.$request(opt).then(res => {
						// 打印调用成功回调
						console.log(1)
						console.log(res)
						console.log(2)
					})
				}else{
					uni.setStorage({
						key: 'yaouserid',
						data: '0',
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.onetext{
		font-size: 16px;
		font-weight: 800;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.toptwo{
		display: flex;
		flex-direction: column;
		align-items: stretch;
		flex-wrap: nowrap;
		justify-content: space-around;
		width: 65%;
	}
	.topdisplay{
		background-size: 100% 100%;
		display: flex;padding: 25px;
		flex-direction: row;
		justify-content: space-evenly;
		margin: 10px 0;
	}
	.topbang{
		position: absolute;
		border-radius: 0 0 6px 6px;
		padding: 1px 5px;
		color: #fff;
		margin-left: 9px;
		font-size: 14px;
		z-index: 1;
	}
	.oneimage{
		padding: 5px;
		background-size:100% 100%;
	}
	.onetextbo{
		font-size: 12px;
		color: white;
		text-align: center;
		display: flex;
		align-items: center;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		padding-bottom: 5px;
	}
	.iz-goods-tpl {
		padding: 0 20rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		// background-color: #F6F6FB;
		width: 100%;
		box-sizing: border-box;
	}
	
	.iz-goods-item {
		width: 48%;
		margin : 0 0 15rpx 0;
		border-radius: 14rpx;
		background-size: 100% 100%;
		padding: 15px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		.iz-img-box {
			padding: 5px;
		}
	
		.goods-title {
			font-size: 24rpx;
			color: #171B25;
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
	.rmb {
		font-size: 26rpx;
		color: #E3BE83;
	}
	
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 400rpx;
		z-index: -2;
		
		&-img {
			width: 100%;
			height: 100%;
		}
	}

	.Used_an {
		// background-image: url("https://oss.jiulove.cn/zl/ershou.png");
		height: 100%;
		background-size: 100%;
		// margin-bottom: 0.2rem;
		// padding-top: 4.8rem;

	}
	.topimage{
		width: 100%;
		// padding: 10px;
	}
	
</style>

