<template>
	<view class="iz-cell" :class="[classN,!bold || 'ft-bold']" @click="$emit('click')">
		<text class="title">优惠券</text>
		<u-icon v-if="icon" size="24rpx" :name="icon"></u-icon>
	</view>
</template>

<script>
	export default {
		name: "iz-cell",
		props: {
			title: {
				type: String,
				default: '标题'
			},
			bold: {
				type: Boolean,
				default: false
			},
			classN: {
				type: String
			},
			icon: {
				type: String
			},
			 
		},
		data() {
			return {
			 
			};
		},
	 
	 
		methods: {
			
		},
	}
</script>

<style lang="scss" scoped>
	.iz-cell {
		display: flex;
		padding: 30rpx;
		align-items: center;
		border-radius: 14rpx;
		background-color: #FFFFFF;
		justify-content: space-between;

		.title {
			color: #414960;
			font-size: 24rpx;
		}
	}
</style>
