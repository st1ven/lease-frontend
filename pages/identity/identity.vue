<template>
	<view class="identity-page" >
		<view class="head">
			<view class="head-img-box">
				<u-icon name="account-fill" color="#fff" size="160rpx" top="16rpx"></u-icon>
			</view>
			<view class="head-title ft-36">
				实名认证
			</view>
			<view class="head-msg">
				根据实名制下单要求，使用信用免押服务前你需要通过实名认证，并授权如下信息
			</view>
		</view>
		<view class="content" style="background-color: #f6f6fb;">
			<view class="idCard-box">
				<view class="card-head">
					<u-icon name="error-circle" color="#007FFF" size="28rpx"></u-icon>姓名与支付宝实名认证信息相关联且不可更改
				</view>
				<view class="card-head" style="line-height: 30rpx;padding: 6px 16px;">
					<u-icon name="error-circle" color="#007FFF" size="28rpx"></u-icon>提交即同意e签宝采集人脸照片并提供给杭州玖恋网络科技有限公司用于实名认证
				</view>
				<view class="card-content">
					<view class="card-li">
						<view class="li-label">
							您的姓名
						</view>
						<view class="li-input">
							<u-input placeholder="请输入姓名" v-model="idCard.realname"></u-input>
						</view>
					</view>

					<view class="card-li">
						<view class="li-label">
							您的身份证
						</view>
						<view class="li-input">
							<u-input placeholder="请输入身份证" v-model="idCard.idcard">
							</u-input>
						</view>
					</view>
				</view>
			</view>
			<view class="btn" style="margin-top: 120rpx;" @click="()=>{
				if(btnLoading) return;
				initiali()
			}" >
				{{ buttonText }} {{ eqianFlag ? '(' + eqianTime + 's' + ")" : '' }}
			</view>
			<view class="btn-box" v-if="h5Flag">
				<view class="btn" @click="jumpFace">
					点击进行人脸验证
				</view>
			</view>
			<view class="btn-box" v-if="eqianFlag">
				<view class="btn btn-cancel" @click="cancelFace">
					取消认证
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
		<u-modal :show="modalShow" confirmText="支付成功" cancelText="支付失败" title="是否已经完成支付" @confirm="confirm" @cancel="cancelModal"
			showCancelButton width="300px">
		</u-modal>
	</view>
</template>

