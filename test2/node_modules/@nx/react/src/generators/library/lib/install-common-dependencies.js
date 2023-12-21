"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCommonDependencies = void 0;
const devkit_1 = require("@nx/devkit");
const add_swc_dependencies_1 = require("@nx/js/src/utils/swc/add-swc-dependencies");
const versions_1 = require("../../../utils/versions");
function installCommonDependencies(host, options) {
    const tasks = [];
    const devDependencies = {};
    // Vite requires style preprocessors to be installed manually.
    // `@nx/webpack` installs them automatically for now.
    // TODO(jack): Once we clean up webpack we can remove this check
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
    const baseInstallTask = (0, devkit_1.addDependenciesToPackageJson)(host, {
        react: versions_1.reactVersion,
        'react-dom': versions_1.reactDomVersion,
    }, devDependencies);
    tasks.push(baseInstallTask);
    if (options.compiler === 'swc') {
        tasks.push((0, add_swc_dependencies_1.addSwcDependencies)(host));
    }
    else if (options.compiler === 'babel') {
        tasks.push((0, devkit_1.addDependenciesToPackageJson)(host, {}, { '@babel/preset-react': versions_1.babelPresetReactVersion }));
    }
    return (0, devkit_1.runTasksInSerial)(...tasks);
}
exports.installCommonDependencies = installCommonDependencies;
