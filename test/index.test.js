const babel = require('@babel/core')
const types  = require('@babel/types')
const plugin = require('../lib/index').default;
const visitor = plugin({ types });

const code = `
    import { Select as KSelect, Pagination } from 'k-view';
    import { DatePicker,Checkbox,CheckboxButton,CheckboxGroup } from 'k-view';
    import * as KView from 'k-view';
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
                    if (['checkbox', 'checkbox-button', 'checkbox-group'].includes(name)) {
                        return `k-view/src/components/checkbox/k-${name}`;
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
