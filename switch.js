const config = require('./common/config');
const fs = require('fs');
const path = require('path');

function replaceTextInFiles(directory, searchValue, replaceValue) {
	const files = fs.readdirSync(directory);

	files.forEach((file) => {
			const filePath = path.join(directory, file);
			const stats = fs.statSync(filePath);

			if (stats.isDirectory()) {
				// 排除 /uni_modules 目录
				if (file === 'uni_modules') {
					return;
				}

				replaceTextInFiles(filePath, searchValue, replaceValue); // 递归处理子目录
			} else {
				// 排除 /common/config.js 文件
				if (file === 'config.js' && directory.endsWith('/common')) {
					return;
				}

				// 读取文件内容
				let content = fs.readFileSync(filePath, '8');

				// 替换文本
				content = content.replace(new RegExp(config[searchValue].AppId, 'gi'), config[replaceValue].AppId)
								 .replace(new RegExp(config[searchValue].Name, 'gi'), config[replaceValue].Name)
								 .replace(new RegExp(config[searchValue].Color, 'gi'), config[replaceValue].Color)
								 .replace(new RegExp(searchValue, 'gi'), replaceValue);

				// 写入替后的内容
				fs.writeFileSync(filePath, content, 'utf8');
		}
	});
}

// 获取命令行参数
const searchValue = process.argv[2];
const replaceValue = process.argv[3];
if (searchValue == undefined || replaceValue == undefined) {
  console.error('请输入参数，示例：node switch.js fengwo jzz');
  process.exit(1);
}
// 执行替换操作
// replaceTextInFiles(__dirname, searchValue, replaceValue);