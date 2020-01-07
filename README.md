# babel-plugin-kimport

[![npm version](https://img.shields.io/npm/v/babel-plugin-kimport.svg?style=flat-square)](https://www.npmjs.org/package/babel-plugin-kimport)
[![install size](https://packagephobia.now.sh/badge?p=babel-plugin-kimport)](https://packagephobia.now.sh/result?p=babel-plugin-kimport)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-kimport.svg?style=flat-square)](http://npm-stat.com/charts.html?package=babel-plugin-kimport)
[![gitter chat](https://img.shields.io/gitter/room/mzabriskie/babel-plugin-kimport.svg?style=flat-square)](https://gitter.im/mzabriskie/babel-plugin-kimport)
[![build status](https://img.shields.io/travis/SoldierAb/babel-plugin-kimport/master.svg?style=flat-square)](https://travis-ci.org/SoldierAb/babel-plugin-kimport)
<!-- [![code coverage](https://img.shields.io/coveralls/mzabriskie/babel-plugin-kimport.svg?style=flat-square)](https://coveralls.io/r/mzabriskie/babel-plugin-kimport) -->


## Install

```shell
npm i babel-plugin-kimport -D
```

## Example

Converts

```javascript
import { Button } from 'components'
```

to

```javascript
var button = require('components/lib/button')
require('components/lib/button/style.css')
```

## styleLibraryName Example

Converts

```javascript
import Components from 'components'
import { Button } from 'components'
```

to

```javascript
require('components/lib/styleLibraryName/index.css')
var button = require('components/lib/styleLibraryName/button.css')
```

## Usage

Via `.babelrc` or babel-loader.

```javascript
{
  "plugins": [["component", options]]
}
```

## Multiple Module

```javascript

{
  "plugins": [xxx,
    ["component", {
      libraryName: "antd",
      style: true,
    }, "antd"],
    ["component", {
      libraryName: "test-module",
      style: true,
    }, "test-module"]
  ]
}
```

### Component directory structure

```
- lib // 'libDir'
  - index.js // or custom 'root' relative path
  - style.css // or custom 'style' relative path
  - componentA
    - index.js
    - style.css
  - componentB
    - index.js
    - style.css
```

### Theme library directory structure
```
- lib
  - theme-default // 'styleLibraryName'
    - base.css // required
    - index.css // required
    - componentA.css
    - componentB.css
  - theme-material
    - ...
  - componentA
    - index.js
  - componentB
    - index.js
```

 or

```

- lib
  - theme-custom // 'styleLibrary.name'
    - base.css // if styleLibrary.base true
    - index.css // required
    - componentA.css // default 
    - componentB.css
  - theme-material
    - componentA
      -index.css  // styleLibrary.path  [module]/index.css
    - componentB
      -index.css
  - componentA
    - index.js
  - componentB
    - index.js
```

### options

- `["component"]`: import js modularly
- `["component", { "libraryName": "component" }]`: module name
- `["component", { "styleLibraryName": "theme_package" }]`: style module name
- `["component", { "styleLibraryName": "~independent_theme_package" }]`: Import a independent theme package
- `["component", { "styleLibrary": {} }]`: Import a independent theme package with more config
  
  ```
  styleLibrary: {
    "name": "xxx", // same with styleLibraryName
    "base": true,  // if theme package has a base.css
    "path": "[module]/index.css",  // the style path. e.g. module Alert =>  alert/index.css
    "mixin": true  // if theme-package not found css file, then use [libraryName]'s css file
  }
  ```

- `["component", { "style": true }]`: import js and css from 'style.css'
- `["component", { "style": cssFilePath }]`: import style css from filePath
- `["component", { "libDir": "lib" }]`: lib directory
- `["component", { "root": "index" }]`: main file dir
- `["component", { "camel2Dash": false }]`: whether parse name to dash mode or not, default `true`
