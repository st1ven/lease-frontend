const BASE_URL = "https://api.jiulove.cn"; //域名抽取
const HEADER = {
	'content-type': 'multipart/form-data'
}; //头部
// const get_token = uni.getStorageSync('token') || ''; //获取token

/* 封装公共的请求 post get put */
export const $request = (options, get_token) => {
	// uni.showLoading({
		// title: "加载中..."
	// })
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			header: {
				'content-type': options.header || 'multipart/form-data',
				token: uni.getStorageSync('token') || ''
			},
			data: options.data || {},
			dataType: 'json',
			success: (res) => {
				setTimeout(() => {
					uni.hideLoading()
				}, 10)
				if (res.data.code == 1) {
					return resolve(res.data)
				} else if (res.data.code == 2) {
					uni.removeStorageSync('token');
					uni.removeStorageSync('avatar');
					uni.removeStorageSync('nickName');
					uni.showToast({
						title: res.data.msg || "获取数据失败",
						success() {
							uni.switchTab({
								url: '/pages/home/home'
							})
						}
					})
					return
				} else {
					return uni.showToast({
						title: res.data.msg || '查询失败',
						duration: 3000,
						success() {
							// uni.navigateBack({ //返回上一页
							// 	success: () => {
							// 		let page = getCurrentPages()
							// 			.pop(); //跳转页面成功之后
							// 		if (!page) {
							// 			return;
							// 		} else {
							// 			page.onLoad(page
							// 				.options); // page自带options对象.
							// 		}
							// 	}
							// })
						}
					})
				}

			},
			fail: (err) => {
				// catch((err) =>{   // reject 的调用,在then后面接
				//     console.log(err);
				// })
				uni.showToast({
					title: err || "获取数据失败"
				})
				reject(err);
			}
		})
	})
}

export const unique = (arr1, txt) => {
	const res = new Map();
	return arr1.filter((a) => !res.has(a[txt]) && res.set(a[txt], 1))
}

//图片文件类的上传
export const $UploadFile = (path) => {
	console.log(path, '-----------开始')
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: BASE_URL + '/base64upload', //服务地址
			files: path,
			method: 'POST',
			fileType: 'image',
			header: {
				"Content-Type": "multipart/form-data"
			},
			success: (res) => {
				console.log(res, '-----------上传成功')
				resolve(res);
			},
			fail: (err) => {
				console.log(res, '失败了')
				reject(err);

			}
		});

	})
}
