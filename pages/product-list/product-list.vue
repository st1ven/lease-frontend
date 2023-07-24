<template>
	<!-- 商品列表  -->
	<view class="product-Page" style="background-color: #f6f6fb;">
		<view class="searchBox" v-if="sortFlag == 0">
			<u-search placeholder="请输入商品名称" actionText="搜索" :clearabled="true" v-model="searchVal" @custom="listHttp" animation>
			</u-search>
		</view>
		<view class="screening-box" v-if="sortFlag == 0">
			<fy-dropdown :menuList="dropdownItems">
				<fy-dropdown-item v-for="(item, index) in dropdownItems" :key="index" v-model="item.value"
					:dropdownKey="item.dropdownKey" :options="item.options"
					@change="arrowLiClick(item,index)"
				></fy-dropdown-item>
			</fy-dropdown>
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
			jiage: '价格区间',
			xinjiu: '成新度',
			xiaoliang: '销量',
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
			dropdownItems: [
				{
					title: '价格区间',
					options: [
						{
							label: '综合',
							value: ''
						},
						{
							label: '价格升序',
							value: 'asc'
						},
						{
							label: '价格降序',
							value: 'desc'
						}
					],
					value: '1',
					type: 1,
					dropdownKey: 'price',
					key: 'jiage',
					labelKey:'price_order',
				},
				{
					title: '成新度',
					options: [
						{
							label: '准新',
							value: 'new'
						},
						// {
						// 	label: '二手',
						// 	value: 'second'
						// }
					],
					value: '2',
					type: 2,
					dropdownKey: 'class',
					key: 'xinjiu',
					labelKey:'condition',
				},
				{
					title: '销量',
					options: [
						{
							label: '综合',
							value: ''
						},
						{
							label: '销量升序',
							value: 'asc'
						},
						{
							label: '销量降序',
							value: 'desc'
						}
					],
					value: '3',
					type: 3,
					dropdownKey: 'sales',
					key: 'xiaoliang',
					labelKey:'sales_order',
				}
			],
			options1: [
			],
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
		// dropdownChange(item) {
		// 	console.log(item,dropdownChange);
		// },
		arrowLiClick(item,index) {
			console.log(item, index, 'itemmmmmmmm')
			// this.dropdownItems[index].title = item.options.filter(x=x);
			let results = item.options.find(x => x.value == item.value)
			this.dropdownItems[index].title = results.label;
			this[item.key] = results.label;
			this[item.labelKey] = results.value;
			this.listHttp(this.category_ids)
			// console.log(item)
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
	background-color: #f6f6fb;
	position: relative;

	.searchBox {
		background-color: #fff;
		padding: 20rpx;
	}

	/deep/ .u-search__content {
		border-radius: 10rpx !important;
		background: #F1F2F5 !important;
	}

	/deep/ .u-search__content__input {
		background-color: #F1F2F5 !important;
	}

	/deep/ .u-search__action {
		color: #414960 !important;
	}

	.product-list-tip {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.screening-box {
		// color: #61687C;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		// flex-wrap: wrap;
		// box-sizing: border-box;
		height: 80rpx;
		background-color: #fff;
		// .screening-tip {
		// 	flex-grow: 1;
		// 	font-size: 28rpx;
		// 	padding-left: 0.6rem;
		// 	position: relative;

		// 	.icon-text {
		// 		position: absolute;
		// 		top: 50%;
		// 		transform: translateY(-50%);
		// 		left: 25rpx;
		// 	}

		// 	.arrow-ul {
		// 		position: absolute;
		// 		top: 40rpx;
		// 		left: -25rpx;
		// 		transform: translate(20%, 0rpx);
		// 		width: 90%;
		// 		background-color: #fff;
		// 		filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
		// 		border-radius: 12rpx;
		// 		padding: 12rpx 8rpx;
		// 		z-index: 9999;

		// 		.arrow-li {
		// 			height: 64rpx;
		// 			line-height: 64rpx;
		// 			display: block;
		// 			font-size: 26rpx;
		// 			padding-left: 8rpx;
		// 			border-radius: 6rpx;
		// 			// border-bottom: 1rpx solid #ecedef;
		// 		}

		// 		.arrow-li:last-child {
		// 			border-bottom: 0
		// 		}

		// 		.arrow-li.on {
		// 			background-color: #F1F2F5;
		// 		}

		// 	}
		// }
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
