<template>
	<!-- 订单详情 -->
	<view class="order-detail" style="background-color: #f6f6fb;">

		<!-- 通知 -->
		<view class="notice-box" v-if="params.path == 'goods-detail'">
			<u-notice-bar :text="notice"></u-notice-bar>
		</view>
		<!-- 在线客服 -->
		<!-- #ifdef MP-ALIPAY -->
		<!-- #endif -->
		<view class="detail-box">
			<!-- <text @click="address()"> {{ addressArr.name }} </text> -->
			<!-- 地址栏 -->
			<view class="address_bar" @click="address()" v-show="addressArr.name">
				<view class="address-info">
					<text>{{ addressArr.name }}</text>
					<text class="address_bar_num">{{ addressArr.mobile }}</text>
				</view>
				<view class="address"> {{ addressArr.province + addressArr.city + addressArr.area + addressArr.address }}
				</view>
				<view class="address_arrow">
					<u-icon name="arrow-right" color="#9FA3B0" size="28rpx"></u-icon>
				</view>
			</view>
			<view class="address_bar" @click="address()" v-show="!addressArr.name">
				<view class="address-info">
					<text>选择地址</text>
				</view>
				<view class="address"> 注意：地址请写详细例如（XX楼XX栋） </view>
				<view class="address_arrow">
					<u-icon name="arrow-right" color="#9FA3B0" size="28rpx"></u-icon>
				</view>
			</view>
			<!-- 			<view class="idCard-box">
				<u-input placeholder="请输入您的邮箱" border="bottom" clearable v-model="email" :value="email"></u-input>
			</view>
			<view class="idCard-box">
				<u-input placeholder="请输入紧急联系人" border="bottom" clearable v-model="jinjiname" :value="jinjiname"></u-input>
			</view>
			<view class="idCard-box">
				<u-input placeholder="紧急联系人电话" border="bottom" clearable v-model="jinjimobile" :value="jinjimobile"></u-input>
			</view> -->
			<!-- 订单信息 -->
			<view class="order">
				<view class="info-box">
					<view class="order-img">
						<u-image :showLoading="true" :src="sku_data.image || '/static/index-icon/10.webp'" width="160rpx"
							height="160rpx" />
					</view>
					<view class="order-info">
						<view class="info-title">{{ goods_data.title }} </view>
						<view class="info-package">套餐：{{ sku_data.goods_sku_text }}</view>
						<view class="info-package">数量：{{ params.num }}</view>
					</view>
				</view>
				<view class="zujinkuang" style="margin: 24rpx;">
					<view class="rent-li">
						<text>预计起租日</text>
						<text class="li-r">{{ leasetime.startleasetime }}</text>
					</view>
					<view class="rent-li">
						<text>到期日</text>
						<text class="li-r">{{ leasetime.endleasetime }}</text>
					</view>
				</view>
				<view class="order-tag-box">
					<u-alert :title="'提示：一般货物会在24小时内发出，如有特殊情况，客服会主动联系告知；快递运输期间不算租期，实际起租日为订单日后推3天'" type="warning"
						fontSize="22rpx"></u-alert>
				</view>
			</view>
			<!-- 租金明细 -->
			<view class="rent-detail">
				<view class="rent-title">
					<text class="title-l">预计每日 </text>
					<text class="title-r">￥{{ sku_data.day_price == null ? 0 : sku_data.day_price }} </text>
				</view>
				<view class="zujinkuang">
					<view class="rent-li">
						<text>首期租金 </text>
						<!-- <text v-if="rentinfo.youhui == '1' && rentinfo.discount_price != 0 " style="color: #FF5B56;" class="li-r">￥{{rentinfo.bottom_rent}} - {{rentinfo.discount_price}}(券) = {{(rentinfo.bottom_rent - rentinfo.discount_price).toFixed(2)}}</text> -->

						<text v-if="youhuiprice != ''" style="color: #FF5B56;" class="li-r">￥{{ rentinfo.top_rent }} -
							{{ youhuiprice }}(券) = {{ (rentinfo.top_rent - youhuiprice).toFixed(2) }}</text>
						<text v-else class="li-r">￥{{ rentinfo.top_rent == null ? 0 : rentinfo.top_rent }} </text>
					</view>

					<view class="rent-li">
						<text>剩余租金 </text> <text class="li-r"> {{ rentinfo.surplus_rend == null ? 0 : rentinfo.surplus_rend }}
						</text>
					</view>
					<view class="rent-li">
						<text>总租金 </text> <text class="li-r">￥{{ rentinfo.total_rent == null ? 0 : rentinfo.total_rent }}
						</text>
					</view>

					<view class="rent-li">
						<text>配送方式 </text> <text class="li-r"> 寄出包邮/顺丰包邮 </text>
					</view>
					<view class="rent-li" v-if="guard_data && guard_data.id">
						<text>{{ guard_data.guard_title }} </text> <text class="li-r u-line-1">{{
							guard_data.guard_desc }}￥{{ guard_data.defaultamount || 0 }}</text>
					</view>
					<!-- <view class="rent-li">
					<text>买断尾款 </text> <text
						class="li-r">￥{{ rentinfo.buyout_bottom_price ==null?0:rentinfo.buyout_bottom_price}} </text>
				</view> -->
				</view>
				<view class="renya" v-if="(mianyastatus == 'yes')">
					<text>总押金 </text> <text class="liya">芝麻信用·有机会免押</text>
				</view>
			</view>
			<!-- 芝麻信用 -->
			<view class="sesame" v-if="(mianyastatus == 'no')">
				<!-- <text class="title-l">凭芝麻信用最高可减免押金 </text> -->
				<view class="title-l">押金 <text class="shenhe">(审核不通过原路退还)</text> </view>
				<text class="title-r">￥ {{ sku_data.deposit }} </text>
			</view>
			<!-- 优惠金额 -->

			<!-- <view class="rent-li" @click="youhuiquankeyong">
				<text>优惠券 </text> <text class="li-r"> 请选择优惠券 </text>
			</view> -->
			<view class="sesame" @click="youhuiquanopen">
				<text class="title-l">优惠券</text>
				<text class="title-r" style="color: #FF5B56;font-size: 12px;" v-if="youhuiprice == '' || youhuiprice == '0'">{{
					youhuiquan.length || 0 }}张可用></text>
				<text class="title-r" v-else>￥ {{ youhuiprice || 0.00 }} </text>
			</view>
			<!-- <view class="idCard-box">
				<u-cell-group :border="false">
					<u-cell title="优惠券" :value="sku_data.buyout_price" ></u-cell>
				</u-cell-group>
			</view> -->
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
			<!-- 实名认证上传身份证 -->
			<!-- <view class="idCard-box">
				<u-cell-group :border="false">
					<u-cell title="身份认证" :value="idcardstatus" isLink :url="idCardUrl" ></u-cell>
				</u-cell-group>
			</view> -->
			<!-- <view class="rent-li">
				<text> </text> <text class="li-r"> ￥0.00 </text>
			</view> -->
			<!-- 备注 -->
			<view class="idCard-box">
				<u-cell-group :border="false">
					<u-cell :border="false" title="到期完结" :value="sku_data.buyout_price"></u-cell>
				</u-cell-group>
			</view>
			<view class="idCard-box">
				<u-cell-group :border="false">
					<u-cell :border="false" title="租赁计划" isLink @click="opendingyue()"></u-cell>
				</u-cell-group>
			</view>
			<view class="note">
				<text style="color: #414960;">备注</text>
				<view class="note-input">
					<u-input placeholder="请在这留下您的备注" v-model="remark" border="none" />
				</view>
			</view>
		</view>



		<!-- 协议与总金额 -->
		<view class="conclusion">
			<view class="agreement-box">
				<view class="agreement-radio">
					<u-checkbox-group>
						<u-checkbox label="我已阅读并同意" size="22" @change="radioChange" activeColor="#ff6633" :name="agreementFlag"
							shape="circle" v-model="agreementFlag"></u-checkbox>
					</u-checkbox-group>
				</view>
				<view class=""><text class="color-txt" @click="tiaozhuanxieyi()">“租赁服务及相关协议”</text>
				</view>
			</view>
			<!-- <view class="shiming" @click="amountBtn"> -->
			<view class="shiming" @click="dingyue">
				<text class="amount-btn">提交订单</text>
			</view>
		</view>
		<u-modal :show="agreementObj.agreementShow" :closeOnClickOverlay="true" :title="agreementObj.title"
			@confirm="agreementObj.agreementShow = false" @close="agreementObj.agreementShow = false">
			<view class="slot-content" style="height:750rpx;" scroll-y="true">
				<scroll-view scroll-y="true" style="height: 800rpx;" scroll-with-animation="true">
					<u-parse :content="agreementObj.text"></u-parse>
				</scroll-view>
			</view>
		</u-modal>
		<u-toast ref="uToast"></u-toast>
		<Contact ref="contact" />

		<uni-popup ref="yhPopup" 
		type="bottom" 
		@change="popChange"
		border-radius=" 10px 10px 0 0 "
		:safe-area-inset-bottom="true"
		:show="popShow">
			<view class="popup">
				<view class="youhuiquantop"
					style="padding: 15px;text-align: center;background: #fff;border-radius: 10px 10px 0pt 0pt;">
					<text>优惠券</text>
				</view>
	
				<!-- 删除按钮 -->
				<view class="youhuiquan-close" @click="closePopup">
					<u-icon name="close" size="20" color="#999"></u-icon>
				</view>

				<view class="" v-if="youhuiquan.length == 0">
					<u-empty mode="coupon" text="非常抱歉! 暂时没有可用的优惠券哦~" textSize="12">
					</u-empty>
				</view>
				<view v-else style="padding:10px 10px 50px;background: #f0f0f0;">
					<view class="" @click="ceshi(item)" v-for="(item, index) in youhuiquan" :key="index">
						<view v-if="yixuan == item.id"
							style="position: absolute;background: #FF5B56;border-radius: 10px 0 50px;padding: 5px;">
							<u-icon name="checkbox-mark" color="#fff" size="20"></u-icon>
						</view>
						<view class="" style="background: #fff; padding: 15px 20px;border-radius: 10px;margin-bottom: 10px;">
							<view class="youhuiquantext">
								<text style="font-size: 15px;font-weight: 800;">{{ item.activity_name }}</text>
								<text style="font-size: 20px;font-weight: 800;color: #FF5B56;">￥{{ item.amount }}</text>
							</view>
							<view class="youhuiquantext">
								<text style="font-size: 10px;color: #a5a5a5;">有效期至{{ item.valid_end_time }}</text>
								<text style="font-size: 10px;color: #FF5B56;">满{{ item.floor_amount }}可用</text>
							</view>
							<u-divider :textSize='10' lineColor='#ffbebe' text="使用说明"></u-divider>
							<view class="" style="padding-top: 6px;">
								<u-text :text="item.voucher_description" :size="10" color="#a5a5a5"></u-text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="zlPopup" background-color="#fff" type="bottom">
			<view style="position: relative;">
			
				<!-- 删除按钮 -->
				<view class="zlPopup-close" @click="closePopup">
					<u-icon name="close" size="20" color="#999"></u-icon>
				</view>
		
				<view style="padding: 50px 30px;" class="baokuang">
					<view class="" v-for="(item, index) in rentt" :key="index">
						<view class="wenzi">
							<view>第{{ index + 1 }}期
								<text style="margin-left: 10px;">
									{{ item.qishu }}
								</text>
							</view>
							<!-- <view v-if="rentinfo.youhui == '1' && index+1 == '1' && rentinfo.discount_price != 0 ">
							<text style="color: #FF5B56;">-￥{{(item.rent - rentinfo.discount_price).toFixed(2)}}(券)</text>
						</view> -->
							<view>
								<!-- <text v-if="rentinfo.youhui == '1' && index+1 == '1' && rentinfo.discount_price != 0 " style="color: #FF5B56;">-￥{{(item.rent - rentinfo.discount_price).toFixed(2)}}(券)</text> -->
								<text v-if="youhuiprice != '' && index + 1 == '1'" style="color: #FF5B56;">-￥{{ (item.rent -
									youhuiprice).toFixed(2) }}(券)</text>
								<text v-else>-￥{{ item.rent }}</text>
							</view>

						</view>
					</view>
					<view class="wenzi" v-if="sku_data.buyout_price != '0.00'">
						<text style="color: #3c9cff;">到期完结/租完买断</text>
						<text style="color: #3c9cff;">-￥{{ sku_data.buyout_price }}</text>
					</view>
				</view>
			</view>
		</uni-popup>

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
			location: {},
			email: "",
			mianyastatus: '',
			detailStatu: 1,
			address_id: 0,
			time: {},
			params: {},
			agreementObj: {
				title: '',
				agreementShow: false,
				text: ""
			},
			agreementFlag: false,
			agreement: '',
			qishu: '',
			addressArr: {},
			goods_data: {},
			leasetime: {},
			order_key: '',
			rentinfo: {},
			rentt: {},
			sku_data: {},
			actual: Number,
			notice: '',
			remark: "", //备注
			certification_status: 0, //认证状态
			guard_data: {}, //保障方案
			idCardUrl: "",
			idcardstatus: "",
			chuanzhi: {},
			show: false,
			formObj: {
				"id": 0, //地址id
				"name": "", //收货人姓名
				"mobile": "", //手机号
				"address": "", //详细地址
				province: '',
				city: '',
				area: '',
				"email": "", //邮箱
			},
			youhuiquanstatus: false,
			yixuan: 1,
			youhuiquan: [],
			youhuiprice: '',
			popShow: false,
		};
	},
	onLoad(obj) {
		this.params = obj
		this.certification_status = obj.certification_status || 0;
		// this.getidcadr()
		this.getLocation()
		// this.getidcadrd()
		console.log(this.params, 'this.paramsthis.params')

	},
	onShow() {
		if (this.params.path == 'goods-detail') { //订单状态为待付款
			this.confirmOrder()
		}
		this.idCardUrl = "/pages/idcard/idcard?type=detail&num=" + this.params.num + "&goods_sku_id=" + this.params
			.goods_sku_id + "&address_id=" + this.address_id
	},

	watch: {
		params(newVal, oldVal) {
			this.params = newVal;
			console.log(this.params, 'this.paramsthis.params')

		},
		// remark(newVal, oldVal) {
		// 	this.remark = newVal
		// },
	},
	methods: {
		closePopup() {
			this.popShow = false;
			this.$refs.yhPopup.close('bottom');
			this.$refs.zlPopup.close('bottom')
		},
		opendingyue() {
			// #ifdef MP-ALIPAY
			uni.requestSubscribeMessage({
				//优惠券到期提醒，优惠券领取提醒
				entityIds: ['97706ed29d1b4635aaddeb429723044e', '3013feeb83f340f4a3cdf8209bbb27ef',
					'f1a4883fe2db417c8b881b241ee953c7'
				],
				complete: (res) => {
					this.open()
				}
			});
			// #endif
			// #ifndef MP-ALIPAY
			this.open()
			// #endif
		},
		ceshi(e) {
			if (this.yixuan == e.id) {
				this.yixuan = ''
				this.youhuiprice = ''
			} else {
				this.yixuan = e.id
				this.youhuiprice = e.amount
				this.youhuiquanstatus = false
			}
		},
		youhuiquanclose() {
			this.youhuiquanstatus = false
		},
		youhuiquanopen() {

			// this.youhuiquanstatus = true;
			this.$refs.yhPopup.open('bottom')
			this.popShow = true;
		},
		youhuiquanke() {
			let opt = {
				url: '/youhuiquan',
				data: {
					price: this.rentinfo.bottom_rent,
					goodid: this.goods_data.goods_id
				}
			}
			this.$request(opt).then(res => {
				console.log(res.data)
				this.youhuiquan = res.data
			})
		},
		tiaozhuanxieyi() {
			uni.navigateTo({
				url: '../order-list/xieyilist'
			})
		},
		// mianya() {
		// 	let opt = {
		// 		url: '/order/mianya',
		// 		method: "POST",
		// 		header: "application/x-www-form-urlencoded;charset=utf-8",
		// 		data: {}
		// 	}
		// 	this.$request(opt).then(res => {
		// 		console.log(res)
		// 		let order = res.data
		// 		console.log(order)
		// 		// 支付宝直接支付
		// 		// #ifdef MP-ALIPAY
		// 		this.amountYa(order)
		// 		// #endif
		// 		// app 弹窗选择支付方式
		// 		// #ifndef MP-ALIPAY
		// 		uni.showActionSheet({
		// 			title: '请选择支付方式',
		// 			itemList: ['支付宝', '微信'],
		// 			success: function (res) {
		// 				if (res.tapIndex == 0) {
		// 					// 支付宝支付
		// 					this.amountYa(order)
		// 				} else if (res.tapIndex == 1) {
		// 					// 微信支付
		// 					uni.showToast({
		// 						title: '暂未开通微信支付',
		// 						icon: 'none'
		// 					})
		// 				}
		// 			}
		// 		});
		// 		// #endif
		// 	})
		// },
		// amountYa(order) {
		// 	let _this = this
		// 	// #ifdef MP-ALIPAY
		// 	uni.tradePay({
		// 		orderStr: order,
		// 		success: (res) => {
		// 			console.log(res);
		// 			uni.alert({
		// 				content: JSON.stringify(res),
		// 			});
		// 		},
		// 		fail: (res) => {
		// 			console.log(res);
		// 			uni.alert({
		// 				content: JSON.stringify(res),
		// 			});
		// 		}
		// 	});
		// 	// #endif
		// 	// #ifndef MP-ALIPAY
		// 	// 支付宝付款
		// 	uni.requestPayment({
		// 		provider: 'alipay',
		// 		orderInfo: order, //微信、支付宝订单数据
		// 		success: function (res) {
		// 			console.log(res);
		// 			uni.alert({
		// 				content: JSON.stringify(res),
		// 			});
		// 		},
		// 		fail: function (res) {
		// 			console.log(res);
		// 			uni.alert({
		// 				content: JSON.stringify(res),
		// 			});
		// 		}
		// 	});
		// 	// #endif
		// },
		getLocation() {
			let _this = this;
			// #ifdef MP-ALIPAY
			uni.getLocation({
				type: 1,
				success: function (res) {
					_this.location = res;
				},
				fail: function (res) {
					if (res.message == '用户不允许授权') {
						uni.showModal({
							title: '温馨提示',
							content: '请允许获取位置信息，以便我们分配就近仓库尽快发货',
							success: function (res) {
								if (res.confirm) {
									_this.getLocation()
								}
							}
						});
					}
				}
			});
			// #endif
			// #ifndef MP-ALIPAY
			uni.getLocation({
				type: 'wgs84',
				success: function (res) {
					_this.location = res;
				},
				fail: function (res) {
					if (res.message == '用户不允许授权') {
						uni.showModal({
							title: '温馨提示',
							content: '请允许获取位置信息，以便我们分配就近仓库尽快发货',
							success: function (res) {
								if (res.confirm) {
									_this.getLocation()
								}
							}
						});
					}
				}
			});
			// #endif
		},
		open() {
			// this.show = true;
			console.log(this.rentt, this.sku_data, 'youhuiquanopen')
			this.$refs.zlPopup.open('bottom')
		},
		close() {
			this.show = false
		},
		radioChange(e) {
			this.agreement = e
			console.log(e, '-----radio')
			this.agreementFlag = !this.agreementFlag
		},
		agreementModal(type) {
			if (type == 1) {
				this.agreementObj.title = "租赁服务协议"
				this.agreementHttp('/zulinxieyi')
			}
			if (type == 2) {
				this.agreementObj.title = "隐私协议"
				this.agreementHttp('/privacy')
			}
			if (type == 3) {
				this.agreementObj.title = "数字证书使用协议"
				this.agreementHttp('/shuzizhengshu')

			}
			if (type == 4) {
				this.agreementObj.title = "租赁委托担保合同"
				this.agreementHttp('/weituodanbao')

			}
			if (type == 5) {
				this.agreementObj.title = "个人征信授权书"
				this.agreementHttp('/zhengxinshouquan')

			}
			this.agreementObj.agreementShow = true
		},
		agreementHttp(url) { //协议请求
			let opt = {
				url: url
			}
			this.$request(opt).then(res => {
				this.agreementObj.text = res.data;
			})
		},
		dingyue() {
			let _this = this
			// 支付宝
			// #ifdef MP-ALIPAY
			uni.getAuthCode({
				scopes: ['order_service'],
				success: (res) => {
					_this.amountBtn()
					// 订单服务授权成功
				},
				fail: (res) => {
					_this.amountBtn()
				},
			});
			// #endif
			// #ifndef MP-ALIPAY
			_this.amountBtn()
			// #endif
		},
		amountBtn() {
			// let emailReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
			// if(!this.email){
			// 	this.$refs.uToast.show({
			// 		message: '请输入您的电子邮箱',
			// 		icon: 'error',
			// 		type: 'error'
			// 	})
			// 	return true
			// } 
			// if (this.email && emailReg.test(this.email) == false) {
			// 	this.$refs.uToast.show({
			// 		message: '邮箱格式不正确',
			// 		icon: 'error',
			// 		type: 'error'
			// 	})
			// 	return true
			// }
			// if (!this.jinjiname) {
			// 	this.$refs.uToast.show({
			// 		message: '请输入紧急联系人',
			// 		icon: 'error',
			// 		type: 'error'
			// 	})
			// 	return true
			// }
			// if (!this.jinjimobile) {
			// 	this.$refs.uToast.show({
			// 		message: '请输入紧急联系人电话',
			// 		icon: 'error',
			// 		type: 'error'
			// 	})
			// 	return true
			// }
			// let telReg = /^1[3456789]\d{9}$/
			// if (telReg.test(this.jinjimobile) == false) {
			// 	this.$refs.uToast.show({
			// 		message: '紧急联系人电话格式不正确',
			// 		icon: 'error',
			// 		type: 'error'
			// 	})
			// 	return true
			// }
			if (this.agreement) {
				// if(!this.idcardstatus){
				// 	this.$refs.uToast.show({
				// 		message: '请上传身份证',
				// 		icon: 'error',
				// 		type: 'error'
				// 	})
				// }else 
				if (this.addressArr.id || this.params.address_id) {
					this.subOrder() //提交订单
				} else {
					this.$refs.uToast.show({
						message: '请选择地址',
						icon: 'error',
						type: 'error'
					})
				}
			} else {
				this.$refs.uToast.show({
					message: '请阅读相关协议',
					icon: 'error',
					type: 'error'
				})
			}
		},
		// getidcadr() {
		// 	let opt = {
		// 		url: '/order/getcard',
		// 		method: "GET",
		// 	}

		// 	this.$request(opt).then(res => {
		// 		this.idcardstatus = res.msg
		// 		// this.email = res.data.email
		// 		// this.jinjiname = res.data.jinjiname
		// 		// this.jinjimobile = res.data.jinjimobile
		// 		// console.log(this.email)
		// 	})
		// },
		// getidcadrd() {
		// 	let opt = {
		// 		url: '/order/getcard',
		// 		method: "GET",
		// 	}

		// 	this.$request(opt).then(res => {
		// 		this.idcardstatus = res.msg
		// 	})
		// },
		popChange(show) {
			console.log(show, 'show')
			// 禁用页面滚动
		},
		subOrder() {
			let opt = {
				url: '/order/submit',
				method: "POST",
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: {
					goods_sku_id: this.params.goods_sku_id,
					num: this.params.num, //库存
					order_key: this.order_key,
					remark: this.remark,
					guard_id: this.params.guard_id || '',
					address_id: this.address_id || this.params.address_id || "",
					// email:this.email,
					location: JSON.stringify(this.location),
					youhuiquanid: this.yixuan,
					youhuiprice: this.youhuiprice,
					// #ifdef MP-ALIPAY
					platform: 'alipay'
					// #endif
					// #ifdef APP-PLUS
					platform: 'app'
					// #endif
					// #ifdef H5
					platform: 'h5'
					// #endif
				}
			}
			this.$request(opt).then(res => {
				let trade_no = res.data.parameter.alipay_trade_create_response.trade_no
				let order_sn = res.data.order_sn
				let order_nn = res.data.parame
				// console.log(order_nn)
				let _this = this
				this.$refs.uToast.show({
					message: res.msg,
					icon: 'success',
					type: 'success',
					complete() {
						//去身份认证
						// if(_this.mianyastatus == "yes"){
						// _this.tradeYa(order_nn,order_sn,trade_no)
						_this.shimingrenzheng(order_sn)
						// }else if(_this.mianyastatus == "no"){
						// _this.tradePay(trade_no, order_sn)
						// }
					}
				})
			})
		},
		shimingrenzheng(order_sn) {
			uni.navigateTo({
				url: "../identity/identity?order_sn=" + order_sn
			})
		},
		// tradeYa(order_nn, order_sn, trade_no) {
		// 	let _this = this
		// 	// #ifdef MP-ALIPAY
		// 	uni.tradePay({
		// 		orderStr: order_nn,
		// 		success: (res) => {
		// 			// console.log(res);
		// 			if (res.resultCode == 9000) {
		// 				uni.navigateTo({
		// 					url: "../identity/identity?order_sn=" + order_sn
		// 				})
		// 			} else {
		// 				// _this.tradePay(trade_no, order_sn)
		// 				uni.showToast({
		// 					title: res.memo,
		// 					duration: 2000,
		// 					icon: 'none'
		// 				});
		// 				uni.navigateTo({
		// 					url: '../eve/introduce',
		// 				});
		// 			}
		// 			// uni.alert({
		// 			//   content: JSON.stringify(res),
		// 			// });

		// 		},
		// 		fail: (res) => {
		// 			console.log(res);
		// 			uni.showToast({
		// 				title: res.memo,
		// 				duration: 2000,
		// 				icon: 'none'
		// 			});
		// 			// uni.alert({
		// 			//   content: JSON.stringify(res),
		// 			// });
		// 			// _this.tradePay(trade_no, order_sn)
		// 		}
		// 	});
		// 	// #endif
		// 	// #ifndef MP-ALIPAY
		// 	uni.requestPayment({
		// 		provider: 'alipay',
		// 		orderInfo: order_nn,
		// 		success: function (res) {
		// 			// console.log(res);
		// 			uni.navigateTo({
		// 				url: "../identity/identity?order_sn=" + order_sn
		// 			})
		// 		},
		// 		fail: function (err) {
		// 			// console.log(err);
		// 			uni.showToast({
		// 				title: err.errMsg,
		// 				duration: 2000,
		// 				icon: 'none'
		// 			});
		// 			// _this.tradePay(trade_no, order_sn)
		// 		}
		// 	});
		// 	// #endif	
		// },
		//支付押金
		// tradePay(trade_no, order_sn) {
		// 	let _this = this
		// 	// #ifdef MP-ALIPAY
		// 	uni.tradePay({
		// 		tradeNO: trade_no,
		// 		success: function (res) {
		// 			// uni.alert(res.resultCode);
		// 			console.log(res, '支付成功')
		// 			if (res.resultCode == 9000) {
		// 				uni.navigateTo({
		// 					url: "../identity/identity?order_sn=" + order_sn
		// 				})
		// 			} else {
		// 				_this.$refs.uToast.show({
		// 					message: res.memo || '取消支付',
		// 					icon: 'error',
		// 					type: 'error',
		// 				})
		// 			}
		// 		},
		// 		fail: function (res) {
		// 			// uni.alert(res.resultCode);
		// 			console.log(res, '支付失败')
		// 		},
		// 	});
		// 	// #endif
		// 	// #ifndef MP-ALIPAY
		// 	uni.requestPayment({
		// 		provider: 'alipay',
		// 		orderInfo: trade_no,
		// 		success: function (res) {
		// 			// console.log(res);
		// 			uni.navigateTo({
		// 				url: "../identity/identity?order_sn=" + order_sn
		// 			})
		// 		},
		// 		fail: function (err) {
		// 			// console.log(err);
		// 			uni.showToast({
		// 				title: err.errMsg,
		// 				duration: 2000,
		// 				icon: 'none'
		// 			});
		// 		}
		// 	});
		// 	// #endif
		// },

		address() {
			console.log('address')
			// 支付宝小程序
			//  #ifdef MP-ALIPAY
			uni.getAddress({
				success: (res) => {
					// console.log(JSON.stringify(res))
					// return;
					// this.result = res.result.address
					this.formObj.name = res.result.fullname
					this.formObj.mobile = res.result.mobilePhone
					this.formObj.city = res.result.city
					this.formObj.province = res.result.prov
					this.formObj.area = res.result.area
					this.addressTxt = this.prev + '-' + this.city + '-' + this.area
					this.formObj.address = res.result.street + res.result.address
					// console.log(JSON.stringify(res))
					// let city = res.result.city
					// let prev = res.result.prev
					// let area = res.result.area
					// this.addSava(city,prev,area);
					console.log(this.formObj)
					let opt = {
						url: '/address/addceshi',
						method: "POST",
						header: "application/x-www-form-urlencoded;charset=utf-8",
						data: this.formObj
					}

					this.$request(opt).then(res => {
						console.log(res)
						this.address_id = res.msg
						this.editShow = false
						this.confirmOrder()
					})
				},
				fail: (res) => {
					// this.uToastFunc('收货地址获取失败')
					// return true
					uni.navigateTo({
						url: '/pages/order-list/address'
					})
				}
			});
			// #endif
			//  #ifndef MP-ALIPAY
			uni.navigateTo({
				url: '/pages/order-list/address'
			})
			// #endif
		},
		addresss() {
			uni.navigateTo({
				url: "../order-list/address?num=" + this.params.num + "&goods_sku_id=" + this.params
					.goods_sku_id + "&address_id=" + this.address_id
			});
		},
		//-----确认订单---------
		confirmOrder() {
			let opt = {
				url: '/order/confirm',
				data: {
					goods_sku_id: this.params.goods_sku_id,
					num: this.params.num, //库存
					guard_id: this.params.guard_id || '', //保障方案
					address_id: this.address_id || this.params.address_id || ""
				}
			}
			console.log(opt, 'confirmOrder')
			this.$request(opt).then(res => {
				console.log(res, 'confirmOrder1122')
				this.addressArr = res.data.address
				this.address_id = res.data.address ? res.data.address.id : ''
				this.goods_data = res.data.goods_data
				this.leasetime = res.data.leasetime
				this.order_key = res.data.order_key
				this.rentinfo = res.data.rentinfo
				this.sku_data = res.data.sku_data
				this.rentt = res.data.rentinfo.rentt
				console.log(this.rentt, 'renttrenttrentt')
				// console.log(JSON.stringify(res))
				// this.riqifenge = this.leasetime.startleasetime.split('.') //获取当前年月份的日期具体格式下标并拆分
				// this.riqifengeend = this.leasetime.endleasetime.split('.')
				// this.qishu = res.sku_data.lease_duration
				this.qishu = this.sku_data.lease_duration
				this.chuanzhi = res.data
				let defaultamount = res.data.guard_data ? res.data.guard_data.defaultamount : 0
				// this.actual = (Number(this.sku_data.deposit) + Number(this.rentinfo.top_rent) + Number(
				// defaultamount)).toFixed(2)
				this.actual = (Number(this.sku_data.deposit) + Number(
					defaultamount)).toFixed(2)
				this.notice = res.data.notice
				this.guard_data = res.data.guard_data
				this.mianyastatus = res.data.goods_data.is_deposit
				this.youhuiquanke()
				// console.log(this.mianyastatus)
				// console.log(this.sku_data.deposit + this.rentinfo.top_rent, '------实付金额', this.actual)
				// 打印调用成功回调
				// uni.navigateTo({
				// 	url: '../../pages/order-list/order-detail'
				// })
			})
		},

	}

};
</script>

