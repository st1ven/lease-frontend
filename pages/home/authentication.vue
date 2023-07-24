<template>
	<view style="background-color: #f6f6fb;height: 100vh;">
		<view class="notice-box" >
			<u-notice-bar text="请尽快完成以下信息认证，如实填写会大幅提高审核通过率"></u-notice-bar>
		</view>
		<view class="auth-box">
			<u-cell-group :border="false">
				<u-cell title="实名认证" label="认证身份证信息" :border="false" isLink @click="open('../idcard/idcard?type=detail')" ></u-cell>
				<u-cell title="紧急联系人" label="非紧急情况下不会打扰" :border="false" isLink @click="open('../contact/contact')" ></u-cell>
				<u-cell title="个人基本信息" label="提交资料加速审核" :border="false" isLink @click="open('../home/profile')" ></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {},
		onShow() {},
		methods: {
			open(url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.auth-box {
		margin: 30rpx 12px;
		border-radius: 20rpx;
		background: #fff;
	}
</style>
