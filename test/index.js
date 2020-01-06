const babel = require('babel-core');
const types = require('babel-types');

const plugin = require('./../lib/index.js');

const visitor = plugin({types});

const code = `
    import { Select as BeeSelect, Pagination } from 'k-view';
    import { DatePicker } from 'k-view';
    import * as Bee from 'k-view';
    import lodash from 'lodash';
`;

const result = babel.transform(code, {
    plugins: [
        [
            visitor,
            {
                "libraryName": "k-view",
                "camel2DashComponentName": true,
                "customName": (name) => {
                    // k-view 1.0.0
                    if (name === 'bee-option') {
                        return `k-view/src/components/select/${name}`;
                    }
                    if (name.startsWith('bee-')) {
                        return `k-view/src/components/${name.substr(4)}/${name}`;
                    }
                    if (['radio', 'radio-button', 'radio-group'].includes(name)) {
                        return `k-view/src/components/radio/bee-${name}`;
                    }
                    if (['checkbox', 'checkbox-button', 'checkbox-group'].includes(name)) {
                        return `k-view/src/components/checkbox/bee-${name}`;
                    }
                    if (name === 'date-combine-range-picker') {
                        name = 'dateCombine-range-picker';
                    }
                    if (name === 'tipsover') {
                        return `k-view/src/components/tipsover/tipsover-theme`;
                    }
                    if (name === 'loading' || name === 'toast') {
                        return `k-view/src/components/${name}/index.js`;
                    }
                    return `k-view/src/components/${name}/${name}`;
                }
            }
        ]
    ]
});

console.log(result.code);