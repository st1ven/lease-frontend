<script>
	export default {
		onLaunch: function() {},
		onShow: function() {},
		onHide: function() {},
		onPageNotFound: function (res) {
		    // 跳转到 404 页面
			uni.switchTab({
				url: "pages/index/index", // 404 页面的路径
			});
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/common/common.scss";

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	// 标题
	.title-color {
		color: #171B25;
	}

	// 副标题 查看更多
	.sub-color {
		color: #61687C;
	}
	
	// 主颜色
	.main-color {
		color: #414960;
	}

	.goods-price {
		display: flex;
		align-items: baseline;
	}

	.price-company {
		color: #FF5B56;
		font-size: 18rpx;
	}

	.price-number {
		color: #FF5B56;
		font-size: 30rpx;
		font-weight: bold;
		margin: 0 5rpx;
	}
</style>
