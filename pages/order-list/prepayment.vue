<template>
	<!-- 提前结算 -->
	<view class="prepayment-page">
		<view class="prepayment-ul">
			<view class="prepayment-li" v-for="(item,index) in initList" :class="item.pay_status_text=='已支付'?on:''"
				:key="index" @click.self="liClick(item,index,false)">
				<view class="li-top">
					<view class="txt-checkbox">
						<u-checkbox-group>
							<u-checkbox size="40rpx" activeColor="#92D3FF" :disabled="item.checkboxFlag" @change="liClick(item,index,true) "
								:checked="item.checked" :shape="'circle'">
							</u-checkbox>
						</u-checkbox-group>
					</view>
					<view class="date-inx">第{{item.start_stage}}/{{item.total_stage}}期 </view>
					<text class="txt-mg u-line-1">{{item.goods_title}}</text>
					<text class="data-price"> ￥{{item.rent}} </text>
				</view>
				<view class="li-bottom">
					
					<view class="time">
						{{item.end_renttime}}
					</view>
					<view class="pay">
						{{item.pay_status_text}}
					</view>
					
				</view>
				<view class="li-bottom" v-if="item.yuqijine != 0">
					<view class="time" style="color: red;">
						违约金:{{item.yuqijine}}
					</view>
					<view class="pay"  style="color: red;">
						已逾期
					</view>
				</view>
			</view>
			<view class="prepayment-bottom">
				<view class="b-txt">
					总金额 <text>￥{{total_amount}}</text>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkboxFlag: false,
				params: {},
				total_amount: 0,
				btnFlag: false,
				initList: [],
				targetArr: [],
				checkedArr: []
			};
		},
		onShow() {
			this.init()
		},
		onLoad(obj) {
			this.params = obj
			console.log('获取参数----', this.params)
		},
		methods: {
			pay() {
				//支付获取商家订单号+支付宝交易号码
				let ids = (this.targetArr.map(item => item.id)).join()
				let opt = {
					url: "/pay/advance",
					method: "POST",
					header: "application/x-www-form-urlencoded;charset=utf-8",
					data: {
						ids: ids
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					let trade_no = res.data.parameter.alipay_trade_create_response.trade_no
					this.tradePay(trade_no)
				})
			},

			//支付宝支付
			tradePay(trade_no) {
				let _this = this
				my.tradePay({
					tradeNO: trade_no,
					success: function(res) {
						// my.alert(res.resultCode);
						console.log(res, '支付成功')
						_this.init()
					},
					fail: function(res) {
						// my.alert(res.resultCode);
						console.log(res, '支付失败')
					},
				});
			},

			liClick(data, i, checkBoolean) {
				this.targetArr = []
				this.initList.forEach((item, index) => {
					if (index <= i) {
						if (item.pay_status_text == "未支付" ) {
							if(checkBoolean == false || (checkBoolean && index < i)){
								item.checked = true
							}
							if(checkBoolean && index == i){
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
				console.log(this.targetArr,'----targetArr')
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
		background-color: #F0F0F0;
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
				color: #1F1F1F;
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
						color: #92D3FF;
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
				background: linear-gradient(139deg, #92D3FF 0%, #4CC5F8 100%);
			}
		}

	}
</style>
