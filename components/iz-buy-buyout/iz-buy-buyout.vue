<template>
	<view>
		<view class="youhuiquantop" style="padding: 10px;text-align: center;background: #fff;border-radius: 10px 10px 0pt 0pt;">
			    <text style="font-size: 16px;font-weight: 800;">租用说明</text>
			</view>
			<view class="" style="padding: 5px 20px;">
				
			
				<view class="topzuqi">
					<text class="topzuqitext">租期租金</text>
					<view class="topkuang">
						<view class="big bigleft">
							<text class="texttext">首期</text>
							<text class="texttext">剩余{{goodinfo.lease_duration - 1}}期</text>
						</view>
						<view class="big bigright">
							<text class="textshu"  v-if="goodinfo.month_rent == '0.00'">￥{{goodinfo.each_price}}/月</text>
							<text class="textshu" style="color: #ff4700;font-weight: 800;" v-if="goodinfo.month_rent != '0.00'">￥{{goodinfo.month_rent}}/月</text>
							<u-line color="#EAE9E5"></u-line>
							<text class="textshu">￥{{goods_data.each_price || '--'}}/月</text>
						</view>
					</view>
				</view>
				<view class="topzuqi">
					<text class="topzuqitext">租满可选</text>
					<view class="topkuang">
						<view class="big bigleft">
							<text class="texttext">买断</text>
							<text class="texttext">归还</text>
							<text class="texttext">续租</text>
						</view>
						<view class="big bigright" style="align-items: flex-start;">
							<view class="textshu">
								<view class="textshu" style="">买断金￥{{goodinfo.buyout_price}}</view>
								<view class="textshubo" style="padding-bottom: 0px;">一次支付买断款，即可直接拥有此商品</view>
								<view class="textshubo">提前买断价格 = 总租金 + 买断款 - 已付租金 - 未付租金的期数(必须大于2期) * 100</view>
							</view>
							<u-line color="#EAE9E5"></u-line>
							<view class="textshu">
								
								<view class="textshu">归还换新</view>
								<view class="textshubo">需要到期前申请归还，归还后可随时申请新机，归还前请清除个人数据，解除锁屏密码并注销ID登录</view>
							</view>
							<u-line color="#EAE9E5"></u-line>
							<view class="textshu" style="align-items: flex-start;">
								
								<view class="textshu">月租金￥{{(goodinfo.each_price * 1.2).toFixed(2)}}</view>
								<view class="textshubo">最长可续租12期，租满即可拥有此商品</view>
							</view>
						</view>
						
					</view>
				</view>
				<view class="topzuqi">
					<text class="topzuqitext">滞纳金说明</text>
					<view class="topkuang" style="font-size: 13px;color: #858585;">
						如您未能按期、足额支付本协议约定的款项（包括但不限于租金、服务费、买断价、赔偿金），自逾期之日起，您应按照10元/天向蜂窝租机支付滞纳金。本协议项下，滞纳金收取上限不超过租赁总费用与到期买断价之和的12%。
					</view>
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		name:"iz-buy-buyout",
		props: {
			goodsku:'' ,
			goodid:''
		},
		data() {
			return {
				good_sku_id: this.goodsku,
				good_id:this.goodid,
				goodinfo:[]
			};
		},
		mounted() {
			this.init()
		},
		methods:{
			init() {
				let opt = {
					url: '/goods/selected/rulenew',
					data: {
						goods_id: this.good_id,
						rule_ids: this.good_sku_id //规则ID
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					console.log(res)
					this.goodinfo = res.data
				})
			},
		
		}
	}
</script>

<style>
	.big{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 14px;
		justify-content: space-around;
	}
	.bigleft{
		width: 30%;
		background: #EAE9E5;
	}
	.bigright{
		width: 100%;
		border: 1px solid #EAE9E5;
		align-items: flex-end;
	}
	.texttext{
		padding: 4px 0;
		font-weight: bold;
		color: #545454;
	}
	.textshu{
		padding: 4rpx 6px;
		font-weight: bold;
		color: #545454;
		// margin-right: 10px;
	}
	.textshubo{
		padding: 5px;
		font-size: 12px;
		color: #908f8e;
	}
	.topkuang{
		display: flex;
		justify-content: space-between;
		margin: 10px 0 15px;
	}
	.topzuqitext{
		font-size: 16px;
		font-weight: 800;
		font-family: 黑体;
	}
</style>