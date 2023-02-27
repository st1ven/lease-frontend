<template>
		<view class="u-content">

			<view class=""@click="tiaozhuan">
				<u-parse :content="content" :previewImg="false"></u-parse>
			</view>
		</view>
</template>

<script>
	export default {
			data() {
				return {
					content:'',
					url:''
				}
			},
			
			onLoad(obj) {
				this.params = obj
				uni.setNavigationBarTitle({
					title: obj.title
				})
				this.contentt(obj.id)
			},
			methods:{
				tiaozhuan(){
					uni.switchTab({
						url: this.url
					}) 
					uni.navigateTo({
						url: this.url
					})
					
				},
				contentt(id){
					
					let opt = {
						data:{
							id:id
						},
						url: '/membercontent'
					}
					this.$request(opt).then(res => {
						this.content = res.data.content
						this.url = res.data.url
						console.log(JSON.stringify(res))
					})
				}
			}
		}
</script>

<style>
	.u-content {
	        /* padding: 24rpx; */
	    }
</style>
