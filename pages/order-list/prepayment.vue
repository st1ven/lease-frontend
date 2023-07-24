<template>
	<!-- 提前结算 -->
	<view class="prepayment-page" style="background-color: #f6f6fb;">
		<!-- {{ modalShow }} -->
		<view class="prepayment-ul">
			<view class="prepayment-li" v-for="(item, index) in initList" :class="item.pay_status_text == '已支付' ? 'on' : ''"
				:key="index" @click.self="liClick(item, index, false)">
				<view class="li-top">
					<view class="txt-checkbox">
						<u-checkbox-group>
							<u-checkbox size="40rpx" activeColor="#FF6633" :disabled="item.checkboxFlag"
								@change="liClick(item, index, true)" :checked="item.checked" :shape="'circle'">
							</u-checkbox>
						</u-checkbox-group>
					</view>
					<view class="date-inx">第{{ item.start_stage }}/{{ item.total_stage }}期 </view>
					<text class="txt-mg u-line-1">{{ item.goods_title }}</text>
					<text class="data-price"> ￥{{ item.rent }} </text>
				</view>
				<view class="li-bottom">

					<view class="time">
						{{ item.end_renttime }}
					</view>
					<view class="pay">
						{{ item.pay_status_text }}
					</view>
				</view>
				<view class="li-bottom" v-if="item.yuqijine != 0">
					<view class="time" style="color: #FF5B56;">
						违约金:{{ item.yuqijine }}
					</view>
					<view class="pay" style="color: #FF5B56;">
						已逾期
					</view>
				</view>
			</view>
			<view class="prepayment-bottom">
				<view class="b-txt">
					总金额 <text>￥{{ total_amount }}</text>
				</view>
				<view class="prepayment-btn on" @click="pay()" v-if="btnFlag">
					立即支付
				</view>
				<view class="prepayment-btn" v-else>
					立即支付
				</view>
			</view>
		</view>
		<u-safe-bottom />
		<u-modal :show="modalShow" confirmText="支付成功" cancelText="支付失败" title="是否已经完成支付" @confirm="confirm" @cancel="confirm"
			showCancelButton width="300px">
		</u-modal>
	</view>
</template>

