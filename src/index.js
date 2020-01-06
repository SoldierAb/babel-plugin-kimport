import assert from 'assert';
import { join } from 'path';

function transCamel(_str, symbol) {
	const str = _str[0].toLowerCase() + _str.substr(1);
	return str.replace(/([A-Z])/g, ($1) => `${symbol}${$1.toLowerCase()}`);
}

function winPath(path) {
	return path.replace(/\\/g, '/');
}


function flatArray(arrParam, depArg) {
	let res = [],
		depth = depArg || 1,
		depNum = 0,
		flatMap = (arr) => {
			arr.map((item, index, array) => {
				if (Array.isArray(item)) {
					if (depNum < depth) {
						depNum++;
						flatMap(item);
					} else {
						res.push(item);
					}
				} else {
					res.push(item);
					if (array.length === index + 1) depNum = 0;
				}
			});
		};
	flatMap(arrParam);
	return res;
}


export default function ({ types }) {
	const Programer = {
		visitor: {
			ImportDeclaration(path, { opts }) {
				const { node } = path,
					{ source, specifiers } = node;

				let currentConfigInstance = opts; //plugin 配置

				if (Array.isArray(opts)) {
					currentConfigInstance = opts.find(option => option.libraryName === source.value) || {};
				}

				assert(currentConfigInstance.libraryName, '\n\n libraryName should be provided! \n\n');

				//plugin 配置的依赖库libraryName名称
				const libraryName = currentConfigInstance.libraryName || opts.libraryName || 'k-view';

				//下划线
				currentConfigInstance.camel2UnderlineComponentName = typeof currentConfigInstance.camel2UnderlineComponentName === 'undefined'
					? false
					: currentConfigInstance.camel2UnderlineComponentName;
				//横杆连接    
				currentConfigInstance.camel2DashComponentName = typeof currentConfigInstance.camel2DashComponentName === 'undefined'
					? false
					: currentConfigInstance.camel2DashComponentName;

				// 确认导入库 是否是 .babelrc library属性指定库 以及 如果不是默认导入 才进行按需导入加载
				if (libraryName === source.value && !types.isImportDefaultSpecifier(specifiers[0]) && !types.isImportNamespaceSpecifier(specifiers[0])) {

					let newImports = specifiers.map(specifier => { // 遍历 出导入的每个包的说明描述符
						//转换后的文件名
						const transformedSourceName = currentConfigInstance.camel2UnderlineComponentName
							? winPath(transCamel(specifier.imported.name, '_'))
							: currentConfigInstance.camel2DashComponentName
								? winPath(transCamel(specifier.imported.name, '-'))
								: specifier.imported.name;
						const libraryDirectory = typeof currentConfigInstance.libraryDirectory === 'undefined'
							? 'lib' : currentConfigInstance.libraryDirectory;

						//当前组件路径
						const compDirPath = winPath(join(libraryName, libraryDirectory, transformedSourceName));

						const compInstancePath = currentConfigInstance.customName ? currentConfigInstance.customName(`${compDirPath}`) : `${compDirPath}/index.js`;
						const compInstanceStylePath = currentConfigInstance.customStyleName ? currentConfigInstance.customStyleName(`${transformedSourceName}`) : `${compDirPath}/style.css`;

						return [
							types.importDeclaration([types.importDefaultSpecifier(specifier.local)], types.stringLiteral(compInstancePath)),
							types.callExpression(types.import(), [
								types.stringLiteral(compInstanceStylePath)
							])
						];
					});
					newImports = flatArray(newImports, 1);
					path.replaceWithMultiple(newImports);
				}
			},

		}
	};
	return Programer;
}
