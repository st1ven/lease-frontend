<template>
	<view class="pages" style="background-color: #f6f6fb;height: 96vh;">

		<view class="idCard-box" v-for="(item,index) in content"  :key='index'>
			<u-cell-group :border="false">
				<u-cell :title="item.name" :border="false" isLink @click="open(item)" ></u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
			data() {
				return {
					content:[]
				}
			},
			onLoad() {
				this.wanzhuan()
			},
			methods:{
				open(item){
					console.log(JSON.stringify(item))
					uni.navigateTo({
						url:'./xieyi?title='+item.name + '&id=' + item.id
					})
				},
				wanzhuan(){
					let opt = {
						url: '/xieyi'
					}
					this.$request(opt).then(res => {
						console.log(res);
						this.content = res.data
					})
				} 
			} 
		}
</script>

<style>
	.pages{
		padding: 10px;
		height: 100%;
	}
	.zulinxieyi{
		display: flex;
		
	}
	.idCard-box {
		background-color: #fff;
		border-radius: 14rpx;
		margin-bottom: 18rpx;
	}
</style>