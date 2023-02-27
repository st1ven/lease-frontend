<template>
	<view class="cooperation-page">
		<view class="image-box" style="margin-bottom: 22rpx;">
			<u-image :showLoading="true" src="https://oss.jiulove.cn/uploads/20220731/c064f192238525431762933c4065e029.png" width="100%" height="472rpx"></u-image>
		</view>
		<!-- </view> -->

		<view class="form-box">
			<view class="title">
				请填写您的申请信息
			</view>
			<view class="form">
				<view class="form-li">
					<view class="li-input">
						<u-input placeholder="公司名称" :border="'surround'" fontSize="28rpx" v-model="formObj.company_name" prefixIcon="bag" clearable>
						</u-input>
					</view>
				</view>

				<view class="form-li">
					<view class="li-input">
						<u-input placeholder="经营范围" :border="'surround'" fontSize="28rpx" v-model="formObj.range"  prefixIcon="list" clearable>
						</u-input>
					</view>
				</view>

				<view class="form-li">
					<view class="li-input">
						<u-input placeholder="您的姓名" :border="'surround'" fontSize="28rpx" v-model="formObj.name"  prefixIcon="account" clearable>
						</u-input>
					</view>
				</view>

				<view class="form-li">
					<view class="li-input">
						<u-input placeholder="您的电话" :border="'surround'" fontSize="28rpx" v-model="formObj.phone"  prefixIcon="phone" clearable>
						</u-input>
					</view>
				</view>

				<view class="form-li">
					
					<view class="li-input">
						<u-input placeholder="所在地址" :border="'surround'" fontSize="28rpx" v-model="formObj.address"  prefixIcon="map" clearable>
						</u-input>
					</view>
				</view>

				<view class="input-btn" @click="editConfirm()">
					提交申请
				</view>
			</view>
		</view>
		
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				formObj: {

				}
			}
		},
		methods: {

			editConfirm() {
				let opt = {
					url: '/cooperation',
					data: this.formObj,
					header: "application/x-www-form-urlencoded;charset=utf-8",
					method: "POST",
				}

				this.$request(opt).then(res => {
					console.log(' -----', res)
					this.$refs.uToast.show({
						message: res.msg || '成功',
						icon: 'success',
						type: 'success'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cooperation-page {
		background-color: #fff;
		// padding: 24rpx;
		// height: 100vh;

		/deep/ .u-input {
			padding-top: 0 !important;
			padding-bottom: 0 !important;
		}

		.input-btn {
			width: 100%;
			margin: 30rpx auto;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 20rpx;
			color: #fff;
			background: linear-gradient(2deg, #92D3FF 0%, #14a3e4 100%);
		}

		.input-li {
			// padding: 27rpx 20rpx 27rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 20rpx;
			position: relative;
			border-bottom: 1rpx solid #E5E5E5;

			.input-label {
				width: 220rpx;
				font-size: 28rpx;
				text-align: right;
				line-height: 110rpx;
			}

			.input-box {
				width: 70%;
				margin: 0 32rpx;
				height: 55rpx;
				border: 1rpx solid #E5E5E5;
				border-radius: 12rpx;
			}



		}

		.input-li:first-child {
			margin-top: 30rpx;
		}


	}

	/deep/ .u-input {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.cooperation-page {
		.form-box {
			height: 842rpx;
			padding: 15rpx 12rpx 24rpx;

			.title {
				color: #14a3e4;
				padding: 36rpx 0;
				font-size: 36rpx;
				text-align: center;
			}

			.form {
				background-color: #fff;
				padding: 34rpx 34rpx 0 34rpx;
				border: 2rpx solid #C8E2FF;
				border-radius: 12rpx;

				.input-btn {
					color: #fff;
					// width: 356rpx;
					height: 76rpx;
					line-height: 76rpx;
					font-size: 32rpx;
					border-radius: 10rpx;
					text-align: center;
					margin-top: 40rpx;
				}

				.form-li {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					border: 1px solid #d1d1d1;
					width: 100%;
					height: 35px;
					border-radius: 5px;
					margin-bottom: 15px;
					flex-wrap: nowrap;
					flex-direction: row;
					align-content: center;
					padding-left: 12px;
				}

				.li-icon {
					width: 64rpx;
					border-right: 2rpx solid #D4D5D6;
					position: relative;
					height: 80%;

					.icon-text {
						position: absolute;
						top: 50%;
						right: 16rpx;
						transform: translateY(-50%);
					}
				}

				.li-label {
					width: 170rpx;
					padding-left: 18rpx;
					font-size: 32rpx;
					color: #14a3e4;
				}

				.li-input {
					width: 95%;
				}
			}
		}
	}
</style>
