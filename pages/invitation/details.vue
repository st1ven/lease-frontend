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

				this.xieyixiangqing(obj.id)
			},
			methods:{
				xieyixiangqing(id){
					let opt = {
						url: '/index/invitationdetails?id='+id
					}
					this.$request(opt).then(res => {
						this.content = res.data.rule
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
