<template>
	<!-- 续租 -->
	<view class="help-page">
		<view class="help-header">
			<view class="title">嗨，{{greeting_text}}</view>
			<view class="desc">您是否遇到了以下问题？</view>
		</view>
		<view class="help-tab">
			<u-tabs :list="tableList" @click="click" :scrollable="false" lineColor="#ffaa00"></u-tabs>
		</view>
		<view class="help-ul">
			<view v-if="loading" style="padding-top: 20px;">
				<u-loading-icon color="#ffaa00" text="正在加载..." size="16" :vertical="true" textSize="14">
				</u-loading-icon>
			</view>
			<u-collapse accordion :border="true" :isLink="true">
				<view v-for="(item,index) in ulList">
					<u-collapse-item :border="false" :isLink="true">
						<text slot="title" class="u-page__item__title__slot-title">{{item.title}}</text>
						<text class="u-collapse-content">{{item.content}}</text>
						<text slot="right-icon" class="u-cell__right-icon-wrap">
							<u-icon name="arrow-right" color="#61687C" size="30rpx"></u-icon>
						</text>
					</u-collapse-item>
				</view>
			</u-collapse>
		</view>
		<view class="help-footer">
			<view class="help-button">
				<image style="width: 40rpx;" src="../../static/image/service.png" mode="widthFix"></image>
				平台在线客服
				<contact-button tnt-inst-id="x8o_S4gv" scene="SCE01231099" icon="../../static/image/online-button.png" color="transparent" />
			</view>
			<view class="help-button" @click="phoneCall">
				<image style="width: 40rpx;" src="../../static/image/phonecall.png" mode="widthFix"></image>
				平台热线客服
			</view>
		</view>
		<view class="help-time">
			服务时间：周一至周五 9:30-18:30
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: true,
				greeting_text: '',
				tableList: [],
				ulList: [],
				allList: [],
				iphoneNum: ''
			}
		},
		onLoad() {
			this.greeting()
		},
		onShow() {
			this.init()
			this.contactHttp()
		},
		methods: {
			click(data) {
				this.ulList = this.allList[data.index].list
			},
			init() {
				let opt = {
					url: "/faq/index",
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.allList = res.data
					this.tableList = []
					res.data.forEach(item => {
						this.tableList.push({
							name: item.name
						})
					})
					this.ulList = res.data[0].list
					this.loading = false
				})
			},
			greeting() {
				const now = new Date();
				const hour = now.getHours();
				switch (true) {
					case hour < 8:
						this.greeting_text = '早上好';
						break;
					case hour < 12:
						this.greeting_text = '上午好';
						break;
					case hour < 14:
						this.greeting_text = '中午好';
						break;
					case hour < 18:
						this.greeting_text = '下午好';
						break;
					case hour < 24:
						this.greeting_text = '晚上好';
						break;
					default:
						this.greeting_text = "您好";
						break;
				}
			},
			phoneCall() {
				uni.makePhoneCall({
					phoneNumber: this.iphoneNum
				});
			},
			contactHttp() {
				let opt = {
					url: "/contact"
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.iphoneNum = res.data.admin_phone
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ contact-button {
		position: absolute;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0;
	}

	/deep/ .u-cell__body {
		padding: 14px 12px;
	}

	/deep/ .u-collapse-item__content__text {
		line-height: 22px;
	}

	/deep/ .u-line {
		border-color: #F1F2F5 !important;
	}

	.help-page {
		background-color: #FFAA00;
		// height: 100vh;

		.help-header {
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			padding: 0 12px 24px 12px;
			color: #fff;
			height: 13vh;
			background: url('../../static/image/honeycomb.png');
			background-size: 50%;
			background-repeat: no-repeat;
			background-position: 100% 0;

			.title {
				font-size: 48rpx;
				font-weight: bold;
				padding-bottom: 12rpx;
			}

			.desc {
				font-size: 36rpx;
			}
		}

		.help-tab {
			height: 98rpx;
			width: 100%;
			border-radius: 12px 12px 0 0;
			background: #fff;
		}

		.help-ul {
			margin-top: -1px;
			padding: 0 28rpx;
			// height: calc(100vh - 98rpx);
			background: #fff;
		}

		.help-footer {
			display: flex;
			background: #fff;
			padding: 64rpx 12px 24rpx 12px;
			justify-content: space-between;
			gap: 12px;
			margin: -1px 0;
		}

		.help-button {
			position: relative;
			display: flex;
			gap: 16rpx;
			justify-content: center;
			align-items: center;
			width: 100%;
			padding: 30rpx 0;
			font-size: 16px;
			font-weight: bold;
			color: #171B25;
			background: #F1F2F5;
			border-radius: 10px;
		}

		.help-time {
			color: #9FA3B0;
			font-size: 12px;
			text-align: center;
			background: #fff;
			padding: 12rpx 0 64rpx 0;
		}
	}
</style>
