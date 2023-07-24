<template>
	<view class="contact-box" style="background-color: #f6f6fb;">
		<view class="notice-box">
			<u-notice-bar text="填写直系亲属会大幅提高审核通过率，请务必填写真实姓名，切勿包含错别字，我们一般不可能会联系您的紧急联系人"></u-notice-bar>
		</view>
		<view class="contact-item" v-if="loading">
			<u-skeleton :loading="loading" rows="3"></u-skeleton>
		</view>
		<view v-for="(item,index) in list" :key="index">
			<view class="contact-item">
				<view class="title">
					紧急联系人{{index+1}}
				</view>
				<!-- #ifdef H5 -->
				<view class="form">
					<view class="form-li">
						<text>真实姓名</text>
						<u-input placeholder="请输入姓名" v-model="item.realname" border="none"></u-input>
					</view>
					<view class="form-li">
						<text>电话</text>
						<u-input placeholder="请输入电话" v-model="item.mobile" border="none"></u-input>
					</view>
					<view class="form-li">
						<text>关系</text>
						<u-radio-group activeColor="#FF6633" v-model="item.relationship" placement="row">
							<u-radio :customStyle="{marginRight: '48rpx'}" labelSize="28rpx"
								v-for="(item1, index1) in relationship_map" :key="index1" :label="item1.name"
								:name="item1.name" @change="(e) => radioChange(e, index)">
							</u-radio>
						</u-radio-group>
					</view>
				</view>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<view class="" v-if="item.mobile == undefined || item.mobile == ''">
					<view class="desc">
						非紧急情况下，我们不会打扰，请您放心
					</view>
					<view class="button" @click="add(index)">
						<u-icon name="plus" size="12" color="#FF6633" label="立即添加" labelPos="right" labelSize="14"
							labelColor="#FF6633"></u-icon>
					</view>
				</view>
				<view class="form" v-else>
					<view class="form-li">
						<text>真实姓名</text>
						<u-input placeholder="请输入姓名" v-model="item.realname" border="none"></u-input>
					</view>
					<view class="form-li">
						<text>姓名</text>
						<u-input class="form-disabled" readonly :placeholder="item.name" border="none"></u-input>
					</view>
					<view class="form-li form-disabled" @click="add(index)">
						<text>电话</text>
						<u-input :readonly="item.mobile !== ''" :placeholder="item.mobile" border="none"
							suffixIcon="arrow-right" suffixIconStyle="color: #9FA3B0; font-size: 24rpx;"></u-input>
					</view>
					<view class="form-li">
						<text>关系</text>
						<u-radio-group activeColor="#FF6633" v-model="item.relationship" placement="row">
							<u-radio :customStyle="{marginRight: '48rpx'}" labelSize="28rpx"
								v-for="(item1, index1) in relationship_map" :key="index1" :label="item1.name"
								:name="item1.name" @change="(e) => radioChange(e, index)">
							</u-radio>
						</u-radio-group>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<view class="input-btn" @click="saveContact()">保存联系人</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: true,
				relationship_map: [{
						name: '父母',
						disabled: false
					},
					{
						name: '配偶',
						disabled: false
					},
					{
						name: '其他亲属',
						disabled: false
					}
				],
				list: []
			}
		},
		onLoad(query) {
			console.log(query, 'query');
			if (query && query.list) {
				this.loading = false;
				console.log(query.list, 'query.list');
				this.list = JSON.parse(query.list);
			} else {
				this.init();
			}
		},
		methods: {
			init() {
				let opt = {
					url: '/emergency',
				}
				this.$request(opt).then(res => {
					this.loading = false;
					this.list = res.data || [{}, {}, {}];
				})
			},
			setArr(list, item, res) {
				this.$set(list, item, {
					...res,
					realname: res.name,
					relationship: '父母'
				});
				console.log(this.list, 'this.list');
			},
			add(item) {
				// #ifdef MP-ALIPAY
				uni.choosePhoneContact({
					success: (res) => {
						console.log(res, 'choosePhoneContact');
						this.setArr(this.list, item, res);
					},
					fail: (res) => {
						uni.showToast({
							title: '请授权您的联系人权限,方便我们快速为您添加联系人',
							duration: 3000
						});
					}
				});
				// #endif
				// #ifdef APP-PLUS
				plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, (addressbook) => {
					console.log(addressbook, 'addressbook');
					// 跳转到通讯录的选择联系人界面
					uni.redirectTo({
						url: '../addressbook/addressbook?item=' + item + '&list=' + JSON.stringify(this
							.list),
					});
				}, (e) => {
					console.log(e, 'e');
					uni.showToast({
						title: '获取通讯录失败,请授权',
						duration: 3000,
						icon: 'none'
					});
				});
				// #endif
			},
			radioChange(name, index) {
				this.$set(this.list, index, {
					...this.list[index],
					relationship: name
				});
			},
			saveContact() {
				if (this.list[0].mobile == undefined || this.list[0].mobile == '' || this.list[1].mobile == undefined ||
					this.list[1].mobile == '' || this.list[2].mobile == undefined || this.list[2].mobile == '') {
					uni.showToast({
						title: "请完善所有紧急联系人",
						duration: 1500
					});
					return false;
				}
				let opt = {
					url: '/emergency',
					data: JSON.stringify(this.list),
					header: "application/json;charset=utf-8",
					method: "POST",
				}
				uni.showLoading({
					title: "加载中..."
				})
				this.$request(opt).then(res => {
					uni.showToast({
						icon: 'success',
						title: res.msg,
						duration: 3000,
						complete() {
							uni.navigateBack({
								delta: 1
							});
						}
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.contact-box {
		.input-btn {
			margin: 30rpx 12px;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 20rpx;
			color: #fff;
			background: #FF6633;
		}

		.form {
			.form-disabled {
				color: #e30d0d;
			}

			.form-li {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				border-bottom: 1px solid #F1F2F5;
				height: 40px;

				text {
					color: #414960;
					margin-right: 16rpx;
				}

				/deep/ .u-radio-group {
					padding-left: 9px;
				}
			}

			.form-li:last-child {
				border-bottom: unset;
			}
		}

		.contact-item {
			position: relative;
			margin: 12px;
			padding: 30rpx 30rpx 14rpx;
			border-radius: 16rpx;
			background: #fff;

			.title {
				font-size: 28rpx;
				font-weight: bold;
				color: #171b25;
				padding-bottom: 20rpx;
			}

			.desc {
				font-size: 24rpx;
				color: #9FA3B0;
				padding-bottom: 16rpx;
			}

			.button {
				position: absolute;
				top: 52rpx;
				right: 30rpx;
				border-radius: 50rpx;
				border: 1px solid #FF6633;
				padding: 8rpx 16rpx;
			}
		}
	}
</style>