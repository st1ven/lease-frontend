<template>
	<!-- 商品列表  -->
	<view class="product-Page">

		<view class="searchBox" v-if="sortFlag==0">
			<u-search placeholder="请输入商品名称" actionText="搜索" :clearabled="true" v-model="searchVal" @custom="listHttp">
			</u-search>
		</view>
		<view class="screening-box" v-if="sortFlag==0">
			<view class="screening-tip" @click.self="arrowDown(1)">
				<view class="icon-text">
					<u-icon :name="arrowNum==1?'arrow-up':'arrow-down'" space="8rpx" color="#333" size="28rpx">
					</u-icon>
				</view>
				<text>{{jiage}}</text>
				<view class="arrow-ul" v-if="arrowNum==1">
					<text class="arrow-li" :class="price_order==item.txt?'on':''" v-for="(item,i) in arrowObj.priceArr"
						:key="i" @click="arrowLiClick(item)">{{item.name}}</text>
				</view>
			</view>
			<view class="screening-tip" @click.self="arrowDown(2)">
				<view class="icon-text">
					<u-icon :name="arrowNum==2?'arrow-up':'arrow-down'" space="8rpx" color="#333" size="28rpx"></u-icon>
				</view>
				<text>{{xinjiu}}</text>
				<view class="arrow-ul" v-if="arrowNum==2">
					<text class="arrow-li" v-for="(item,i) in arrowObj.classArr" :key="i"
						:class="condition==item.txt?'on':''" @click="arrowLiClick(item)">{{item.name}}</text>
				</view>
			</view>
			<view class="screening-tip" @click.self="arrowDown(3)">
				<view class="icon-text">
					<u-icon :name="arrowNum==3?'arrow-up':'arrow-down'" space="8rpx" color="#333" size="28rpx"></u-icon>
				</view>
				<text>{{xiaoliang}}</text>
				<view class="arrow-ul" v-if="arrowNum==3">
					<text class="arrow-li" v-for="(item,i) in arrowObj.salesArr" :key="i"
						:class=" sales_order==item.txt?'on':''" @click="arrowLiClick(item)">{{item.name}}</text>
				</view>
			</view>
		</view>
		<view class="product-list">
			<iz-goods-item ImgBoxH="333rpx" v-if="list.length" :newList="list" :credit="false" />
			<view class="product-list-tip" v-else>
				<u-icon name="warning" color="#ccc" size="45rpx" labelColor="#ccc" labelSize="30rpx" label="暂时没有商品哦">
				</u-icon>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		name: 'product-list',
		data() {
			return {
				jiage:'价格区间',
				xinjiu:'成新度',
				xiaoliang:'销量',
				loadingType: '下拉刷新',
				arrowObj: {
					priceArr: [{
						name: '综合',
						txt: "",
						type: 1
					}, {
						name: '价格升序',
						txt: "asc",
						type: 1
					}, {
						name: '价格降序',
						txt: "desc",
						type: 1
					}],
					classArr: [
					// 	{
					// 	name: '综合',
					// 	txt: "null",
					// 	type: 2
					// }, 
					{
						name: '准新',
						txt: "new",
						type: 2
					}
					// , {
					// 	name: '二手',
					// 	txt: "second",
					// 	type: 2
					// },
					],
					salesArr: [{
						name: '综合',
						txt: "",
						type: 3
					}, {
						name: '销量升序',
						txt: "asc",
						type: 3
					}, {
						name: '销量降序',
						txt: "desc",
						type: 3
					}],

				},
				list: [],
				params: {},
				category_ids: '',
				sortFlag: 0, //0显示搜索框+筛选
				platform: '', //分类类型    平台 admin   商户 mer
				arrowNum: 0,
				arrowFlag: false,
				price_order: '',
				sales_order: '',
				condition: '',
				pageSize: 20,
				pageIndex: 1,
				searchVal: '',
				searchType: "",
				coupons_id: "", //优惠劵ID
			}
		},
		onLoad(obj) {
			this.sortFlag = obj.sortFlag
			this.category_ids = obj.id || obj.category_ids
			this.searchType = obj.type
			this.searchVal = obj.title
			this.coupons_id = obj.coupons_id
			this.platform = obj.platform
			this.listHttp(this.category_ids)
			// console.log(obj)
		},
		watch: {
			idFunc(newVal, oldVal) {
				this.sortFlag = newVal
			}
		},

		onShow() {
			// this.listHttp()
		},
		methods: {

			arrowLiClick(item) {
				if (item.type == 1) {
					this.price_order = item.txt
					this.jiage = item.name
				}
				if (item.type == 2) {
					this.condition = item.txt
					this.xinjiu = item.name
				}
				if (item.type == 3) {
					this.sales_order = item.txt
					this.xiaoliang = item.name
				}
				// console.log(item)
				this.listHttp(this.category_ids)
			},
			// 列表数据
			listHttp(id) {
				let opt = {}
				if (this.sortFlag == 0) {
					if (this.searchType == 'search') {
						opt = {
							url: '/search/goods',
							method: "POST",
							header: "application/x-www-form-urlencoded;charset=utf-8",
							data: {
								pageSize: this.pageSize,
								pageIndex: this.pageIndex,
								price_order: this.price_order,
								sales_order: this.sales_order,
								condition: this.condition,
								title: this.searchVal
							}
						}
					} else {
						opt = {
							url: '/goods/list',
							data: {
								// category_ids: this.category_ids,
								category_ids: id,
								pageSize: this.pageSize,
								pageIndex: this.pageIndex,
								price_order: this.price_order,
								sales_order: this.sales_order,
								condition: this.condition,
								title: this.searchVal,
								type: this.platform
							}
						}
					}
				}
				if (this.sortFlag == 1) {
			
					opt = {
						url: '/goods/list',
						data: {
							// category_ids: this.category_ids || 47,
							category_ids: id,
							pageSize: this.pageSize,
							pageIndex: this.pageIndex
						}
					}
				}
				if (this.sortFlag == 3) {
					opt = {
						url: '/goods/hot',
					}
				}
				
				if (this.sortFlag == 2) {
					opt = {
						url: '/goods/coupons',
						data: {
							coupons_id: this.coupons_id,
							// coupons_id: id,
						}
					}
				}

				let _this = this
				this.$request(opt).then(res => {
					// 打印调用成功回调
					// console.log(res)
					this.arrowFlag = !this.arrowFlag
					if (this.sortFlag == 2 || this.searchType == "search" || this.sortFlag == 1 || this.sortFlag ==
						0) {
						this.list = res.data.data
					} else {
						this.list = res.data
					}
					// if (res.data.current_page == 1) {
					// 	this.list = res.data.data
					// } else {
					// 	let dataArr = res.data.data
					// 	dataArr.forEach((item, inx) => {
					// 		_this.list.push(item)
					// 	})
					// }

				})
			},
			arrowDown(inx) {
				this.arrowFlag = !this.arrowFlag
				this.arrowNum = this.arrowFlag ? inx : 0;

			}
		}
	}
