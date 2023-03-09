<template>
	<view class="">
		<view class="topyao">
			<view class="toptwo">
				<text class="toptext">总奖励</text>
				<text class="topbot">{{userprice.zongjiangli || 0}}元</text>
			</view>
			<text style="color: #EFA03A;font-size: 25px;">|</text>
			<view class="toptwo">
				<text class="toptext">已提现</text>
				<text class="topbot">{{userprice.chenggong || 0}}元</text>
			</view>
			<text style="color: #EFA03A;font-size: 25px;">|</text>
			<view class="toptwo">
				<text class="toptext">待提现</text>
				<text class="topbot">{{userprice.daitixian || 0}}元</text>
			</view>
		</view>
		<view class="">
			<image v-if="userprice.userpriceinfo == ''" :src="backgroundimage.noyao_image" mode="widthFix" style="width: 100%;"></image>
			<view class="touni" v-else v-for="(item, index) in userprice.userpriceinfo":key="index">
						<view class="toptext" style="font-size: 14px;">￥{{item.money}}</view>
						<view style="font-size: 12px;color: #9FA3B0;">{{item.createtime}}</view>
						<view  style="font-size: 12px;color: #9FA3B0;">{{item.status}}</view>
			</view>
		</view>
		<view class="" style="padding-bottom: 10px;display: flex;flex-direction: row;justify-content: center;">
		<button class="buy-ok" style="" open-type="share">邀请好友</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
				return {
					configg:{},
					userprice:{},
					backgroundimage:{},
					userinfo:{},
				}
			},
		onLoad() {
			this.userpriceget()
			this.background()
			this.shareconfig()
			this.userinfoget()
		},
		onShow() {
			this.userpriceget()
		},
		onShareAppMessage(res) {
		    return {
				  title: this.configg.title,
				  path: this.configg.path + this.userinfo.userinfo.id,
				  bgImgUrl:this.configg.bgImgUrl_image,
				  content:this.configg.content,
				  desc:this.configg.ddesc
		    }
		  },
		methods: {
			background(){
				let opt = {
					url: '/index/invitationbackgroundimage',
				}
				this.$request(opt).then(res => {
					this.backgroundimage = res.data
				})
			},
			userpriceget(){
				let opt = {
					url: '/user/userpriceget',
				}
				this.$request(opt).then(res => {
					this.userprice = res.data
				})
			},
			userinfoget(){
				
				let opt = {
					url: '/user/userinfo',
				}
				this.$request(opt).then(res => {
					this.userinfo = res.data
					
				})
			},
			shareconfig(){
				let opt = {
					url: '/index/invitation'
				}
				this.$request(opt).then(res => {
					this.configg = res.data
					
				})
			},
		},
	}
</script>

<style>
	.topyao{
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		background: #ffdfc9;
	}
	.toptwo{
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 35px;
	}
	.toptext{
		font-size: 16px;
		font-weight: 800;
		color: #EFA03A;
	}
	.topbot{
		font-size: 14px;
	}
	.touni{
		display: flex;
		justify-content: space-around;
		flex-direction: row;
		padding: 10px 0 10px 20px;
		border-bottom: 1px solid #e7e7e7;
		align-items: center;
	}
	.buy-ok {
		width: 626rpx;
		height: 80rpx;
		border-radius: 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: #fff;
		margin-top: 27rpx;
		background:linear-gradient(179deg, #E77232 0%, #EEB051 100%);
		color:#fff;
		margin-bottom: 20px;
	}
</style>