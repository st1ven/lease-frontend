<template>
	<view class="" :style="{backgroundColor:contentt.color}">
		<view class="detail-cont">
			<u-parse :content="contentt.content" :previewImg="false"></u-parse>
		</view>
		<view class="buttonn">
			<view class="" @click="shouye">
				<image :src="contentt.left" mode="widthFix" :lazy-load="true" style="width: 300rpx"></image>
			</view>
			<view class="" @click="followquery">
				<image :src="contentt.right" mode="widthFix" :lazy-load="true" style="width: 300rpx"></image>
			</view>
		</view>
    </view>
</template>

<script> 
	export default {
	data() {
		return {
			action: {},
			activityId: '',
			isReady: false,
			item:'',
			contentt:'',
			tokenstatus:'',
			guanzhu:''
		}
	},
	onLoad(query) {
		this.kaibao()
		// #ifdef MP-ALIPAY
		this.activityId=query.activityId
		this.action={ type: 'directReceive' } //开启红包并拆包
		if(this.activityId !=null && query.activityId !=null){
			uni.setStorageSync('activityId', this.activityId);
		}
		my.loadPlugin({
		  plugin: '2021003125612168@*',
		  success: () => {
			this.isReady= true
		  }
		});
		// #endif
		
	},
	onShow() {
	},
	methods: {
		onClose() {
		  this.action= { type: '' }
		},
		onError() {
			this.action={ type: '' }
		},
		// 检测token是否过期
		shouye(){
			uni.navigateTo({
				url:this.contentt.url
			})
			uni.switchTab({
				url:this.contentt.url
			})
		},
		kaibao(){
			let opt = {
				url: '/kaibao'
			}
			this.$request(opt).then(res => {
				this.contentt = res.data
			})
		},
		followquery(){
			this.action={ type: 'directReceive' }
		},
		}	
	}
</script>

<style>
	.guanzhu{
		color:blueviolet;
		display: flex;
		align-content: center;
		height:100rpx ;
		background-size: 100% 100%;
		align-items: center;
		justify-content: space-evenly;
	}
	.textt{
		background: #5199ff;
		padding: 5px 20px;
		border-radius: 10px;
		color: #fff;
		font-size: 14px;
	}
	.buttonn{
		position: fixed;
		z-index: 1030;
		bottom: 45px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
		align-items: center;
	}

</style>