<template>
	<view class="iz-buy-popup">
		<view class="buy-head">
			<view class="buy-img">
				<slot name="img">
					<u-image :showLoading="true" :src='goods_data.image' width="189rpx" height="189rpx"></u-image>
				</slot>
			</view>
			<view class="buy-info">
				<!-- <view class="buy-name">{{goods_data.title}}</view> -->
				<view class="buy-price">
					¥ <text class="price-num">{{ goods_data.day_price }}</text>
					<!-- - ¥<text class="price-num">24.21</text>--> /天
				</view>
				<view class="inventory-num">库存 {{ totalNum }}</view>
				<view class="bug-msg">
					<text>{{ selected_text || '' }}</text>
				</view>
			</view>
		</view>

		<!-- <view class="weidu" v-if="goods_data.each_price"> -->
		<view class="weidu">
			<view class="weidufen">
				<text class="weidutextone">￥{{ goods_data.each_price || '--' }}</text>
				<text class="weidutexttwo">月租金</text>
			</view>
			<view class="weidufen">
				<text class="weidutextone" v-if="goods_data.price >= 100">￥{{ goods_data.price }}</text>
				<text class="weidutextone" v-else>￥--</text>
				<text class="weidutexttwo">总租金</text>
			</view>
			<view class="weidufen">
				<text class="weidutextone">￥{{ goods_data.buyout_price || '--' }}</text>
				<text class="weidutexttwo">买断价</text>
			</view>
		</view>
		<view class="buy-cont">
			<view class="">
				<view style="display: flex; padding-bottom: 40rpx; align-items: center;" v-for="(item, index) in list"
					:key='index'>
					<text class="title">{{ item.name }}</text>
					<view class="tig-btn-box" v-if="item.name != '套餐'">
						<view v-for="(lists, inx) in item.children.filter(x => x.name != '套餐')" :key="inx"
							@click="tigBtn({ targetArr: lists, pInx: index, cInx: inx, type: 1 })"
							:class="lists.isOn == true ? 'on' : ''" class="tig-btn">
							{{ lists.name }}
						</view>
					</view>
					<view class="tig-btn-box gap_40" v-if="item.name == '套餐'">
						<view class="tig-bin-two" v-for="(lists, inx) in item.children.filter(x => x.name != '套餐')" :key="inx">
							<view @click="tigBtn({ targetArr: lists, pInx: index, cInx: inx, type: 1 })"
								:class="lists.isOn == true ? 'on' : ''" class="tig-btn" style="margin-bottom: 0rem;">
								{{ lists.name }}
							</view>
							<image v-if="lists.name == '租完买断/归还/续期' || lists.name == '租完买断'"
								@click="zuwan(2, { targetArr: lists, pInx: index, cInx: inx, type: 1 })"
								src="../../static/image/why-l.png" mode="widthFix" style="width: 18px;"></image>
							<image v-if="lists.name == '租满即送(可随时买断)' || lists.name == '租完即送'"
								@click="zuwan(1, { targetArr: lists, pInx: index, cInx: inx, type: 1 })"
								src="../../static/image/why-l.png" mode="widthFix" style="width: 18px;"></image>
						</view>
					</view>
				</view>
				<!-- 				<view class="buy-num-box" v-if="totalNum !=0">
					<text class="title">租赁数量</text>
					<view class="num-box" name="minus">
						<view class="box-tag" @click="boxTag(1)">
							<u-icon name="minus" color="#9FA3B0" size="20rpx"></u-icon>
						</view>
						<view class="box-tag">{{inventoryNum}}</view>
						<view class="box-tag" @click="boxTag(0)">
							<u-icon name="plus" color="#9FA3B0" size="20rpx"></u-icon>
						</view>
					</view>
				</view> -->
				<!-- 支付宝保障服务 -->
				<view style="display: flex; align-items: center; margin-bottom: 56rpx;" v-if="guard_data.id">
					<text class="title">保障服务</text>
					<!-- {{ guard_data.isOn }} -->
					<view class="tig-btn-box" @click="tigBtn({ type: 2 })">
						<view :class="guard_data.isOn ? 'tig-btn on' : 'tig-btn'">
							{{ guard_data.guard_title }}￥{{ guard_data.defaultamount }}
						</view>
					</view>
				</view>
			</view>
			<u-popup :show="returnstatus" @close="close" :round="10" mode="bottom" :closeable='true'
				customStyle="min-height:350;background: #fff;">
				<iz-buy-return :goodsku="goodskuid" :goodid="good_id"></iz-buy-return>
			</u-popup>
			<u-popup :show="maiduanstatus" @close="close" :round="10" mode="bottom" :closeable='true'
				customStyle="min-height:350;background: #fff;">
				<iz-buy-buyout :goodsku="goodskuid" :goodid="good_id"></iz-buy-buyout>
			</u-popup>
			<view class="" v-if="tijiaorenzheng">
				<u-loading-icon color="#FF6633" text="正在提交请稍后..." size="16" :vertical="true" textSize="14">
				</u-loading-icon>
			</view>
			<view v-if="totalNum != 0 && tokenstatus != ''">
				<view class="shimings" type="default" open-type="getPhoneNumber" @click="decryptPhoneNumber">
					<!-- 确定 -->
					<text>确定</text>
				</view>
			</view>
			<view class="shimings" style="border: 0;" open-type="getAuthorize" scope="userInfo" @click="onGetAuthorize"
				@error="onAuthError" v-if="tokenstatus == ''">
				<text>确定</text>
			</view>
			<view class="shimings" @click="baoqian" v-if="totalNum == 0">
				<text>确定</text>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	name: "iz-buy-popup",
	props: {
		goodsId: 0,
		type: 0
	},
	data() {

		return {
			canIUseAuthButton: uni.canIUse('button.open-type.getAuthorize'),
			inventoryNum: 1, //库存
			totalNum: 0,
			selected_text: '', //选择规则
			good_id: this.goodsId,
			goods_data: {},
			day_price: "",
			list: [],
			ids: [],
			orderId: '',
			guard_data: {
				isOn: false,
				id: null,
			}, //保障方案
			guard_id: '', //保障方案ID
			token: '',
			tokenstatus: '',
			tijiaorenzheng: false,
			maiduanstatus: false,
			returnstatus: false,
			goodskuid: ''
		}
	},
	watch: {
		list(newVal, oldVal) {
			this.list = newVal
		},
	},
	mounted() {
		this.init()
		this.tokenstatus = uni.getStorageSync('token')
	},
	methods: {

		close() {
			this.maiduanstatus = false
			this.returnstatus = false
		},
		zuwan(e, obj) {
			this.tigBtn(obj)
			if (e == 1) {
				this.returnstatus = true
			} else if (e == 2) {
				this.maiduanstatus = true
			}
		},
		toBuy(mobile) {
			let code = encodeURIComponent(mobile);
			console.log(code, 'code')
			let opt = {
				url: "/index/mobile?mobile=" + code,
			}
			console.log(opt, 'opt')
			this.$request(opt).then(res => {
				if (res.code == '1') {
					this.buyOk()
					this.tijiaorenzheng = false
				} else {
					this.tijiaorenzheng = false
					this.$refs.uToast.show({
						message: '授权失败',
						type: 'error'
					})
				}
			}).catch(err => {
				this.tijiaorenzheng = false
				// this.$refs.uToast.show({
				// 	message: '授权失败',
				// 	type: 'error'
				// })
			})
		},
		decryptPhoneNumber(res) {
			this.tijiaorenzheng = true
			// 支付宝
			// #ifdef MP-ALIPAY
			uni.getPhoneNumber({
				success: (res) => {
					var duixiang = JSON.parse(res.response)
					console.log(duixiang, 'duixiang')
					let mobile = duixiang.response;
					this.toBuy(mobile)
				},
				fail: (res) => {
					this.tijiaorenzheng = false
					this.$refs.uToast.show({
						message: '授权失败',
						type: 'error'
					})
				},
			});
			// #endif
			// APP
			// #ifndef MP-ALIPAY
			let mobile = uni.getStorageSync('mobile');
			this.buyOk()
			this.tijiaorenzheng = false
			// #endif
		},
		baoqian() {
			this.$refs.uToast.show({
				message: '该规格暂无库存哦~',
				type: 'error'
			})
			return
		},
		boxTag(num) {
			if (num == 1) {
				if (this.inventoryNum <= 0) {
					this.$refs.uToast.show({
						message: '数量不能少于1',
						icon: 'error',
						type: 'error'
					})
					return
				}
				this.inventoryNum = this.inventoryNum - 1
			} else {
				if (this.inventoryNum >= this.totalNum) {
					this.$refs.uToast.show({
						message: '数量不能多于库存量',
						icon: 'error',
						type: 'error'
					})
					return
				}
				this.inventoryNum = this.inventoryNum + 1
			}
		},
		tigBtn(obj) {
			console.log(obj, 'obj')
			let self = this;
			if (obj.type == 1) {
				this.list[obj.pInx].children.forEach((item, i) => {
					if (obj.cInx == i) {
						item.isOn = true
					} else {
						item.isOn = false
					}
				})
				this.ids = []
				for (let i = 0; i < this.list.length; i++) {
					for (let j = 0; j < this.list[i].children.length; j++) {
						if (this.list[i].children[j].isOn == true) {
							this.ids.push(this.list[i].children[j].id)
						}
					}
				}
				this.ruleFunc(this.ids)
			}

			if (obj.type == 2) {
				self.$set(self.guard_data, 'isOn', !self.guard_data.isOn);
				self.guard_id = self.guard_data.isOn ? self.guard_data.id : '';
				console.log(self.guard_data, 'guard_data')
			}

		},
		ruleFunc(ids) {
			let id = ids.join()
			this.goodskuid = id

			let opt = {
				url: '/goods/selected/rule',
				data: {
					goods_id: this.good_id,
					rule_ids: id //规则ID
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.selected_text = res.data.selected_text
				this.totalNum = res.data.stock
				this.orderId = res.data.goods_data.id
				this.goods_data.image = res.data.goods_data.image
				this.goods_data.day_price = res.data.goods_data.day_price
				this.goods_data.price = res.data.goods_data.price
				this.goods_data.each_price = res.data.goods_data.each_price
				this.goods_data.buyout_price = res.data.goods_data.buyout_price
			})
		},

		//授权登录
		onGetAuthorize() {
			let _this = this
			let loginObj = {}

			// 支付宝小程序
			// #ifdef MP-ALIPAY
			uni.getOpenUserInfo({
				fail: res => {
					// console.log(res);
				},
				success: res => {
					// console.log(res);
					const userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 
					if (userInfo.code != 10000) {
						return uni.showToast({
							title: userInfo.msg
						});
					}
					loginObj.avatar = userInfo.avatar
					loginObj.nickname = userInfo.nickName
					loginObj.userid = uni.getStorageSync('yaouserid')
					this.avatar = userInfo.avatar
					this.nickName = userInfo.nickName
					uni.getAuthCode({
						scopes: 'auth_base',
						// scopes: ['auth_base','order_service'],
						success: (authData) => {
							loginObj.code = authData.authCode
							_this.loginFunc(loginObj) //开始登录
						}
					});
				},
			});
			// #endif
			// #ifndef MP-ALIPAY
			uni.showToast({
				title: '暂未登录,请先登录',
				icon: 'none'
			});
			// 跳转到登录页面
			uni.redirectTo({
				url: '/pages/login/login?fromPage=/pages/goods-detail/goods-detail?id=' + this.good_id
			});
			// #endif
		},
		// 授权失败回调
		onAuthError() {
			uni.showToast({
				title: "授权失败"
			});
		},
		loginFunc(loginObj) {
			let opt = {
				url: "/aliyun/login",
				method: 'POST',
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: loginObj
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				// console.log(res, ' -------获取登录信息-----')
				uni.setStorageSync('token', res.data.token);
				uni.setStorageSync('avatar', this.avatar || '');
				uni.setStorageSync('nickName', this.nickName || '');
				// this.avatar = uni.getStorageSync('avatar')
				// this.nickName = uni.getStorageSync('nickName')
				this.tokenstatus = res.data.token
				// uni.$emit('tokenstatus',this.token)

				this.loginFlag = 1
				setTimeout(() => {
					uni.hideLoading()
					// this.buyOk()
					this.$refs.uToast.show({
						message: '登录成功',
						type: 'success'
					})
				}, 100)
			})
		},


		buyOk() {

			if (this.inventoryNum && (this.ids.length == this.list.length)) {
				uni.navigateTo({
					url: '/pages/order-list/order-detail?goods_sku_id=' + this.orderId + '&num=' + this
						.inventoryNum + '&path=goods-detail&guard_id=' + this.guard_id
				})
			} else {
				let title = this.list.map(item => item.name)
				this.$refs.uToast.show({
					message: '请选择' + title + ',数量哦~',
					icon: 'error',
					type: 'error'
				})
			}
		},

		init() {
			let opt = {
				url: '/goods/rule',
				data: {
					goods_id: this.good_id
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				let rule = res.data.rule
				this.ids = []
				for (let i = 0; i < rule.length; i++) {
					for (let j = 0; j < rule[i].children.length; j++) {
						// rule[i].children[j].isOn = false
						//只把属性长度为1的选中第一个选项
						// if(rule[i].children.length =='1' && j == '0'){
						if (j == '0') {
							//默认选中第一个选项
							rule[i].children[j].isOn = true
							//只把属性长度为1的选中第一个选项
							// this.ids.push(rule[i].children[j].id)
							// this.ruleFunc(this.ids)	
							/*属性为1的选项结束并需要注意吧下面的this.ruleFunc(this.ids)注释和this.ids.push(rule[i].children[0].id)注释掉*/
							this.ids.push(rule[i].children[0].id)
						} else {
							rule[i].children[j].isOn = false
						}
					}
				}

				this.ruleFunc(this.ids)
				this.list = rule
				this.goods_data = res.data.goods_data
				this.selected_text = res.data.selected_text
				this.totalNum = res.data.stock
				res.data.guard_data =
					this.guard_data = res.data.guard_data.id ? JSON.parse(JSON.stringify(res.data.guard_data)) : {
						isOn: true,
					}
				// this.guard_data.isOn = true
				this.$set(this.guard_data, 'isOn', true)
			})
		}

	}
}
</script>