<script>
// import button from 'uview-plus/libs/config/props/button';
import { encryptDes, decryptDes } from '../../common/des.js';
// import UButton from '../../uni_modules/uview-ui/components/u-button/u-button.vue';
export default {
	data() {
		return {
			startAPVerify_url: "",
			certifyId: "",
			order_sn: '',
			idCard: {
				realname: "",
				idcard: ''
			},
			miyao: '',
			renzheng: false,
			tijiao: true,
			tijiaorenzheng: false,
			buttonText: '立即认证',
			btnLoading: false,
			eqianFlag: false,
			eqianTime: 120,
			inter: null,
			orderStatus: 0, //未付款
			modalShow: false,
			h5Flag: false,
		}
	},
	onShow() {
		this.getidcard()
	},
	onLoad(obj) {
		this.order_sn = obj.order_sn
		this.orderStatus = obj.orderStatus || 0;
		console.log(obj, "人脸验证")
	},
	methods: {
		confirm() {
			let opt = {
				url: '/dongjie_check',
				data: {
					order_sn: this.order_sn
				}
			}
			this.$request(opt).then(res => {
				this.modalShow = false;
				this.startAPVerify();
			})
		},
		cancelModal() {
			this.modalShow = false;
			location.reload();
		},
		jumpFace() {
			window.open(this.startAPVerify_url);
		},
		cancelFace() {
			// 提示 您已取消认证,你可以重新认证或在订单列表中完成该订单
			// 清除计时器
			this.btnRest();
			
			this.$refs.uToast.show({
				message: '您已取消认证,您可以在订单列表中继续完成该订单',
				icon: 'none',
				type: 'none',
				complete() {
					uni.navigateTo({
						url: '../order-list/order-list?inx=1&certification_status=0'
					})
				}
			})
		},
		btnRest() {
			this.btnLoading = false;
			this.buttonText = '立即认证';
			this.eqianFlag = false;
			this.eqianTime = 120;
			if (this.inter) {
				clearInterval(this.inter);
			}
		},
		zhengzaitijiao() {
			this.$refs.uToast.show({
				message: '正在提交，请稍等',
				icon: 'success',
				type: 'success',
			})
		},
		query(certify_id) {
			// this.getidcard()
			// 查询人脸识别结果
			this.renzheng = true
			let opt = {
				url: '/idcard/query',
				data: {
					certify_id: certify_id
				}
			}
			this.$request(opt).then(res => {
				this.renzheng = false
				this.$refs.uToast.show({
					message: res.msg || '认证成功',
					icon: 'success',
					type: 'success',
					complete() {
						uni.navigateTo({
							url: '../order-list/order-list?inx=1&certification_status=1'
						})
					}
				})
			})
		},
		zhifu() {
			let opt = {
				url: '/idd/miyao',
			}
			this.buttonText = '生成订单中...'
			this.$request(opt).then(res => {
				console.log(res, "秘钥")
				// this.tijiaorenzheng = false
				this.miyao = res.data
				this.gopay(this.miyao)
			}).catch(err => {
				this.btnRest();
			})

		},
		gopay(miyao) {
			this.key = encryptDes(this.idCard.realname, miyao); // 秘钥
			this.iv = encryptDes(this.idCard.idcard, miyao); //向量iv
			let opt = {
				url: '/pay/shimingagain_pay',
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: {
					order_sn: this.order_sn,
					realnamee: this.key,
					idcardd: this.iv,
					// #ifdef H5
					mode: 'h5'
					// #endif
				}
			}
			let _this = this
			this.$request(opt).then(res => {
				console.log(res, "gopay")
				// return 
				let order_nn = res.data
				let _this = this
				// 支付宝直接支付
				// #ifdef MP-ALIPAY
				_this.tradeYa(order_nn)
				// #endif
				// app 弹窗选择支付方式
				// #ifndef MP-ALIPAY
				uni.showActionSheet({
					title: '请选择支付方式',
					itemList: ['支付宝', '微信'],
					success: function (res) {
						if (res.tapIndex == 0) {
							_this.tradeYa(order_nn)
						} else {
							// 提醒暂未开通微信支付,请选择支付宝方式付款
							_this.btnRest()
							_this.$refs.uToast.show({
								message: '暂未开通微信支付,请选择支付宝方式付款',
								icon: 'none',
								type: 'none',
							})
						}
					},
					fail: function (res) {
						_this.btnRest()
					}
				});
				// #endif
			}).catch(err => {
				_this.btnRest();
			})
		},
		tradeYa(order_nn) {
			let _this = this
			this.buttonText = '支付中...';
			console.log(order_nn, "支付宝")
			// #ifdef MP-ALIPAY
			uni.tradePay({
				orderStr: order_nn,
				success: (res) => {
					if (res.resultCode == 9000) {
						_this.startAPVerify();
					} else {
						_this.btnRest();
						uni.showToast({
							title: res.memo,
							duration: 2000,
							icon: 'none'
						});
						uni.navigateTo({
							url: '../eve/introduce',
						});
					}
				},
				fail: (res) => {
					_this.btnRest();
					uni.showToast({
						title: res.memo,
						duration: 2000,
						icon: 'none'
					});
				}
			});
			// #endif
			// #ifdef APP-PLUS
			uni.requestPayment({
				provider: 'alipay',
				orderInfo: order_nn, //微信、支付宝订单数据
				success: function (res) {
					console.log(res, 'success')
					// _this.initiali()
					_this.startAPVerify(this.miyao)
				},
				fail: (err) => {
					console.log(err, _this, 'errrr');
					// _this.btnRest();
					_this.btnRest()
					uni.showToast({
						title: err.errMsg,
						duration: 2000,
						icon: 'none'
					});
					uni.navigateTo({
						url: '../eve/introduce',
					});
				}
			});
			// #endif
			// #ifdef H5
			// H5 唤醒支付
			_this.modalShow = true;
			window.open(order_nn)
			// #endif
		},
		dingyue(certifyId) {
			let _this = this
			uni.getAuthCode({
				scopes: ['order_service'],
				success: (res) => {
					_this.queryeqian(certifyId)
					// 订单服务授权成功
				},
				fail: (res) => {
					_this.queryeqian(certifyId)
					// 订单服务授权失败，根据自己的业务场景来进行错误处理
				},
			});
			//下面注释的是订阅消息
			// uni.requestSubscribeMessage({
			// 	  entityIds: ['2b42dc4e5f9d467da1a6ce9da367b06e'],
			// 	  success: (res) => {
			// 	    // res.behavior == 'subscribe'
			// 	    // console.log("接口调用成功的回调", res);
			// 		_this.query(certifyId)
			// 	  },
			// 	  fail: (res) => {
			// 	    // console.log("接口调用失败的回调", res);
			// 		_this.query(certifyId)
			// 	  },
			// 	  complete: (res) => {
			// 	    // console.log("接口调用结束的回调", res);
			// 		_this.query(certifyId)
			// 	  }
			// 	});
		},
		startAPVerify() {
			let _this = this;
			// 支付宝
			// #ifdef MP-ALIPAY
			uni.startAPVerify({
				url: this.startAPVerify_url,
				certifyId: this.certifyId,
				success: function (res) {
					_this.dingyue(_this.certifyId)
				},
				fail: function (res) {
					_this.btnRest();
					this.$refs.uToast.show({
						message: res,
						icon: 'error',
						type: 'error',
					})
				},
			})
			// #endif
			// app
			// #ifndef MP-ALIPAY
			// 通过 url 唤醒支付宝
			this.buttonText = '请在浏览器中打开支付宝进行人脸识别...';
			console.log(this.startAPVerify_url, 'url')
			// #ifdef APP-PLUS
			plus.runtime.openURL(this.startAPVerify_url);
			// #endif
			// #ifdef H5
			this.h5Flag = true;
			// #endif
			this.eqianFlag = true;
			this.inter = setInterval(() => {
				this.eqianTime--;
				if (this.eqianTime <= 0) {
					clearInterval(this.inter);
					this.eqianFlag = false;
					this.eqianTime = 120;
				}
			}, 1000)
			this.queryeqian();
			// #endif
		},
		queryeqian() {
			console.log(this.certifyId)
			// this.getidcard()
			// 查询人脸识别结果
			this.buttonText = '人脸验证确认中,请稍候...';
			let opt = {
				url: '/idcard/queryeqian',
				data: {
					flowId: this.certifyId
				},
				noError: true
			}
			this.$request(opt).then(res => {
				this.renzheng = false
				this.$refs.uToast.show({
					message: res.msg || '认证成功',
					icon: 'success',
					type: 'success',
					complete() {
						uni.redirectTo({
							url: '../order-list/order-list?inx=1&certification_status=1'
						})
					}
				})
			}).catch(err => {
				// #ifndef MP-ALIPAY
				if (this.eqianFlag) {
					setTimeout(() => {
						this.queryeqian()
					}, 1000)
				} else {
					this.btnRest();
					this.$refs.uToast.show({
						message: err.msg || '认证失败',
						icon: 'error',
						type: 'error',
					})
				}
				// #endif
			})
		},
		errorIDNumber(e) {
			// console.log(e, '验证失败')
		},
		//获取身份证号+姓名
		getidcard() {
			let opt = {
				url: '/getidcard?order_sn=' + this.order_sn,
			}
			this.$request(opt).then(res => {
				this.idCard = {
					realname: res.data.realname || '',
					idcard: res.data.idcard || ''
				}
			})
		},

		toast(msg) {
			uni.showToast({
				title: msg || "失败"
			})
		},
		//请求人脸识别的接口+id
		initiali() {
			this.btnLoading = true;
			this.buttonText = '正在认证中...';
			if (this.idCard.realname == "") {
				this.btnRest();
				return this.toast('请填写您的真实姓名')
			}
			if (this.idCard.idcard == "") {
				this.btnRest();
				return this.toast('请填写您的身份证号码')
			}
			let opt = {
				url: '/idd/miyao',
			}
			this.$request(opt).then(res => {
				console.log(res, 'initiali');
				this.miyao = res.data
				this.initialize(this.miyao)
			}).catch(err => {
				this.btnRest();
			})
		},
		initialize(miyao) {
			this.key = encryptDes(this.idCard.realname, miyao); // 秘钥
			this.iv = encryptDes(this.idCard.idcard, miyao); //向量iv
			let opt = {
				url: '/idcard/initialiieqianbao',
				method: 'POST',
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: {
					realnamee: this.key,
					idcardd: this.iv
				}
			}
			this.$request(opt).then(res => {
				console.log(res, 'initialize');
				this.startAPVerify_url = res.data.data
				this.certifyId = res.data.certify_id;
				if (this.orderStatus == 0) {
					this.zhifu();
				}
				if (this.orderStatus == 1) {
					this.startAPVerify();
				}
			}).catch(err => {
				this.btnRest();
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.identity-page {
	// background-color: #ccc;
	height: 100vh;
	display: flex;
	flex-direction: column;
	.head {
		height: 382rpx;
		background: #ff6633;
		color: #fff;
		text-align: center;
		padding-top: 60rpx;

		.head-img-box {
			height: 151rpx;
			width: 151rpx;
			margin: 0 auto 40rpx;
			border-radius: 14rpx;
			background-color: rgba($color: #fff, $alpha: 0.3);
		}

		.head-msg {
			width: 500rpx;
			line-height: 30rpx;
			font-size: 22rpx;
			margin: 22rpx auto;
		}
	}

	.content {
		padding: 0 30rpx;
		// border: 1px solid red;
		flex: 1;
		.idCard-box {
			background-color: #fff;
			height: 356rpx;
			margin-top: -54rpx;
			border-radius: 12rpx;
			// border: 1px solid red;
			// 加点阴影
			box-shadow: 0 0 10rpx 0 rgba($color: #000, $alpha: 0.1);

			.card-head {
				height: 54rpx;
				line-height: 54rpx;
				padding-left: 33rpx;
				font-size: 22rpx;
				color: #007FFF;
				display: flex;
				border-bottom: 1rpx solid #f0f0f0;
			}

			.card-content {
				font-size: 28rpx;

				.card-li {
					height: 100rpx;
					line-height: 100rpx;
					display: flex;
					align-items: center;

					.li-label {
						width: 30%;
						text-align: right;
						padding-right: 15rpx;
						color: #414960;
					}

					.li-input {
						height: 54rpx;
						border-bottom: 1rpx solid #FAFAFB;
						margin: 0 40rpx 0 10rpx;
						width: 70%;

						/deep/ .u-input {
							padding-top: 0 !important;
						}
					}
				}

			}

		}

		.btn {
			height: 88rpx;
			line-height: 88rpx;
			background-color: #ff6633;
			color: #fff;
			font-size: 30rpx;
			text-align: center;
			border-radius: 12rpx;
		}
		
		.btn-cancel {
			border: 1px solid #ff6633;
			background: #fff;
			color: #ff6633;
		}
		
		.btn-box {
			margin-top: 20rpx;
		}
	}
}
</style>
