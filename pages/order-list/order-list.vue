<template>
	<view style="background-color: #f6f6fb;">
		<!-- 订单列表  -->
		<view class="connect-boxs">
			<!-- #ifdef MP-ALIPAY -->
			<scroll-view scroll-x="true" class="flex">
				<view class="btn-box">
					<view class="btn" v-for="(item, index) in tabList" :key="index" :class='index == activeIndex ? "active"
						: ""' @click="tabClick(index)">
						{{ item.name }}
					</view>
				</view>
			</scroll-view>
			<!--  #endif -->
			<!--  #ifndef MP-ALIPAY -->
			<view class="btn-boxs" style="background-color: #fff;">
				<view class="btns" v-for="(item, index) in tabList" :key="index" :class='index == activeIndex ? "active"
					: ""' @click="tabClick(index)">
					{{ item.name }}
				</view>
			</view>
			<!--  #endif -->
			<!-- 占位 -->
			<view style="height: 150rpx;" v-if="initList.length" class="list-boxs">
				<view class="order-item" v-for="(item, index) in initList" :key="index">
					<view class="top-box" @click="shop(item)">
						<u-icon name="home" />
						<text class="name">{{ item.mer.mer_name }}</text>
						<u-icon size="14" name="arrow-right" />
						<text class="type">{{ tabList[activeIndex].name }}</text>
					</view>
					<view class="center-box" @click="order(item)">
						<u-image mode="aspectFit" width="158rpx" height="158rpx" :src="item.sku.goods_image" />
						<view class="desc-box">
							<view class="u-line-1 title">{{ item.sku.goods_title }}</view>
							<view class="flex align-center u-flex-between">
								<view class="ft-24 flex flex-col" style="color: #9FA3B0;font-weight: 400;">
									<text>套餐:{{ item.sku.goods_sku_text }}</text>
									<!-- <text class="mt-15">租期:2021.12.05-2022.12.04</text> --> <text v-if="item.sku.reject_msg"
										class="mt-15">驳回原因：{{ item.sku.reject_msg }}</text>
									<text v-if="item.sku.refund_msg" class="mt-15">退款原因：{{ item.sku.refund_msg }}</text>
								</view>
								<!-- <text class="ml-auto">x 1</text> -->
							</view>
						</view>
					</view>
					<view class="bottom-box">
						<view class="price-box">
							<text class="ft-24 main-color">总租金</text>
							<text class="ft-32 ft-bold mx-20" style="color: #171b25;">¥{{ item.goods_amount }}</text>
							<text class="ft-24 main-color">共{{ item.stage }}期</text>
						</view>
						<!-- 待付款 -->
						<view class="order-btn" v-if="tabList[activeIndex].inx == '0'">
							<!-- <view class="btn ml-20"  v-if="item.is_authentication==0" @click="getIDNumber(item)">去认证</view> -->
							<view class="btn ml-20" @click="gopay(item)">去付款</view>
							<view class="btn ml-20" @click="opencancelorder(item)">取消订单</view>
							<view class="btn ml-20" @click="contact(item)">联系商家</view>
						</view>
						<!-- 已完成-->
						<view class="order-btn" v-if="tabList[activeIndex].inx == '6,7' || tabList[activeIndex].inx == '-2'">
							<view class="btn ml-20" @click="contact(item)">联系商家</view>
						</view>
						<!-- 待审核 -->
						<view class="order-tag-box" style="margin-top: 10rpx;" v-if="tabList[activeIndex].inx == '1'">
							<u-alert :description="'补充信息可加速审核，大幅提高审核通过率'" type="warning" fontSize="22rpx"></u-alert>
						</view>
						<view class="order-btn" v-if="tabList[activeIndex].inx == '1'">
							<view class="btn ml-20" style="background: #FF6633; color: #fff; border: 1px solid #FF6633;"
								@click="jumpAuth()">补充信息</view>
							<view class="btn ml-20" v-if="item.is_authentication == 0" @click="getIDNumber(item)">去认证</view>
							<view class="btn ml-20" @click="opencancelorder(item)">取消订单</view>
							<view class="btn ml-20" v-if="item.hetong" @click="hetong(item)">签署合同</view>
							<!-- <view class="btn ml-20" v-if="yaprice.order_id==item.id" @click="yajin(item)">补交￥{{yaprice.bond_price}}</view> -->
							<view class="btn ml-20" v-if="item.zujin" @click="yajin(item)">预交租金￥{{ item.zujin['bond_price'] }}</view>
							<!-- <view class="btn ml-20" @click="bujiaoyajin()">补交押金</view> -->
							<view class="btn ml-20" @click="contact(item)">联系商家</view>
						</view>
						<!-- 待发货 -->
						<view class="order-tag-box" style="margin-top: 10rpx;" v-if="tabList[activeIndex].inx == '2'">
							<u-alert :title="'您的商品将会在24小时内完成发货，预计2~3天内到达，请保持电话畅通，收货时请准备好身份证复印件'" type="warning"
								fontSize="22rpx"></u-alert>
						</view>
						<view class="order-btn" v-if="tabList[activeIndex].inx == '2'">

							<view class="btn ml-20" @click="prepaymentClick(item)">提前结算</view>
							<view class="btn ml-20" @click="contact(item)">联系商家</view>
						</view>
						<!-- 归还中 -->
						<view class="order-btn" v-if="tabList[activeIndex].inx == '9'">
							<view class="btn ml-20" @click="contact(item)">联系商家</view>
							<view class="btn ml-20" @click="courier_number(item)">填写单号</view>
						</view>
						<!-- 待收货 -->
						<view class="order-tag-box" style="margin-top: 10rpx;" v-if="tabList[activeIndex].inx == '3'">
							<u-alert :title="'您的商品已发货，预计2~3天内到达，请保持电话畅通，收货时请准备好身份证复印件'" type="warning" fontSize="22rpx"></u-alert>
						</view>
						<view class="order-btn" v-if="tabList[activeIndex].inx == '3'">
							<view class="btn ml-20" v-if="item.hetong" @click="hetong(item)">查看合同</view>
							<view class="btn ml-20" @click="prepaymentClick(item)">提前结算</view>
							<view class="btn ml-20" @click="logistics(item)">查看物流</view>
							<view class="btn ml-20" @click="goodsConfirm(item)">确认收货</view>
							<view class="btn ml-20" @click="contact(item)">联系商家</view>
						</view>
						<!-- 已取消 -->
						<view class="order-btn" v-if="tabList[activeIndex].inx == '-1'">
							<view class="btn ml-20" @click="delOrder(item)">删除订单</view>
							<view class="btn ml-20" @click="contact(item)">联系商家</view>
						</view>

						<!-- 待归还 -->
						<view class="order-tag-box" style="margin-top: 10rpx;" v-if="tabList[activeIndex].inx == '4'">
							<!-- 滞纳金 -->
							<view class="late_fee" v-if="item.late_fee_show">
								<u-alert :title="item.late_fee_title" :description="item.late_fee_desc" type="error"
									fontSize="28rpx"></u-alert>
							</view>
						</view>
						<view class="order-btn" v-if="tabList[activeIndex].inx == '4'">
							<view class="btn ml-20" @click="buyout(item)">买断</view>
							<!-- <view class="btn ml-20" @click="returnOrder(item)">归还</view>
						<view class="btn ml-20" @click="renewal(item)" v-if="item.sku.is_renewal== 'yes'">续租</view> -->
							<view class="btn ml-20" v-if="item.hetong" @click="hetong(item)">查看合同</view>
							<view class="btn ml-20" @click="prepaymentClick(item)">提前结算 </view>
						</view>
					</view>
				</view>
			</view>
			<view class="order-item-no" v-else>
				<u-icon name="warning" color="#9FA3B0" size="45rpx" labelColor="#9FA3B0" labelSize="30rpx" label="暂时没有订单哦">
				</u-icon>
			</view>
		</view>
		<view class="" v-if="quxiaoquan" style="padding-top: 20px;">
			<u-loading-icon color="#FF6633" text="正在取消..." size="16" :vertical="true" textSize="14"></u-loading-icon>
		</view>
		<u-popup :show="show" :round="10" mode="bottom" :closeable="true" @close="close">
			<view class="quxiaoyuanyin">请选择取消原因</view>
			<view style="padding: 30px;">
				<u-radio-group placement="column">
					<u-radio activeColor="#FF6633" labelColor="#61687C" :customStyle="{ marginBottom: '8px', padding: '10px' }"
						v-for="(item, index) in radiolist1" :key="index" :label="item" labelSize='18px' :name="item"
						@change="groupChange" shape="square">
					</u-radio>
				</u-radio-group>
			</view>
			<view class="" v-if="quxiaoquan" style="padding-top: 20px;">
				<u-loading-icon color="#FF6633" text="正在取消..." size="16" :vertical="true" textSize="14"></u-loading-icon>
			</view>
			<view class="querenquxiao">
				<view style="color: #FF6633;" @click="queren()">确定取消</view>
				<view style="color: #D5D7DC;">|</view>
				<view style="color: #61687C;" @click="show = false">暂不取消</view>
			</view>
		</u-popup>


		<u-modal :show="modalObj.cancelOrderShow" :showCancelButton="true" :closeOnClickOverlay="true" :title="modalObj.title"
			@confirm="cancelOrderConfim()" @cancel="modalObj.cancelOrderShow = false">
			<view class="slot-content" style="width: 100%;" v-if="modalObj.type == 4">
				<view class="buyout-li">
					<text>总金额:</text>
					<text>
						￥{{ buyOutObj.total_price || '0' }}
					</text>
				</view>
				<view class="buyout-li">
					<text>已付金额:</text>
					<text>
						￥{{ buyOutObj.paid_price || '0' }}
					</text>
				</view>
				<view class="buyout-li">
					<text>提前买断:</text>
					<text>￥{{ buyOutObj.buyout_price || '0' }}</text>
				</view>
			</view>
			<view class="slot-content" v-else-if="modalObj.type == 5">
				<view class="modal-li">
					<view class="li-input" @click="courierShow = true">
						{{ courier.name || '请选择快递公司' }}
						<view class="li-icon">
							<u-icon name="arrow-down" size="30rpx" color="#9FA3B0"></u-icon>
						</view>
					</view>
					<view class="li-ul" v-if="courierShow">
						<view class="li" v-for="(item, index) in courier.list" :key="index" @click="modalLi(item)">
							{{ item.name }}
						</view>
					</view>
					<view class="li-input">
						<u-input placeholder="请输入单号" border="surround" v-model="courier.code"></u-input>
					</view>
				</view>
			</view>
			<view class="slot-content" v-else>
				{{ modalObj.modalTxt }}
			</view>



		</u-modal>
		<!-- 联系商家 -->
		<Contact ref="contact" type="1" />
		<u-toast ref="uToast"></u-toast>
		<u-modal :show="modalShow" confirmText="支付成功" cancelText="支付失败" title="是否已经完成支付" @confirm="confirm" @cancel="modalShow = false"
			showCancelButton width="300px">
		</u-modal>
	</view>
