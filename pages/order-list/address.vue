<template>
	<!-- 地址列表 & 地址的详细信息 -->
	<view class="address-page" >
		<view class="address-ul">
			<view v-for="(item, inx) in list" :key="inx" @click.self="liClick(inx)"
				:class="item.onFlag ? 'address-li on' : 'address-li'">
				<view class="edit icon" @click="edit({ type: 1, data: item })">
					<u-icon name="edit-pen" color="#909399" size="48rpx"></u-icon>
				</view>
				<view class="del icon" @click="delShows(item)">
					<u-icon name="trash" color="#909399" size="48rpx"></u-icon>
				</view>
				<view @click="liClickk(inx)">
					<view class="txt-title">
						{{ item.name }} - {{ item.mobile }}
					</view>
					<view class="txt-detail">
						{{ item.province + item.city + item.area + item.address }}
					</view>
				</view>
			</view>
			<!-- #ifdef MP-ALIPAY -->
			<view class="address">
				<view class="address-button">
					<button type="primary" @click="onGetAddress">授权添加支付宝收货地址</button>
				</view>
			</view>
			<!-- #endif -->
			<view class="pb-50">
				<u-tabbar :safeAreaInsetBottom="true" >
					<!-- <u-tabbar-item text="选择" icon="checkbox-mark" @click="choose()"></u-tabbar-item> -->
					<!-- <u-tabbar-item text="新增" icon="plus" @click="edit({ type: 2 })"></u-tabbar-item> -->
					<view class="bottom-btn" @click="edit({ type: 2 })">
						<u-icon name="plus" color="#fff" style="margin-right:10rpx"></u-icon>
						<text>新增</text>
					</view>
				</u-tabbar>
				<u-safe-bottom />
			</view>
		</view>
		<!-- 编辑&新增-模态框 -->
		<u-popup :show="editShow" mode="center" :borderRadius="'30rpx'" :closeIconPos="'top-right'"
			:safeAreaInsetBottom="false">
			<view class="slot-content addressModel">
				<view class="title">
					{{ editTitle }}
				</view>
				<view class="close" @click="editShow = false">
					<u-icon name="close-circle" size="40rpx" color="#ccc"></u-icon>
				</view>
				<view class="input-ul">
					<view class="input-li">
						<view class="input-label">* 姓名：</view>
						<view class="input-box">
							<u-input placeholder="请输入 " :border="'surround'" fontSize="24rpx" v-model="formObj.name">
							</u-input>
						</view>
					</view>
					<view class="input-li">
						<view class="input-label">* 电话：</view>
						<view class="input-box">
							<u-input placeholder="请输入 " :border="'surround'" fontSize="24rpx" v-model="formObj.mobile">
							</u-input>
						</view>
					</view>

					<view class="input-li">
						<view class="input-label">* 收货地址 ：</view>
						<view class="input-box" @tap="openAddres">
							<!-- <u-input placeholder="请输入收货地址" v-model="addressTxt" :border="'surround'" fontSize="24rpx">
							</u-input> -->
							{{ addressTxt }}
						</view>
					</view>
					<view class="input-li">
						<view class="input-label">* 详细地址 ：</view>
						<view class="input-box">
							<u-input placeholder="请输入 " :border="'surround'" fontSize="24rpx" v-model="formObj.address">
							</u-input>
						</view>
					</view>
					<view class="input-li">
						<view class="input-label">邮箱：</view>
						<view class="input-box">
							<u-input placeholder="请输入 " :border="'surround'" fontSize="24rpx" v-model="formObj.email">
							</u-input>
						</view>
					</view>
					<view class="input-btn" @click="editConfirm">
						提交
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 删除提示模态框 -->
		<u-modal :show="delShow" :showCancelButton="true" :closeOnClickOverlay="true" title="删除" @confirm="delConfim()"
			@cancel="delShow = false">
			<view class="slot-content">
				确认删除这个地址吗
			</view>
		</u-modal>
		<u-toast ref="uToast"></u-toast>
		<!-- :pickerValueDefault="cityValueDefault"  -->
		<simpleAddress ref="simpleAddress" :show="addresShow" @onConfirm="onConfirm">
		</simpleAddress>

	</view>
</template>

