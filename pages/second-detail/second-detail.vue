<template>
	<view class="goods-box" style="background-color: #f6f6fb;">
		<iz-goods-item ImgBoxH="333rpx" :newList="list" v-if="list.length" />

		<view class="product-list-tip" v-else>
			<u-icon name="warning" color="#ccc" size="45rpx" labelColor="#ccc" labelSize="30rpx" label="暂时没有商品哦">
			</u-icon>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				id: '',
				pageSize: 20,
				pageIndex: 1
			};
		},

		onLoad(obj) {
			this.id = obj.id
			console.log(this.id, '----second-detail')
			uni.setNavigationBarTitle({
				title: obj.title
			});
		},
		onShow() {
			this.init()
		},
		methods: {
			
			init() {
				let opt = {
					url: '/second/more',
					data: {
						category_id: this.id, //分类id
						pageSize: this.pageSize,
						pageIndex: this.pageIndex
					}
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.list = res.data.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goods-box {
		height: 100vh;
		position: relative;
		background-color: #F6F6FB;
		.product-list-tip {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
