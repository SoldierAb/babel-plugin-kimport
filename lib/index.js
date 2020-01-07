"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function transCamel(_str, symbol) {
  var str = _str[0].toLowerCase() + _str.substr(1);

  return str.replace(/([A-Z])/g, function ($1) {
    return "".concat(symbol).concat($1.toLowerCase());
  });
}

function winPath(path) {
  return path.replace(/\\/g, '/');
}

function flatArray(arrParam, depArg) {
  var res = [],
      depth = depArg || 1,
      depNum = 0,
      flatMap = function flatMap(arr) {
    arr.map(function (item, index, array) {
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

function _default(_ref) {
  var types = _ref.types;
  var Programer = {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, _ref2) {
        var opts = _ref2.opts;
        var node = path.node,
            source = node.source,
            specifiers = node.specifiers;
        var currentConfigInstance = opts;

        if (Array.isArray(opts)) {
          currentConfigInstance = opts.find(function (option) {
            return option.libraryName === source.value;
          }) || {};
        }

        (0, _assert["default"])(currentConfigInstance.libraryName, '\n\n libraryName should be provided! \n\n');
        var libraryName = currentConfigInstance.libraryName || opts.libraryName || 'k-view';
        currentConfigInstance.camel2UnderlineComponentName = typeof currentConfigInstance.camel2UnderlineComponentName === 'undefined' ? false : currentConfigInstance.camel2UnderlineComponentName;
        currentConfigInstance.camel2DashComponentName = typeof currentConfigInstance.camel2DashComponentName === 'undefined' ? false : currentConfigInstance.camel2DashComponentName;

        if (libraryName === source.value && !types.isImportDefaultSpecifier(specifiers[0]) && !types.isImportNamespaceSpecifier(specifiers[0])) {
          var newImports = specifiers.map(function (specifier) {
            var transformedSourceName = currentConfigInstance.camel2UnderlineComponentName ? winPath(transCamel(specifier.imported.name, '_')) : currentConfigInstance.camel2DashComponentName ? winPath(transCamel(specifier.imported.name, '-')) : specifier.imported.name;
            var libraryDirectory = typeof currentConfigInstance.libraryDirectory === 'undefined' ? 'lib' : currentConfigInstance.libraryDirectory;
            var compDirPath = winPath((0, _path.join)(libraryName, libraryDirectory, transformedSourceName));
            var compInstancePath = currentConfigInstance.customName ? currentConfigInstance.customName("".concat(transformedSourceName)) : "".concat(compDirPath, "/index.js");
            var compInstanceStylePath = currentConfigInstance.customStyleName ? currentConfigInstance.customStyleName("".concat(transformedSourceName)) : "".concat(compDirPath, "/style.css");
            return [types.importDeclaration([types.importDefaultSpecifier(specifier.local)], types.stringLiteral(compInstancePath)), types.callExpression(types["import"](), [types.stringLiteral(compInstanceStylePath)])];
          });
          newImports = flatArray(newImports, 1);
          path.replaceWithMultiple(newImports);
        }
      }
    }
  };
  return Programer;
}