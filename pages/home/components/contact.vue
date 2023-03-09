<template>
	<view>
		<u-popup mode="center" :round="10" closeable :show="contactStatus" :safeAreaInsetBottom="false"
			@close="setStatus(false)">
			<view class="contact-item">
				<u-icon size="28" name="phone-fill" />
				<view class="content">
					<text class="title">联系电话</text>
					<text class="number" @click="iphoneFunc">{{iphoneNum}}</text>
				</view>
			</view>
			<view class="line" />
			<view class="contact-item">
				<u-icon size="28" name="email-fill" />
				<view class="content">
					<text class="title">邮箱</text>
					<text class="number">{{email}}</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "Contact",
		props: {
			type: 0
		},
		data() {
			return {
				contactStatus: false,
				iphoneNum: Number,
				email: String
			}
		},

		methods: {
			iphoneFunc(){
				console.log(this.iphoneNum,'iphoneNum','--------')
				if(this.iphoneNum){
					let iphoneNum = this.iphoneNum
					 my.makePhoneCall({
					    number:   iphoneNum//仅为示例
					});

				}
			},
			setStatus(status) {
				this.contactStatus = status
				console.log(this.type, '---type')
				if (status == true && this.type == '0') {
					this.contactHttp()
				}
				if (status == true && this.type == '1') {
					this.contactHttp2()
				}
			},
			//联系我们
			contactHttp() {

				let opt = {
					url: "/contact"
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.iphoneNum = res.data.admin_phone
					this.email = res.data.admin_email
				})
			},
			//联系商家
			contactHttp2() {

				let opt = {
					url: "/mer_contact",
					data: {
						mer_id: uni.getStorageSync('merid')
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.iphoneNum = res.data.admin_phone
					this.email = res.data.admin_email
				})
			},
		}
	}
</script>


<style lang="scss" scoped>
	.contact-item {
		display: flex;
		width: 564rpx;
		height: 130rpx;
		padding: 0 50rpx;
		align-items: center;

		.content {
			display: flex;
			margin-left: 30rpx;
			flex-direction: column;

			.title {
				color: #61687C;
				font-size: 24rpx;
				font-weight: 400;
			}

			.number {
				color: #414960;
				font-size: 40rpx;
				font-weight: 800;
				margin-top: 6rpx;
			}
		}
	}

	.line {
		width: 86%;
		height: 1px;
		margin: 0 7%;
		background: #F1F2F5;
	}
</style>
