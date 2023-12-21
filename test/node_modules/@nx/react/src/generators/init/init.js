"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactInitSchematic = exports.reactInitGenerator = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const js_1 = require("@nx/js");
const versions_1 = require("../../utils/versions");
function setDefault(host) {
    const workspace = (0, devkit_1.readNxJson)(host);
    workspace.generators = workspace.generators || {};
    const reactGenerators = workspace.generators['@nx/react'] || {};
    const generators = Object.assign(Object.assign({}, workspace.generators), { '@nx/react': Object.assign(Object.assign({}, reactGenerators), { application: Object.assign(Object.assign({}, reactGenerators.application), { babel: true }) }) });
    (0, devkit_1.updateNxJson)(host, Object.assign(Object.assign({}, workspace), { generators }));
}
function updateDependencies(host, schema) {
    (0, devkit_1.removeDependenciesFromPackageJson)(host, ['@nx/react'], []);
    const dependencies = {
        react: versions_1.reactVersion,
        'react-dom': versions_1.reactDomVersion,
    };
    if (!schema.skipHelperLibs) {
        dependencies['tslib'] = versions_1.tsLibVersion;
    }
    return (0, devkit_1.addDependenciesToPackageJson)(host, dependencies, {
        '@nx/react': versions_1.nxVersion,
        '@types/node': versions_1.typesNodeVersion,
        '@types/react': versions_1.typesReactVersion,
        '@types/react-dom': versions_1.typesReactDomVersion,
        '@testing-library/react': versions_1.testingLibraryReactVersion,
    });
}
function reactInitGenerator(host, schema) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const tasks = [];
        const jsInitTask = yield (0, js_1.initGenerator)(host, Object.assign(Object.assign({}, schema), { tsConfigName: schema.rootProject ? 'tsconfig.json' : 'tsconfig.base.json', skipFormat: true }));
        tasks.push(jsInitTask);
        setDefault(host);
        if (!schema.e2eTestRunner || schema.e2eTestRunner === 'cypress') {
            (0, devkit_1.ensurePackage)('@nx/cypress', versions_1.nxVersion);
            const { cypressInitGenerator } = yield Promise.resolve().then(() => require('@nx/cypress/src/generators/init/init'));
            const cypressTask = yield cypressInitGenerator(host, {});
            tasks.push(cypressTask);
        }
        if (!schema.skipPackageJson) {
            const installTask = updateDependencies(host, schema);
            tasks.push(installTask);
        }
        return (0, devkit_1.runTasksInSerial)(...tasks);
    });
}
exports.reactInitGenerator = reactInitGenerator;
exports.default = reactInitGenerator;
exports.reactInitSchematic = (0, devkit_1.convertNxGenerator)(reactInitGenerator);
