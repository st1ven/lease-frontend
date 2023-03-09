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
		padding: 12px;
		height: 100vh;

		.agreement-cont {
			width: calc(100% - 24px);
			min-height: 95vh;
			margin: 0 auto;
			background-color: #fff;
			padding: 12px;
			overflow-x: scroll;
			border-radius: 10px;
		}

	}
</style>
