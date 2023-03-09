<template>
	<view class="iz-card-item" :style="'width: ' + width" @click="$emit('click')">
		<!-- <u-image v-if="src" width="48rpx" height="48rpx" :src="'/static/image/'+src+'.webp'" /> -->
		<u-image v-if="src" width="50rpx" height="50rpx" :src="src" />
		<text>{{text}}</text>
	</view>
</template>

<script>
	export default {
		name: "iz-card-item",
		props: {
			width: {
				type: String,
				default: '20%'
			},
			text: {
				type: String,
				default: '标题'
			},
			src: {
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
	.iz-card-item {
		display: flex;
		height: 90rpx;
		text-align: center;
		align-items: center;
		margin-bottom: 30rpx;
		flex-direction: column;
		justify-content: space-between;

		text {
			font-size: 24rpx;
			font-weight: 400;
			color: #61687C;
		}
	}
</style>
