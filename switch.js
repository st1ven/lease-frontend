const config = require('./common/config');
const fs = require('fs');
const path = require('path');

function replaceTextInFiles(directory, searchValue, replaceValue) {
	const files = fs.readdirSync(directory);

	files.forEach((file) => {
		const filePath = path.join(directory, file);
		const fileExt = path.extname(filePath).toLowerCase();
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			// 排除目录
			if (file === 'uni_modules' || file === 'node_modules' || file === '.git' || file === 'unpackage' ||
				file === '.hbuilderx') {
				return;
			}
			// 递归处理子目录
			replaceTextInFiles(filePath, searchValue, replaceValue);
		} else {
			// 排除配置文件
			if (file === 'config.js' && directory.endsWith('/common')) {
				return;
			}
			// 限制后缀文件
			if (fileExt === '.js' || fileExt === '.json' || fileExt === '.css' || fileExt === '.scss' ||
				fileExt === '.vue' || fileExt === '.html') {
				// 读取文件内容
				let content = fs.readFileSync(filePath, 'utf8');
				// 替换文本
				content = content.replace(new RegExp(config[searchValue].AppId, 'gi'), config[replaceValue].AppId)
					.replace(new RegExp(config[searchValue].Name, 'gi'), config[replaceValue].Name)
					.replace(new RegExp(config[searchValue].Color, 'gi'), config[replaceValue].Color)
					.replace(new RegExp('config.' + searchValue, 'gi'), 'config.' + replaceValue)
					.replace(new RegExp('base/' + searchValue, 'gi'), 'base/' + replaceValue);
				// 写入替后的内容
				fs.writeFileSync(filePath, content, 'utf8');
			}
		}
	});
}

// 获取命令行参数
const searchValue = process.argv[2];
const replaceValue = process.argv[3];

if (searchValue === undefined || replaceValue === undefined) {
	console.error('请输入参数，示例：node switch.js fengwo jzz');
	process.exit(1);
}

// 执行替换操作
replaceTextInFiles(__dirname, searchValue, replaceValue);