<style lang="scss" scoped>
.weidu {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	border-bottom: 1px solid #FAFAFB;
	padding: 24rpx 0;
}

.weidufen {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.weidutextone {
	color: #FF5B56;
	font-size: 12px;
	font-weight: bold;
}

.weidutexttwo {
	font-size: 12px;
	font-weight: bold;
	color: #545454;
}

.iz-buy-popup {
	background-color: #fff;
	padding: 65rpx 12px 0;
	border-radius: 20rpx 20rpx 0 0;

	.buy-head {
		// height: 233rpx;
		// border-bottom: 1px solid #E5E5E5;
		display: flex;

		.buy-img {
			height: 189rpx
		}

		.buy-info {
			font-size: 22rpx;
			color: #414960;
			padding: 16rpx 0 0 44rpx;

			.buy-name {
				font-size: 24rpx;
				font-weight: bold;
			}

			.buy-price {
				color: #FF5B56;
				font-size: 24rpx;

				.price-num {
					font-weight: bold;
					font-size: 48rpx;
					margin-bottom: 23rpx;
				}
			}
		}

	}

	.inventory-num {
		font-size: 20rpx;
		padding: 12rpx 0;
		color: #9FA3B0;
	}

	.buy-cont {
		max-height: 850rpx;
		min-height: 400rpx;
		overflow-y: scroll;
		color: #171B25;
		padding: 24rpx 0rpx 20rpx;

		.title {
			font-size: 24rpx;
			font-weight: bold;
			margin-right: 32rpx;
			min-width: 50rpx;
			// margin-bottom: 16rpx;
		}

		.buy-ok {
			width: 100%;
			height: 80rpx;
			background: #FF6633;
			border-radius: 20rpx;
			text-align: center;
			line-height: 80rpx;
			color: #fff;
			margin-top: 27rpx;
		}

		.buy-num-box {
			display: flex;
			// margin-top: 50rpx;

			.num-box {
				width: 228rpx;
				margin-left: 200rpx;
				border: 1rpx solid #E5E5E5;
				display: flex;
				box-sizing: border-box;

				.box-tag:nth-of-type(2) {
					border-left: 1rpx solid #E5E5E5;
					border-right: 1rpx solid #E5E5E5;
					width: 130rpx;
					text-align: center;
					font-size: 30rpx;
				}

				.box-tag:first-child,
				.box-tag:last-child {
					padding: 11rpx 15rpx;
				}
			}
		}

		.broken_screen {


			.broken_msg {
				color: #F22F2F;
				font-size: 18rpx;
				padding: 4rpx;
				border: 1rpx solid #F22F2F;
				margin-left: 34rpx;
			}

			.broken_info {
				padding-top: 34rpx;
			}
		}

		.tig-btn-box {
			display: flex;
			// padding: 10rpx 0 0 0rpx;
			flex-wrap: wrap;
			gap: 20rpx 0;

			.tig-btn {
				padding: 10rpx 16rpx;
				border: 1px solid #F1F2F5;
				border-radius: 10rpx;
				font-size: 26rpx;
				margin-right: 20rpx;
				// margin-bottom: 21rpx;
				background-color: #F1F2F5;
				// #ifndef MP-ALIPAY
				margin-bottom: 10rpx;
				// border: 1px solid red;
				// #endif
			}

			.on {
				color: #FF6633;
				border: 1px solid #FF6633;
				background-color: rgba($color: #FF6633, $alpha: 0.1);
			}
		}
	}
}

.tig-bin-two {
	display: flex;
	flex-direction: row;
	align-items: center;
	// margin-bottom: 0.21rem;
}

.gap_40 {
	// #ifdef MP-ALIPAY
	gap: 40rpx;
	// #endif
	// #ifndef MP-ALIPAY
	display: flex;
	width: 55%;
	justify-content: space-between;
	// #endif
}


.shimings {
	padding: 16px 16px;
	background: #FF6633;
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

.amount-btn {
	display: inline-block;
	// width: 219rpx;
	// height: 87rpx;
	padding: 29rpx 50rpx;
	// line-height: 87rpx;
	background: #FF6633;
	color: #fff;
	text-align: center;
	margin-left: 20rpx;
	border-radius: 43rpx;
	font-size: 30rpx;
	margin-left: auto;
}
</style>
