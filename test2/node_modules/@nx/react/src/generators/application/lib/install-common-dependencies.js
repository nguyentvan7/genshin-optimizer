"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCommonDependencies = void 0;
const devkit_1 = require("@nx/devkit");
const versions_1 = require("../../../utils/versions");
function installCommonDependencies(host, options) {
    const devDependencies = {};
    // Vite requires style preprocessors to be installed manually.
    // `@nx/webpack` installs them automatically for now.
    if (options.bundler === 'vite' || options.unitTestRunner === 'vitest') {
        switch (options.style) {
            case 'scss':
                devDependencies['sass'] = versions_1.sassVersion;
                break;
            case 'less':
                devDependencies['less'] = versions_1.lessVersion;
                break;
            case 'styl': // @TODO(17): deprecated, going to be removed in Nx 17
                devDependencies['stylus'] = versions_1.stylusVersion;
                break;
        }
    }
    if (options.bundler === 'webpack') {
        if (options.compiler === 'swc') {
            devDependencies['swc-loader'] = versions_1.swcLoaderVersion;
        }
        else if (options.compiler === 'babel') {
            // babel-loader is currently included in @nx/webpack
            // TODO(jack): Install babel-loader and other babel packages only as needed
            devDependencies['@babel/preset-react'] = versions_1.babelPresetReactVersion;
        }
    }
    return (0, devkit_1.addDependenciesToPackageJson)(host, {}, devDependencies);
}
exports.installCommonDependencies = installCommonDependencies;
