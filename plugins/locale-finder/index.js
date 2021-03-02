const childprocess = require('child_process');
const fs = require('fs');
const path = require('path');
const { normalizeJSON } = require('./utils');

console.log('path ', __dirname);
// 项目根目录,package.json文件所处目录
const ProjectRootDir = path.join(__dirname, '../../');

// 执行脚本输出文件目录名称
const FinderOutputDirname = 'localeFinder';

// 执行脚本输出文件目录
const FinderOutputDir = path.join(ProjectRootDir, FinderOutputDirname);

// 判断脚本输出目录是否存在，存在则删除目录
if (fs.existsSync(FinderOutputDir)) {
  childprocess.execSync(`rimraf ${FinderOutputDir}`);
}
// 新建脚本输出目录
fs.mkdirSync(FinderOutputDir);

// 第一步, 将项目中的typescript文件转换为JavaScript文件
console.log('*** start compile typescript file *** ');

// 忽略该步错误
try {
  const compileCommand = `tsc -p .  --target ES6 --module es6 --jsx preserve --outDir ${FinderOutputDirname}/extracted --sourceMap false`;
  const compileStdout = childprocess.execSync(compileCommand);

  console.log('complie output ', compileStdout);
} catch (e) {
  // console.log("complie error ", e)
}

// 第二步, 将编译完成的JavaScript使用babel脚本识别出代码中的国际化内容,并返回对应的JSON文件
console.log('*** start babel JavaScript file *** ');
// process.chdir(__dirname)
try {
  let baseExtraCmd = `babel  \"${FinderOutputDirname}/extracted/**/*.jsx\" \"${FinderOutputDirname}/extracted/**/*.js\" --config-file ./plugins/locale-finder/.reactIntl.babelrc`;
  if (process.platform == 'win32') {
    baseExtraCmd += ` --out-file ${FinderOutputDirname}/transTmpExtract.js`;
  } else {
    baseExtraCmd += ' --out-file /dev/null';
  }

  const extractStdout = childprocess.execSync(baseExtraCmd);
  console.log('babel output ', extractStdout.toString());
} catch (e) {
  console.log('babel error ', e);
}

// 第三步, 使用上一步生成的JSON文件，整合为单一JSON文件，并执行翻译
console.log('*** start translate JSON file *** ');
const transCommand = `atool-l10n --config ./plugins/locale-finder/l10n.config.js`;
const transStdout = childprocess.execSync(transCommand);
console.log('trans output ', transStdout.toString());

// 第四步，读取生成的JSON文件内容
console.log('*** start read JSON file *** ');
const outputJSONFile = path.join(FinderOutputDir, 'localesJson', 'zh.json');
let outputJSON = {};
try {
  const outputJSONStr = fs.readFileSync(outputJSONFile, {
    encoding: 'utf-8',
  });
  outputJSON = JSON.parse(outputJSONStr);
  // console.log("result ", typeof outputJSON, Object.keys(outputJSON))
} catch (e) {}

// 第五步，读取代码中现有的locales目录，并转换为commonjs模块
console.log('*** start babel locales dir *** ');
const currentLocalesDir = path.join(
  FinderOutputDir,
  'extracted',
  'src',
  'locales',
);
const babeltargetLocalesDir = path.join(FinderOutputDir, 'commonjslocales');
const localesBabelCommand = `babel ${currentLocalesDir} --out-dir ${babeltargetLocalesDir} --config-file ${__dirname}/.commonjs.babelrc`;
try {
  const localesBabelStdout = childprocess.execSync(localesBabelCommand);
  console.log('locales babel stdout ', localesBabelStdout.toString());
} catch (e) {}

// 第六步，读取转换为commonjs的locales文件中的zh-CN.js 并将其与第四步生成的JSON文件做merge，(zh-CN.js文件中的优先级更高)
// 然后将结果写入 output/result.json
console.log('*** start merge json file *** ');
const zhCNJSON = require(path.join(babeltargetLocalesDir, 'zh-CN.js'));
// 合并json文件与现有locales文件
const newOutputJSON = normalizeJSON(zhCNJSON.default, outputJSON);
// 新建output目录
fs.mkdirSync(path.join(FinderOutputDir, 'output'));
const resultOutputPath = path.join(FinderOutputDir, 'output', 'result.json');
fs.writeFileSync(resultOutputPath, JSON.stringify(newOutputJSON), {
  encoding: 'utf-8',
});

console.log('*** Finish *** ');