<script>
import simpleAddress from './components/simple-address.vue';
export default {
	components: {
		simpleAddress
	},
	data() {
		return {
			editShow: false,
			delShow: false,
			showSex: false,
			city: '',
			prev: '',
			area: "",
			addresShow: false,
			addressTxt: '请选择省-市-区',
			editTitle: '',
			list: [],
			actions: ['父母', '夫妻', '子女', '兄弟', '姐妹', '朋友'],
			useplaceshow: false,
			tragetArr: {},
			formObj: {
				"id": 0, //地址id
				"name": "", //收货人姓名
				"mobile": "", //手机号
				"address": "", //详细地址
				province: '',
				city: '',
				area: '',
				"urgent_name": "", //紧急联系人
				"urgent_mobile": "", //紧急手机号
				"email": "", //邮箱
				relationship: '关系',

			},
			params: {},
			delIds: [],
		}
	},
	onShow() {
		this.addressInit() //获取地址列表
	},
	onLoad(obj) {
		this.params = obj
	},
	onBackPress(event) {

	},
	methods: {
		delShows(item) {
			this.delShow = true
			this.delIds = [item.id]
		},
		onGetAddress() {
			uni.getAddress({
				success: (res) => {
					this.result = res.result.address
					this.formObj.name = res.result.fullname
					this.formObj.mobile = res.result.mobilePhone
					this.city = res.result.city
					this.prev = res.result.prov
					this.area = res.result.area
					this.addressTxt = this.prev + '-' + this.city + '-' + this.area
					this.formObj.address = res.result.street + res.result.address
					this.addSava();
				},
				fail: (res) => {
					this.uToastFunc('收货地址获取失败')
					return true
				}
			});
		},
		sexSelect(item) {
			this.formObj.relationship = item
			this.showSex = false
		},
		onConfirm(e) {
			this.prev = e.labelArr[0]
			this.city = e.labelArr[1]
			this.area = e.labelArr[2]
			this.addressTxt = this.prev + '-' + this.city + '-' + this.area
		},
		openAddres(e) {
			this.addresShow = true
		},
		choose() {
			if (!this.tragetArr.id) {
				return this.$refs.uToast.show({
					message: '请选择地址',
					icon: 'error',
					type: 'error'
				})
			}
			let opt = {
				url: '/address/select',
				data: {
					id: this.tragetArr.id
				}
			}
			this.$request(opt).then(res => {
				this.$refs.uToast.show({
					message: res.msg || '成功',
					icon: 'success',
					type: 'success'
				})

				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.num = this.params.num; //修改上一页data里面的searchVal参数值为1211
				prevPage.$vm.goods_sku_id = this.params.goods_sku_id; //修改上一页data里面的searchVal参数值为1211
				prevPage.$vm.address_id = this.tragetArr.id; //修改上一页data里面的searchVal参数值为1211
				uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});
			})
		},
		formReg() {
			let emailReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
			// let telReg = /^1[3456789]\d{9}$/
			// 验证手机号的正则
			let telReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
			if (this.formObj.name == '' || this.formObj.mobile == '') {
				this.uToastFunc('请输入姓名或电话')
				return true
			}
			if (this.formObj.address == '' || this.area == '') {
				this.uToastFunc('请输入地址')
				return true
			}
			// if (this.formObj.urgent_mobile == '' || this.formObj.urgent_name == '') {
			// 	this.uToastFunc('请输入紧急联系人或电话')
			// 	return true
			// }
			// if (this.formObj.relationship == '关系') {
			// 	this.uToastFunc('请选择与紧急联系人的关系')
			// 	return true
			// }
			console.log(this.formObj.mobile,telReg.test(this.formObj.urgent_mobile))
			if (telReg.test(this.formObj.mobile) == false) {
				this.uToastFunc('手机格式不正确')
				return true
			}
			// if (this.formObj.mobile == this.formObj.urgent_mobile) {
			// 	this.uToastFunc('紧急联系人电话不能与联系电话一致')
			// 	return true
			// }
			if (this.formObj.email && emailReg.test(this.formObj.email) == false) {
				this.uToastFunc('邮箱格式不正确')
				return true
			}
		},
		uToastFunc(msg) {
			uni.showToast({
				title: msg
			})
		},
		editConfirm(type) {
			let flag = this.formReg()
			if (flag) {
				return
			}
			if (this.editTitle == '编辑') {
				this.editSava()
			}
			if (this.editTitle == '新增') {
				this.addSava()
			}
		},

		addSava() {
			this.formObj.province = this.prev
			this.formObj.city = this.city
			this.formObj.area = this.area
			let opt = {
				url: '/address/add',
				method: "POST",
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: this.formObj
			}

			this.$request(opt).then(res => {
				this.$refs.uToast.show({
					message: res.msg || '成功',
					icon: 'success',
					type: 'success'
				})
				this.editShow = false
				this.addressInit()
			})
		},

		editSava() {
			this.formObj.province = this.prev
			this.formObj.city = this.city
			this.formObj.area = this.area
			let opt = {
				url: '/address/edit',
				method: "POST",
				header: "application/x-www-form-urlencoded;charset=utf-8",
				data: this.formObj
			}
			this.$request(opt).then(res => {
				this.$refs.uToast.show({
					message: res.msg || '成功',
					icon: 'success',
					type: 'success'
				})
				this.editShow = false
				this.addressInit()
			})

		},
		delConfim() {
			// let list = []
			// this.list.forEach((item, i) => {
			// 	if (item.onFlag) {
			// 		list.push(item)
			// 	}
			// })
			// let ids = list.map(item => item.id).join()
			let opt = {
				url: '/address/del',
				header: "application/x-www-form-urlencoded;charset=utf-8",
				method: "POST",
				data: {
					ids: this.delIds
				}
			}
			this.$request(opt).then(res => {
				this.$refs.uToast.show({
					message: res.msg || '删除成功',
					icon: 'success',
					type: 'success'
				})
				this.addressInit()
				this.delShow = false
			})
		},
		edit(data) {
			this.editShow = true
			this.editTitle = data.type == 1 ? '编辑' : '新增'
			if (data.type == 1) {
				this.tragetArr = data.data
				this.editModal(data.data)
			} else {
				this.city = ''
				this.prev = ''
				this.area = ""
				this.formObj = {
					"id": 0, //地址id
					"name": "", //收货人姓名
					"mobile": "", //手机号
					"address": "", //详细地址
					province: '',
					city: '',
					area: '',
					"urgent_name": "", //紧急联系人
					"urgent_mobile": "", //紧急手机号
					"email": "", //邮箱
					relationship: '关系',
				}
			}
		},
		editModal(data) { //查看列表
			//编辑初始化
			let opt = {
				url: '/address/details',
				data: {
					id: data.id
				}
			}
			this.$request(opt).then(res => {
				this.formObj = res.data
				this.prev = res.data.province
				this.city = res.data.city
				this.area = res.data.area
				this.addressTxt = this.prev + '-' + this.city + '-' + this.area
			})
		},
		liClick(inx) {
			this.tragetArr = {}
			this.list.forEach((item, i) => {
				if (inx == i) {
					item.onFlag = true
				} else {
					item.onFlag = false
				}
				if (item.onFlag) {
					this.tragetArr = item
				}
			})
		},
		liClickk(inx) {
			this.tragetArr = {}
			this.list.forEach((item, i) => {
				if (inx == i) {
					item.onFlag = true
				} else {
					item.onFlag = false
				}
				if (item.onFlag) {
					this.tragetArr = item
				}
			})
			this.choose()
		},
		addressInit() {
			let opt = {
				url: '/myaddress',
			}
			this.$request(opt).then(res => {
				// console.log('-----地址', res)
				this.list = res.data
				this.list.forEach(item => {
					item.onFlag = false
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.address {
	padding: 20rpx 0;
	text-align: center;
}
.bottom-btn{
	background-color: #ff6633;
	color: #fff;
	// text-align: center;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.address .address-button {
	margin: 20rpx 50rpx;
	margin-bottom: 62rpx;
}

.address .result {
	width: 100%;
	background: #fafbfc;
	color: #61687C;
}

.address-page {
	background-color: #fff;
	height: 100vh;

	.address-ul {
		// height: 145rpx;

		.address-li.on {
			background-color: #f2f9fc;
		}

		.address-li {
			margin: 0 14rpx 0 24rpx;
			border-bottom: 1rpx solid #e3e6ea;
			position: relative;
			padding-top: 14rpx;

			.icon {
				position: absolute;
				top: 12rpx;
				right: 20rpx;
			}

			.edit {
				right: 100rpx;
			}

			.txt-title {
				color: #171B25;
				font-size: 28rpx;
				padding-bottom: 24rpx;
			}

			.txt-detail {
				color: #afb0b3;
				font-size: 24rpx;
				padding-bottom: 24rpx;

			}
		}
	}

	/deep/ .u-popup__content {
		width: 600rpx;
		border-radius: 20rpx !important;
	}

	.addressModel {
		background-color: #fff;
		border-radius: 20rpx;

		.close {
			position: absolute;
			top: 20rpx;
			right: 20rpx
		}

		.title {
			font-size: 30rpx;
			font-weight: bold;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			border-bottom: 1rpx solid #E5E5E5;

		}

		.input-btn {
			width: 70%;
			margin: 30rpx auto;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 20rpx;
			color: #fff;
			background: #ff6633;
		}

		.input-li {
			// padding: 27rpx 20rpx 27rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: nowrap;
			margin: 0 20rpx;
			position: relative;
			border-bottom: 1rpx solid #E5E5E5;

			.input-label {
				min-width: 30%;
				font-size: 25rpx;
				text-align: right;
				line-height: 110rpx;
			}

			.input-box {
				width: 60%;
				// border: 1rpx solid #E5E5E5;
				border-radius: 12rpx;
				font-size: 25rpx;
			}

			.color-bule {
				width: 100rpx;
				position: absolute;
				top: 0rpx;
				right: 0rpx;
				height: 100%;
				line-height: 60rpx;
				font-size: 24rpx;
				text-align: right;
				color: #ff6633;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.relationship-ul {
				width: 200rpx;
				height: 200rpx;
				border: 1rpx solid #82d0fe;
				position: absolute;
				border-radius: 20rpx;
				top: 80rpx;
				overflow-y: scroll;
				background-color: #fff;
				right: 10rpx;
				z-index: 99999;

				.relationship-li {
					height: 35rpx;
					line-height: 35rpx;
					font-size: 24rpx;
					margin: 10rpx 6rpx;
					color: #7d7d7d;
					text-align: center;
					border-bottom: 2rpx solid #e9e9e9;
				}
			}
		}

		.input-li:first-child {
			margin-top: 30rpx;
		}
	}

}
</style>
