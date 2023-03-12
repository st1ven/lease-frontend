<template>
	<view class="contact-box">
		<view class="notice-box">
			<u-notice-bar text="请填写真实姓名，填写直系亲属会大幅提高审核通过率"></u-notice-bar>
		</view>
		<view class="contact-item" v-if="loading">
			<u-skeleton :loading="loading" rows="3"></u-skeleton>
		</view>
		<view v-for="(item,index) in list" :key="index">
			<view class="contact-item">
				<view class="title">
					紧急联系人{{index+1}}
				</view>
				<view class="" v-if="item.mobile == undefined || item.mobile == ''">
					<view class="desc">
						非紧急情况下，我们不会打扰，请您放心
					</view>
					<view class="button" @click="add(index)">
						<u-icon name="plus" size="12" color="#ffaa00" label="立即添加" labelPos="right" labelSize="14"
							labelColor="#ffaa00"></u-icon>
					</view>
				</view>
				<view class="form" v-else>
					<view class="form-li">
						<text>姓名</text>
						<u-input placeholder="请输入姓名" v-model="item.name" border="none"></u-input>
					</view>
					<view class="form-li" @click="add(index)">
						<text>电话</text>
						<u-input :readonly="item.mobile !== ''" placeholder="请输入电话" v-model="item.mobile" border="none"
							suffixIcon="arrow-right" suffixIconStyle="color: #9FA3B0; font-size: 24rpx;"></u-input>
					</view>
					<view class="form-li">
						<text>关系</text>
						<u-radio-group activeColor="#ffaa00" v-model="item.relationship" placement="row">
							<u-radio :customStyle="{marginRight: '48rpx'}" labelSize="28rpx"
								v-for="(item1, index1) in relationship_map" :key="index1" :label="item1.name"
								:name="item1.name" @change="(e) => radioChange(e, index)">
							</u-radio>
						</u-radio-group>
					</view>
				</view>
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
		onLoad() {
			this.init()
		},
		onShow() {},
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
			add(item) {
				// #ifdef MP-ALIPAY
				my.choosePhoneContact({
					success: (res) => {
						this.$set(this.list, item, {
							...res,
							relationship: '父母'
						});
					},
					fail: (res) => {
						uni.showToast({
							title: res.errorMessage,
							duration: 3000
						});
					}
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
						duration: 3000
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
			background: #ffaa00;
		}

		.form {
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
				border: 1px solid #ffaa00;
				padding: 8rpx 16rpx;
			}
		}
	}
</style>
