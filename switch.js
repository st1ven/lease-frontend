const config = require('./common/config');
const fs = require('fs');
const path = require('path');

function replaceStringInFile(filePath, searchString, replaceString) {
    const fileExt = path.extname(filePath).toLowerCase();

    if (fileExt === '.js' || fileExt === '.json' || fileExt === '.css' || fileExt === '.scss' || fileExt === '.vue') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const newContent = fileContent.replace(new RegExp(config[searchString].AppId, 'gi'), config[replaceString].AppId)
					.replace(new RegExp(config[searchString].Name, 'gi'), config[replaceString].Name)
					.replace(new RegExp(config[searchString].Color, 'gi'), config[replaceString].Color)
					.replace(new RegExp(searchString, 'gi'), replaceString);
        fs.writeFileSync(filePath, newContent);
        console.log(`替换文件：${filePath}`);
    }
}

function traverseDirectory(dirPath, searchString, replaceString) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory() && (file !== 'uni_modules' || file !== '.git')) {
            traverseDirectory(filePath, searchString, replaceString);
        } else if (stats.isFile() 
            && !(file === 'config.js' && dirPath.includes('/common'))) {
            replaceStringInFile(filePath, searchString, replaceString);
        }
    });
}

function replaceInDirectory(dirPath, searchString, replaceString) {
    traverseDirectory(dirPath, searchString, replaceString);
    console.log('替换完成');
}

const searchString = process.argv[2];
const replaceString = process.argv[3];
if (searchString == undefined || replaceString == undefined) {
  console.error('请输入参数，示例：node switch.js fengwo jzz');
  process.exit(1);
}
replaceInDirectory(__dirname, searchString, replaceString);
