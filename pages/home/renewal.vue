<template>
	<!-- 续租 -->
	<view class="renewal-page" style="background-color: #f6f6fb;">
		<view class="renewal-ul">
			<view v-for="(item, index) in list" @click="liClick(item)" :key="index" :class="item.on == false ? 'li' : 'li on'">
				{{ item.date }}天
			</view>
			<view class="renewal-list">
				<view class="lists">
					<text>原归还日期</text>
					<text class="lists-r">{{current_renttime}}</text>
				</view>
				<view class="lists">
					<text>现归还日期</text>
					<text class="lists-r">{{new_current_renttime}}</text>
				</view>
			</view>
			<view class="xuzu">
				<text>续租费用</text>
				<text class="lists-r">￥ {{price || 0}}</text>
			</view>
			<view class="renewal-btn" @click="submitBtn">
				确认
			</view>
		</view>
		<u-modal :show="modalShow" confirmText="支付成功" cancelText="支付失败" title="是否已经完成支付" @confirm="confirm" @cancel="confirm"
			showCancelButton width="300px">
		</u-modal>
	</view>
</template>

<script>
	export default {

	data() {
		return {
			order_id: "",
			day_price: "",
			current_renttime: "",
			day: "",
			price: "",
			new_current_renttime: '', //现在的骨灰时间
			price: "", //价格
			list: [],
			modalShow: false,
		}
	},
	onLoad(obj) {
		this.order_id = obj.id;
		// #ifdef H5
		this.init()
		// #endif
	},
	// #ifndef H5
	onShow() {
		this.init()
	},
	// #endif
	methods: {
		confirm() {
			this.modalShow = false
			location.reload();
		},
		init() {
			console.log('续租-----')
			let opt = {
				url: "/order/rerent",
				data: {
					id: this.order_id
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.list = []
				let list = Object.values(res.data.renewal_days);
				list.forEach(item => {
					let obj = {
						date: item,
						on: false
					}
					this.list.push(obj)
				})
				this.day_price = res.data.day_price;
				this.current_renttime = res.data.current_renttime;
				console.log(res, ' -------续租-----', this.list);
			})
		},
		liClick(data) {
			this.list.forEach((item, i) => {
				if (item.date == data.date) {
					item.on = true
					this.day = item.date
					this.liClickHttp()
				} else {
					item.on = false
				}
			})
		},
		liClickHttp() {
			let opt = {
				url: "/order/rerent_count",
				data: {
					day_price: this.day_price,
					current_renttime: this.current_renttime,
					day: this.day
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.new_current_renttime = res.data.new_current_renttime
				this.price = res.data.price
				console.log(res, '--------续租-----')
			})
		},
		submitBtn() {
			if (this.day == '') {
				return uni.showToast({
					title: "请选择续租时间"
				})
			}
			let opt = {
				url: "/pay/rerent",
				method: "POST",
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: {
					id: this.order_id,
					rerent_day: this.day,
					// #ifndef MP-ALIPAY
					mode: 'app',
					// #endif
					// #ifdef H5
					mode: 'h5',
					// #endif
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调

				// 支付宝直接支付
				// #ifdef MP-ALIPAY
				let trade_no = res.data.parameter.alipay_trade_create_response.trade_no
				this.tradePay(trade_no)
				// #endif
				// app 弹窗选择支付方式
				// #ifndef MP-ALIPAY
				let parameter = res.data.parameter
				uni.showActionSheet({
					title: '请选择支付方式',
					itemList: ['支付宝', '微信'],
					success: function (res) {
						if (res.tapIndex == 0) {
							// app支付
							// #ifdef APP-PLUS
							_this.tradePay(parameter)
							// #endif
							// #ifdef H5
							console.log(parameter, '支付宝支付')
							window.open(parameter)
							// #endif
						} else if (res.tapIndex == 1) {
							// 微信支付
							uni.showToast({
								title: '暂未开通微信支付',
								icon: 'none'
							})
						}
					}
				});
				// #endif
				console.log(res, ' -------续租提交-----', trade_no)
			})
		},
		tradePay(trade_no) {
			let _this = this
			// #ifdef MP-ALIPAY
			uni.tradePay({
				tradeNO: trade_no,
				success: function (res) {
					console.log(res, '---zhifu')
					let msg = res.memo || ''
					if (res.resultCode == 6001) {
						msg = res.memo || '取消支付'
					}
					if (res.resultCode == 9000) {
						msg = res.memo || '支付成功'
					}

					uni.showToast({
						title: msg
					})

					},
					fail: function(res) {
						uni.showToast({
							title: "支付失败！"
						})

				},
			});
			// #endif
			// #ifdef  APP-PLUS
			uni.requestPayment({
				provider: 'alipay',
				orderInfo: trade_no, //微信、支付宝订单数据
				success: function (res) {
					console.log(res, '---zhifu')
					uni.showToast({
						title: "支付成功！"
					})
				},
				fail: function (err) {
					console.log(err, '---zhifu')
					uni.showToast({
						title: "支付失败！"
					})
				}
			});
			// #endif
		},
	}
}
</script>

<style lang="scss" scoped>
	.renewal-page {
		background-color: #F6F6FB;
		height: 100vh;

		.renewal-ul {
			padding: 30rpx;

			.li:nth-child(2n) {
				margin-left: 18rpx;
			}

			.li.on {
				background-color: #FF6633;
				color: #fff;
			}

			.li {
				width: 335rpx;
				margin-bottom: 21rpx;
				height: 210rpx;
				display: inline-block;
				text-align: center;
				background-color: #fff;
				line-height: 210rpx;
				border-radius: 14rpx;

			}
		}

		.renewal-list {
			background-color: #fff;
			border-radius: 14rpx;
			font-size: 28rpx;
			padding: 0 24rpx;

			.lists {
				height: 83rpx;
				line-height: 83rpx;
				color: #414960;
				border-bottom: 1rpx solid #E5E5E5;

				.lists-r {
					float: right;
				}
			}
		}

		.xuzu {
			height: 83rpx;
			line-height: 83rpx;
			background-color: #fff;
			color: #414960;
			margin-top: 24rpx;
			border-radius: 14rpx;
			font-size: 28rpx;
			padding: 0 24rpx;

			.lists-r {
				float: right;
			}
		}

		.renewal-btn {
			width: 579rpx;
			height: 88rpx;
			text-align: center;
			color: #fff;
			margin: 48rpx auto;
			line-height: 88rpx;
			background: #FF6633;
			border-radius: 14rpx;
		}
	}
</style>
