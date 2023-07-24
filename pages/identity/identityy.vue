<template>
	<view class="identity-page" style="background-color: #f6f6fb;">
		<view class="head">
			<view class="head-img-box">
				<u-icon name="account-fill" color="#fff" size="160rpx" top="16rpx"></u-icon>
			</view>
			<view class="head-title ft-36">
				人脸实名认证
			</view>
			<view class="head-msg">
				根据实名制下单要求，使用信用免押服务前你需要通过实名认证，并授权如下信息
			</view>
		</view>
		<view class="content">
			<view class="idCard-box">
				<view class="card-head">
					<u-icon name="error-circle" color="#007FFF" size="28rpx"></u-icon>姓名与支付宝实名认证信息相关联且不可更改
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
			<view class="btn" @click="initiali">
				进入人脸认证
			</view>
			<view class="" v-if="renzheng" style="padding-top: 20px;">
				<u-loading-icon color="#ff6633" text="正在同步实名认证结果" size="16" :vertical="true" textSize="14"></u-loading-icon>
			</view>
			
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { encryptDes, decryptDes  } from '../../common/des.js' ;
	export default {
		data() {
			return {
				startAPVerify_url: "",
				certifyId: "",
				order_sn:'',
				idCard: {
					realname: "",
					idcard: ''
				},
				miyao:'',
				renzheng:false,
			}
		},
		onShow() {
			this.getidcard()
		},
		onLoad(obj) {
			this.order_sn = obj.order_sn
		},
		methods: {
			query(certify_id) {
				this.renzheng = true
				// 查询人脸识别结果
				let opt = {
					url: '/idcard/query',
					data: {
						certify_id:  certify_id
					}
				}
				this.$request(opt).then(res => {
						this.renzheng = false
						this.$refs.uToast.show({
							message:res.msg ||  '认证成功',
							icon: 'success',
							type: 'success',
							complete(){
								uni.navigateTo({
									url: '../order-list/order-list?inx=1&certification_status=1'
								})
							}
						})
					 

				})
			},
			dingyue(certifyId){
				let _this = this
				uni.getAuthCode({
				  scopes: ['order_service'],
				  success: (res) => {
					  _this.query(certifyId)
				    // 订单服务授权成功
				  },
				  fail: (res) => {
					  _this.query(certifyId)
				    // 订单服务授权失败，根据自己的业务场景来进行错误处理
				  },
				});
			
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
				let _this = this 
				uni.startAPVerify({
					url: this.startAPVerify_url,
					certifyId: this.certifyId,
					success: function(res) {
						// console.log(res, '人脸识别认证成功-----')
						_this.dingyue(_this.certifyId)
						// _this.query( _this.certifyId)
					},
					fail: function(res) {
						this.$refs.uToast.show({
							message: res,
							icon: 'error',
							type: 'error',
						})
					},
					 
				})
			},
			errorIDNumber(e) {
				// console.log(e, '验证失败')
			},
			//获取身份证号+姓名
			getidcard() {
				let opt = {
					url: '/getidcard?order_sn='+this.order_sn,
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
			initiali(){
				if (this.idCard.realname == "") {
					return this.toast('请填写您的真实姓名')
				}
				if (this.idCard.idcard == "") {
					return this.toast('请填写您的身份证号码')
				}
				let opt = {
					url: '/idd/miyao',
				}
				this.$request(opt).then(res => {
					this.miyao = res.data
					this.initialize(this.miyao)
				})
			},
			initialize(miyao){
				this.key = encryptDes(this.idCard.realname, miyao); // 秘钥
				this.iv = encryptDes(this.idCard.idcard, miyao); //向量iv
				let opt = {
					url: '/idcard/initialii',
					method: 'POST',
					header: "application/x-www-form-urlencoded;charset=utf-8",
					data: {
						realnamee :this.key,
						idcardd:this.iv
					}
				}
				
				this.$request(opt).then(res => {
					this.startAPVerify_url = res.data.data
					this.certifyId = res.data.certify_id
					this.startAPVerify()
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.identity-page {
		background-color: #F6F6FB;
		height: 100vh;

		.head {
			height: 382rpx;
			background: #ff6633;
			color: #fff;
			text-align: center;
			padding-top: 60rpx;

			.head-img-box {
				height: 151rpx;
				width: 151rpx;
				border-radius: 14rpx;
				background-color: rgba($color: #fff, $alpha: 0.3);
				margin: 0 auto 40rpx;
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

			.idCard-box {
				background-color: #fff;
				height: 256rpx;
				margin-top: -54rpx;
				border-radius: 12rpx;

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
						}

						.li-input {
							height: 54rpx;
							border-bottom: 1rpx solid #f0f0f0;
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
				margin-top: 120rpx;
				border-radius: 12rpx;
			}

		}
	}
</style>
