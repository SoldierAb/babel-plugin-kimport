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

				let currentConfigInstance = opts;

				if (Array.isArray(opts)) {
					currentConfigInstance = opts.find(option => option.libraryName === source.value) || {};
				}

				assert(currentConfigInstance.libraryName, '\n\n libraryName should be provided! \n\n');

				const libraryName = currentConfigInstance.libraryName || opts.libraryName || 'k-view';

				currentConfigInstance.camel2UnderlineComponentName = typeof currentConfigInstance.camel2UnderlineComponentName === 'undefined'
					? false
					: currentConfigInstance.camel2UnderlineComponentName;
				currentConfigInstance.camel2DashComponentName = typeof currentConfigInstance.camel2DashComponentName === 'undefined'
					? false
					: currentConfigInstance.camel2DashComponentName;

				if (libraryName === source.value && !types.isImportDefaultSpecifier(specifiers[0]) && !types.isImportNamespaceSpecifier(specifiers[0])) {

					let newImports = specifiers.map(specifier => {
						const transformedSourceName = currentConfigInstance.camel2UnderlineComponentName
							? winPath(transCamel(specifier.imported.name, '_'))
							: currentConfigInstance.camel2DashComponentName
								? winPath(transCamel(specifier.imported.name, '-'))
								: specifier.imported.name;
						const libraryDirectory = typeof currentConfigInstance.libraryDirectory === 'undefined'
							? 'lib' : currentConfigInstance.libraryDirectory;

						const compDirPath = winPath(join(libraryName, libraryDirectory, transformedSourceName));
						const compInstancePath = currentConfigInstance.customName ? currentConfigInstance.customName(`${transformedSourceName}`) : `${compDirPath}/index.js`;
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
