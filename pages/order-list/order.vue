<template>
	<!-- 订单详情 -->
	<view class="order-detail">

		<!-- 0              1,2       3       4         9        7        -1 -->
		<!-- ["待付款", "待发货", "待收货", "待归还", "归还中", '已完成', "已取消"] -->
		<!-- 订单状态 -->
		<view class="order-status">
			<!-- 已完成状态  -->
			<view class="status-box" v-if="status == '7'">
				<view class="status-img">
					<u-icon name="checkmark-circle" color="#fff" size="30rpx" :label="initList.status_text_title"
						labelColor="#fff"></u-icon>
					<!-- <text class="status" style="margin-left: 10rpx;">{{initList.status_text_title}}</text> -->
				</view>
				<view class="status-detail">{{initList.status_text_content}} </view>
			</view>
			<!-- 已取消 -->
			<view class="status-box" v-if="status =='-1'">
				<view class="status-img">
					<u-icon name="close-circle" color="#fff" size="35rpx" :label="initList.status_text_title"
						labelColor="#fff"> </u-icon>
					<!-- <text class="status" style="margin-left: 10rpx;">{{initList.status_text_title}}</text> -->
				</view>
				<view class="status-detail">{{initList.status_text_content}} </view>
			</view>

			<!-- 待收货 -->
			<view class="status-box" v-if="status == '1' || status == '2'">
				<view class="status-img">
					<u-icon name="info-circle" color="#fff" size="35rpx" :label="initList.status_text_title"
						labelColor="#fff"> </u-icon>
					<!-- 	<u-image src="/static/image/daishouhuo.webp" width="30rpx" height="30rpx"></u-image>
					<text class="status" style="margin-left: 10rpx;">{{initList.status_text_title}}</text> -->
				</view>
				<view class="status-detail">{{initList.status_text_content}} </view>
			</view>
			<!-- 待发货 -->
			<view class="status-box" v-if="status == '3'">
				<view class="status-img">
					<u-icon name="calendar" color="#fff" size="35rpx" :label="initList.status_text_title"
						labelColor="#fff"> </u-icon>
					<!-- <u-image src="/static/image/daifahuo.png" width="30rpx" height="30rpx"></u-image>
					<text class="status" style="margin-left: 10rpx;">{{initList.status_text_title}}</text> -->
				</view>
				<view class="status-detail">{{initList.status_text_content}} </view>
			</view>
			<!-- 待归还 -->
			<view class="status-box" v-if="status == '4'">
				<view class="status-img">
					<u-icon name="order" color="#fff" size="35rpx" :label="initList.status_text_title"
						labelColor="#fff"> </u-icon>
					<!-- 	<u-image src="/static/image/guihuanzhong.webp" width="30rpx" height="30rpx"></u-image>
					<text class="status" style="margin-left: 10rpx;">{{initList.status_text_title}}</text> -->
				</view>
				<view class="status-detail">{{initList.status_text_content}} </view>
			</view>
			<!-- 归还中 -->
			<view class="status-box" v-if="status == '9'">
				<view class="status-img">
					<!-- <u-image src="/static/image/daiguihuan.webp" width="30rpx" height="30rpx"></u-image>
					<text class="status" style="margin-left: 10rpx;">{{initList.status_text_title}}</text> -->
					<u-icon name="car" color="#fff" size="35rpx" :label="initList.status_text_title" labelColor="#fff">
					</u-icon>
				</view>
				<view class="status-detail">{{initList.status_text_content}} </view>
			</view>

			<!-- 待付款 -->
			<view class="status-box" v-if="status == '0'">
				<view class="status-img">
					<u-image src="/static/image/daifukuan.png" width="30rpx" height="30rpx"></u-image>
					<text class="status" style="margin-left: 10rpx;">{{initList.status_text_title}}</text>
				</view>

				<view class="countdown">剩余 <text>
						<view class="time">
						
							{{time}}
						</view>
					</text> 自动取消 </view>
				<view class="status-detail">{{initList.status_text_content}} </view>
			</view>

		</view>
		<view class="detail-box">
			<!-- 地址栏 -->
			<view class="address_bar">
				<view class="address-info">
					<text>{{initList.consignee}}</text>
					<text class="address_bar_num">{{initList.phone}}</text>
				</view>
				<view class="address"> {{initList.province_name+initList.city_name+initList.area_name+initList.address}}
				</view>

			</view>
		

			<!-- 订单信息 -->
			<view class="order">
				<view class="info-box">
					<view class="order-img">
						<u-image :showLoading="true" :src="initList.item.goods_image||'/static/index-icon/10.webp'"
							width="160rpx" height="160rpx" />
					</view>
					<view class="order-info">
						<view class="info-title">{{initList.item.goods_title}} </view>
						<view class="info-package">套餐：{{initList.item.goods_sku_text}}</view>
						<view class="info-package">数量：{{initList.item.goods_num}}</view>
					</view>
				</view>
				<view class="order-date">
					<view class="date-start date-box">

						<view class="data-img">
							<u-image src="/static/image/start.png" width="62rpx" height="62rpx"></u-image>
						</view>
						<view class="start-box">
							<view class="start-txt">
								预计起租日
							</view>
							<text class="time"> {{initList.startleasetime || ''}} </text>
						</view>
					</view>
					<view class="date-start date-box">
						<view class="date-icon">
							<u-image src="/static/image/end.png" width="62rpx" height="62rpx"></u-image>
						</view>
						<view class="start-box">
							<view class="start-txt">
								归还日
							</view>
							<text class="time"> {{initList.endleasetime || ''}}</text>
						</view>
					</view>
				</view>
				<view class="order-tag-box">
					<u-alert :title="'提示：一般货物会在24小时内发出，如有特殊情况，客服会主动联系告知；快递运输期间不算租期，实际起租日为订单日后推3天 '" type="warning" fontSize="22rpx"></u-alert>
				</view>


			</view>
			<!-- 租金明细 -->
			<view class="rent-detail">
				<!-- <view class="rent-title">
					<text class="title-l">预计每日 </text>
					<text class="title-r">￥{{sku_data.day_price==null?0:sku_data.day_price}} </text>
				</view> -->
				<!-- <view class="rent-title">
					<text class="title-l">首期实付租金 </text>
					<text class="title-r">￥{{rentinfo.top_rent==null?0:rentinfo.top_rent}} </text>
				</view> -->
				<!-- <view class="rent-li">
					<text>剩余租金 </text> <text class="li-r">￥{{ rentinfo.bottom_rent || 0}} </text>
				</view> -->
				<view class="rent-li">
					<text>首期租金 </text> <text class="li-r">￥{{(initList.goods_amount/12).toFixed(2)==null?0:(initList.goods_amount/12).toFixed(2)}} </text>
				</view>
				<!-- <view class="rent-li">
					<text>剩余租金 </text> <text class="li-r">￥{{rentinfo.total_rent-rentinfo.top_rent}} </text>
				</view> -->
				<view class="rent-li">
					<text>剩余租金 </text> <text class="li-r"> {{(initList.goods_amount/12*11).toFixed(2)==null?0:(initList.goods_amount/12*11).toFixed(2)}}
					</text>
				</view>
				<view class="rent-li">
					<text>总租金 </text> <text class="li-r">￥{{initList.goods_amount ==null?0:initList.goods_amount}} </text>
				</view>
				
				<view class="rent-li">
					<text>配送方式 </text> <text class="li-r"> 寄出包邮/顺丰包邮 </text>
				</view>
				<view class="rent-li" v-if="guard_data.id">
					<text>{{guard_data.guard_title}} </text> <text
						class="li-r u-line-1">{{guard_data.guard_desc}}￥{{guard_data.defaultamount || 0}}</text>
				</view>
				<!-- <view class="rent-li">
					<text>买断尾款 </text> <text
						class="li-r">￥{{ rentinfo.buyout_bottom_price ==null?0:rentinfo.buyout_bottom_price}} </text>
				</view> -->
				
			</view>
			<!-- <view class="rent-detail">
				<view class="rent-title">
					<text class="title-l">首期实付租金 </text>
					<text class="title-r">￥{{initList.rentinfo.top_rent }} </text>
				</view>
				<view class="rent-li">
					<text>尾期租金 </text> <text class="li-r">￥{{ initList.rentinfo.bottom_rent }} </text>
				</view>
				<view class="rent-li">
					<text>剩余租期 </text> <text class="li-r"> {{ initList.rentinfo.surplus_rend}} </text>
				</view>
				<view class="rent-li">
					<text>总租金 </text> <text class="li-r">￥{{ initList.rentinfo.total_rent}} </text>
				</view>


					<view class="rent-li">
					<text>配送方式 </text> <text class="li-r"> 包邮 </text>
				</view>
				<view class="rent-li">
					<text>买断尾款 </text> <text class="li-r">￥{{ initList.rentinfo.buyout_bottom_price}} </text>
				</view>
				<view class="rent-li" v-if="guard_data.id">
					<text>{{guard_data.guard_title}} </text> <text
						class="li-r u-line-1">￥{{guard_data.defaultamount || 0}}</text>
				</view>
			</view> -->
			<!-- 冻结租金 -->
			<view class="rent-detail">
				<view class="rent-title">
					<text class="title-l">冻结押金</text>
					<text class="title-r">￥{{initList.deposit}} </text>
				</view>
				<view class="rent-li">
					<text>商品押金</text> <text class="li-r">￥{{ initList.deposit }} </text>
				</view>
				<view class="rent-li">
					<text>芝麻信用免押金</text> <text class="li-r">￥{{ initList.credit_amount}} </text>
				</view>
				<view class="rent-li">
					<text>支付宝冻结押金</text> <text class="li-r">￥{{ initList.deposit - initList.credit_amount}} </text>
				</view>
				<view class="rent-li">
					<text>押金冻结方式</text> <text class="li-r">支付宝资金授权</text>
				</view>
			</view>
			<!-- 芝麻信用 -->
			<!-- <view class="sesame">
			<text class="title-l">凭芝麻信用最高可减免押金 </text>
			<text class="title-r">￥ {{sku_data.deposit}} </text>
		</view> -->
			<view class="sesame">
				<text class="title-l">优惠劵可减免金额 </text>
				<text class="title-r">￥ {{initList.rentinfo.discount_price}} </text>
			</view>
			<!-- 商品及赠品 -->
			<!-- 		<view class="accessories">
				<view class="accessories-title">
					商品配件
				</view>
				<view class="accessories-box">
					<view class="accessories-li">
						<view class="li-title">
							需归还
						</view>
						<view class="li-cont">
							<text class="cont-txt">快充数据线</text>
							<text class="cont-num">1</text>
							<text class="cont-price">¥145.00</text>
						</view>
					</view>
					<view class="accessories-li">
						<view class="li-title">
							赠品
						</view>
						<view class="li-cont">
							<text class="cont-txt">手机钢化膜、手机保护壳</text>
						</view>
					</view>
				</view>
			</view> -->
			<!-- 备注 -->
			<view class="note">
				<text>备注</text>
				<view class="note-input">
					<u-input :disabled="true" :value="initList.remark || ''" border="none"></u-input>
				</view>
			</view>

			<!-- 租赁协议 -->
			<view class="rent-detail" style="margin-bottom: 180rpx;">
				<!-- <view class="rent-li">
					<text>租赁协议</text> <text class="li-r">查看协议 </text>
				</view> -->
				<view class="rent-li" style="padding-top: 0.2rem;">
					<text>订单编号 </text>
					<view class="li-r">{{ initList.order_sn}} <text class="copy" @click="copy">复制</text> </view>
				</view>
				<view class="rent-li">
					<text>创建时间 </text> <text class="li-r"> {{ initList.createtime}} </text>
				</view>
			</view>
		</view>
		<!--   0       1   2       3       4         9        7        -1 -->
		<!-- ["待付款", "待审核","待发货", "待收货", "待归还", "归还中", '已完成', "已取消"] -->
		<!-- 底部按钮-->
		<view class="">
			<view class="detail-btn-box" v-if="status=='0'">
				<!-- v-if="params.type==0" -->
				<view class="btn" @click="$refs.contact.setStatus(true)">
					联系商家
				</view>
				<!-- <button open-type="getAuthorize" class="btn" scope="IDNumber" @getAuthorize="getIDNumber"
					@error="errorIDNumber"> 实名认证</button> -->
				<view class="btn" @click="subOrder()">
					去付款
				</view>
				<view class="btn" @click="cancelOrder()">
					取消订单
				</view>
			</view>
			<view class="detail-btn-box"
				v-if="status=='1' || status=='2' || status=='3'||status=='4' || status=='9' || status=='7'">
				<!-- v-if="params.type==0" -->
				<view class="btn" @click="$refs.contact.setStatus(true)">
					联系商家
				</view>

			</view>
			<view class="detail-btn-box" v-if="status=='-1'">
				<!-- v-if="params.type==0" -->
				<view class="btn" @click="order_again()">
					再次下单
				</view>

			</view>
		</view>

		<u-toast ref="uToast"></u-toast>
		<Contact ref="contact" type="1" />

		<u-modal :show="agreement.agreementShow" :showCancelButton="agreement.showCancelButton || false"
			:closeOnClickOverlay="true" :title="agreement.title" @confirm="modalConfirm()" @cancel="closeModal()">
			<view class="slot-content">
				<u-parse :content="agreement.text"></u-parse>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import Contact from "../../pages/home/components/contact.vue"
	export default {
		components: {
			Contact
		},
		data() {
			return {
				detailStatu: 1,
				address_id: 0,
				// time: {},
				time: '',
				timeObj: {
					m: '00',
					s: '00',
					h: '00'
				},
				params: {},
				agreement: {
					title: '',
					agreementShow: false,
					text: "",
					type: 1, //1取消
				},
				initList: {},
				status: String,
				idCardUrl: '', //身份证上传路径
				guard_data: {} //保障方案
			};
		},
		onLoad(obj) {
			// 0 1,2 3 4 9 7 -1
			// ["待付款", "待发货", "待收货", "待归还", "归还中", '已完成', "已取消"]
			this.params = obj
		},
		onShow() {
			this.init()
			this.idCardUrl = "/pages/idcard/idcard?type=order&id=" + this.initList.goods_id
		},

		watch: {
			params(newVal, oldVal) {
				this.params = newVal
			},
		},
		methods: {

			subOrder() {
				let opt = {
					url: '/pay/again',
					// method: "POST",
					header: "application/x-www-form-urlencoded;charset=utf-8",
					data: {
						order_id: this.initList.id
					}
				}
				let _this = this
				this.$request(opt).then(res => {
					let trade_no = res.data.alipay_trade_create_response.trade_no
					let order_sn = this.initList.order_sn
					console.log(order_sn)
					let order_nn = res.url
					let _this = this
					_this.payType = 'go'
					_this.tradeYa(order_nn,order_sn,trade_no)
					//原直接支付通道
					// let trade_no = res.data.alipay_trade_create_response.trade_no
					// let order_sn = this.initList.order_sn
					// let _this = this
					// _this.payType = 'go'
					// _this.tradePay(trade_no, order_sn)
				})
			},
			//免押支付
			tradeYa(order_nn,order_sn,trade_no){
				let _this = this
				my.tradePay({
					orderStr:order_nn,
					success: (res) => {
						console.log(res);
						if(res.resultCode == 9000){
							uni.navigateTo({
								url: "../identity/identity?order_sn=" + order_sn
							})
						}else{
							uni.showToast({
								title: res.memo,
								duration: 2000,
								icon:'none'
							});
							uni.navigateTo({
								url: '../eve/introduce',
							});
							// _this.tradePay(trade_no, order_sn)
						}
					    // my.alert({
					    //   content: JSON.stringify(res),
					    // });
						
					  },
					  fail: (res) => {
						console.log(res);
						uni.showToast({
							title: res.memo,
							duration: 2000,
							icon:'none'
						});
					    // my.alert({
					    //   content: JSON.stringify(res),
					    // });
						 // _this.tradePay(trade_no, order_sn)
					  }
				});
			}, 
			//支付押金
			tradePay(trade_no, order_sn) {
				let _this = this
				my.tradePay({
					tradeNO: trade_no,
					success: function(res) {
						// my.alert(res.resultCode); 
						if (res.resultCode == 9000) {
							uni.navigateTo({
								url: "../identity/identity?order_sn=" + order_sn
							})
						} else {
							_this.$refs.uToast.show({
								message: res.memo || '取消支付',
								icon: 'error',
								type: 'error',
							})
						}
					},
					fail: function(res) {
						// my.alert(res.resultCode);
						console.log(res, '支付失败')
					},
				});
			},
			copy() {
				uni.setClipboardData({
					data: this.initList.order_sn,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
						});
					}
				});
			},
			// 拒绝身份证号
			errorIDNumber(e) {
				console.log('拒绝授权', e)
				this.$refs.uToast.show({
					message: e || '失败',
					icon: 'error',
					type: 'error'
				})
			},
			closeModal() {
				this.agreement = {
					title: '',
					agreementShow: false,
					text: "",
					type: 0, //1取消
					showCancelButton: false
				}
			},
			order_again() {
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + this.initList.goods_id
				})
			},
			//查看物流
			logistics(item) {
				uni.navigateTo({
					url: "logistics?id=" + item.id
				})
			},
			cancelOrder() {
				this.agreement = {
					title: '',
					agreementShow: true,
					text: "确认取消订单吗",
					type: 1, //1取消
					showCancelButton: true
				}
			},
			//模块关闭
			modalConfirm() {
				if (this.agreement.type == 1) {
					this.cancelOrderHttp()
				}
			},
			cancelOrderHttp() {
				let opt = {
					url: '/order/cancel',
					data: {
						id: this.initList.id
					}
				}

				this.$request(opt).then(res => {
					// console.log('-----订单', res)
					this.$refs.uToast.show({
						message: res.msg || '成功',
						icon: 'success',
						type: 'success'
					})
					this.init()
					this.closeModal()
				})
			},
			//-----确认订单---------
			init() {
				let opt = {
					url: '/order/detail',
					data: {
						id: this.params.id
					}
				}

				this.$request(opt).then(res => {
					// console.log('-----订单', res)
					this.initList = res.data
					// console.log(this.initList)
					// console.log(JSON.stringify(res))
					this.status = res.data.status
					this.guard_data = res.data.guard_data || {}
					this.time = res.data.count_down || '00:00:00'
					if (this.status == 0 && this.time) {
						this.timeData()
					}
				})
			},
			times(time) {
				if (time !== null) {
					var s = "";
					var hour = time.split(":")[0];
					var min = time.split(":")[1];
					var sec = time.split(":")[2];
					s = Number(hour * 3600) + Number(min * 60) + Number(sec);
					return s;
				}
			},
			timesFunc(data) {
				var time = Number(data);
				var h = Math.floor(time / 3600);
				var m = Math.floor((time % 3600) / 60);
				var s = parseInt(time % 3600) % 60;
				var hh = h < 10 ? "0" + h : h;
				var mm = m < 10 ? "0" + m : m;
				var ss = s < 10 ? "0" + s : s;
				return hh + ":" + mm + ":" + ss;
			},
			timeData() {
				let totalSeconds = this.times(this.time);
				let times = setInterval(() => {
					totalSeconds = totalSeconds - 1;
					if (totalSeconds <= 0) {
						this.time = '00:00:00'
						clearInterval(times)
						return
					}
					this.time = this.timesFunc(totalSeconds);
				}, 1000)
			},

		}

	};
