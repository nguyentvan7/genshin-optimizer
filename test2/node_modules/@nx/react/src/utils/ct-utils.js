"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isComponent = exports.getBundlerFromTarget = exports.addCTTargetWithBuildTarget = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const ensure_typescript_1 = require("@nx/js/src/utils/typescript/ensure-typescript");
const ast_utils_1 = require("./ast-utils");
let tsModule;
const allowedFileExt = new RegExp(/\.[jt]sx?/);
const isSpecFile = new RegExp(/(spec|test)\./);
function addCTTargetWithBuildTarget(tree, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let found = { target: options.buildTarget, config: undefined };
        // Specifically undefined as a workaround for Remix to pass an empty string as the buildTarget
        if (options.buildTarget === undefined) {
            const { findBuildConfig } = yield Promise.resolve().then(() => require('@nx/cypress/src/utils/find-target-options'));
            found = yield findBuildConfig(tree, {
                project: options.project,
                buildTarget: options.buildTarget,
                validExecutorNames: options.validExecutorNames,
            });
            assertValidConfig(found === null || found === void 0 ? void 0 : found.config);
        }
        const projectConfig = (0, devkit_1.readProjectConfiguration)(tree, options.project);
        projectConfig.targets['component-test'].options = Object.assign(Object.assign({}, projectConfig.targets['component-test'].options), { devServerTarget: found.target, skipServe: true });
        (0, devkit_1.updateProjectConfiguration)(tree, options.project, projectConfig);
        return found;
    });
}
exports.addCTTargetWithBuildTarget = addCTTargetWithBuildTarget;
function assertValidConfig(config) {
    if (!config) {
        throw new Error('Unable to find a valid build configuration. Try passing in a target for an app. --build-target=<project>:<target>[:<configuration>]');
    }
}
function getBundlerFromTarget(found, tree) {
    var _a, _b, _c;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (found.target && ((_a = found.config) === null || _a === void 0 ? void 0 : _a.executor)) {
            return found.config.executor === '@nrwl/vite:build' ||
                found.config.executor === '@nx/vite:build'
                ? 'vite'
                : 'webpack';
        }
        const { target, project } = (0, devkit_1.parseTargetString)(found.target, yield (0, devkit_1.createProjectGraphAsync)());
        const projectConfig = (0, devkit_1.readProjectConfiguration)(tree, project);
        const executor = (_c = (_b = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig.targets) === null || _b === void 0 ? void 0 : _b[target]) === null || _c === void 0 ? void 0 : _c.executor;
        return executor === '@nrwl/vite:build' || executor === '@nx/vite:build'
            ? 'vite'
            : 'webpack';
    });
}
exports.getBundlerFromTarget = getBundlerFromTarget;
function isComponent(tree, filePath) {
    if (!tsModule) {
        tsModule = (0, ensure_typescript_1.ensureTypescript)();
    }
    if (isSpecFile.test(filePath) || !allowedFileExt.test(filePath)) {
        return false;
    }
    const content = tree.read(filePath, 'utf-8');
    const sourceFile = tsModule.createSourceFile(filePath, content, tsModule.ScriptTarget.Latest, true);
    const cmpDeclaration = (0, ast_utils_1.getComponentNode)(sourceFile);
    return !!cmpDeclaration;
}
exports.isComponent = isComponent;
