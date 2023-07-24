<template>
		<view class="u-content" style="background-color: #f6f6fb;">

			<view class="" @click="fanhui">
				<u-parse :content="content" :previewImg="false"></u-parse>
			</view>
		</view>
</template>

<script>
	export default {
			data() {
				return {
					content:''
				}
			},
			onLoad() {
				this.wanzhuan()
			},
			methods:{
				wanzhuan(){
					let opt = {
						url: '/index/wanzhuan'
					}
					this.$request(opt).then(res => {
						this.content = res.data
					})
				}, 
				fanhui(){
					uni.navigateBack({
						delta: 1
					});
				},
			}
		}
</script>

<style>
	.u-content {
	        /* padding: 24rpx; */
	    }
</style>
