# babel-plugin-kimport

[![npm version](https://img.shields.io/npm/v/babel-plugin-kimport.svg?style=flat-square)](https://www.npmjs.org/package/babel-plugin-kimport)
[![install size](https://packagephobia.now.sh/badge?p=babel-plugin-kimport)](https://packagephobia.now.sh/result?p=babel-plugin-kimport)
[![npm downloads](https://img.shields.io/npm/dm/babel-plugin-kimport.svg?style=flat-square)](http://npm-stat.com/charts.html?package=babel-plugin-kimport)
[![gitter chat](https://img.shields.io/gitter/room/mzabriskie/babel-plugin-kimport.svg?style=flat-square)](https://gitter.im/mzabriskie/babel-plugin-kimport)
[![build status](https://img.shields.io/travis/SoldierAb/babel-plugin-kimport/master.svg?style=flat-square)](https://travis-ci.org/SoldierAb/babel-plugin-kimport)

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

## Usage

Via `.babelrc` or babel-loader.

```javascript
{
  "plugins": [["kimport", options]]
}
```

## Multiple Module

```javascript

{
  "plugins": [xxx,
    ["kimport", {
      libraryName: "antd",
    }, "antd"],
    ["kimport", {
      libraryName: "test-module",
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



### options

- `["component"]`: import js modularly
- `["component", { "libraryName": "component" }]`: module name
- `["component", { "libraryDirectory": "lib" }]`: lib directory , default `lib`
- `["component", { "camel2UnderlineComponentName": false }]`: whether parse name to underline mode or not, default `false`
- `["component", { "camel2DashComponentName": true }]`: whether parse name to dash mode or not, default `true`

#### customName

We can use `customName` to customize import file path.

For example, the default behavior:

```typescript
import { TimePicker } from "antd"
↓ ↓ ↓ ↓ ↓ ↓
var _button = require('antd/lib/TimePicker');
```

You can set `camel2DashComponentName` to `true` to enable transfer from camel to dash:

```typescript
import { TimePicker } from "antd"
var _button = require('antd/lib/time-picker');
↓ ↓ ↓ ↓ ↓ ↓
```

And finally, you can use `customName` to customize each name parsing:

```js
[
  "import",
    {
      "libraryName": "antd",
      "customName": (name: string) => {
        if (name === 'TimePicker'){
          return 'antd/lib/custom-time-picker';
        }
        return `antd/lib/${name}`;
      }
    }
]
```

So this result is:

```typescript
import { TimePicker } from "antd"
↓ ↓ ↓ ↓ ↓ ↓
var _button = require('antd/lib/custom-time-picker');
```

In some cases, the transformer may serialize the configuration object. If we set the `customName` to a function, it will lost after the serialization.

So we also support specifying the customName with a JavaScript source file path:

```js
[
  "import",
    {
      "libraryName": "antd",
      "customName": require('path').resolve(__dirname, './customName.js')
    }
]
```

The `customName.js` looks like this:

```js
module.exports = function customName(name) {
  return `antd/lib/${name}`;
};
```

#### customStyleName

`customStyleName` works exactly the same as customName, except that it deals with style file path.


