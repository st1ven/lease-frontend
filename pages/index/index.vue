<template>
	<view>
		<!-- 搜索 & 轮播  首页 -->
		<view class="tab-box" :style="{background:'linear-gradient(1deg, #ffffff 0%, '+ backgroundcolor +' 100%)', paddingTop:statusBarHeight + titleBarHeight}">
			<view class="search-box" @click="JumpSearch" >
				<u-icon size="26" name="search" color="#9FA3B0" />
				<text class="title">输入关键词</text>
			</view>
			<u-swiper @click="bann" indicator @change="bannqiehan" :list="list" :circular="true"/>
			<view class="bannerbottom">
					<image  v-for="(item,index) in imagee.bannerbottom" :key="index" :src="item" mode="widthFix"></image>
			</view>
		</view>
		<view class="gonggao" v-if="imagee.dynamic != '0'">
			<view class="content">
				<text class="zulin">租赁<text style="color: #FFAA00;">动态</text></text>
				<text v-if="(imagee.gonggao).length < 15 " class="tishi">{{imagee.gonggao}}</text>
				<u-notice-bar v-else :text="''+imagee.gonggao+''" direction="row" icon=" " bgColor=" " speed="60" color="#414960"></u-notice-bar>
			</view>
		</view> 
		<view class="gongge">
			<u-skeleton :loading="loading" rows="1"></u-skeleton>
			<swiper class="swiper" :indicator-dots="true" indicator-color="#D5D7DC" indicator-active-color="#9FA3B0">
				<swiper-item>
					<u-grid col="5" :border="false">
						<u-grid-item v-for="(baseListItem,baseListIndex) in baseList.slice(0, 5)"
							:key="baseListIndex" @click="gongge(baseListItem)">
							<u-image :src="baseListItem.image" mode="aspectFit" shape="circle"  width="96rpx" height="96rpx"></u-image>
							<text class="grid-text">{{baseListItem.name}}</text>
						</u-grid-item>
					</u-grid>
				</swiper-item>
				<swiper-item>
					<u-grid col="5" :border="false">
						<u-grid-item v-for="(baseListItem,baseListIndex) in baseList.slice(5)"
							:key="baseListIndex" @click="gongge(baseListItem)">
							<u-image :src="baseListItem.image" mode="aspectFit" shape="circle"  width="96rpx" height="96rpx"></u-image>
							<text class="grid-text">{{baseListItem.name}}</text>
						</u-grid-item>
					</u-grid>
				</swiper-item>
			</swiper>
		</view>
		<!-- #ifdef MP-ALIPAY -->

		<view v-if="imagee.followopen == '1'" style="padding: 4px 12px 0 12px;">
			<view :style="{backgroundImage:'url('+imagee.follow+')'}"  class="guanzhu" @click="huiyuan()">
			</view>
		 </view>
		 <!-- #endif -->
		<view class="bigkuang">
			<u-skeleton :loading="loading" rows="2"></u-skeleton>
		</view>
		<view class="bigkuang">
			
			<view class="bigimage">
				<view class="imageimage" style="padding-right: 2px;">
					<u-swiperbot @click="bannbottom" indicatorMode="dot" interval="4000" indicator  height="100%" :list="listimage.map(item => item.image)" :circular="true" />
				</view>
				<image :lazy-load="true" class="imageimage"  :src="imagee.imageright" style="margin-left: 2px;" mode="widthFix" @click='haohuoright()'></image>
			</view>
			<view class="smartimage">
				<image  :lazy-load="true" class="smartimageimage" :src="imagee.imageleft" mode="widthFix" @click='haohuolefturl()'></image>
				<image  :lazy-load="true" class="smartimageimage" :src="imagee.image3" mode="widthFix" @click="huiyuanding()"></image>
				<image  :lazy-load="true" class="smartimageimage" :src="imagee.image2" mode="widthFix" @click='huodongding()'></image>
			</view>
		</view>

		<view style="background: #fff;">
			<view class=""  style="background: #fff;" v-for="(item,index) in activity" :key="index">
				<view class="changtu" @click="huodongtiao(item)" style="height: auto;">
					<u-image :src="item.banner_image" mode="widthFix" radius="7px" width="100%" >
					</u-image>
				</view>
			</view>
		</view>
		<!-- 生活号 -->
		<view class="bannergood" style="padding: 10px 12px 0;">
			<lifestyle sceneId="6fdff7bd819d4a28b170d00ef6d750c6" /> 
		</view>
		
		<!-- 热门推荐 -->
		
		<view class="rank-box boxx">
			<image style="width: 100%;border-radius: 12px;" :src="imagee.imagehot" mode="widthFix" @click='JumpHot({indexFlag:3,id:47})'></image>

			<scroll-view scroll-x="true" class="flex">
			
				<view class="diso dioo" style="display: flex;flex-direction: row;flex-wrap: nowrap;flex-wrap: wrap;justify-content: space-between;">
	
				<view class="rank-item" style="margin-left: 2rpx;" v-for="(item,i) in hotList.slice(0,6)" :key="i" @click="JumpDetail(item)">
					<view class="uimage">
						<u-image :lazy-load="true" width="113rpx" height="113rpx" :src="item.image"><template v-slot:loading>
					    <u-loading-icon color="#1890ff"></u-loading-icon>
					  </template></u-image>
				     </view>
					<text class="u-line-1 ft-24 my-10" style="width: 208rpx; ">{{item.title}}</text>
					<view class="goods-price">
						<text class="price-number">¥{{item.day_price}}</text>
						<text class="price-company">/天起</text>
					</view>
				</view>

				</view>

			</scroll-view>

		</view>

		<view v-if="loadding" style="padding-top: 20px;">
			<u-loading-icon  color="#14a3e4" text="正在加载..." size="16" :vertical="true" textSize="14"></u-loading-icon>
		</view>
		<view class="zhuanqu" v-for="(item,index) in phoneList" :key="index">
			<view class="bannerbig">
				<view class="bannergood" style="padding: 12px 12px 0;">
					<image style="width: 100%;border-radius: 12px;" :src="item.index_image" mode="widthFix" @click="tiaozhuan(item.id)"></image>
				</view>
					<scroll-view scroll-x="true" class="flex">
						<!-- #ifdef H5 -->
						<view class="diso">
						<!-- #endif -->
						<view class="rank-item" style="padding: 16px 12px;margin-left: 8rpx;" v-for="(ite,i) in item.list" :key="i" @click="JumpDetail(ite)">
							<view class="uimage">
								<u-image :lazy-load="true"  width="113rpx" height="113rpx" :src="ite.image" />
							 </view>
							<text class="u-line-2 ft-24 my-10" style="width: 178rpx;height: 52rpx;margin-bottom: 8px;">{{ite.title}}</text>
							<view class="goods-price">
								<text class="price-number">¥{{ite.day_price}}</text>
								<text class="price-company">/天</text>
							</view>
						</view>
						<!-- #ifdef H5 -->
						</view>
						<!-- #endif -->
					</scroll-view>
			</view>
		</view>
		
		<view class="zhuanqu" v-for="(item,index) in pcList" :key="index">
			<view class="bannerbig">
				<view class="bannergood" style="padding: 12px 12px 0;">
					<image style="width: 100%;border-radius: 12px;" :src="item.index_image" mode="widthFix"  @click="tiaozhuan(item.id)"></image>
				</view>
					<scroll-view scroll-x="true" class="flex">
						<!-- #ifdef H5 -->
						<view class="diso">
						<!-- #endif -->
						<view class="rank-item" style="padding: 14px 12px;margin-left: 8rpx;" v-for="(ite,i) in item.list" :key="i" @click="JumpDetail(ite)">
							<view class="uimage">
								<u-image :lazy-load="true"  width="113rpx" height="113rpx" :src="ite.image" />
							 </view>
							<text class="u-line-2 ft-24 my-10" style="width: 178rpx;height: 52rpx;margin-bottom: 8px;">{{ite.title}}</text>
							<view class="goods-price">
								<text class="price-number">¥{{ite.day_price}}</text>
								<text class="price-company">/天</text>
							</view>
						</view>
						<!-- #ifdef H5 -->
						</view>
						<!-- #endif -->
					</scroll-view>
			</view>
		</view>

		<view class="recommend-goods" style="margin-top: 10px;background-color: #f0f0f0;">
			<text class="line"></text>
			<text class="line"></text>
			<view class="recommend-goods-ul">
				<iz-goods-item ImgBoxH="333rpx" :credit="true" :newList="newList" />
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				cateList: [],
				phoneList: [],
				phoneIndex: 0,
				phoneArr: [],
				phoneiphone:[],
				
				pcList: [],
				pcIndex: 0,
				newList: [],
				hotList: [],
				good:[],
				imagee:{},
				baseList: [],
				
				windowTop:'',
				statusBarHeight:'',
				titleBarHeight:'',
				activity:[],
				phonevivo:[],
				phoneoppo:[],
				phonexiaomi:[],
				phonehuawei:[],
				listimage:[],
				userid:{},
				scrollstatus:1,
				loading:true,
				loadding:true,
				backgroundcolor:'',
				// #ifdef MP-ALIPAY
				canUse: my.canIUse('lifestyle'),
				show: true,
				checkFollow: true, 
				templateId:''
				// #endif 
			}
		},
		onPageScroll(object)
		    {
				if(this.pcList == '' && this.scrollstatus == '1'){
					this.scrollstatus = 2
					this.phoneHttp() //手机
					this.pcHttp() //电脑
					this.newListHttp() //最新上架
				}
		},
		onLoad() {
			this.user = my.getLaunchOptionsSync()
			this.userid = this.user.query
			console.log(this.userid)
			this.cookiee()
		},
		onShow() {
			this.swiperList() //轮播图
			this.gonggeurl()
			this.image()
			this.activityimage()

			this.hotListHttp() //热门推荐		
			if(this.pcList !=''){
				this.phoneHttp() //手机
				this.pcHttp() //电脑
				this.newListHttp() //最新上架
			}
		},
		
		created() {
					// 获取设备信息
					this.getStateBarHeight();
					
				},
		methods: {
			huodongding(){
				let opt = {
					url: '/index/dingyue?biaoshi=indexcopus'
				}
				this.$request(opt).then(res => {
				var dingyueid = res.data
				my.requestSubscribeMessage({
					//优惠券到期提醒，优惠券领取提醒
					entityIds: dingyueid,
					complete: (res) => {
						this.huodong()
					}
				});
				})
			},
			huiyuanding(){
				let opt = {
					url: '/index/dingyue?biaoshi=indexinvite'
				}
				this.$request(opt).then(res => {
					var dingyueid = res.data
					my.requestSubscribeMessage({
						entityIds: dingyueid,
						complete: (res) => {
							this.huiyuanyao()
						}
					});
				})
				
			},
			huiyuanyao(){
				let opt = {
					url: '/index/huiyuanyao'
				}
				this.$request(opt).then(res => {
					var urll = res.data.value
					uni.navigateTo({
						url: urll
					})
				})
			},

			tiaozhuan(e){
				uni.navigateTo({
					url: "../product-list/product-list?sortFlag=1&category_ids=" + e
				})
			},
			bannqiehan(e){
				let index = e.current
				this.backgroundcolor = this.good[index].backgroundcolor
			},
			
			haohuoright(){
				let opt = {
					url: '/index/haohuoright'
				}
				this.$request(opt).then(res => {
					var urll = res.data.value
					uni.navigateTo({
						url: urll
					})
				})
			},
			haohuolefturl(){
				let opt = {
					url: '/index/haohuolefturl'
				}
				this.$request(opt).then(res => {
					const path = res.data.value
					if(res.url.value == '1'){
						my.ap.navigateToAlipayPage({
						  path
						});
					}else{
						uni.navigateTo({
							url: path
						})
					}
				})
			},
			huiyuan(){
				let opt = {
					url: '/index/getmemberurl'
				}
				this.$request(opt).then(res => {
					var urll = res.data.url
					var plugin = requirePlugin("alipassToolKit") // 引用名称需与 app.json 中定义名称相同
					let params = {
					  url: urll,//开卡链接，通过上文 获取投放链接 获取
					    callback: function (res) {
					      if (res.success === true) {
					      }
					    }
					  }
					 plugin.openCard(params);// 接口参数说明如下
				})
			},
			cookiee(){
				if(this.userid){
					uni.setStorage({
						key: 'yaouserid',
						data: this.userid.userid,
					});
					let opt = {
						url: '/index/yaoqing',
						data: {
							yaouserid:this.userid.userid,
						}
						
					}
					this.$request(opt).then(res => {
						// 打印调用成功回调
						// console.log(res)
					})
				}else{
					uni.setStorage({
						key: 'yaouserid',
						data: '0',
					});
				}
			},
			huodong(){
				let opt = {
					url: '/index/huodongurl'
				}
				this.$request(opt).then(res => {
					var urll = res.data.value
					uni.navigateTo({
						url: urll
					})
				})
			},
			huodongtiao(item){
				uni.navigateTo({
					url:"./activity?id=" + item.id + "&title=" + item.name
				})
			},
			getStateBarHeight() {
				let info = uni.getSystemInfoSync()
				this.windowtop = info.windowTop
				this.statusBarHeight = info.statusBarHeight
				this.titleBarHeight = info.titleBarHeight
			},
			gonggeurl(){
				let opt = {
					url: '/index/gonggeur'
				}
				this.$request(opt).then(res => {
				this.loading = false	
				this.baseList = res.data
				})
			},
			gongge(name) {
				if(name.classification == '1'){
				uni.navigateTo({
					　　url: "/pages/index/gongge?id=" + name.categoryid +"&title=" + name.name
					})
				}else{
					uni.navigateTo({
						url: "../product-list/product-list?sortFlag=" + 1 + '&category_ids=' + name.categoryid
					})
				}	
			},
			activityimage(){
				let opt = {
					url: '/index/activityimage'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
				// this.imagee = res.data
				this.activity = res.data
				// console.log(res)
				})
			},
			image(){
				let opt = {
					url: '/index/image'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
				this.imagee = res.data
				})
			},
			bann(index){
				if(this.good[index].good_url == '' || this.good[index].good_url == null){
					uni.navigateTo({
						url: "../goods-detail/goods-detail?id=" + this.good[index].good_id
					})
				}else{
					uni.navigateTo({
						url: this.good[index].good_url
					})	
				}
			},
			bannbottom(index){
				if(this.listimage[index].good_url == '' || this.listimage[index].good_url == null){
					uni.navigateTo({
						url: "../goods-detail/goods-detail?id=" + this.listimage[index].good_id
					})
				}else{
					uni.navigateTo({
						url: this.listimage[index].good_url
					})	
				}
			},
			JumpSearch() {
				uni.navigateTo({
					url: "../search/search"
				})
			},
			JumpDetail(obj) {
				
				uni.navigateTo({
					url: "../goods-detail/goods-detail?id=" + obj.id
				})
			},
			JumpHot(obj) {
				uni.navigateTo({
					url: "../product-list/product-list?sortFlag=" + obj.indexFlag + '&category_ids=' + obj.id
				})
			},
			// 轮播图数据
			swiperList() {
				let opt = {
					url: '/banner'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.list = res.data.map(item => item.image)
						this.good = res.data
						this.backgroundcolor = this.good[0].backgroundcolor
						this.listimage = res.url
					}
				})
			},
			//手机
			phoneHttp() {
				let opt = {
					url: '/phone/arrondi'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					
					this.phoneList = res.data
					this.loadding = false
				})

			},
			//电脑
			pcHttp() {
				let opt = {
					url: '/computer/arrondi'
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.pcList = res.data
					}
				})

			},
			// 热门推荐数据
			hotListHttp() {
				let opt = {
					url: "/goods/hot",
					data: {
						pageSize: 6,
						pageIndex: 1,
						more: true
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.hotList = res.data.data
					}
				})
			},
			//最新数据
			newListHttp() {
				let opt = {
					url: "/goods/new?more=ture",
					data: {
						pageSize: 6,
						pageIndex: 1
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					if (res.code == 1) {
						this.newList = res.data.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.guanzhu{
		color:blueviolet;
		display: flex;
		justify-content: space-around;
		align-content: center;
		height:100rpx ;
		background-size: 100% 100%;
		align-items: center;
		justify-content: flex-end;
		padding: 0 10px 0pt 0pt;
		border-radius: 8px;
	}
	.bigkuang{
		display: flex;
		flex-direction: column;
	}
	.bigimage{
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 10px 12px;
	}
	.imageimage{
		border-radius: 8px;
		width: 50%;
	}
	.smartimage{
		display: flex;
		padding: 0 12px;
	}
	.smartimageimage{
		border-radius: 8px;
		padding: 0 2px;
	}
	.bannerbottom{
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-around;
		padding: 5px 15px 0;
	}
	.uimage{
		margin: 0 auto;
	}
	.boxx{
		width: 94%;
		margin-left: 3%;
		border-radius: 10px;
		background-size: 100% 100%;
	}
	.gongge{
		background-color: #fff;
		padding: 2% 2% 0 2%;
		min-height: 80px;
	}
	.changtu{
		padding:0 3.5% 2% 3.5%;
		background-color: #fff;
		margin-bottom: 3px;
		height: 60px;
	}
	.gonggao{
		padding: 6px 16px;
		font-size: 14px;
		background-color: rgb(255, 255, 255);
		.content {
			display: flex;
			align-items: center;
			background-color: #FAFAFB;
			border-radius: 4px;
			padding: .5% 2%;
		}
	}
	.zulin{
		border-right: 1px solid #D5D7DC;
		padding-right: 8px;
		font-weight: 600;
		color: #414960;
	}
	.tishi{
		padding-left: 8px;
		font-size: 15px;
	}
	.dioo{
		flex-wrap: wrap;
		background: #fff;
		width: 94%;
		margin-left: 3%;
		border-radius: 10px;
		padding-bottom: 10px;
		// padding: 20px 0;
		min-height: 100px;
	}
	.grid-text {
		font-size: 14px;
		color: #414960;
		padding: 10rpx 0 40rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
	.line {
		width: 83rpx;
		height: 1rpx;
		background: #333333;
	}	
	.tab-box {
		// #ifdef H5
		padding-top: 30rpx;
		// #endif
		// #ifdef MP-ALIPAY
		padding-top: 170rpx;
		// #endif
		padding-bottom: 20rpx;
		background-size: 100% 100%;

		.tab-title {
			font-size: 32rpx;
			margin: 14rpx 20rpx;
		}

		.search-box {
			// #ifdef H5
			width: 90%;
			height: 60rpx;
			margin: 0 auto;
			border-radius: 10rpx;
			// #endif
			// #ifdef MP-ALIPAY
			width: 92%;
			margin: 0 4%;
			height: 60rpx;
			border-radius: 10rpx;
			// #endif
			display: flex;
			
			align-items: center;
			flex-direction: row;
			background: #F9F9F9;

			/deep/ .u-icon {
				opacity: 0.6;
				margin: 0 15rpx 0 15rpx;
			}

			.title {
				opacity: 0.8;
				color: #909090;
				// #ifdef H5
				font-size: 24rpx;
				// #endif
				// #ifdef MP-ALIPAY
				font-size: 24rpx;
				// #endif
			}
		}

		/deep/ .u-swiper {
			border-radius: 32rpx;
			margin: 20rpx 30rpx 0 30rpx;
		}
	}
	.diso{
		display: flex;
	}
	
	.rank-box {
		margin-top: 15rpx;
		// padding: 30rpx 0;
		background-color: #FFFFFF;
		
		.title-box {
			display: flex;
			align-items: center;
			flex-direction: row;
			margin: 0 30rpx 0 30rpx;

			.title {
				font-size: 32rpx;
				font-weight: bold;
				color: #fff;
			}

			.more {
				color: #fff;
				font-size: 24rpx;
				margin-left: auto;
			}
		}

		scroll-view {
			width: 100%;
			margin-top: 30rpx;
			white-space: nowrap;
		}

		.goods-price {
			// align-items: center;
			justify-content: center;
		}
	}

	.rank-item {
		display: flex;
		margin-left: 20rpx;
		width: 30%;
		flex-direction: column;
		padding: 20rpx 0 10rpx 0;
		align-items: center;
		background: #ffffff;
		border-radius: 10px;
		padding: 12px 2px;
		image {
			margin: 0 auto;
		}

		&:last-child {
			margin-right: 30rpx;
		}

		&>text {
			// text-align: center;
		}
	}

	.recommend-goods {

		background-color: #fff;

		.recommend-goods-title {
			color: #1F1F1F;
			font-size: 32rpx;
			text-align: center;
			padding: 15rpx;
			font-weight: bold;
		}
	}
	/deep/ .u-tabs__wrapper__nav {
		width: 88%;
		margin: 0 auto;
		flex: 0 1 auto !important;
	}
</style>
