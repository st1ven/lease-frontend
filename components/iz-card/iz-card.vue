<template>
	<view class="iz-card">
		<view class="top">
			<text class="title">{{ title }}</text>
			<view class="flex align-center ml-auto" v-if="moreTitle" @click="$emit('click')">
				<text class="more">{{ moreTitle }}</text>
				<u-icon color="#666666" size="10" name="arrow-right" />
			</view>
		</view>
		<view class="content">
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		name: "iz-card",
		props: {
			title: {
				type: String,
				default: '卡片标题'
			},
			moreTitle: {
				type: String
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.iz-card {
		background: #FFFFFF;
		border-radius: 14rpx;
		margin: 0 40rpx 20rpx 40rpx;
		padding: 20rpx 30rpx 0 30rpx;

		.top {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			.title {
				color: #1F1F1F;
				font-size: 28rpx;
			}
			
			.more {
				color: #333333;
				font-size: 20rpx;
				font-weight: 400;
			}
			
			/deep/ .u-icon {
				margin-bottom: 5rpx;
			}
		}
		
		.content {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			flex-direction: row;
		}
	}
</style>
