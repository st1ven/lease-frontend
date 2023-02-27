<template>
	<view class="page goods-detail-page" :style="buyStatus ?'overflow:hidden':'overflow:scroll' ">
		<!-- 轮播大图  商品详情 -->
		<u-swiper :list="goods_data.images" :autoplay="false" height="750rpx" />
		<!-- 简介 -->
		<view class="desc-box">
			<view class="salesclass">
				<view class="" >
					<text class="price-company">¥</text>
					<text class="price-number">{{goods_data.day_price}}</text>
					<text class="price-company">元/天起</text>
				</view>
				<text style="font-size: 12px;color: #999;">
					销量：{{goods_data.sales}}
				</text>
			</view>
			<view class="title">
				{{goods_data.title}}
			</view>
			<text class="ft-24" style="color: #333333;">国行现货 下单速发</text>
			<view class="price-msg">
				<view class="goods-tag">信用免押</view>
				<text class="price-tag">官方质保省心 | 租后服务无忧 </text>
			</view>
		</view>
		<!-- 优惠券 -->
		<iz-cell v-if="couponsopen.couponsopen == '1'" title="优惠券" bold icon="arrow-right" classN="mx-30" @click="cellModal()" :goodId="goods_data.id" />
		<view class="kuang" style="padding: 0 12px;"  v-if="couponsopen.mercouponsopen == '1'">
			<get-coupon :params="zfbparams" :zIndex="9">
				<u-image @click="huodongding" :lazy-load="true" width="100%" :src="image" radius="8px" mode="widthFix"></u-image>
			</get-coupon>

		</view>
		<!-- 商品详情、租赁说明，常用说明 -->
		<view class="detail-box">
			<u-tabs :list="tabList" @click="tabClick" :scrollable="false" lineColor="#92D3FF" :inactiveStyle='{
						color: "#606266",
						transform: "scale(1)"}' :activeStyle="{
						 transform: 'scale(1.05)'
					}"></u-tabs>
		</view>

		<view class="detail-cont"> 
			<u-parse :content="detailtarget.content" :previewImg="false"></u-parse>
		</view>
		<!-- 门店信息 -->
		<view class="Stores-info" @click="shop(Mer_data.id )">
			<view class="buy-name">{{Mer_data.mer_type}}</view>
			<view class="">
				<view class="store-name">
					<u-icon name="coupon" :label="Mer_data.mer_name" labelSize="30rpx" size="38rpx" color="#000"
						labelColor="#000">
					</u-icon>
					
				</view>
				<view class="store-arrow">
					<u-icon name="arrow-right" labelSize="20rpx" labelColor="#000"></u-icon>
				</view>
				<view class="store">
					<text>{{Mer_data.mer_name}}</text>
					<text class="store-phone" v-if="Mer_data.mer_phone">电话：{{Mer_data.mer_phone}}</text>
				</view>
				<view class="store-btn">
					<u-icon name="coupon" label="进店逛逛" labelSize="15rpx" space="3rpx"></u-icon>
				</view>
			</view>
		</view>
		<!-- 购买信息 -->
		<view class="buy-box">
		
			<view class="buy-li">
				<u-icon name="home" labelSize="22rpx" labelColor="#666" label="首页" color="#666" labelPos="bottom"
					@click="goIndex()" size="42rpx">
				</u-icon>
			</view>
			<view class="buy-li">
				<u-icon :name="collectlist.icon" labelSize="22rpx" @click="collect()" size="42rpx"
					:labelColor="collectlist.fontColor" label="收藏" :color="collectlist.fontColor" labelPos="bottom">
				</u-icon>
			</view>
			<view class="buy-li">
				<view class="buy-btn" @click="buyBtn">
					免押租
				</view>
			</view>
		</view>
		<!-- 优惠券 弹出框 -->
		<u-popup :round="13" :show="couponsStatus" @close="couponsStatus = false" :safeAreaInsetBottom="false">
			<view class="coupons-box">
				<view class="coupons-title">领取优惠券</view>
				<view class="" style="min-height: 400rpx;">
					<iz-coupons-item type="1" :goodsId="goods_data.id|| ''" :tokenstatus="tokenstatus"/>
				</view>
				<u-safe-bottom />
			</view>
		</u-popup>
		<u-popup :show="buyStatus" :round="20" mode="bottom" @close="BuyClose" @open="BuyOpen" :closeable="true">
			<iz-buy-popup :goodsId="goodsId"/>
		</u-popup>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collectlist: {
					fontColor: "",
					icon: ""
				}, //收藏的颜色
				detailtarget: {
					inx: 0,
					content: ""
				},
				goodsId: "0",
				tabList: [{
						name: "商品详情",
						type: "0"
					},
					{
						name: "租赁说明",
						type: "1"
					},
					{
						name: "常用说明",
						type: "2"
					},
				],
				couponsStatus: false,
				buyStatus: false, //购买弹窗
				params: {},
				Mer_data: {},
				goods_data: {},
				pageFlag: false,
				paramsid:{},
				tokenstatus:'',
				zfbparams: [],
				image:'',
				couponsopen:{},
				
			};
		},

		onLoad(obj) {
			this.lingquan()
			this.params = obj
			let options = my.getLaunchOptionsSync();
			this.paramsid = options.query
			this.tokenexpir()
		},
		watch: {
		},
		onShow() {
			
			uni.setStorageSync('path', 'goods');
			this.init(this.params.id || this.paramsid.id)
			
			this.lingquan()
			this.imagee()
			
		},
		methods: {
			huodongding(){
				let opt = {
					url: '/index/dingyue?biaoshi=goodsid'
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
			lingquan(){
		
				let opt = {
					url: '/userlingquan'
				}
				this.$request(opt).then(res => {
					this.zfbparams = res.data
				})
			},
			// 检测token是否过期
			tokenexpir(){
				this.tokenstatus = uni.getStorageSync('token')
				if(this.tokenstatus != ''){
					let opt = {
						url: '/index/tokenexpirtime',
						data: {
							token: this.tokenstatus
						}
					}
					this.$request(opt).then(res => {
						if(res.data == '0'){
							uni.removeStorageSync('token');
						}
					})
				}
			},
			goIndex() { 
				uni.switchTab({
					url: '/pages/index/index'
				})
				// my.hideBackHome();
			},
			cellModal() {
				this.couponsStatus = true
			},
			shop(id) {
				if (id == null || id == undefined || id == '') {
					this.goIndex()
				} else {
					uni.navigateTo({
						url: "../order-list/shop?id=" + id,
					});
				}
			},
			tabClick(item) {
				this.detailtarget.inx = item.index
				if (this.detailtarget.inx == 0) {
					this.detailtarget.content = this.goods_data.content
				}
				if (this.detailtarget.inx == 1) {
					this.detailtarget.content = this.goods_data.lease_description
				}
				if (this.detailtarget.inx == 2) {
					this.detailtarget.content = this.goods_data.common_problem
				}
			},
			buyBtn() {
				
				let opt = {
					url: '/index/dingyue?biaoshi=freebutton'
				}
				this.$request(opt).then(res => {
					var dingyueid = res.data
				my.requestSubscribeMessage({
					//好友完成租机通知
					entityIds: dingyueid,
					complete: (res) => {
						this.goodsId = this.goods_data.id
						this.buyStatus = true
					}
				});
				
				})
			},
			BuyClose() {
				this.buyStatus = false
			},
			BuyOpen() {

			},
			init(id) {
				let opt = {
					url: '/goods/details',
					data: {
						id: id
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					// this.list = res.data
					this.goods_data = res.data.goods_data
					this.Mer_data = res.data.Mer_data
					this.detailtarget.content = this.goods_data.content
					this.collectlist = {
						icon: res.data.is_like == "1" ? "star-fill" : "star",
						fontColor: res.data.is_like == "1" ? "#4CC5F8" : "#666"
					}
				})
			},
			//添加/取消收藏
			collect() {
				let url = '';
				let opt = {}
				if (this.collectlist.icon == "star") {
					opt = {
						url: '/goods/add/like',
						data: {
							goods_id: this.goods_data.id
						}
					}
				} else {
					opt = {
						url: '/goods/del/like',
						method: "POST",
						header: "application/x-www-form-urlencoded;charset=utf-8",
						data: {
							ids: this.goods_data.id
						}
					}
				}

				this.$request(opt).then(res => {
					this.collectlist = {
						icon: this.collectlist.icon == "star" ? "star-fill" : "star",
						fontColor: this.collectlist.fontColor == "#4CC5F8" ? "#666" : "#4CC5F8"
					}
					let msg = this.collectlist.icon == "star" ? '取消收藏成功' : res.msg
					this.$refs.uToast.show({
						message: msg,
						icon: "success",
						type: "success"
					})
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.salesclass{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.page {
		height: 100vh;
		background-color: #f0f0f0;
	}

	.goods-detail-page {

		.desc-box {
			padding: 30rpx;
			margin: 15rpx 30rpx;
			border-radius: 14rpx;
			background-color: #FFFFFF;

			.price-company {
				font-size: 24rpx;
			}

			.price-number {
				font-size: 48rpx;
			}

			.title {
				color: #333333;
				margin: 15rpx 0;
				font-size: 28rpx;
				letter-spacing: 2rpx;
			}

			.price-msg {
				margin-top: 18rpx;
				display: flex;
				flex-wrap: nowrap;
				justify-content: start;
				align-items: center;

				.goods-tag {
					color: #2aabe9;
					font-size: 18rpx;
					font-weight: 400;
					width: 75rpx;
					border-radius: 8rpx;
					padding: 5rpx 10rpx;
					border: 1rpx solid #2aabe9;
				}

				.price-tag {
					font-size: 20rpx;
					color: #999;
					margin-left: 13rpx;
				}

				.price-tag:last-child {
					margin-left: auto;
				}
			}

		}

		.detail-box {
			background-color: #fff;
			font-size: 28rpx;
			height: 91rpx;
			margin-top: 18rpx;
			border-radius: 14rpx 14rpx 0px 0px;
		}

		.detail-cont {
			padding: 10rpx;
			min-height: 300rpx;
			margin-bottom: 18rpx;
		}

		.coupons-box {
			// height: 600rpx;
			padding: 30rpx 0;
			border-radius: 26rpx;
			background-color: #fefefd;

			.coupons-title {
				color: #1F1F1F;
				font-size: 30rpx;
				font-weight: bold;
				text-align: center;
			}
		}

		.Stores-info {
			height: 178rpx;
			background-color: #fff;
			font-size: 30rpx;
			box-sizing: border-box;
			font-weight: bold;
			padding: 29rpx 33rpx 12rpx 31rpx;
			display: flex;
			position: relative;
			padding-bottom: 320rpx;

			.store-name {
				display: flex;

				text {
					margin-left: 10rpx;
				}
			}

			.store-arrow {
				position: absolute;
				top: 30rpx;
				right: 34rpx;
			}

			.buy-name {
				margin-right: 53rpx;
			}

			.store-btn {
				line-height: 36rpx;
				width: 106rpx;
				border: 1rpx solid #666666;
				border-radius: 18px;
				font-size: 20rpx;
				padding-left: 15rpx;
			}


			.store {
				font-size: 20rpx;
				color: #666;
				margin-top: 16rpx;
				margin-bottom: 22rpx;
				font-weight: normal;

				.store-phone {
					margin-left: 44rpx;
				}
			}
		}

		.buy-box {
			display: flex;
			position: fixed;
			bottom: 0;
			left: 0;
			height: 120rpx;
			line-height: 120rpx;
			padding: 0rpx 0 22rpx 0;
			background-color: #fff;
			width: 100%;
			align-items: center;
			border-top: 1px solid #f0f0f0;

			.buy-li {
				width: 206rpx;
			}

			.buy-li:first-child {
				border-right: 1px solid #999;
			}

			.buy-btn {
				width: 285rpx;
				height: 81rpx;
				background: linear-gradient(139deg, #92D3FF 0%, #14a3e4 100%);
				border-radius: 20rpx;
				line-height: 81rpx;
				text-align: center;
				color: #fff;
				font-size: 30 rpx;
			}
		}
	}
</style>
