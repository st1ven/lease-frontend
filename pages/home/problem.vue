<template>
	<view class="problem-page" style="background-color: #f6f6fb;">
		<view class="problem-form">

			<u-textarea height="370rpx" border="none" v-model="textareaVal" :maxlength="300" :count="true"
				placeholder="您可以输入问题或建议，我们收到后会及时跟进"></u-textarea>

			<view class="upload-box">
				<view class="upload-icon" v-for="(item, index) in fileList" :key="index">
					<image :src="item" style="width: 117rpx; height: 117rpx;"></image>
					<view class="icon-del">
						<u-icon name="close-circle" color="#FF5B56" size="32rpx" @click="deletePic(index)"></u-icon>
					</view>
				</view>

				<view class="upload-icon" v-if="fileList.length < 9">
					<view class="icon-box">
						<u-icon name="plus" color="#9FA3B0" size="60rpx" :bold="false" top="2rpx" left="10rpx" @click="uploadClick">
						</u-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="problem-btn" @click="JumpOrder()">
			提交
		</view>

		<!-- 提示框 -->
		<u-toast ref="uToast"></u-toast>
		<canvas id="canvas" width="610" height="610" style="opacity: 0;"></canvas>
	</view>
</template>

<script>
export default {
	data() {
		return {
			textareaVal: "",
			fileList: [],

		}
	},
	onLoad() {
		this.ctx = uni.createCanvasContext('canvas');
	},
	methods: {
		JumpOrder() {
			// uni.navigateTo({
			// 	url: "../home/home"
			// })
			if (this.textareaVal == '') {
				return this.$refs.uToast.show({
					message: '请详细描述您所遇到的问题？',
					type: 'error',
				})
			}
			if (this.fileList <= 0) {
				return this.$refs.uToast.show({
					message: '请上传问题的图片？',
					type: 'error',
				})
			}
			let fileList = this.fileList.join()
			let opt = {
				url: '/feedback',
				method: 'POST',
				header: 'application/json; charset=utf-8',
				data: {
					content: this.textareaVal,
					image: fileList
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				this.$refs.uToast.show({
					message: '提交成功',
					type: 'success',
					duration: 2000,
					complete() {
						uni.switchTab({
							url: '/pages/home/home'
						})
					}
				})

			})
		},


		deletePic(index) {
			this.fileList.splice(index, 1)
		},

		uploadClick() {
			let ctx = this.ctx
			let that = this
			uni.chooseImage({
				/** 调取相册*/
				sourceType: ['camera', 'album'],
				sizeType:['compressed'],
				count: 1,
				success: (res1) => {
					console.log(res1, 'apFilePathsapFilePathsapFilePaths')
					let apFilePaths = [];
					// #ifdef MP-ALIPAY
					apFilePaths = res1.apFilePaths;
					// #endif
					// #ifndef MP-ALIPAY
					apFilePaths = res1.tempFilePaths;
					// #endif
					console.log(apFilePaths, 'apFilePathsapFilePathsapFilePaths')
					for (let i = 0; i < apFilePaths.length; i++) {
						that.getImgInfo(apFilePaths[i], i)
					}
				},
				fail: (e) => {
					console.log(e)
					let msg = e.error == 11 ? e.errorMessage || '取消上传' : '上传失败'

					that.$refs.uToast.show({
						message: msg,
						type: 'error'
					})
				}
			})
		},
		getImgInfo(imagePath, i) {
			console.log(imagePath, 'imagePathimagePathimagePath')
			let _this = this
			// #ifdef MP-ALIPAY
			uni.getImageInfo({
				src: imagePath,
				success: async (res) => {
					let imgWidth = res.width / 2.5;
					let imgHeight = res.height / 2.5;
					let canvas = uni.createCanvasContext("canvas");
					console.log(canvas, 'canvascanvascanvas')
					canvas.drawImage(imagePath, 0, 0, imgWidth, imgHeight); // 1. 绘制图片至canvas
					console.log(i, imagePath)

					// 绘制完成后执行回调
					canvas.draw(false, async () => {
						let base64 = await canvas.toDataURL({
							width: imgWidth,
							height: imgHeight,
							quality: 1,
						});
						console.log(imagePath, '64---', base64)
						// base64 = base64.replace("data:image/png;base64,", "");
						await this.imageHttp(base64);
					});
				},
			});
			// #endif
			// #ifdef APP-PLUS
			plus.io.resolveLocalFileSystemURL(imagePath, (entry) => {
				console.log(entry, 'entryentryentry')
				entry.file((file) => {
					console.log(file, 'filefilefile')
					let fileReader = new plus.io.FileReader();
					fileReader.onloadend = (e) => {
						console.log(e, 'e')
						let base64 = e.target.result;
						_this.imageHttp(base64);
					};
					fileReader.readAsDataURL(file);
				})
			})
			// #endif
			// #ifdef H5
			console.log(imagePath, 'imagePathimagePath')
			let blobUrl = imagePath;
			const xhr = new XMLHttpRequest();
			xhr.open("GET", blobUrl);
			xhr.responseType = "blob";
			xhr.onload = function () {
				const blob = xhr.response;
				const reader = new FileReader();
				reader.onloadend = function () {
					let base64data = reader.result.split(",")[1];
					console.log(base64data, 'base64database64database64data')
					// 加上 base64 前缀
					base64data = "data:image/png;base64," + base64data;
					_this.imageHttp(base64data);
				};
				reader.readAsDataURL(blob);
			};
			xhr.send();
			// #endif
		},

		imageHttp(base64) {
			let opt = {
				url: '/base64upload',
				method: 'POST',
				header: 'application/json; charset=utf-8',
				data: {
					url: base64
				}
			}
			this.$request(opt).then(res => {
				// 打印调用成功回调
				// base64ToPath(res.data).then(path => { 
				this.fileList.push(res.data)
				// })
			}).catch(res => {
				this.$refs.uToast.show({
					message: res.msg || '上传失败',
					type: 'error'
				})
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.problem-page {
	background-color: #F6F6FB;
	padding: 24rpx;
	height: 100vh;

	.problem-form {
		background-color: #fff;
		min-height: 598rpx;
		border-radius: 14rpx;

		/deep/ .u-textarea__count {
			display: none;
		}
	}

	.upload-box {
		display: flex;
		flex-wrap: wrap;
	}

	/deep/.u-upload__button {
		// margin-left: 44rpx;
		margin-bottom: 37rpx;
		background-color: #fff;
		border: 1rpx solid #E2E5EA;
		border-radius: 8rpx;
	}

	/deep/.u-upload {
		padding-left: 44rpx;
	}

	.icon-del {
		position: absolute;
		top: -15rpx;
		right: -15rpx;
		background-color: #fff;
		border-radius: 50%;
	}

	.upload-icon {
		width: 117rpx;
		height: 117rpx;
		border: 1rpx solid #E2E5EA;
		border-radius: 8rpx;
		margin-left: 44rpx;
		position: relative;
		margin-bottom: 20rpx;

		.icon-box {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

		.problem-btn {
			width: 80%;
			height: 81rpx;
			background: #FF6633;
			border-radius: 14rpx;
			line-height: 81rpx;
			margin: 81rpx auto;
			color: #fff;
			text-align: center;
		}
	}
</style>
