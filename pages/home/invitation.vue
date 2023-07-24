<template>
	<view class="content" style="background-color: #f6f6fb;">
		
		<choose-date ref="chooseDate" layout="horizontal" :mode="mode1" @changeDateFun="changeDateFun1" @show="onDateViewShow" @hide="onDateViewHide" />
		<view class="box">
			<view class="minbox">
				<text class="num">{{list['countnum'] || 0}}次</text>
				<text class="explain">链接访问次数</text>
			</view>
			<view class="minbox" @click="qiuqiu">
				<text class="num">{{list['count'] || 0}}人</text>
				<text class="explain">注册用户数</text>
			</view>
			<view class="minbox">
				<text class="num">{{list['ordernumyi'] || 0}}单</text>
				<text class="explain">总订单</text>
			</view>
			<view class="minbox">
				<text class="num">{{list['ordernumbo'] || 0}}单</text>
				<text class="explain">审核驳回数</text>
			</view>
			<view class="minbox">
				<text class="num">{{list['ordernumdai'] || 0}}单</text>
				<text class="explain">审核通过代发货</text>
			</view>
			<view class="minbox">
				<text class="num">{{list['ordernumzu'] || 0}}单</text>
				<text class="explain">已发货/租赁中</text>
			</view>
		</view>
		<view class="" v-if="status!=1">
			<u-loading-icon></u-loading-icon>
		</view>
		<view v-if="list['array']">
			<view class="explain order" style="font-size: 14px;margin-bottom: 10px;">{{xuantime}}订单通过总金额￥{{list['orderprice'] || 0}}元</view>
			
			<view class="center-box" v-for="(item,index) in list['array']" :key="index" >			
				<u-image mode="aspectFit" width="70rpx" height="70rpx" :src="item.goods_image" radius="5px"/>
				<view class="desc-box" style="width: 100%;">
					<view class="explaintitle">
						<text>{{item.goods_title}}</text>
						<text style="font-size: 12px;
		font-weight: bold;
		color: #FF5B56;">￥{{item.goods_amount}}</text>
					</view>
					<view class="explaintitle">
						<text style="font-size: 12px;font-weight:100;color: #2a2a2a;">套餐:{{item.goods_sku_text}}</text>
						<text style="font-size: 10px;font-weight: 0;color: #2a2a2a;">{{item.createtime}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/*******
	 * 
	 *******/
	import chooseDate from "@/components/tongtong-choose-date/tongtong-choose-date.vue";
	export default {
		data() {
			return {
				mode1: 'day',
				type1: 1,
				time1: new Date().Format('yyyy-MM-dd'),
				time:'',
				list:{},
				xuantime:'',
				status:0,
			}
		},
		components: {
			chooseDate,
		},
		onLoad() {
			this.qiuqiu()
		},
		methods: {
			// tuiguangurl(){
			// 	let opt = {
			// 		url: "/tuiguangurl",
			// 	}
			// 	this.$request(opt).then(res => {
			// 		console.log(res)
			// 		// this.list = res.data
			// 	})
			// },
			qiuqiu(){
				this.status = 0
				let opt = {
					url: "/shuju",
				}
				this.$request(opt).then(res => {
					this.list = res.data
					this.status = 1
				})
			},
			//修改日期后回调
			changeDateFun1(obj) {
				this.mode1 = obj.mode;
				this.type1 = obj.type;
				this.time1 = obj.time;
				this.xuantime = obj.dateTime
				this.status = 0;
				console.log(this.status)
				// console.log('1' + JSON.stringify(obj));
				let opt = {
					url: "/shuju",
					data: {
						mode: obj.mode,
						type: obj.type,
						time: obj.time
					}
				}
				this.$request(opt).then(res => {
					this.list = res.data
					this.status = 1;
					console.log(this.status)
					// console.log(res)
				})
			},
			onDateViewShow() {
				
			},
			onDateViewHide() {
				
			},
		}
	}
</script>

<style lang="scss">
	.order{
		text-align: center;
	}
	.content {
		padding: 21rpx;
	}
	.line {
		margin: 80rpx;
	}
	.minbox{
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 33%;
		padding: 4% 0;
		line-height: 20px;
	}
	.box{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: stretch;
	}
	.num{
		color: #FF5B56;
		font-size: 12px;
		font-weight: bold;
	}
	.explain{
		font-size: 12px;
		font-weight: bold;
		color: #545454;
	}
	.explaintitle{
		font-size: 15px;
		font-weight: bold;
		color: #545454;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}
	.center-box {
		display: flex;
		align-items: center;
		width: 651rpx;
		margin: 0 auto;
		padding: 10rpx 0;
		/* border-bottom: 1px solid rgba($color: #acacac, $alpha: 0.3); */
		border-bottom: 1px solid #eaeaea;
	
		.desc-box {
			width: 470rpx;
			display: flex;
			margin-left: auto;
			flex-direction: column;
	
			.title {
				color: #171B25;
				font-size: 28rpx;
				margin-bottom: 15rpx;
			}
		}
	}
</style>
