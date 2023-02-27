<template>
	<view>
		<view class="kuang" style="padding: 10px 12px;">
			<get-coupon   onGetCouponSuccess="onGetCouponSuccess" onGetCouponFail="onGetCouponFail"
							  onClose="onClose"
							  :params="zfbparams"
							  :zIndex="9999">
				<u-image :lazy-load="true" width="100%" :src="image" radius="8px" mode="widthFix"></u-image>
			</get-coupon>
		</view>
	</view>
</template>

<script>
	export default {
		name:"merchant-voucher", 
		props: {
			imagee:'',
			 
		},
		data() {
			return {
				zfbparams: [],
				image:''
			};
		},
		mounted(){
			this.lingquan()
			this.image()
			this.$scope.onClose = this.onClose.bind(this)
			this.$scope.onGetCouponSuccess = this.onGetCouponSuccess.bind(this)
			this.$scope.onGetCouponFail = this.onGetCouponFail.bind(this)
		},
		methods: {
			image(){
				let opt = {
					url: '/userlingquanimage'
				}
				this.$request(opt).then(res => {
					this.image = res.data
				})
			},
			lingquan(){
		
				let opt = {
					url: '/userlingquan'
				}
				this.$request(opt).then(res => {
					this.zfbparams = res.data
				})
			},
			 onGetCouponSuccess(resultList, { extraData }) {
				console.log('触发了 onGetCouponSuccess 事件')
				console.log('成功返回结果: ', resultList)
			},
			onGetCouponFail(result, { extraData }) {
				uni.showToast({
					title:result.errorMsg,
					icon:"none"
				})
				console.log('触发了 onGetCouponFail 事件')
				console.log('失败返回结果: ', result)
			},
			onUseImmediately(event, { extraData }) {
				console.log('触发了 onUseImmediately 事件')
			
				// 可以跳转到自定义的页面
				my.navigateTo({
				  url: '/pages/goods-detail/index',
				})
			},
			onClose(event, { extraData }) {
			
				console.log('触发了 onClose 事件')
			},
		}	
	}
</script>

<style>
.kuang{
	padding: 10px 12px;
}
</style>