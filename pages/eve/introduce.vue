<template>
		<view class="u-content">

			<image @click="goods" style="width: 100%;" :src="content.backgroundimage" mode="widthFix"></image>

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
				this.introduce()
			},
			methods:{
				introduce(){ 
					let opt = {
					 	url: '/index/introduce'
					}
					this.$request(opt).then(res => {
						
						this.content = res.data
						uni.setNavigationBarTitle({
							title: this.content.title || "介绍"
						})
						console.log(JSON.stringify(this.content))
					})
				}, 
				goods(){
					uni.navigateTo({
						url: "../goods-detail/goods-detail?id=" + this.content.goodsid
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
		/* min-height: 100%;
		height: auto;
		padding: 0px;
		margin: 0px; */
	        /* padding: 24rpx; */
	    }
</style>
