<template>
	<!-- 续租 -->
	<view class="help-page">
		<view class="help-tab">
			<u-tabs :list="tableList" @click="click" :scrollable="false"></u-tabs>
		</view>
		<view class="help-ul">
			<u-collapse accordion :border="true" :isLink="true">
				<view class="" v-for="(item,index) in ulList">
					<u-collapse-item :border="false" :isLink="true">
						<text slot="title" class="u-page__item__title__slot-title">{{item.title}}</text>
						<text class="u-collapse-content">{{item.content}}</text>
						<text slot="right-icon" class="u-cell__right-icon-wrap">
							<u-icon name="arrow-right" color="#333" size="30rpx"></u-icon>
						</text>
					</u-collapse-item>
				</view>
			</u-collapse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tableList: [],
				ulList: [],
				allList: []
			}
		},
		 
		onShow() {
			this.init()
		},
		methods: {
			click(data) {
				this.ulList = this.allList[data.index].list
			},
			init() {
				let opt = {
					url: "/faq/index",
				}
				this.$request(opt).then(res => {
					// 打印调用成功回调
					this.allList = res.data
					res.data.forEach(item => {
						this.tableList.push({
							name: item.name
						})
					})
					this.ulList = res.data[0].list
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.help-page {
		background-color: #fff;
		// height: 100vh;

		.help-tab {
			height: 98rpx;
			background-color: #fff;
			width: 100%;
		}

		.help-ul {
			padding: 0 28rpx;
			height: calc(100vh - 98rpx);
		}
	}
</style>
