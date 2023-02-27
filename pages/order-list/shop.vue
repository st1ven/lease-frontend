<template>
	<!-- 店铺详情 -->
	<view class="shop-page">
		<view class="shop-cont">
			<!-- 店铺信息 -->
			<view class="shop" v-if="shopType==0">
				<view class="shop-info">
					<view class="shop-img-box" v-if="shopData.mer_avatar">
						<u-image :showLoading="true" shape="circle" :src="shopData.mer_avatar" width="140rpx"
							height="140rpx"></u-image>
					</view>
					<view class="shop-msg-box">
						<view class="msg-title">
							{{shopData.mer_name}}
						</view>
						<text class="msg-tag">{{ shopData.mer_type}}</text>
						<text class="msg-icon">
							<u-icon name="map" color="#333" size="32rpx" :label="shopData.mer_address" labelPos="left"
								labelSize="24rpx">
							</u-icon>
						</text>
					</view>
				</view>

				<view class="shop-cont">
					<iz-goods-item ImgBoxH="333rpx" :credit="true" :newList="newList" />
					<u-loadmore :status="status" />
				</view>
			</view>
			<!-- 分类 -->
			<view class="classification" v-if="shopType==1">
				<view class="content-box">
					<!-- 侧边导航栏 -->
					<view class="content-box-l">
						<scroll-view scroll-y="true" :scroll-into-view="'nav-' + activeIndex"
							scroll-with-animation="true">
							<view :class="activeIndex === i ? 'active' : ''" v-for="(item,i) in sidebarList" :key="i"
								:id="item.id" class="tab-item" @click="sidebarClick(item,i)">
								{{item.name}}
							</view>
						</scroll-view>
					</view>

					<!-- 内容 -->
					<view class="content-box-r">
						<view v-for="(item,inx) in targetList" :key="inx" class="cate-item" @click="more(item)">
							<view class="image-box">
								<u-image width="100%" height="180rpx" style="border-radius:10px;" :src="item.image">
									<template v-slot:loading>
										<u-loading-icon color="#ccc"></u-loading-icon>
									</template>
									<view slot="error" style="font-size: 20rpx;color: #ccc;margin-top: 50rpx;">加载失败
									</view>
								</u-image>
							</view>


							<!-- <text class="u-line-1">{{item.name}}</text> -->
						</view>
					</view>
				</view>
			</view>

		</view>
		<view class="shop-bottom">
			<view :class="shopType==0?'on':''" @click="tabClick(0)">店铺</view>
			<view :class="shopType==1?'on':''" @click="tabClick(1)">分类</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				activeIndex: 0,
				sidebarList: [],
				targetList: [],
				allList: [],
				shopType: 0,
				tabberVal: 0,
				mer_id: '',
				shopData: {},
				newList: [],
				status: 'loadmore',
				page:0,
				list:10
			}
		},
		onShow() {
			this.shopListFunc(this.mer_id)
		},
		onLoad(obj) {
			// console.log(obj, '---------shop---id')
			this.mer_id = obj.id
		},
		watch: {
			params(newVal, oldVal) {
				this.mer_id = newVal
			}
		},
		onReachBottom() {
			if(this.page >= 20) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.list += 10;
				this.newListHttp();
				if(this.page >= 20) this.status = 'nomore';
				else this.status = 'loading';
			}, 20)
		},
		methods: {
			sidebarClick(item, i) {
				this.activeIndex = i;
				this.targetList = this.allList[i].children
				console.log(this.allList, i, this.allList[i],
					'---========-this.allList')
			},

			tabClick(type) {
				if (type == 1) {
					this.allListFunc()
				}
				if (type == 0) {
					this.shopListFunc(this.mer_id)
				}
				this.shopType = type
			},
			// 店铺信息
			shopListFunc() {
				let opt = {
					url: '/merchant/index',
					data: {
						mer_id: this.mer_id
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.shopData = res.data
					this.newListHttp()
				})
			},
			newListHttp() {
				let opt = {
					url: "/merchant/goods",
					data: {
						pageSize: this.list,
						pageIndex: 1,
						mer_id: this.mer_id
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.newList = res.data.data

				})
			},
			more(obj) {
				uni.navigateTo({
					url: "../product-list/product-list?sortFlag=0&platform=mer&&id=" + obj.id
				})
			},
			//商家分类
			allListFunc() {
				let opt = {
					url: "/category/mer/index",
					data: {
						mer_id: this.mer_id
					}
				}
				let _this = this
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.sidebarList = []
					this.allList = res.data
					if (res.data.length) {

						this.allList.forEach((item, i) => {
							item.children = item.children || []
							this.sidebarList.push({
								name: item.name,
								id: item.id,
							})
							if (i == 0) {
								this.targetList = item.children
							}

						})
						console.log(this.allList, '----this.allList')
					} else {
						this.tabClick(0)
						this.$refs.uToast.show({
							message: '暂时没有分类。。。',
							icon: 'error',
							type: 'error',
							duration: 3000,
						})
					}

				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.shop-msg-box{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
	}
	.shop-page {
		background-color: #F0F0F0;
		position: relative;

		.shop-cont {
			// padding-top: 24rpx;
			padding-bottom: 150rpx;
			// overflow-y: scroll;
			// height: 100vh;

			.shop {
				height: calc(100vh - 108rpx);

				.shop-info {
					height: 200rpx;
					margin: 0 24rpx;

					box-sizing: border-box;
					background-color: #fff;
					border-radius: 16rpx;
					padding: 32rpx 36rpx 39rpx 44rpx;
					display: flex;
					position: relative;
					margin-bottom: 17rpx;

					.shop-img-box {
						margin-right: 39rpx;
					}

					.msg-title {
						font-size: 30rpx;
						color: #333;

						// margin-bottom: 10rpx;
					}

					.msg-tag {
						color: #fff;
						padding: 4rpx 8rpx;
						border-radius: 6rpx;
						font-size: 18rpx;
						background: linear-gradient(180deg, #F28E26 0%, #FD644F 100%);
					}

					.msg-icon {
						// position: absolute;
						
						top: 40rpx;
						right: 40rpx;
					}
				}
			}

			.classification {
				height: calc(100vh - 108rpx);

				.content-box {
					position: relative;
					// top: 185rpx;
					left: 0;
					right: 0;
					bottom: 0;
					background: #F0F0F0;
					box-sizing: border-box;
					display: flex;

					.content-box-l {
						background-color: #f0f0f0;

					}

					.content-box-r {
						position: absolute;
						top: 0px;
						left: 91px;
						right: 0;
						bottom: 0;
						padding: 16px 16px;
						background: #ffffff;
						border-radius: 7px 7px 0 0;
						display: flex;
						flex-wrap: wrap;
						align-content: flex-start;
						flex-direction: column;

						.cate-item {
							width: 100%;
							height: 170rpx;
							padding: 15rpx 0;
							display: flex;
							align-items: center;
							flex-direction: column;

							.image-box {
								height: 123rpx;
								// width: 90rpx;
								width: 100%;
								margin: 0 auto;
							}

							text {
								width: 100%;
								color: #1F1F1F;
								font-weight: 400;
								font-size: 22rpx;
								text-align: center;
							}
						}

						.cate-item:nth-child(3n - 1) {
							margin: 0 0.5%;
						}
					}

					.tab-item {
						width: 170rpx;
						height: 90rpx;
						color: #1F1F1F;
						font-size: 24rpx;
						font-weight: 400;
						line-height: 90rpx;
						text-align: center;
					}

					.active {
						color: #1F1F1F;
						font-size: 30rpx;
						font-weight: bold;
						position: relative;
						background-color: #FFFFFF;
						border-radius: 0 10rpx 10rpx 0;
					}

					.active:after {
						content: '';
						display: block;
						position: absolute;
						top: 50%;
						width: 10rpx;
						height: 38rpx;
						background: #93D3FF;
						transform: translateY(-50%);
					}

					scroll-view {
						width: 170rpx;
						height: calc(100vh - 108rpx);
					}

					.content {
						position: absolute;
						top: -24rpx;
						left: 185rpx;
						right: 0;
						bottom: 0;
						padding: 30rpx;
						background: #ffffff;
						border-radius: 14rpx 14rpx 0 0;

						display: flex;
						flex-wrap: wrap;
						align-content: flex-start;



					}
				}

			}
		}

		.shop-bottom {
			width: 100%;
			height: 138rpx;
			line-height: 88rpx;
			background-color: #fff;
			position: fixed;
			display: flex;
			bottom: 0;
			// padding-bottom: 50rpx;
			box-sizing: border-box;

			view {
				width: 50%;
				font-size: 30rpx;
				text-align: center;
			}

			view.on {
				color: #92D3FF;
			}
		}
	}
</style>
