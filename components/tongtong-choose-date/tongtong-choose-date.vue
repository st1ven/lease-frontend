<template>
	<view>
		<template v-if="layout === 'horizontal'">
			<view class="flex justify-between date-content horizontal">
				<view class="flex switch-date-btn">
					<view v-if="showDate" :class="mode === 'day' ? 'active' : ''" @tap="changeDateType('day', true)">按天</view>
					<view v-if="showMonth" :class="mode === 'month' ? 'active' : ''" @tap="changeDateType('month', true)">按月</view>
					<view v-if="showYear" :class="mode === 'year' ? 'active' : ''" @tap="changeDateType('year', true)">按年</view>
				</view>
				<view class="common-datetime flex justify-center" @tap="toggleTab">
					{{dateTime}}
					<view class="iconfont icon-right"></view>
				</view>
			</view>
		</template>
		<template v-if="layout === 'topLayout'">
			<view class="flex switch-date-btn topLayout">
				<view v-if="showDate" :class="mode === 'day' ? 'active' : ''" @tap="changeDateType('day', true)">日</view>
				<view v-if="showMonth" :class="mode === 'month' ? 'active' : ''" @tap="changeDateType('month', true)">月</view>
				<view v-if="showYear" :class="mode === 'year' ? 'active' : ''" @tap="changeDateType('year', true)">年</view>
			</view>
			<view class="flex justify-between date-content">
				<view>{{title}}</view>
				<view class="common-datetime flex justify-center text-gray" @tap="toggleTab">
					{{dateTime}}
					<view class="iconfont icon-right"></view>
				</view>
			</view>
		</template>
		<w-picker :visible.sync="dayVisible" mode="date" fields="day" :current="true" @confirm="onConfirm" @cancel="onCancel"
		 :disabledAfter="false" ref="day" :themeColor="themeColor"></w-picker>
		<w-picker :visible.sync="monthVisible" mode="date" fields="month" :current="true" @confirm="onConfirm" @cancel="onCancel"
		 :disabledAfter="false" ref="month" :themeColor="themeColor"></w-picker>
		<w-picker :visible.sync="yearVisible" mode="date" fields="year" :current="true" @confirm="onConfirm" @cancel="onCancel"
		 ref="year" :disabledAfter="false" :themeColor="themeColor"></w-picker>
	</view>
</template>