<script>
import COM_PAY from '../../util/common/pay.js'
export default {
	data() {
		return {
			checkboxFlag: false,
			params: {},
			total_amount: 0,
			btnFlag: false,
			initList: [],
			targetArr: [],
			checkedArr: [],
			modalShow: false,
		};
	},
	// #ifndef H5
	onShow() {
		this.init()
	},
	// #endif
	onLoad(obj) {
		this.params = obj
		console.log('获取参数----', this.params);
		// #ifdef H5
		this.init()
		// #endif
	},
	methods: {
		confirm() {
			this.modalShow = false
			location.reload();
		},
		pay() {
			let _this = this
			//支付获取商家订单号+支付宝交易号码
			let ids = (this.targetArr.map(item => item.id)).join()
			let opt = {
				url: "/pay/advance",
				method: "POST",
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: {
					ids: ids,
					// #ifndef MP-ALIPAY
					mode: 'app',
					// #endif
					// ifdef H5
					mode: 'h5',
					// endif
				}
			}
			console.log(opt, '支付获取商家订单号+支付宝交易号码')
			_this.$request(opt).then(res => {
				console.log(res, '/pay/advance')
				// 打印调用成功回调
				// 支付宝直接支付
				// #ifdef MP-ALIPAY
				let trade_no = res.data.parameter.alipay_trade_create_response.trade_no;
				_this.tradePay(trade_no)
				// #endif
				// app 弹窗选择支付方式
				// #ifndef MP-ALIPAY
				let parameter = res.data.parameter
				console.log(res.data.parameter, '支付宝支付')
				uni.showActionSheet({
					title: '请选择支付方式',
					itemList: ['支付宝', '微信'],
					success: function (re) {
						console.log(re, '支付方式');
						if (re.tapIndex == 0) {
							// app支付
							// #ifdef APP-PLUS
							_this.tradePay(parameter)
							// #endif
							// #ifdef H5
							console.log(parameter, '支付宝支付');
							_this.modalShow = true;
							window.open(parameter)
							// #endif
							// 跳转进 pay 页面
							// uni.navigateTo({
							// 	url: '/pages/order-list/pay'
							// })
						} else if (re.tapIndex == 1) {
							// 微信支付
							uni.showToast({
								title: '暂未开通微信支付',
								icon: 'none'
							})
						}
					},
					fail: function (err) {
						console.log(err, '请选择支付方式')
					}
				});
				// #endif
			})
		},

		//支付宝支付
		tradePay(trade_no) {
			console.log(trade_no, '支付宝支付')
			let _this = this
			// #ifdef MP-ALIPAY
			uni.tradePay({
				tradeNO: trade_no,
				success: function (res) {
					// uni.alert(res.resultCode);
					console.log(res, '支付成功')
					_this.init()
				},
				fail: function (res) {
					// uni.alert(res.resultCode);
					console.log(res, '支付失败')
				},
			});
			// #endif
			// #ifdef  APP-PLUS
			uni.requestPayment({
				provider: 'alipay',
				orderInfo: trade_no, //微信、支付宝订单数据
				success: function (res) {
					console.log(res, '支付成功')
					_this.init()
				},
				fail: function (err) {
					console.log(err, '支付失败')
				}
			});
			// #endif
		},
		async tradePays(trade_no) {
			let _this = this
			console.log(trade_no, COM_PAY, '支付宝支付')
			let miyao = await COM_PAY.getPayKey();
			console.log(miyao, 'miyao')
			let identity = await COM_PAY.getIdentity(trade_no);
			console.log(identity, 'identity')
			let sign = await COM_PAY.getAliPay(trade_no, identity.realname, identity.idcard, miyao);
			console.log(sign, 'sign');
			this.tradePay(sign);
		},

		liClick(data, i, checkBoolean) {
			this.targetArr = []
			this.initList.forEach((item, index) => {
				if (index <= i) {
					if (item.pay_status_text == "未支付") {
						if (checkBoolean == false || (checkBoolean && index < i)) {
							item.checked = true
						}
						if (checkBoolean && index == i) {
							item.checked = !item.checked
						}
					}
				} else {
					item.checked = false
				}
				if (item.checked) {
					this.targetArr.push(item)
				}
			})
			console.log(this.targetArr, '----targetArr')
			this.btnFlag = this.targetArr.length > 0 ? true : false
			this.total_amount = (Number(this.initList[i].rent) * this.targetArr.length).toFixed(2)
		},
		init() {
			let opt = {
				url: "/order/plan",
				data: {
					id: this.params.id
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				res.data.forEach(item => {
					item.checkboxFlag = true
					if (item.pay_status_text == "未支付") {
						item.checkboxFlag = false
						item.checked = false
					}
				})
				this.initList = res.data
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.prepayment-page {
	background-color: #F6F6FB;
	padding: 13rpx 16rpx 0;
	position: relative;
	height: 100vh;

	.prepayment-ul {
		padding: 0 13rpx 140rpx 13rpx;

		.prepayment-li:first-child {
			border-top-right-radius: 14rpx;
			border-top-left-radius: 14rpx;
		}

		.prepayment-li:last-child {
			border-bottom-right-radius: 14rpx;
			border-bottom-left-radius: 14rpx;
		}

		.prepayment-li.on {
			color: #ccc
		}

		.prepayment-li {
			// height: 130rpx;
			border-bottom: 1rpx solid #E5E5E5;

			position: relative;
			font-size: 28rpx;
			box-sizing: border-box;
			color: #171B25;
			padding: 15rpx 0 15rpx 83rpx;
			// display: flex;
			background-color: #fff;

			.li-top,
			.li-bottom {
				display: flex;
				line-height: 40rpx;

				.date-inx {}
			}

			.li-bottom {
				font-size: 24rpx;
				color: #ccc;
				display: flex;
				// padding-left: 140rpx;
				justify-content: space-evenly;

				.time {
					width: 330rpx;
					margin-right: 20rpx;
				}

				.pay {
					color: #FF6633;
				}
			}

			.txt-mg {
				width: 310rpx;
				margin: 0 20rpx;
			}

			.txt-checkbox {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				left: 23rpx;
			}
		}
	}

	.prepayment-bottom {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		background-color: #fff;
		height: 100rpx;
		line-height: 100rpx;
		padding-bottom: 20rpx;
		display: flex;
		width: 100%;


		.b-txt {
			font-size: 28rpx;
			padding-left: 34rpx;

			text {
				font-size: 36rpx;
				color: #E20000;
			}
		}

		.prepayment-btn {
			margin-left: auto;
			width: 240rpx;
			height: 81rpx;
			text-align: center;
			line-height: 81rpx;
			background: #C8C7C7;
			color: #fff;
			border-radius: 40rpx;
			margin-right: 20rpx;
			margin-top: 13rpx;
		}

		.prepayment-btn.on {
			background: #FF6633;
		}
	}

}
</style>
