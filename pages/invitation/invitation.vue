<template>
	<view>
		<view class="" :style="{backgroundImage:'url('+configg.background_image+')'}" style="padding:  0 0 20px 0;">
			<view class="huodonganniu">
				<text @click="huodongguize" class="huodongbu"
					:style="{background:configg.page_json.ActivityB,color:configg.page_json.ActivityC,boxShadow:configg.page_json.ActivityS}">{{configg.page_json.Activity}}</text>
				<text @click="jianglijiludingyue" class="huodongbu"
					:style="{background:configg.page_json.RewardB,color:configg.page_json.RewardC,boxShadow:configg.page_json.RewardS}">{{configg.page_json.Reward}}</text>
			</view>
			<image :src="configg.top_image" mode="widthFix" style="width: 100%;"></image>

			<view class="" style="padding: 10px;">
				<view class="widthdrow">
					<text>可提现金额：{{userinfo.userinfo.money || 0}}元</text>
					<text v-if="tokenstatus ==''" class="tixiantext"
						style="background: linear-gradient(179deg, #8b8b8b 0%, #cdcdcd 100%);"
						@click="qingdenglu">提现到支付宝</text>
					<button v-else type="default" class="tixiantext" open-type="getPhoneNumber"
						@getphonenumber="decryptPhoneNumber" :style="{background:configg.page_json.ButtonC}"
						style="color: rgb(255, 255, 255);padding: 1px 15px;font-size: 12px;line-height: 1.7;margin: 1px;height: 25px;"
						@click="tixianchu">提现到支付宝</button>
				</view>
				<view class="yaoqingtishi">
					<text class="widthdrowtext"
						:style="{background:configg.page_json.ButtonC}">每邀请一名用户成功租机，您可以获得{{configg.price}}元现金</text>
					<view class="da">
						<scroll-view scroll-x="true" class="flex">
							<view class="four">

								<view class="fourthree">

									<image :src="configg.add_image" mode="widthFix"
										style="width:50px;border-radius: 10px;"></image>
									<text style="font-size: 12px;margin-top: 10px;">待邀请</text>
								</view>
								<view class="fourthree" v-for="(item,index) in userinfo.useryao">
									<image v-if="item.avatar == ''" :src="configg.avatar_image" mode="widthFix"
										style="width:50px;border-radius: 10px;"></image>
									<image v-else :src="item.avatar" mode="widthFix"
										style="width:50px;border-radius: 10px;"></image>
									<text style="font-size: 12px;margin-top: 10px;">{{item.nickname}}</text>
								</view>

							</view>
						</scroll-view>
						<view class="fourtwo"
							style="display: flex;justify-content: space-between;margin-bottom: 15px;padding: 0px 20px;">
							<text class="" style="font-size: 14px;">
								成功邀请：{{userinfo.sum || 0}}人
							</text>
							<text class="" @click="yaoqingjiludingyue"
								style="font-size: 14px;color:rgb(54 54 54 / 62%);">
								查看全部>
							</text>
						</view>
						<view class=""
							style="padding-bottom: 10px;display: flex;flex-direction: row;justify-content: center;">
							<fengwologin v-if="tokenstatus ==''" titlee='授权登录' :stylee='configg.page_json.ButtonC'
								:stylecolor="stylecolor" />
							<button v-else class="buy-ok"
								:style="{background:configg.page_json.ButtonC,color:stylecolor}" open-type="share">
								<view class="yaoqing" @click="yaoqinghaoyou">邀请好友</view>
							</button>
						</view>
					</view>
				</view>
				<view class=""
					style="background-color: rgba(240, 248, 255, 0.25);border-radius: 10px;padding: 10px;margin-top: 10px;">
					<image @click="huodongguize" :src="configg.bottom_image" mode="widthFix"
						style="width: 100%;border-radius: 10px;"></image>
				</view>

			</view>
		</view>
		<u-popup :show="show" @close="close" mode="center" :round="10" :closeable='true' closeIconPos='top-right'>
			<view style="">
				<view class="">
					<text class="tititle">提现到支付宝</text>
				</view>
				<u-divider text="·"></u-divider>
				<view class="" style="width: 280px;font-size: 14px;padding: 10px 15px;background: #f9a239;color: #fff;">
					{{configg.page_json.Tips}}
				</view>

				<view class="form-box">

					<view class="form">
						<view class="form-li">
							<view class="li-input">

								<input type="number" class="inpuuu" :placeholder="'可提现￥'+userinfo.userinfo.money"
									v-model="tixianprice"></input>
							</view>
						</view>

						<view class="input-btn" @click="Confirm()">
							提交申请
						</view>
					</view>
				</view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				configg: {},
				tokenstatus: '',
				userinfo: {},
				userid: '',
				background: 'linear-gradient(179deg, #E77232 0%, #EEB051 100%)',
				stylecolor: '#ffffff',
				show: false,
				tixianprice: ''
			}
		},
		onLoad(e) {
			this.shareconfig()

			this.tokenexpir()
			// #ifdef H5
			this.userinfoget()
			// #endif
			this.userid = e.userid
			this.cookiee()

		},
		onShow() {
			this.cookiee()
			uni.$on('tokenstatus', (data) => {
				this.tokenstatus = data
				this.userinfoget()
			})
		},
		onUnload() {
			uni.$off('tokenstatus');

		},
		onShareAppMessage(res) {
		 return {
				title: this.configg.title,
				path: this.configg.path + this.userinfo.userinfo.id,
				bgImgUrl: this.configg.bgImgUrl_image,
				content: this.configg.content,
				desc: this.configg.ddesc
			}
		},
		methods: {
			yaoqinghaoyou() {
				let opt = {
					url: '/user/invcount',
				}
				this.$request(opt).then(res => {
					// console.log(res)
				})
			},
			jianglijiludingyue() {
				let opt = {
					url: '/index/dingyue?biaoshi=reward'
				}
				this.$request(opt).then(res => {
					var dingyueid = res.data
					my.requestSubscribeMessage({
						//权益领取提醒
						entityIds: dingyueid,
						complete: (res) => {
							this.jianglijilu()
						}
					});
				})

			},
			yaoqingjiludingyue() {
				let opt = {
					url: '/index/dingyue?biaoshi=rewardji'
				}
				this.$request(opt).then(res => {
					var dingyueid = res.data
					my.requestSubscribeMessage({
						//好友完成租机通知
						entityIds: dingyueid,
						complete: (res) => {
							this.yaoqingjilu()
						}
					});
				})
			},
			tixianchu() {
				this.show = true
			},
			Confirm() {
				if (this.tixianprice == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入提现金额~'
					})
				} else if (this.tixianprice > this.userinfo.userinfo.money) {
					uni.showToast({
						icon: 'none',
						title: '提现金额超出~'
					})
				} else if (this.tixianprice <= 0) {
					uni.showToast({
						icon: 'none',
						title: '提现金额不合法~'
					})
				} else {
					let opt = {
						url: '/user/invitationwithdrawal',
						data: {
							price: this.tixianprice,
						}
					}
					this.$request(opt).then(res => {
						// 打印调用成功回调
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
						this.show = false
						this.userinfoget()
					})
				}
			},
			close() {
				this.show = false
			},
			decryptPhoneNumber(res) {

				my.getPhoneNumber({
					success: (res) => {
						var duixiang = JSON.parse(res.response)
						let opt = {
							url: "/index/mobile?mobile=" + encodeURIComponent(duixiang.response),
						}
						this.$request(opt).then(res => {
							if (res.code == '1') {
						  this.show = true
							} else {
								this.$refs.uToast.show({
									message: '授权失败',
									type: 'error'
								})
							}

						})
					},
					fail: (res) => {
						this.tijiaorenzheng = false
						this.$refs.uToast.show({
							message: '授权失败',
							type: 'error'
						})
					},
				});
			},
			qingdenglu() {
				uni.showToast({
					icon: 'none',
					title: '请先登录'
				})
			},
			jianglijilu() {
				//奖励纪录
				if (this.tokenstatus == '') {
					uni.showToast({
						icon: 'none',
						title: '请先登录'
					})
				} else {
					uni.navigateTo({
						url: './reward'
					})
				}
			},
			yaoqingjilu() {
				//邀请记录
				if (this.tokenstatus == '') {
					uni.showToast({
						icon: 'none',
						title: '请先登录'
					})
				} else {
					uni.navigateTo({
						url: './record'
					})
				}
			},
			huodongguize() {
				uni.navigateTo({
					url: './details?id=' + this.configg.id
				})
			},
			cookiee() {
				if (this.userid) {
					uni.setStorage({
						key: 'yaouserid',
						data: this.userid,
					});
					let opt = {
						url: '/index/yaoqing',
						data: {
							yaouserid: this.userid,
						}

					}
					this.$request(opt).then(res => {
						// 打印调用成功回调

					})
				} else {

					uni.setStorage({
						key: 'yaouserid',
						data: '0',
					});
				}
			},
			shareconfig() {
				let opt = {
					url: '/index/invitation'
				}
				this.$request(opt).then(res => {
					this.configg = res.data
					uni.setNavigationBarTitle({
						title: this.configg.name
					})
				})
			},
			userinfoget() {

				let opt = {
					url: '/user/userinfo',
				}
				this.$request(opt).then(res => {
					this.userinfo = res.data

				})
			},
			// 检测token是否过期
			tokenexpir() {
				this.tokenstatus = uni.getStorageSync('token')
				if (this.tokenstatus != '') {
					let opt = {
						url: '/index/tokenexpirtime',
						data: {
							token: this.tokenstatus
						}
					}
					this.$request(opt).then(res => {
						if (res.data == '0') {
							uni.removeStorageSync('token');
							this.tokenstatus = ''
						} else {
							this.userinfoget()
						}
					})
				}

			},


		}
	}
