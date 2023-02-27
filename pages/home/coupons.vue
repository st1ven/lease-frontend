<template>
	<!-- 续租 -->
	<view class="coupons-page">
		<view class="coupons-tab">
			<u-tabs :list="list1" @click="click" :scrollable="false"></u-tabs>
		</view>
		<view class="coupons-item" >
			<iz-coupons-item :type="0" :status="status" />
		</view>
		 
	</view>
</template>

<script>
	export default {

		data() {
			return {
				type: 0,
				status: 1,
			 
				list1: [{
					name: '未使用',
				}, {
					name: '已使用',
				}, {
					name: '已过期',
				}]
			}
		},
		onShow() {
			 
		},
		methods: {
			click(item) {
				this.status = item.index+1
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupons-page {

		.coupons-tab {
			height: 98rpx;
			background-color: #fff;
			width: 100%;
		}

		.coupons-item {
			padding: 0 28rpx;
			background-color: #F0F0F0;
			height: calc(100vh - 98rpx);
		}
	}
</style>
