<template>
	<!-- 上传身份证 -->
	<view class="idCard-box">
		<view class="title_bg">
			<u-image :showLoading="true" :src="idcardto" width="100%" height="470rpx"></u-image>
		</view>
		<view class="title">
			实名认证
		</view>
		<view class="sub-title">
			若暂无照片，可先传任意照片，审核通过后补传即可
		</view>
		<!-- 人像面 -->
		<view class="idCard-positive idCard-content" @click="uploadClick(1)">
			<u-image :src="positiveSrc" mode="aspectFit" width="590rpx" height="284rpx"></u-image>
			<text class="idCard-txt" v-if="type == 'detail' && txtFlag == false">请上传身份证正面照</text>
		</view>
		<!-- 国徽面 -->
		<view class="idCard-reverse idCard-content" @click="uploadClick(2)">
			<u-image :src="reverseSrc" mode="aspectFit" width="590rpx" height="284rpx"></u-image>
			<text class="idCard-txt" v-if="type == 'detail' && txtFlag == false">请上传身份证反面照</text>
		</view>

		<!-- 提交 -->
		<view class="btn" @click="sub" v-if="type == 'detail'">
			提交
		</view>
		<canvas id="ctx" width="610" height='610' style="opacity: 0;position: fixed;left: -100%;"
			v-if="type == 'detail'"></canvas>
		<u-toast ref="uToast"></u-toast>

	</view>
</template>

<script>
export default {
	data() {
		return {
			positiveSrc: "",
			reverseSrc: "",
			type: '', // order 查看身份证 detail //上传身份证
			txtFlag: false,
			Cheight: 610,
			Cwidth: 610,
			idcardto: ''
		}
	},
	onShow() {
		if (this.txtFlag == false) {
			this.init()
		}
	},

	watch: {
		Cheight(newVal, oldVal) {
			this.Cheight = newVal
		},
		Cwidth(newVal, oldVal) {
			this.Cwidth = newVal
		},
	},
	onLoad(obj) {
		this.idcardtop()
		this.type = obj.type
		this.params = obj
	},
	methods: {
		idcardtop() {
			let opt = {
				url: '/idcardtop',
				method: 'GET',
			}
			this.$request(opt).then(res => {
				console.log(res.data)
				this.idcardto = res.data
			})
		},
		init() {
			// 获取身份证识别结果
			let opt = {
				url: '/bindidcard'
			}
			this.$request(opt).then(res => {
				this.positiveSrc = res.data.idcard_front || ''
				this.reverseSrc = res.data.idcard_back || ''
				if (res.data.idcard_front) {
					this.txtFlag = true
				}
			})
		},
		getImgInfo(imagePath, num) {
			let _this = this;
			// #ifdef MP-ALIPAY
			uni.getImageInfo({
				src: imagePath,
				success: async (res) => {
					let imgWidth = res.width / 2.5;
					let imgHeight = res.height / 2.5;
					let canvas = uni.createCanvasContext("ctx");
					canvas.drawImage(imagePath, 0, 0, imgWidth, imgHeight); // 1. 绘制图片至canvas
					// 绘制完成后执行回调
					canvas.draw(false, async () => {
						let base64 = await canvas.toDataURL({
							width: imgWidth,
							height: imgHeight,
							quality: 1,
						});
						console.log('64---', base64)
						// base64 = base64.replace("data:image/png;base64,", "");
						await this.imageHttp(base64, num);
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
						_this.imageHttp(base64, num);
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
					_this.imageHttp(base64data, num);
				};
				reader.readAsDataURL(blob);
			};
			xhr.send();
			// #endif
		},
		//提交身份证正反面
		sub() {
			if (this.positiveSrc == '') {
				// let msg = this.positiveSrc == '' ? '请输入身份证正面照' : ""
				// msg = this.reverseSrc == '' ? '请输入身份证反面照' : ""
				return this.$refs.uToast.show({
					message: '请上传身份证正面照',
					icon: 'error',
					type: 'error',
				})
			} else if (this.reverseSrc == '') {
				return this.$refs.uToast.show({
					message: '请上传身份证反面照',
					icon: 'error',
					type: 'error',
				})
			}
			let opt = {
				url: '/bindidcard',
				method: 'POST',
				header: 'application/json; charset=utf-8',
				data: {
					front_img: this.positiveSrc,
					back_img: this.reverseSrc
				}
			}
			this.$request(opt).then(res => {
				this.$refs.uToast.show({
					message: res.msg || '上传成功',
					icon: 'success',
					type: 'success',
					complete() {
						uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
							delta: 1
						});
					}
				})
			})
		},

		uploadClick(num) {
			if (this.type != "detail") {
				return
			}
			let that = this

			uni.chooseImage({
				/** 调取相册*/
				sourceType: ['camera', 'album'],
				count: 1,
				sizeType: ['compressed'],
				success: (res1) => {
					// alert(JSON.stringify(res1))
					let apFilePaths = [];
					// #ifdef MP-ALIPAY
					apFilePaths = res1.apFilePaths;
					// #endif
					// #ifndef MP-ALIPAY
					apFilePaths = res1.tempFilePaths;
					// #endif
					console.log(apFilePaths, 'apFilePathsapFilePathsapFilePaths')
					that.getImgInfo(apFilePaths[0], num)
				},
				fail: (e) => {
					// console.log('错误原因：', e)
					// let msg = e.error == 11 ? e.errorMessage || '取消上传' : '上传失败'
					// that.$refs.uToast.show({
					// 	message: msg,
					// 	type: 'error'
					// })
				}
			})
		},
		imageHttp(base64, num) {
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
				this.txtFlag = true //上传成功后背景图隐藏
				if (num == 1) {
					this.positiveSrc = res.data
				}
				if (num == 2) {
					this.reverseSrc = res.data
				}
				console.log(res, num, '----success',)
				console.log(this.positiveSrc, 'this.positiveSrc ',)
				console.log(this.reverseSrc, 'this.reverseSrc',)
			}).catch(res => {
				console.log(res, '------error')
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
.idCard-box {
	height: 100vh;
	background-color: #fff;

	.title_bg {
		width: 100%;
		height: 470rpx;
	}

	.title {
		color: #414960;
		padding: 36rpx 0 16rpx 0;
		font-size: 36rpx;
		text-align: center;
	}

	.sub-title {
		color: #61687C;
		padding-bottom: 36rpx;
		font-size: 24rpx;
		text-align: center;
	}

	.idCard-content {
		height: 284rpx;
		margin: 0 80rpx 26rpx;
		position: relative;

		.idCard-txt {
			font-size: 30rpx;
			color: #FF6633;
			position: absolute;
			left: 50%;
			bottom: 60rpx;
			transform: translateX(-50%);
		}
	}

	.btn {
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