<script>
	Date.prototype.Format = function(fmt) { //author: meizz
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
				k]).substr(("" + o[k]).length)));
		return fmt;
	}
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		/**********
		 * props参数说明
		 * @mode：day:默认选择天 month:默认选择月 year:默认选择年 | 必填
		 * @showDate 是否显示天 | 选填
		 * @showMonth 是否显示月 | 选填
		 * @showYear 是否显示年 | 选填
		 * @layout 布局排版，目前开发两种布局 默认horizontal （horizontal、topLayout） | 选填
		 * @title 当布局为topLayout时可选标题名称参数 | 选填
		 ***********/
		props: {
			mode: {
				required: true,
				type: String,
				default: 'day',

			},
			showDate: {
				type: Boolean,
				default: true,
			},
			showMonth: {
				type: Boolean,
				default: true,
			},
			showYear: {
				type: Boolean,
				default: true,
			},
			layout: {
				type: String,
				default: 'horizontal', //布局 默认horizontal topLayout 
			},
			title: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				dateTime: new Date().Format('yyyy-MM-dd'),
				dayVisible: false,
				monthVisible: false,
				yearVisible: false,
				themeColor: getApp().globalData.sysConfig ? getApp().globalData.sysConfig.theme : '#1890FF',
			}
		},
		mounted() {
			this.initDateTime();

			uni.$on('tabBarSwitched', this.tabBarSwitched);
		},
		destroyed() {
			uni.$off('tabBarSwitched', this.tabBarSwitched);
		},
		//注册自定义组件
		components: {
			wPicker
		},
		methods: {
			tabBarSwitched() {
				this.dayVisible = false;
				this.monthVisible = false;
				this.yearVisible = false;
				this.onCancel();
			},
			//初始化时间
			initDateTime() {
				switch (this.mode) {
					case "day":
						this.dateTime = new Date().Format('yyyy-MM-dd');
						break;
					case "month":
						this.dateTime = new Date().Format('yyyy-MM');
						break;
					case "year":
						this.dateTime = new Date().Format('yyyy');
						break;
				}
			},

			//根据年月日更换对应的w-picker
			toggleTab() {
				this.dayVisible = false;
				this.monthVisible = false;
				this.yearVisible = false;
				this[this.mode + 'Visible'] = true;
				//传给父组件事件
				this.$emit("show");
			},
			//取消
			onCancel(val) {
				//传给父组件事件
				setTimeout(() => {
					this.$emit("hide");
				}, 150);
			},
			//选择日期后确认
			onConfirm(val) {
				this.dateTime = val.result;
				//传给父组件值
				this.$emit("changeDateFun", {
					dateTime: val.result,
					mode: this.mode,
					type: this.getType(this.mode),
					time: this.getTime(this.mode, val.result)
				});
				//传给父组件事件
				setTimeout(() => {
					this.$emit("hide");
				}, 150);
			},
			//更换年月日
			changeDateType(index, callback) {
				switch (index) {
					case "day":
						this.dateTime = new Date().Format('yyyy-MM-dd');
						break;
					case "month":
						this.dateTime = new Date().Format('yyyy-MM');
						break;
					case "year":
						this.dateTime = new Date().Format('yyyy');
						break;
				}
				if (callback) {
					//传给父组件值
					this.$emit("changeDateFun", {
						dateTime: this.dateTime,
						mode: index,
						type: this.getType(index),
						time: this.getTime(index, this.dateTime)
					});
				}
			},

			getType(mode) {
				if (mode == 'day') {
					return 1;
				} else if (mode == 'month') {
					return 2;
				} else if (mode == 'year') {
					return 3;
				}
			},
			getTime(mode, dateTime) {
				if (mode == 'day') {
					return dateTime;
				} else if (mode == 'month') {
					return dateTime + '-01';
				} else if (mode == 'year') {
					return dateTime + '-01-01';
				}
			},
			setModeAndTime(mode, time) {
				if (mode == 'day') {
					this.dateTime = time;
				} else if (mode == 'month') {
					this.dateTime = time.substr(0, 7);
				} else if (mode == 'year') {
					this.dateTime = time.substr(0, 4);;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@font-face {
		font-family: "iconfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAKIAAsAAAAABkAAAAI9AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcApMXwE2AiQDCAsGAAQgBYRtBy8bhAXIDiUJD4mAwwJAQDz8t/Z63+xsgFnlRAJqQBsFpCLUjwxXNUpVV5lq1tV//5cubVlTuDzPmEt1qTGTf/9u5wLborBgNM9XWFBgQbj6xL3TP4E+yKgHlONeNNakSV1AXRxIAe2NUWQllHHD2AUv8DGBBiNmZHbPboowJLNXBeLemiYMFUKyzLJ1Qk3DwSy+6FeXntIXPqLvxz/LMURSFuy6g8vTDhz8HHbyikq1ohIQwiCg4yUKLAGZOGlM7ckJxuU0pPpMgGNVBz+Hq9XAKY5qE+yvsyubwBCUP5PCWylAgscaqQPom3QJ0XH31k0fla7O+/PXx17D/oTP85+hi7390lQJFNBUd7q0YGdK0104wD9L39KvQPD5/NKrT67+H2rM4Md+71pkzYZ5qNuHO/gXioFd2VDZjpQ1RWN/0nGOhgYNqMK+Dv9Tzd0nzoU63RM8tYYzFOpMkZldQqnRCmrU2UCDRefHG3USOZHrseAVILT5RNLiOwptvsnM/qHUo4cabZFDg7PovLDRTNiRHaGmUgdbj2jbUciuS0fi6jyZW78peVXEl0lSG8XFuYVy9pxCkiW2pHdmSZWRJQrwDDxHvh9hLJFLbZ1zVOOt+XluetNcOwpgxA5BmhTpQC2PkNUWCXEwWI1UPp9HjFu+JunoqMuWEZGy46NFcxYGkOf6cFDHo7ySumMsUYohJiIBdAbmEZ8vguLmeS7SpuY4ExKxLfNOLx6qn9veGPzdIWhgW1I4MwrlgzWOAgAA') format('woff2');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-right:before {
		content: "\e609";
	}
	// 注：直接通过var（）来动态修改主题色，可省略组件进行传参
	$theme: #1890FF;
	//$theme: var(--theme);

	.flex {
		display: flex;
	}

	.justify-between {
		justify-content: space-between;
	}

	.date-content {
		margin: 20rpx 0;
		line-height: 70rpx;
		font-size: 26rpx;

		.iconfont {
			font-size: 32rpx;
		}
	}

	.common-datetime {
		color: #222222;
	}

	.switch-date-btn {
		width: 390rpx;
		border: 1rpx solid #CECECE;
		border-radius: 30rpx;
		margin: 0 auto;
	}

	.common-datetime,
	.switch-date-btn view {
		line-height: 60rpx;
	}

	.common-datetime>view {
		font-size: 20rpx;
	}

	.switch-date-btn view {
		padding: 2rpx 26rpx;
		border-radius: 30rpx;
		width: 130rpx;
		font-size: 32rpx;
		text-align: center;
	}

	.switch-date-btn>view.active {
		color: #FFFFFF;
		background: $theme;
	}

	//horizontal样式重置
	.horizontal {
		.common-datetime {
			line-height: 48rpx;
		}

		.switch-date-btn {
			margin: 0;
			border: none;

			&>view {
				line-height: 48rpx;
			}
		}

		.common-datetime {
			&>view {
				font-size: 24rpx;
			}

			.iconfont {
				font-size: 32rpx;
			}
		}

		.switch-date-btn {
			&>view {
				margin-right: 10rpx;
				padding: 2rpx 26rpx;
				border-radius: 30rpx;
				font-size: 24rpx;
			}
		}
	}
</style>
