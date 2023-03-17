<template>
	<view>
		<view class="notice-box">
			<u-notice-bar direction="column" :text="['请如实填写，资料填写越完整，通过率越高']"></u-notice-bar>
		</view>
		<view class="profile-box">
			<u-skeleton :loading="loading" rows="2"></u-skeleton>
			<view class="form" v-if="!loading">
				<view class="form-li" @click="show_zaizu = true">
					<text style="min-width: 194rpx;">在租设备台数</text>
					<text v-if="profile.zaizu" style="color: #303133; width: 100%;">{{profile.zaizu}}</text>
					<text v-else style="color: #c0c4cc; width: 100%;">请选择</text>
					<u-icon slot="right" name="arrow-right" color="#9FA3B0" size="24rpx"></u-icon>
					<u-picker title="请选择在租设备台数" :show="show_zaizu" :columns="zaizu_map"
						@confirm="(e) => confirm(e, 'zaizu')" @cancel="cancel('show_zaizu')" visibleItemCount="8"
						cancelColor="#414960" confirmColor="#ffaa00">
					</u-picker>
				</view>
				<view v-if="profile.zaizu">
					<view class="form-li" @click="show_zulinshijian = true" v-if="profile.zaizu !== '无'">
						<text style="min-width: 194rpx;">最早租赁时间</text>
						<text v-if="profile.zulinshijian" style="color: #303133; width: 100%;">{{profile.zulinshijian}}</text>
						<text v-else style="color: #c0c4cc; width: 100%;">请选择</text>
						<u-icon slot="right" name="arrow-right" color="#9FA3B0" size="24rpx"></u-icon>
						<u-picker title="请选择最早租赁时间" :show="show_zulinshijian" :columns="zulinshijian_map"
							@confirm="(e) => confirm(e, 'zulinshijian')" @cancel="cancel('show_v')" visibleItemCount="8"
							cancelColor="#414960" confirmColor="#ffaa00">
						</u-picker>
					</view>
				</view>
			</view>
		</view>
		<view class="profile-box">
			<u-skeleton :loading="loading" rows="6"></u-skeleton>
			<view class="form" v-if="!loading">
				<view class="form-li">
					<text style="min-width: 176rpx;">征信状况</text>
					<u-radio-group activeColor="#ffaa00" v-model="profile.zhengxin" placement="row">
						<u-radio :customStyle="{marginRight: '48rpx'}" labelSize="28rpx"
							v-for="(item, index) in zhengxin_map" :key="index" :label="item.name" :name="item.name"
							@change="(e) => radioChange(e, 'zhengxin')">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="form-li" @click="show_zhima = true">
					<text style="min-width: 194rpx;">芝麻信用分</text>
					<text v-if="profile.zhima" style="color: #303133; width: 100%;">{{profile.zhima}}</text>
					<text v-else style="color: #c0c4cc; width: 100%;">请选择</text>
					<u-icon slot="right" name="arrow-right" color="#9FA3B0" size="24rpx"></u-icon>
					<u-picker title="请选择芝麻信用分区间" :show="show_zhima" :columns="zhima_map"
						@confirm="(e) => confirm(e, 'zhima')" @cancel="cancel('show_zhima')" visibleItemCount="8"
						cancelColor="#414960" confirmColor="#ffaa00">
					</u-picker>
				</view>
				<view class="form-li" @click="show_gongjijin = true">
					<text style="min-width: 194rpx;">公积金余额</text>
					<text v-if="profile.gongjijin" style="color: #303133; width: 100%;">{{profile.gongjijin}}</text>
					<text v-else style="color: #c0c4cc; width: 100%;">请选择</text>
					<u-icon slot="right" name="arrow-right" color="#9FA3B0" size="24rpx"></u-icon>
					<u-picker title="请选择公积金余额区间" :show="show_gongjijin" :columns="gongjijin_map"
						@confirm="(e) => confirm(e, 'gongjijin')" @cancel="cancel('show_v')" visibleItemCount="8"
						cancelColor="#414960" confirmColor="#ffaa00">
					</u-picker>
				</view>
				<view class="form-li" @click="show_huabei = true">
					<text style="min-width: 194rpx;">花呗额度</text>
					<text v-if="profile.huabei" style="color: #303133; width: 100%;">{{profile.huabei}}</text>
					<text v-else style="color: #c0c4cc; width: 100%;">请选择</text>
					<u-icon slot="right" name="arrow-right" color="#9FA3B0" size="24rpx"></u-icon>
					<u-picker title="请选择花呗额度区间" :show="show_huabei" :columns="huabei_map"
						@confirm="(e) => confirm(e, 'huabei')" @cancel="cancel('show_huabei')" visibleItemCount="8"
						cancelColor="#414960" confirmColor="#ffaa00">
					</u-picker>
				</view>
				<view class="form-li" @click="show_xinyongka = true">
					<text style="min-width: 194rpx;">信用卡额度</text>
					<text v-if="profile.xinyongka" style="color: #303133; width: 100%;">{{profile.xinyongka}}</text>
					<text v-else style="color: #c0c4cc; width: 100%;">请选择</text>
					<u-icon slot="right" name="arrow-right" color="#9FA3B0" size="24rpx"></u-icon>
					<u-picker title="请选择信用卡额度区间" :show="show_xinyongka" :columns="xinyongka_map"
						@confirm="(e) => confirm(e, 'xinyongka')" @cancel="cancel('show_xinyongka')" visibleItemCount="8"
						cancelColor="#414960" confirmColor="#ffaa00">
					</u-picker>
				</view>
				<view class="form-li" @click="show_yinhang = true">
					<text style="min-width: 194rpx;">银行贷款额度</text>
					<text v-if="profile.yinhang" style="color: #303133; width: 100%;">{{profile.yinhang}}</text>
					<text v-else style="color: #c0c4cc; width: 100%;">请选择</text>
					<u-icon slot="right" name="arrow-right" color="#9FA3B0" size="24rpx"></u-icon>
					<u-picker title="请选择银行贷款额度区间" :show="show_yinhang" :columns="yinhang_map"
						@confirm="(e) => confirm(e, 'yinhang')" @cancel="cancel('show_yinhang')" visibleItemCount="8"
						cancelColor="#414960" confirmColor="#ffaa00">
					</u-picker>
				</view>
			</view>
		</view>
		<view class="profile-box">
			<u-skeleton :loading="loading" rows="4"></u-skeleton>
			<view class="form" v-if="!loading">
				<view class="form-li">
					<text>工作单位</text>
					<u-input fontSize="28rpx" placeholder="请输入工作单位" v-model="profile.company" border="none"></u-input>
				</view>
				<view class="form-li">
					<text>职业状况</text>
					<u-input fontSize="28rpx" placeholder="请输入当前职业与职位" v-model="profile.occupation" border="none"></u-input>
				</view>
				<view class="form-li" style="height: auto; margin-top: 16rpx;">
					<text>收入方式</text>
					<u-radio-group activeColor="#ffaa00" v-model="profile.income_type" placement="column">
						<u-radio :customStyle="{marginBottom: '16rpx'}" labelSize="28rpx"
							v-for="(item, index) in income_type_map" :key="index" :label="item.name" :name="item.name"
							@change="(e) => radioChange(e, 'income_type')">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="form-li" @click="show_income = true">
					<text style="min-width: 130rpx;">收入状况</text>
					<text v-if="profile.income" style="color: #303133; width: 100%;">{{profile.income}}</text>
					<text v-else style="color: #c0c4cc; width: 100%;">请选择</text>
					<u-icon slot="right" name="arrow-right" color="#9FA3B0" size="24rpx"></u-icon>
					<u-picker title="请选择月收入状况" :show="show_income" :columns="income_map"
						@confirm="(e) => confirm(e, 'income')" @cancel="cancel('show_income')" visibleItemCount="8"
						cancelColor="#414960" confirmColor="#ffaa00">
					</u-picker>
				</view>
			</view>
		</view>
		<view class="profile-box">
			<u-skeleton :loading="loading" rows="3"></u-skeleton>
			<view class="form" v-if="!loading">
				<view class="form-li">
					<text>婚姻状况</text>
					<u-radio-group activeColor="#ffaa00" v-model="profile.marriage" placement="row">
						<u-radio :customStyle="{marginRight: '48rpx'}" labelSize="28rpx"
							v-for="(item, index) in marriage_map" :key="index" :label="item.name" :name="item.name"
							@change="(e) => radioChange(e, 'marriage')">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="form-li">
					<text>车贷状况</text>
					<u-radio-group activeColor="#ffaa00" v-model="profile.car" placement="row">
						<u-radio :customStyle="{marginRight: '48rpx'}" labelSize="28rpx"
							v-for="(item, index) in car_map" :key="index" :label="item.name" :name="item.name"
							@change="(e) => radioChange(e, 'car')">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="form-li" style="height: auto; margin-top: 16rpx;">
					<text>住所性质</text>
					<u-radio-group activeColor="#ffaa00" v-model="profile.accommodation" placement="column">
						<u-radio :customStyle="{marginBottom: '16rpx'}" labelSize="28rpx"
							v-for="(item, index) in accommodation_map" :key="index" :label="item.name" :name="item.name"
							@change="(e) => radioChange(e, 'accommodation')">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="form-li" v-if="profile.accommodation == '自购房'">
					<text>房贷状况</text>
					<u-radio-group activeColor="#ffaa00" v-model="profile.house" placement="row">
						<u-radio :customStyle="{marginRight: '48rpx'}" labelSize="28rpx"
							v-for="(item, index) in house_map" :key="index" :label="item.name" :name="item.name"
							@change="(e) => radioChange(e, 'house')">
						</u-radio>
					</u-radio-group>
				</view>
			</view>
		</view>
		<view class="input-btn" @click="saveProfile()">提交资料</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: true,
				show_zhima: false,
				show_education: false,
				show_income: false,
				show_gongjijin: false,
				show_huabei: false,
				show_xinyongka: false,
				show_yinhang: false,
				show_zaizu: false,
				show_zulinshijian: false,
				zaizu_map: [
					['无', '1-2台', '3-5台', '5-7台', '7-10台', '10台以上']
				],
				zulinshijian_map: [
					['1个月内', '1-3个月', '3-6个月', '6-12个月', '12个月以上']
				],
				gongjijin_map: [
					['无公积金', '1万元以下', '1-2万元', '2-3万元', '3-5万元', '5万元以上']
				],
				huabei_map: [
					['无花呗额度', '1000元以下', '1000-3000元', '3000-5000元', '5000-10000元', '1万元以上']
				],
				xinyongka_map: [
					['无信用卡额度', '5000元以下', '5000-10000元', '1-2万元', '2-5万元', '5万元以上']
				],
				yinhang_map: [
					['无银行贷款额度', '5000元以下', '5000-10000元', '1-2万元', '2-5万元', '5万元以上']
				],
				zhima_map: [
					['350-550分', '550-600分', '600-650分', '650-700分', '700-950分']
				],
				income_map: [
					['1000元以下', '1000-3000元', '3000-5000元', '5000-7000元', '7000-9000元', '9000-10000元', '1-2万元',
						'2-3万元', '3万元以上'
					]
				],
				zhengxin_map: [{
						name: '良好',
					},
					{
						name: '违约',
					},
					{
						name: '黑户',
					}
				],
				marriage_map: [{
						name: '未婚',
					},
					{
						name: '已婚',
					},
					{
						name: '离异',
					}
				],
				income_type_map: [{
						name: '银行转账',
					},
					{
						name: '支付宝/微信',
					},
					{
						name: '现金收款',
					}
				],
				car_map: [{
						name: '无车贷',
					},
					{
						name: '有车贷',
					}
				],
				accommodation_map: [{
						name: '租房',
					},
					{
						name: '自购房',
					},
					{
						name: '与父母同住',
					},
					{
						name: '宿舍',
					}
				],
				house_map: [{
						name: '无房贷',
					},
					{
						name: '有房贷',
					}
				],
				profile: {
					zaizu: '',
					zulinshijian: '',
					zhengxin: '',
					zhima: '',
					gongjijin: '',
					huabei: '',
					xinyongka: '',
					yinhang: '',
					company: '',
					occupation: '',
					income_type: '',
					income: '',
					marriage: '',
					car: '',
					accommodation: '',
					house: ''
				}
			}
		},
		onLoad() {
			this.init()
		},
		onShow() {},
		methods: {
			init() {
				let opt = {
					url: '/profile',
				}
				this.$request(opt).then(res => {
					this.loading = false;
					this.profile = res.data || {};
				})
			},
			confirm(e, action) {
				this.profile[action] = e.value[0]
				this.cancel('show_' + action)
			},
			cancel(visible) {
				this[visible] = false
			},
			radioChange(e, action) {
				if (e == '租房' || e == '宿舍') {
					this.$set(this.profile, 'house', '')
				}
				this.$set(this.profile, action, e)
			},
			saveProfile() {
				let opt = {
					url: '/profile',
					data: this.profile,
					header: "application/x-www-form-urlencoded;charset=utf-8",
					method: "POST",
				}
				uni.showLoading({
					title: "加载中..."
				})
				this.$request(opt).then(res => {
					uni.showToast({
						icon: 'success',
						title: res.msg,
						duration: 3000,
						complete() {
							uni.navigateBack({
								delta: 1
							});
						}
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.input-btn {
		margin: 30rpx 12px 60rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 20rpx;
		color: #fff;
		background: #ffaa00;
	}

	/deep/ .u-textarea__count {
		display: none;
	}

	.profile-box {
		padding: 10rpx 30rpx;
		margin: 30rpx 12px;
		border-radius: 20rpx;
		background: #fff;

		.form {
			.form-li {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				border-bottom: 1px solid #F1F2F5;
				height: 40px;

				text {
					color: #414960;
					margin-right: 16rpx;
				}

				/deep/ .u-radio-group {
					padding-left: 9px;
				}
			}

			.form-li:last-child {
				border-bottom: unset;
			}
		}

	}
</style>