</script>

<style>
	.inpuuu {
		text-align: center;
	}

	.widthdrow {
		border-radius: 20px;
		padding: 5px;
		display: flex;
		background-color: #f0f8ff40;
		color: #fff;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		font-size: 14px;
		margin-bottom: 10px;
	}

	.widthdrowtext {
		font-size: 12px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		/* background: linear-gradient(179deg, #e76b2f 0%, #f0c65c 100%); */
		color: #fff;
		padding: 10px;
		border-radius: 0 0 20px 20px;
	}

	.fourthree {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 15px;
	}

	.da {
		background: #ffffffcf;
		margin: 10px;
		border-radius: 10px;
	}

	.four {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
	}

	.buy-ok {
		width: 626rpx;
		height: 80rpx;
		border-radius: 20rpx;
		text-align: center;
		line-height: 80rpx;
		color: #fff;
		margin-top: 27rpx;
	}

	.tixiantext {
		/* background: linear-gradient(179deg, #e76b2f 0%, #f0c65c 100%); */
		padding: 2px 15px;
		border-radius: 0 10px;
	}

	.yaoqingtishi {
		background-color: #f0f8ff40;
		padding-bottom: 10px;
		border-radius: 10px;
	}

	.huodonganniu {
		position: absolute;
		z-index: 9;
		margin-top: 5%;
		display: flex;
		font-size: 16px;
		justify-content: space-between;
		flex-direction: column;
		width: 100%;
		align-items: flex-end;
	}

	.huodongbu {
		margin-bottom: 15px;
		overflow: hidden;
		color: #fff;
		border-radius: 10px 0 0 10px;
		padding: 3px 10px;
		font-size: 12px;
		/* 		box-shadow: 1px 2px 0px 0px #fdf8e5; */
	}

	.tititle {
		padding: 13px 5px 7px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		font-size: 16px;
	}

	.form-box {
		/* height: 842rpx; */
		padding: 15rpx 12rpx 24rpx;
	}

	.title {
		color: #ffaa00;
		padding: 36rpx 0;
		font-size: 36rpx;
		text-align: center;
	}

	.form {
		background-color: #fff;
		padding: 34rpx 34rpx 0 34rpx;
		border-radius: 12rpx;
	}

	.input-btn {
		height: 76rpx;
		line-height: 76rpx;
		font-size: 32rpx;
		border-radius: 10rpx;
		text-align: center;
		margin-top: 40rpx;
		background: linear-gradient(179deg, rgb(231, 114, 50) 0%, rgb(238, 176, 81) 100%);
		color: #fff;
	}

	.form-li {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		border: 1px solid #d1d1d1;
		width: 100%;
		height: 35px;
		border-radius: 5px;
		margin-bottom: 15px;
		flex-wrap: nowrap;
		flex-direction: row;
		align-content: center;
		/* padding-left: 12px; */
	}

	.li-label {
		width: 170rpx;
		padding-left: 18rpx;
		font-size: 32rpx;
		color: #ffaa00;
	}

	.li-input {
		width: 100%;
	}
</style>