</script>

<style lang="scss">
	.product-Page {
		height: 100vh;
		background-color: #f0f0f0;
		position: relative;

		.searchBox {
			background-color: #fff;
			padding: 20rpx;
		}

		.product-list-tip {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}

		.screening-box {
			color: #333333;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			box-sizing: border-box;
			height: 80rpx;
			background-color: #fff;

			.screening-tip {
				flex-grow: 1;
				font-size: 28rpx;
				padding-left: 0.6rem;
				position: relative;

				.icon-text {
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					left: 25rpx;
				}

				.arrow-ul {
					position: absolute;
					top: 40rpx;
					left: -25rpx;
					transform: translate(20%, 0rpx);
					width: 90%;
					background-color: #fff;
					box-shadow: -2rpx -2rpx -2rpx -2rpx #F0f0f0;
					border-radius: 12rpx;
					padding: 12rpx 8rpx;
					z-index: 9999;

					 .arrow-li {
						height: 55rpx;
						line-height: 55rpx;
						display: block;
						font-size: 26rpx;
						padding-left: 8rpx;
						border-bottom: 1rpx solid #ecedef;
					}

					.arrow-li:last-child {
						border-bottom: 0
					}

					.arrow-li.on {
						background-color: #f0f0f0;
					}

				}
			}
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(-180deg);
		}
	}
</style>
