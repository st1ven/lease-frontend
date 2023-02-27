<template>
	<view class="agreement-page">
		<view class="agreement-cont">
			<!-- {{value1}} -->
			<u-parse :content="value1"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				value1: '',
				params: {}
			}
		},
		onLoad(obj) {
			uni.setNavigationBarTitle({
				title: obj.title
			})
			this.agreementFunc(obj._url)
		},
		onShow() {
			if (this.params._url) {
				this.agreementFunc(this.params._url)
			}
		},
		methods: {
			agreementFunc(url) {
				let opt = {
					url: '/' + url
				}
				this.$request(opt).then(res => {
					this.value1 = res.data;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.agreement-page {
		background-color: #F0f0f0;
		padding: 24rpx;
		height: 100vh;

		.agreement-cont {
			width: 90%;
			min-height: 95vh;
			margin: 0 auto;
			background-color: #fff;
			padding: 35rpx 20rpx;
			overflow-x: scroll;
			border-radius: 14rpx;
		}

	}
</style>