</template>

<script>
import Contact from "../home/components/contact.vue"
export default {
	components: {
		Contact
	},
	data() {
		return {
			activeIndex: 0,
			pageSize: 20,
			pageIndex: 1,
			initList: [],
			courierShow: false,
			courier: {
				list: [],
				code: "",
				name: "",
				nameCode: "",
				show: false
			},
			show: true,
			modalObj: {
				cancelOrderShow: false,
				title: '',
				modalTxt: "",
				type: 0, //0删除订单  1取消订单  2确认收货  3归还  4买断  5填写单号
				data: {} //数据
			},
			targetObj: {},
			buyOutObj: {},
			payType: "", //支付类型
			// yaprice:[],
			tabList: [{
				name: "待付款",
				inx: "0"
			}, {
				name: "待审核",
				inx: "1"
			}, {
				name: "待发货",
				inx: "2"
			}, {
				name: "待收货",
				inx: "3"
			}, {
				name: "租赁中",
				inx: "4"
			}, {
				name: "归还中",
				inx: "9"
			}, {
				name: "已完成",
				inx: "6,7"
			}, {
				name: "已取消",
				inx: "-1"
			}, {
				name: "已驳回",
				inx: "-2"
			}],
			show: false,
			quxiaostatus: '',
			radiolist1: [],
			radiovalue1: '',
			itemorder: [],
			quxiaoquan: false,
			modalShow: false,
		};
	},
	onBackPress(e) {
		uni.switchTab({
			url: "/pages/home/home"
		})
		return true;
	},
	onLoad(obj) {
		this.activeIndex = obj.inx;
		// this.bujiaoyajin();
	},
	onShow() {
		this.listInit()
		// this.bujiaoyajin()
	},
	methods: {
		confirm() {
			this.modalShow = false;
			this.activeIndex = 6;
			this.initList = [];
			this.listInit()
			// location.reload();
		},
		close() {
			this.quxiaostatus = ''
			this.show = false
		},
		opencancelorder(item) {
			this.itemorder = item
			let opt = {
				url: '/cancelorder'
			}
			this.$request(opt).then(res => {
				this.radiolist1 = res.data
				this.radiovalue1 = res.data[1]
				this.show = true
			})
		},
		groupChange(n) {
			this.quxiaostatus = n
		},
		queren() {
			if (this.quxiaostatus == '') {
				this.$u.toast('请选择取消原因')
			} else if (this.quxiaostatus != '') {
				this.quxiaoquan = true
				let opt = {
					url: '/order/cancell',
					data: {
						id: this.itemorder.id,
						msg: this.quxiaostatus
					}
				}
				this.$request(opt).then(res => {
					// console.log(res)
					this.quxiaoquan = false
					this.show = false
					this.$u.toast('取消成功')
					this.listInit()
				})
			}
		},

		hetong(item) {
			// 提示查看合同 显示 loading
			uni.showLoading({
				title: '加载中,请稍候...'
			})

			// #ifdef MP-ALIPAY
			uni.hideLoading();
			uni.ap.openURL({
				//蚂蚁链电子签名合同链接
				url: item.hetong,
				fail: (error) => {
					uni.alert({ content: '失败：' + JSON.stringify(error) });
				}
			})
			// #endif
			console.log(item.hetong)
			// #ifndef MP-ALIPAY
			uni.downloadFile({
				url: item.hetong,
				success: function (res) {
					uni.hideLoading();
					var filePath = res.tempFilePath;
					uni.openDocument({
						filePath: filePath,
						fileType: 'pdf',
						showMenu: true,
						success: function (res) {
							console.log('打开文档成功');
						},
						fail: function (err) {
							console.log(err.errMsg);
							uni.showModal({
								title: '打开文档_fail',
								content: err.errMsg + fileUrl,
							})
						},
					});
				},
				fail: function (err) {
					uni.hideLoading();
					uni.showModal({
						title: '下载文档_fail',
						content: err.errMsg + fileUrl,
					})
				},
			});
			// #endif
		},
		contact(item) {
			console.log(item, '------------item')
			uni.setStorageSync('merid', item.mer_id);
			this.$refs.contact.setStatus(true)
			// contact(item)
		},
		cancelOrder(item) {
			this.modalObj = {
				cancelOrderShow: true,
				title: "取消订单",
				modalTxt: "确认取消订单",
				type: 1,
				data: item
			}
		},
		tradeYa(order_nn, order_sn, trade_no) {
			let _this = this
			// #ifdef MP-ALIPAY
			uni.tradePay({
				orderStr: order_nn,
				success: (res) => {
					console.log(res);
					if (res.resultCode == 9000) {
						uni.navigateTo({
							url: "../identity/identity?order_sn=" + order_sn
						})
					} else {
						console.log(res);
						uni.showToast({
							title: res.memo,
							duration: 2000,
							icon: 'none'
						});
						uni.navigateTo({
							url: '../eve/introduce',
						});
						// _this.tradePay(trade_no, order_sn)
					}
					// uni.alert({
					//   content: JSON.stringify(res),
					// });

				},
				fail: (res) => {
					console.log(res);
					uni.showToast({
						title: res.memo,
						duration: 2000,
						icon: 'none'
					});
					// uni.alert({
					//   content: JSON.stringify(res),
					// });
					// _this.tradePay(trade_no, order_sn)
				}
			});
			// #endif
			// #ifdef  APP-PLUS
			uni.requestPayment({
				provider: 'alipay',
				orderInfo: order_nn, //微信、支付宝订单数据
				success: function (res) {
					console.log(res, 'success')
					// 提示付款成功
					uni.showToast({
						title: '付款成功',
						duration: 2000,
						icon: 'none'
					});
					uni.navigateTo({
						url: "../identity/identity?order_sn=" + order_sn
					})
				},
				fail: (err) => {
					console.log(err, 'errrr');
					uni.showToast({
						title: err.code == -100 ? '取消支付' : '支付失败',
						duration: 2000,
						icon: 'none'
					});
				}
			});
			// #endif
		},
		gopay(item) {
			let opt = {
				url: '/pay/again',
				// method: "POST",
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: {
					order_id: item.id
				}
			}
			let _this = this
			this.$request(opt).then(res => {
				// console.log(res.url)
				let trade_no = res.data.alipay_trade_create_response.trade_no
				let order_sn = item.order_sn
				let order_nn = res.url
				let _this = this
				_this.payType = 'go'
				uni.navigateTo({
					url: "../identity/identity?order_sn=" + order_sn
				})
				return
				// 支付宝直接支付
				// #ifdef MP-ALIPAY
				_this.tradeYa(order_nn, order_sn, trade_no);
				// #endif
				// #ifndef MP-ALIPAY
				uni.navigateTo({
					url: "../identity/identity?order_sn=" + order_sn
				})
				// uni.showActionSheet({
				// 	title: '请选择支付方式',
				// 	itemList: ['支付宝', '微信'],
				// 	success: function (res) {
				// 		if (res.tapIndex == 0) {
				// 			_this.tradeYa(order_nn, order_sn, trade_no);
				// 		} else {
				// 			// 提醒暂未开通微信支付,请选择支付宝方式付款
				// 			_this.$refs.uToast.show({
				// 				message: '暂未开通微信支付,请选择支付宝方式付款',
				// 				icon: 'none',
				// 				type: 'none',
				// 			})
				// 		}
				// 	},
				// 	fail: function (res) {
				// 	}
				// });
				// #endif
				// _this.tradePay(trade_no, order_sn)
			})
		},
		//支付押金

		// 授权身份证号
		getIDNumber(item) {
			// #ifdef MP-ALIPAY
			uni.navigateTo({
				url: "../identity/identityy?order_sn=" + item.order_sn
			})
			// #endif
			// #ifndef MP-ALIPAY
			uni.navigateTo({
				url: "../identity/identity?order_sn=" + item.order_sn + '&orderStatus=1'
			})
			// #endif
		},

		modalLi(item) {
			this.courier.name = item.name
			this.courier.nameCode = item.code || ''
			this.courierShow = false
			console.log(item, '------快递', this.courier)
		},
		//归还中的弹框
		courier_number(data) {
			this.modalObj = {
				cancelOrderShow: true,
				title: "填写单号",
				modalTxt: "",
				type: 5,
				data: data
			}
			//获取快递信息
			this.expressHttp()
		},
		buyout(item) {
			this.modalObj = {
				cancelOrderShow: true,
				title: "买断",
				modalTxt: "",
				type: 4,
				data: item
			}
			this.buyoutHttp()
		},
		goodsConfirm(item) {
			this.modalObj = {
				cancelOrderShow: true,
				title: "收货",
				modalTxt: "确认收货吗",
				type: 2,
				data: item
			}
		},
		delOrder(item) {
			this.modalObj = {
				cancelOrderShow: true,
				title: "删除订单",
				modalTxt: "确认删除订单吗",
				type: 0,
				data: item
			}
		},
		returnOrder(item) {
			this.modalObj = {
				cancelOrderShow: true,
				title: "归还",
				modalTxt: "确认归还该商品吗",
				type: 3,
				data: item
			}
		},
		cancelOrderConfim() {
			//0删除订单  1取消订单  2确认收货  3归还  4买断  5填写单号
			if (this.modalObj.type == 0) {
				this.OrderModalHttp('/order/destroy')
			}
			if (this.modalObj.type == 1) {
				this.OrderModalHttp("/order/cancel")
			}
			if (this.modalObj.type == 2) {
				this.goodsBtn("/order/confirm/receipt")
			}
			if (this.modalObj.type == 3) {
				this.OrderModalHttp("/order/return")
			}
			if (this.modalObj.type == 4) {
				this.pay()
			}
			if (this.modalObj.type == 5) {
				this.expressSubHttp()
			}
			this.modalObj.cancelOrderShow = false
		},
		OrderModalHttp(url) { //取消订单接口
			let opt = {
				url: url,
				data: {
					id: this.modalObj.data.id,
				}
			}
			this.$request(opt).then(res => {
				this.$refs.uToast.show({
					message: res.msg || '成功',
					icon: 'success',
					type: 'success'
				})
				// 打印调用成功回调
				this.listInit()
			})
		},
		goodsBtn(url) {
			let opt = {
				url: url,
				method: "POST",
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: {
					id: this.modalObj.data.id,
				}
			}
			this.$request(opt).then(res => {
				this.$refs.uToast.show({
					message: res.msg || '成功',
					icon: 'success',
					type: 'success'
				})
				// 打印调用成功回调
				this.listInit()
			})
		},
		jumpAuth() {
			uni.navigateTo({
				url: "../home/authentication",
			});
		},
		shop(item) {
			uni.navigateTo({
				url: "shop?id=" + item.mer.id,
			});
		},
		//买断付款
		pay() {
			let _this = this
			//支付获取商家订单号+支付宝交易号码
			let opt = {
				url: "/pay/buyout",
				method: "POST",
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: {
					id: this.modalObj.data.id,
					// #ifndef MP-ALIPAY
					mode: 'app',
					// #endif
					// #ifdef H5
					mode: 'h5',
					// #endif
				}
			}
			_this.$request(opt).then(res => {
				// 打印调用成功回调
				_this.payType = 'buyout'

				// 支付宝直接支付
				// #ifdef MP-ALIPAY
				let trade_no = res.data.parameter.alipay_trade_create_response.trade_no;
				_this.tradePay(trade_no)
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
							console.log(parameter, '支付宝支付');
							_this.modalShow = true;
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
				// this.tradePay(trade_no) //调用支付宝付款接口
				console.log(res)
			})
		},
		buyoutHttp() {
			let opt = {
				url: "/order/buy_out",
				data: {
					id: this.modalObj.data.id,
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.buyOutObj = {
					"total_price": res.data.total_price, //支付总金额
					"paid_price": res.data.paid_price, //付款金额
					"buyout_price": res.data.buyout_price, //买断价
					"unpaid_price": res.data.unpaid_price //未支付金额
				}
			})
		},
		//获取快递公司
		expressHttp() {
			let opt = {
				url: "/express",
				data: {
					order_id: this.modalObj.data.id
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.courier = {
					list: res.data.express || '',
					code: res.data.express_return_code || ''
				}
			})
		},
		//提交快递单号
		expressSubHttp() {
			let opt = {
				url: "/express",
				method: "POST",
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: {
					order_id: this.modalObj.data.id,
					express_return_code: this.courier.nameCode,
					express_return_no: this.courier.code,
					express_return_name: this.courier.name
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.$refs.uToast.show({
					message: res.msg || '成功',
					icon: 'success',
					type: 'success'
				})
			})
		},
		//支付宝支付
		tradePay(trade_no) {
			let _this = this
			console.log(trade_no, 'trade_no')
			console.log(this.initList.order_sn, 'this.initList.order_sn')
			// #ifdef MP-ALIPAY
			uni.tradePay({
				tradeNO: trade_no,
				success: function (res) {
					// uni.alert(res.resultCode);
					console.log(JSON.stringify(res))
					if (res.resultCode == 9000) {
						//去付款后人脸认证

						if (this.payType == 'go') {
							uni.navigateTo({
								url: "../identity/identity?order_sn=" + this.initList.order_sn
							})
						}
						_this.bujiaoyajin()
						//买断后
						if (this.payType == 'buyout') {
							uni.navigateTo({
								url: "../order-list/order-list?inx=3"
							})
						}
						//补交保证金后
						if (this.payType == 'buji') {
							uni.switchTab({
								url: "../home/home"
							})
						}

					} else {
						_this.$refs.uToast.show({
							message: res.memo || '取消支付',
							icon: 'error',
							type: 'error',
						})
					}

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
					// uni.alert(res.resultCode);
					console.log(res, 'requestPayment')
				},
				fail: function (res) {
					// uni.alert(res.resultCode);
					console.log(res, '支付失败')
				},
			});
			// #endif
		},

		listInit() {
			let opt = {
				url: "/order/list",
				data: {
					status: this.tabList[this.activeIndex].inx,
					pageIndex: this.pageIndex,
					pageSize: this.pageSize
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.initList = res.data.data
				console.log(this.initList)
			})
		},
		tabClick(index) {
			this.activeIndex = index;
			this.initList = [];
			this.listInit()
		},
		order(item) {
			uni.navigateTo({
				url: 'order?id=' + item.id
			})
		},
		prepaymentClick(item) {
			// #ifdef MP-ALIPAY
			uni.requestSubscribeMessage({
				//扣款提醒
				entityIds: ['97706ed29d1b4635aaddeb429723044e', '3013feeb83f340f4a3cdf8209bbb27ef', 'f1a4883fe2db417c8b881b241ee953c7'],
				complete: (res) => {
					uni.navigateTo({
						url: "prepayment?id=" + item.id + '&status=' + this.tabList[this.activeIndex].inx
					})
				}
			});
			// #endif
			// #ifndef MP-ALIPAY
			uni.navigateTo({
				url: "prepayment?id=" + item.id + '&status=' + this.tabList[this.activeIndex].inx
			})
			// #endif
		},
		renewal(item) {
			uni.navigateTo({
				url: "../home/renewal?id=" + item.id
			})
		},
		logistics(item) {
			uni.navigateTo({
				url: "logistics?id=" + item.id
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.querenquxiao {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	padding: 15px 24px;
	border-top: 1px solid #F1F2F5;
}

.quxiaoyuanyin {
	font-size: 14px;
	text-align: center;
	padding-top: 15px;
	color: #414960;
	border-bottom: 1px solid #F1F2F5;
	padding-bottom: 15px;
}

.btn-box {
	display: flex;
	padding: 30rpx;
	align-items: center;
	// margin-bottom: 30rpx;
	background-color: #FFFFFF;
	border-top: 1px solid #f0f0f0;

	// border: 1px solid red;
	// overflow-x: auto;
	.active {
		font-weight: bold;
		color: #FF6633 !important;
		border-bottom: 2px solid #FF6633;
		background: rgba($color: #FF6633, $alpha: 0.1) !important;
	}

	.btn {
		width: 158rpx;
		height: 64rpx;
		color: #9FA3B0;
		font-size: 28rpx;
		text-align: center;
		line-height: 64rpx;
		background: #F1F2F5;
		border-radius: 10rpx;
		// display: inline-block;
	}

	.btn+.btn {
		margin-left: 20rpx;
	}
}

.connect-boxs {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.btn-boxs {
	display: flex;
	padding: 30rpx;
	overflow-x: auto;
	// border: 1px solid red;
	// 使btns 在一行显示 并横向滚动
	white-space: nowrap;

	.active {
		font-weight: bold;
		color: #FF6633 !important;
		border-bottom: 2px solid #FF6633;
		background: rgba($color: #FF6633, $alpha: 0.1) !important;
	}

	.btns+.btns {
		margin-left: 20rpx;
	}

	.btns {
		// width: 158rpx;
		height: 64rpx;
		color: #9FA3B0;
		font-size: 28rpx;
		text-align: center;
		line-height: 64rpx;
		background: #F1F2F5;
		border-radius: 10rpx;
		padding: 0rpx 30rpx;
		// display: inline-block;
	}
}

.list-boxs {
	flex: 1;
	// border: 1px solid red;
	overflow-y: auto;
}

.order-item {
	width: 718rpx;
	border-radius: 14rpx;
	margin: 14rpx auto 14rpx auto;
	background-color: #FFFFFF;
	filter: 2rpx 2rpx 0 #E5E5E5;
}

.order-item-no {
	text-align: center;
	margin-top: 100rpx;
	color: #9FA3B0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.top-box {
	display: flex;
	padding: 30rpx 30rpx;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid rgba($color: #E5E5E5, $alpha: 0.3);

	.name {
		color: #414960;
		margin: 0 10rpx;
		font-size: 24rpx;
		font-weight: bold;
	}

	.type {
		color: #FF6633;
		font-size: 24rpx;
		margin-left: auto;
	}
}

.center-box {
	display: flex;
	align-items: center;
	width: 651rpx;
	margin: 0 auto;
	padding: 30rpx 0;
	border-bottom: 1px solid rgba($color: #E5E5E5, $alpha: 0.3);

	.desc-box {
		width: 470rpx;
		display: flex;
		margin-left: auto;
		flex-direction: column;

		.title {
			color: #171B25;
			font-size: 28rpx;
			margin-bottom: 15rpx;
		}
	}
}

.bottom-box {
	text-align: right;
	padding: 30rpx;

	.price-box {
		letter-spacing: 2rpx;
	}

	.order-btn {
		display: flex;
		margin-top: 30rpx;
		// justify-content: right;
		// align-items: right;
		flex-direction: row-reverse;

		.btn {
			height: 53rpx;
			width: 143rpx;
			color: #414960;
			font-size: 24rpx;
			text-align: center;
			line-height: 53rpx;
			border-radius: 10rpx;
			border: 2rpx solid #414960;
		}
	}
}

.buyout-li {
	height: 55rpx;
	line-height: 55rpx;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	white-space: nowrap;

	text {
		width: 30%;

		text-align: right;
		// #ifdef H5
		text-align: left;
		// #endif

	}
}

.modal-li {
	width: 100%;
	color: #000;
	position: relative;

	.li-input {
		height: 60rpx;
		line-height: 60rpx;
		width: 100%;
		margin: 20rpx auto;
		border-radius: 14rpx;
		position: relative;
		// text-align: center;
		padding-left: 10rpx;
		border: 1rpx solid #9FA3B0;

		.li-icon {
			position: absolute;
			top: 12rpx;
			right: 15rpx;
		}

		/deep/ .u-input {
			padding-top: 0 !important;
		}
	}

	.li-ul {
		position: absolute;
		top: 65rpx;
		left: 0;
		width: 100%;
		border-radius: 14rpx;
		height: 180rpx;
		overflow-y: scroll;
		z-index: 99999;
		background: #fff;
		border: #9FA3B0 solid 1rpx;

		.li {
			padding: 10rpx 0;
			width: 80%;
			color: #999;
			border-bottom: #f7efef solid 1rpx;
			margin: 0 auto;
			text-align: center;
		}
	}
}

/deep/ .u-modal__title {
	color: #000;
	font-size: 34rpx;
}
</style>