<style lang="scss" scoped>
.shenhe {
	color: #f9ae3d;
}

.youhuiquantext {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 6px;
}

.wenzi {
	font-size: 26rpx;
	line-height: 70rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-bottom: 1px solid #eeeeee;
	background-color: #fff;
	color: #61687C;
}

.baokuang {
	// background-color: #F6F6FB;
	// border-radius: 10rpx;
}

.shiming {
	padding: 16px 16px;
	background: #ff6633;
	color: #fff;
	text-align: center;
	font-size: 16px;
	margin-left: auto;
	border-radius: 10px;
	display: flex;
	align-content: center;
	justify-content: center;
	align-items: flex-end;
}

.order-detail {
	background-color: #F6F6FB;
	width: 100%;
	overflow: hidden;

	// border: 1px solid red;
	.notice-box {
		// margin-bottom: 80rpx;
	}

	// height: 100vh;
	.order-status {
		height: 209rpx;
		background: #ff6633;
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
						color: #ff6633;
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
		margin-bottom: 300rpx;
	}

	.address_bar {
		background-color: #fff;
		border-radius: 14rpx;
		padding: 33rpx 38rpx;
		position: relative;
		margin: 18rpx 0 18rpx;

		.address {
			font-size: 24rpx;
			color: #9FA3B0;
		}

		.address_arrow {
			position: absolute;
			top: 40rpx;
			right: 40rpx;
		}

		.address-info {
			color: #171B25;
			font-size: 30rpx;
			margin-bottom: 20rpx;

			.address_bar_num {
				margin-left: 38rpx;
			}
		}
	}

	.renya {
		font-size: 14px;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 94%;
		margin-left: 3%;
		color: #9FA3B0;
		align-items: center;
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
				color: #9FA3B0;
				// line-height: 42rpx;

				.info-title {
					font-size: 28rpx;
					color: #171B25;
					margin-bottom: 25rpx;
				}
			}
		}

		.order-date {
			width: 90%;
			height: 88rpx;
			background: #FAFAFB;
			border-radius: 6px;
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
					background-color: #ff6633;
					position: relative;

					.icon-box {
						margin-right: 12rpx;
					}

					.icon-txt {
						position: absolute;
						left: 13rpx;
						top: 13rpx;
						font-size: 20rpx;
						color: #ff6633;
					}
				}

				.start-txt {
					font-size: 24rpx;
					color: #414960;
				}

				.time {
					font-size: 20rpx;
					color: #9FA3B0;
				}
			}
		}
	}

	.zujinkuang {
		background: #FAFAFB;
		padding: 1px 12px;
		border-radius: 6px;

		.rent-li {
			font-size: 24rpx;
			color: #9FA3B0;
			line-height: 50rpx;

			.li-r {
				float: right;
				color: #61687C;
			}
		}
	}


	.rent-detail {
		background-color: #fff;
		// height: 370rpx;
		padding: 0rpx 24rpx 24rpx 29rpx;
		margin-bottom: 18rpx;
		border-radius: 14rpx;

		.rent-li {
			font-size: 24rpx;
			color: #9FA3B0;
			line-height: 50rpx;

			.li-r {
				float: right;
				color: #61687C;
			}
		}

		.rent-title {
			height: 80rpx;
			line-height: 80rpx;
			font-weight: bold;
			font-size: 30rpx;
			color: #414960;
			// border-bottom: #E5E5E5 1rpx solid;

			.title-r {
				float: right;
			}
		}
	}

	.liya {
		color: #007FFF;
		border: 1px solid #007FFF;
		border-radius: 10rpx;
		padding: 1px 6px;
		float: right;
	}

	.sesame {
		color: #414960;
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
				color: #9FA3B0;
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
					color: #171B25;
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
		padding: 8rpx 30rpx 50rpx 30rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		width: 100%;
		border-top: 1px solid #FAFAFB;

		.agreement-box {
			color: #414960;
			font-size: 28rpx;
			line-height: 80rpx;
			margin-bottom: 8rpx;
			display: flex;
			align-items: center;
			// margin-bottom: 45rpx;

			.agreement-radio {
				float: left;
				// margin-top: 10rpx;
			}

			.color-txt {
				color: #ff6633
			}
		}

		.total-amount {
			font-size: 24rpx;
			color: #414960;
			margin-left: -8rpx;
			display: flex;
			align-items: center;
			justify-content: center;

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
				background: #ff6633;
				color: #fff;
				text-align: center;
				margin-left: 20rpx;
				border-radius: 43rpx;
				font-size: 30rpx;
				margin-left: auto;
			}

			.color-red {
				font-size: 38rpx;
				color: #FF5B56;
				margin: 0 22rpx 0 0;

			}
		}
	}

	.detail-btn-box {
		// position: fixed;
		width: 100%;
		// left: 0;
		// bottom: 0;
		background-color: #fff;
		height: 102rpx;
		padding-bottom: 40rpx;
		padding-right: 41rpx;
		display: flex;
		flex-direction: row-reverse;

		.btn {
			// width: 143rpx;
			height: 53rpx;
			line-height: 53rpx;
			font-size: 24rpx;
			border-radius: 27rpx;
			padding: 0rpx 24rpx;
			text-align: center;
			border: 1px solid #414960;
			margin-left: 14rpx;
		}
	}

	.popup {
		// 
		// border: 1px solid red;
		border-radius: 10px 10px 0 0;
		overflow: hidden;
		position: relative;
		background-color: #F6F6FB;
		box-sizing: border-box;
		height: 100%;
		padding-bottom: 140rpx;
		margin-bottom: -100rpx;
		.youhuiquan-close {
			position: absolute;
			top: 36rpx;
			right: 36rpx;
		}



		.youhuiquantop {
			background-color: #fff;
			padding: 20rpx 10rpx;
		}
	}

	.zlPopup-close {
		position: absolute;
		top: 36rpx;
		right: 36rpx;
	}
}
</style>
