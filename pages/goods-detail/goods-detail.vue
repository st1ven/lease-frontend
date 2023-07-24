<template>
	<view class="page goods-detail-page" :style="buyStatus ? 'overflow:hidden' : 'overflow:scroll'" style="background-color: #f6f6fb;">
		<!-- 轮播大图  商品详情 -->
		<u-swiper :list="goods_data.images" :autoplay="false" radius="0" height="750rpx" />
		<!-- 简介 -->
		<view class="price-box salesclass">
			<view>
				<text class="price-company">¥</text>
				<text class="price-number">{{goods_data.day_price}}</text>
				<text class="price-company">元/天起</text>
			</view>
			<view>
				<text style="width: 100%; font-size: 12px; text-align: right; color: #FFF;">
					{{goods_data.sales}}人已租
				</text>
			</view>
		</view>
		<view class="desc-box">
			<view class="goods-tags">
				<view class="goods-tag tag-red">全新</view>
				<view class="goods-tag">{{goods_data.mer_text}}</view>
				<view class="goods-tag">顺丰包邮</view>
			</view>
			<view class="title">
				{{goods_data.title}}
			</view>
			<view class="bannerbottom">
				<image v-for="(item,index) in banner_bottom" :key="index" :src="item" mode="widthFix"></image>
			</view>
		</view>
		<view class="select-box" @click="buyBtn">
			<view class="salesclass">
				<view class="select-row" style="padding: 0 0 24rpx 0;">
					<view class="select-title">选择</view>
					<view class="select-desc">请选择：规格；颜色；租期；套餐；保障服务；</view>
				</view>
				<view class="select-row" style="padding: 0 0 24rpx 0;">
					<u-icon name="arrow-right" color="#61687C" size="26rpx"></u-icon>
				</view>
			</view>
			<view class="select-row" style="padding: 24rpx 0 0 0;">
				<view class="select-title">发货</view>
				<view class="select-desc">顺丰快递 | 寄出包邮</view>
			</view>
		</view>
		<!-- 优惠券 -->
		<iz-cell v-if="couponsopen.couponsopen == '1'" title="优惠券" bold icon="arrow-right" classN="mx-30"
			@click="cellModal()" :goodId="goods_data.id" />
		<view class="kuang" style="padding: 0 12px;" v-if="couponsopen.mercouponsopen == '1'">
			<get-coupon :params="zfbparams" :zIndex="9">
				<u-image @click="huodongding" :lazy-load="true" width="100%" :src="image" radius="8px" mode="widthFix">
				</u-image>
			</get-coupon>

		</view>
		<!-- 商品详情、租赁说明，常用说明 -->
		<view class="detail-box">
			<u-tabs :list="tabList" @click="tabClick" :scrollable="false" lineColor="#FF6633" :inactiveStyle='{
						color: "#61687C",
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
					<u-icon name="coupon" :label="Mer_data.mer_name" labelSize="30rpx" size="38rpx" color="#171B25"
						labelColor="#171B25">
					</u-icon>
				</view>
				<view class="store-arrow">
					<u-icon name="arrow-right" labelSize="20rpx" labelColor="#171B25"></u-icon>
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
				<u-icon name="home" labelSize="22rpx" labelColor="#61687C" label="首页" color="#61687C" labelPos="bottom"
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
					<iz-coupons-item type="1" :goodsId="goods_data.id|| ''" :tokenstatus="tokenstatus" />
				</view>
				<u-safe-bottom />
			</view>
		</u-popup>
		<u-popup :show="buyStatus" :round="20" mode="bottom" @close="BuyClose" @open="BuyOpen" :closeable="true">
			<iz-buy-popup :goodsId="goodsId" />
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
				banner_bottom: [],
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
						name: "常见问题",
						type: "2"
					},
				],
				couponsStatus: false,
				buyStatus: false, //购买弹窗
				params: {},
				Mer_data: {},
				goods_data: {},
				pageFlag: false,
				paramsid: {},
				tokenstatus: '',
				zfbparams: [],
				image: '',
				couponsopen: {},

			};
		},

		onLoad(obj) {
			this.lingquan()
		this.params = obj;
		let options = uni.getLaunchOptionsSync();
			this.paramsid = options.query
			this.tokenexpir()
		},
		watch: {},
		onShow() {
			uni.setStorageSync('path', 'goods');
			this.init(this.params.id || this.paramsid.id)
			this.lingquan()
			this.imagee()
			this.bottomImage()
		},
		methods: {
			huodongding() {
				let opt = {
					url: '/index/dingyue?biaoshi=goodsid'
				}
				this.$request(opt).then(res => {
					var dingyueid = res.data
				uni.requestSubscribeMessage({
						//优惠券到期提醒，优惠券领取提醒
						entityIds: dingyueid,
						fail: (res) => {
							uni.showToast({
								title: res.errorMessage || '订阅成功',
								duration: 3000, //单位毫秒
								icon: 'none'
							});
						}
					});
				})
			},

			imagee() {
				let opt = {
					url: '/userlingquanimage'
				}
				this.$request(opt).then(res => {
					this.image = res.data
					this.couponsopen = res.url
				})
			},
			lingquan() {

				let opt = {
					url: '/userlingquan'
				}
				this.$request(opt).then(res => {
					this.zfbparams = res.data
				})
			},
			// 检测token是否过期
			tokenexpir() {
				this.tokenstatus = uni.getStorageSync('token')
				if (this.tokenstatus != '') {
					let opt = {
						url: '/index/tokenexpirtime',
						data: {
							token: this.tokenstatus
						}
					}
					this.$request(opt).then(res => {
						if (res.data == '0') {
							uni.removeStorageSync('token');
						}
					})
				}
			},
			goIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			// uni.hideBackHome();
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
				// 支付宝小程序专用
				// #ifdef MP-ALIPAY
				my.requestSubscribeMessage({
					//好友完成租机通知
					entityIds: dingyueid,
					complete: (res) => {
						this.goodsId = this.goods_data.id
						this.buyStatus = true
					}
				});
				// #endif
				// app端专用
				// #ifndef MP-ALIPAY
				this.goodsId = this.goods_data.id
				this.buyStatus = true
				// #endif
				})
			},
			BuyClose() {
				this.buyStatus = false
			},
			BuyOpen() {

			},
			bottomImage() {
				let opt = {
					url: '/index/image'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.banner_bottom = res.data.bannerbottom
				})
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
						fontColor: res.data.is_like == "1" ? "#FF6633" : "#61687C"
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
						fontColor: this.collectlist.fontColor == "#FF6633" ? "#61687C" : "#FF6633"
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
	.salesclass {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.bannerbottom {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
	}

	.goods-tags {
	display: flex;
	// #ifdef MP-ALIPAY
	gap: 10rpx;
	// #endif
	// #ifndef MP-ALIPAY
	// width: 40%;
	// justify-content: space-between;
	// #endif
	}

	.goods-tag {
		color: #4D79FF;
		font-size: 18rpx;
		font-weight: 400;
		width: max-content;
		border-radius: 8rpx;
		padding: 4rpx 10rpx;
		border: .5px solid #4D79FF;
		background: rgba(77, 121, 255, 0.1);
	// #ifndef MP-ALIPAY
	margin-right: 15rpx;
	// #endif
	}

	.tag-red {
		color: #FF5B56;
		border: .5px solid #FF5B56;
		background: rgba(255, 91, 86, 0.1);
	}

	.page {
		height: 100vh;
		background-color: #F6F6FB;
	}

	.goods-detail-page {
		.select-box {
			margin: 12px;
			padding: 32rpx 30rpx;
			border-radius: 14rpx;
			font-size: 24rpx;
			background: #fff;

			.select-row {
				display: flex;
				padding: 24rpx 0;
				align-items: center;

				.select-title {
					color: #61687C;
					margin-right: 30rpx;
				}

				.select-desc {
					color: #171B25;
				}
			}
		}

		.price-box {
			padding: 12rpx 30rpx 24rpx 30rpx;
			margin: 12px 12px 0 12px;
			border-radius: 14rpx 14rpx 0 0;
			background: linear-gradient(270deg, #FF6633 0%, #ff4141 100%);

			.price-company {
				font-size: 24rpx;
				color: #fff;
			}

			.price-number {
				font-size: 48rpx;
				color: #fff;
			}
		}

		.desc-box {
			padding: 24rpx 30rpx 16rpx 30rpx;
			background-color: #FFFFFF;
			margin: -12rpx 12px 0 12px;
			border-radius: 14rpx;

			.title {
				color: #171B25;
				margin: 15rpx 0;
				font-size: 30rpx;
				font-weight: bold;
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
				color: #171B25;
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
				border: 1rpx solid #61687C;
				border-radius: 18px;
				font-size: 20rpx;
				padding-left: 15rpx;
			}


			.store {
				font-size: 20rpx;
				color: #61687C;
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
			padding: 0rpx 12px 22rpx 0;
			background-color: #fff;
			width: 100%;
			align-items: center;
			border-top: 1px solid #f0f0f0;

			.buy-li {
				width: 120rpx;
			}

			.buy-li:first-child {
				border-right: 1px solid #F1F2F5;
			}

			.buy-li:last-child {
				width: calc(100% - 240rpx - 12px);
			}

			.buy-btn {
				height: 81rpx;
				background: #FF6633;
				border-radius: 20rpx;
				line-height: 81rpx;
				text-align: center;
				color: #fff;
				font-size: 30rpx;
			}
		}
	}
</style>
