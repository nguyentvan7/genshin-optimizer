"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendReactEslintJson = exports.extraEslintDependencies = void 0;
const tslib_1 = require("tslib");
const versions_1 = require("./versions");
exports.extraEslintDependencies = {
    dependencies: {},
    devDependencies: {
        'eslint-plugin-import': versions_1.eslintPluginImportVersion,
        'eslint-plugin-jsx-a11y': versions_1.eslintPluginJsxA11yVersion,
        'eslint-plugin-react': versions_1.eslintPluginReactVersion,
        'eslint-plugin-react-hooks': versions_1.eslintPluginReactHooksVersion,
    },
};
const extendReactEslintJson = (json) => {
    const { extends: pluginExtends } = json, config = tslib_1.__rest(json, ["extends"]);
    return Object.assign({ extends: ['plugin:@nx/react', ...(pluginExtends || [])] }, config);
};
exports.extendReactEslintJson = extendReactEslintJson;
