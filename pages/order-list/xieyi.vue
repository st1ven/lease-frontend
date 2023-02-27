<template>
		<view class="u-content">
			<u-parse :content="content" :selectable="true" :scrollTable="false"></u-parse>
		</view>
</template>

<script>
	export default {
			data() {
				return {
					content:''
				}
			},
			onLoad(obj) {
				uni.setNavigationBarTitle({
					title: obj.title
				})
				this.xieyixiangqing(obj.id)
			},
			methods:{
				xieyixiangqing(id){
					let opt = {
						url: '/xieyixiangqing?id='+id
					}
					this.$request(opt).then(res => {
						this.content = res.data
						console.log(this.content)
					})
				},
			}
		}
</script>

<style>
	.u-content {
	        padding: 24rpx;
			background-color: #fff;
			overflow: hidden;
	    }
</style>