</script>

<style lang="scss" scoped>
	.order-detail {
		background-color: #f0f0f0;
		width: 100%;
		overflow: hidden;

		.notice-box {
			// margin-bottom: 80rpx;
		}

		// height: 100vh;
		.order-status {
			height: 209rpx;
			background: linear-gradient(79deg, #000000 0%, #54b2f1 0%, #67f2fb 100%);
			border-radius: 0 0 30rpx 30rpx;

			.status-box {
				color: #fff;
				font-size: 24rpx;
				padding: 46rpx 0 0rpx 60rpx;
				position: relative;

				.status-img {
					display: flex;
				}

				.status {
					font-size: 30rpx;
				}

				.status-detail {
					padding-top: 23rpx;
				}

				.countdown {
					@include flex;
					position: absolute;
					right: 20rpx;
					top: 50rpx;

					.time {
						margin: 0 2rpx;
						display: flex;

						.time-doc {
							color: #fff;
							margin: 0 4rpx;
						}

						.time-m,
						.time-s {
							color: #92D3FF;
							padding: 3rpx 6rpx;
							border-radius: 10rpx;
							font-size: 22rpx;
							background-color: #fff;
						}
					}

				}
			}
		}

		.detail-box {
			width: 92%;
			margin: 0 auto;
			box-sizing: border-box;
		}

		.address_bar {
			background-color: #fff;
			border-radius: 14rpx;
			padding: 33rpx 38rpx;
			position: relative;
			margin: 18rpx 0 18rpx;
			border-radius: 14rpx;

			.address {
				font-size: 24rpx;
				color: #999;
			}

			.address_arrow {
				position: absolute;
				top: 50rpx;
				right: 40rpx;
			}

			.address-info {
				color: #1f1f1f;
				font-size: 30rpx;
				margin-bottom: 20rpx;

				.address_bar_num {
					margin-left: 38rpx;
				}
			}
		}

		.idCard-box {
			background-color: #fff;
			border-radius: 14rpx;
			margin-bottom: 18rpx;
		}

		.order {
			background-color: #fff;
			padding: 30rpx 0 0 0;
			margin-bottom: 18rpx;
			border-radius: 14rpx;

			.info-box {
				display: flex;

				.order-img {
					width: 160rpx;
					height: 160rpx;
					margin: 0 20rpx;
				}

				.order-info {
					font-size: 24rpx;
					color: #999;
					// line-height: 42rpx;

					.info-title {
						font-size: 28rpx;
						color: #1F1F1F;
						margin-bottom: 25rpx;
					}
				}
			}

			.order-date {
				width: 90%;
				height: 88rpx;
				background-color: #c4e6fd;
				border-radius: 44rpx;
				margin: 28rpx auto;
				display: flex;
				flex: 1;

				.date-box {
					padding: 13rpx 0 13rpx 32rpx;
					width: 50%;
					display: flex;

					.start-box {
						padding-left: 12rpx;
					}

					.date-icon {
						border-radius: 50%;
						background-color: #4CC5F8;
						position: relative;

						.icon-box {
							margin-right: 12rpx;
						}

						.icon-txt {
							position: absolute;
							left: 13rpx;
							top: 13rpx;
							font-size: 20rpx;
							color: #4CC5F8;
						}
					}

					.start-txt {
						font-size: 24rpx;
					}

					.time {
						font-size: 20rpx;
						color: #999;
					}
				}
			}
		}

		.rent-detail {
			background-color: #fff;
			// height: 370rpx;
			padding: 0rpx 24rpx 20rpx 29rpx;
			margin-bottom: 18rpx;
			border-radius: 14rpx;

			.rent-li {
				font-size: 24rpx;
				color: #999;
				line-height: 50rpx;

				.li-r {
					float: right;
				}

				.copy {
					color: #4CC5F8;
					margin-left: 10rpx;
				}
			}

			.rent-title {
				height: 90rpx;
				line-height: 90rpx;
				font-weight: bold;
				font-size: 30rpx;
				border-bottom: #E5E5E5 1rpx solid;

				.title-r {
					float: right;
				}
			}
		}

		.sesame {
			height: 90rpx;
			line-height: 90rpx;
			font-weight: bold;
			font-size: 30rpx;
			background-color: #fff;
			padding: 0 26rpx 0 30rpx;
			margin-bottom: 18rpx;
			border-radius: 14rpx;

			.title-r {
				float: right;
			}
		}

		.accessories {
			height: 360rpx;
			border-radius: 14rpx;
			padding: 0 14rpx 14rpx;
			background-color: #fff;

			.accessories-title {
				height: 70rpx;
				line-height: 70rpx;
				padding-left: 13rpx;
			}

			.accessories-box {
				background-color: #F9F9F9;
				height: 270rpx;
				font-size: 14rpx;
				border-radius: 14rpx;
				padding: 0 12rpx 0 14rpx;

				.accessories-li {
					font-size: 20rpx;
					color: #999;
					border-bottom: 1rpx solid #E5E5E5;

					.note {
						height: 90rpx;
						line-height: 90rpx;
						border-radius: 14rpx;
						background-color: #fff;
						padding-left: 31rpx;
					}

					.li-title {
						font-size: 24rpx;
						color: #1F1F1F;
						padding: 22rpx 0 26rpx;
					}

					.li-cont {
						margin-bottom: 29rpx;

						.cont-price {
							float: right;
						}
					}
				}
			}
		}
 
		.note {
			height: 90rpx;
			line-height: 90rpx;
			font-size: 30rpx;
			padding-left: 30rpx;
			position: relative;
			background-color: #fff;
			margin: 18rpx 0;
			border-radius: 14rpx;

			.note-input {
				position: absolute;
				top: 20rpx;
				right: 8rpx;
			}
		}

		.conclusion {
			background-color: #fff;
			// height: 215rpx;
			padding: 23rpx 30rpx 50rpx 60rpx;
			box-sizing: border-box;

			.agreement-box {
				color: #333;
				font-size: 24rpx;
				line-height: 50rpx;
				// margin-bottom: 45rpx;

				.agreement-radio {
					float: left;
					margin-top: 10rpx;
				}

				.color-txt {
					color: #92D3FF
				}
			}

			.total-amount {
				font-size: 24rpx;
				color: #333;
				margin-left: -8rpx;

				.amount-icon {
					display: inline-block;
					width: 30rpx;
				}

				.amount-btn {
					display: inline-block;
					// width: 219rpx;
					// height: 87rpx;
					padding: 29rpx 50rpx;
					// line-height: 87rpx;
					background: #92D3FF;
					color: #fff;
					text-align: center;
					margin-left: 20rpx;
					border-radius: 43rpx;
					font-size: 30rpx;
				}

				.color-red {
					font-size: 38rpx;
					color: #E60000;
					margin: 0 22rpx 0 0;

				}
			}
		}

		.detail-btn-box {
			position: fixed;
			width: 100%;
			// left: 0;
			bottom: 0;
			background-color: #fff;
			height: 102rpx;
			padding-bottom: 40rpx;
			padding-right: 41rpx;
			display: flex;
			// text-align: center;
			// justify-content: center;
			flex-direction: row-reverse;

			.btn {
				// width: 143rpx;
				height: 53rpx;
				line-height: 53rpx;
				font-size: 24rpx;
				border-radius: 10rpx;
				padding: 0rpx 24rpx;
				text-align: center;
				border: 1px solid #333333;
				margin: 30rpx 14rpx;
			}
		}
	}
</style>
