<template>
	<!-- 我的收藏 -->
	<view class="collection-page" style="background-color: #f6f6fb;">
		<view class="collection-ul" v-if="list.length">
			<view class="collection-li" v-for="(item,index) in list" :key="index" @click="liClick(item)">
				<view class="li-checkbox">
					<u-checkbox-group :v-model="item" @change="checkboxChange(item,index)">
						<u-checkbox activeColor="#ff6633" shape="circle" :checked="item.disabled"></u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="li-img">
					<u-image :showLoading="true" :src="item.Goodsdata.image" width="130rpx" height="130rpx"></u-image>
				</view>
				<view class="head-box">
					<view class="li-msg u-line-2">{{item.Goodsdata.title}}</view>
					<view class="li-price">¥{{item.Goodsdata.price}}元/起</view>
				</view>
			</view>
		</view>
		<view class="collection-no" v-else>
			<u-icon name="warning" color="#9FA3B0" size="45rpx" labelColor="#9FA3B0" labelSize="30rpx" label="暂时没有收藏哦">
			</u-icon>
		</view>
		<view class="collection-bottom" v-if="list.length">
			<view class="bottom-l box">
				<view class="checkbox">
					<u-checkbox-group @change="allChange(list)">
						<u-checkbox activeColor="#ff6633" shape="circle" label="全选" :checked="allCheckFlag"></u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
			<view class="bottom-r box">
				<view class="delAll" @click="delFunc(list,1)">
					删除
				</view>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
		<u-modal :show="modal_show" title="确认删除收藏吗" @confirm="confirm_Modal(item)" :closeOnClickOverlay="true"
			@close="modal_show=false" @cancel="modal_show=false" :showCancelButton="true">
			<view style="text-align: center;" slot="content">
				{{content}}
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageIndex: 1,
				pageSize: 10,
				list: [],
				allCheckFlag: false,
				targetArr: [],
				modal_show: false,
				content: '确认取消收藏吗'
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			checkboxChange(item, index) {
				item.disabled = !item.disabled
				if (item.disabled) {
					this.targetArr.push(item)
				} else {
					for (var i = 0; i < this.targetArr.length; i++) {
						if (item.id == this.targetArr[i].id) {
							this.targetArr.splice(i, 1)
						}
					}
				}
			},
			confirm_Modal() {

				this.modal_show = false
				this.del(this.targetArr)
			},
			liClick(data) {
				uni.navigateTo({
					url: '../goods-detail/goods-detail?id=' + data.Goodsdata.id
				})
			},
			allChange() {
				this.allCheckFlag = !this.allCheckFlag
				this.list.forEach(item => {
					item.disabled = this.allCheckFlag ? true : false
				})
				if (this.allCheckFlag) {
					this.targetArr = this.list
				}
			},
			delFunc(item, type) {
				if (type == 0) {
					this.modal_show = true
					this.targetArr.push(item)
				}
				if (type == 1) {
					if (this.targetArr.length) {
						this.modal_show = true
						// this.del(this.targetArr)
					} else {
						this.$refs.uToast.show({
							message: '请选择',
							type: 'error'
						})
					}
				}
			},
			del(item) {
				let ids = item.map(items => items.goods_id).join(",")
				let opt = {
					url: '/goods/del/like',
					method: 'POST',
					header: "application/x-www-form-urlencoded;charset=utf-8",
					data: {
						ids: ids,
					}
				}
				this.$request(opt, this.getToken).then(res => {
					// 打印调用成功回调
					this.$refs.uToast.show({
						message: res.msg,
						type: 'success',
					})
					this.init()
				})
			},
			init() {
				let opt = {
					url: '/goods/index/like',
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize
					}
				}
				this.$request(opt, this.getToken).then(res => {
					// 打印调用成功回调
					this.list = []
					res.data.data.forEach((item, index) => {
						item.disabled = false
						item.title = index + '-------------'
						this.list.push(item)
					})
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.collection-page {
		background-color: #F6F6FB;
		min-height: 100vh;

		.collection-no {
			position: absolute;
			top: 100rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.collection-ul {
			padding: 25rpx 25rpx 120rpx;

			.collection-li {
				height: 150rpx;
				border-radius: 14rpx;
				margin-bottom: 20rpx;
				display: flex;
				font-size: 24rpx;
				position: relative;
				background-color: #fff;
				padding: 15rpx 0 6rpx 80rpx;

				.li-checkbox {
					position: absolute;
					top: 40%;
					left: 20rpx
				}

				.li-img {
					margin-right: 12rpx;
				}

				.del {
					position: absolute;
					bottom: 20rpx;
					right: 20rpx;
					border-radius: 20rpx;
					border: 1rpx solid #414960;
					padding: 8rpx 12rpx;
					font-size: 16rpx;
				}

				.head-box {
					.li-msg {
						// width: 350rpx;
						padding-top: 20rpx;
						font-size: 28rpx;
					}

					.li-price {
						color: #FF5B56;
						padding-top: 10rpx;
					}
				}
			}
		}

		.collection-bottom {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 90rpx;
			padding-bottom: 20rpx;
			background-color: #fff;
			display: flex;

			.box {
				width: 50%;
				font-size: 30rpx;

				.checkbox {
					margin: 30rpx 0 0 10%;
				}

				.delAll {
					background-color: #FF5B56;
					border-radius: 20rpx;
					color: #fff;
					width: 260rpx;
					text-align: center;
					font-size: 24rpx;
					height: 60rpx;
					line-height: 60rpx;
					margin: 20rpx auto;
				}
			}
		}
	}
</style>
