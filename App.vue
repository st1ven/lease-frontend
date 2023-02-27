<script>
	export default {
		onLaunch: function() {},
		onShow: function() {},
		onHide: function() {},
		onPageNotFound: function (res) {
		    		// 跳转到 404 页面：
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
		color: #1F1F1F;
	}

	// 副标题 查看更多
	.sub-color {
		color: #666666;
	}
	
	// 主颜色
	.main-color {
		color: #333333;
	}

	.goods-price {
		display: flex;
		align-items: baseline;
	}

	.price-company {
		color: #E60000;
		font-size: 18rpx;
	}

	.price-number {
		color: #E60000;
		font-size: 30rpx;
		font-weight: bold;
		margin: 0 5rpx;
	}
</style>
